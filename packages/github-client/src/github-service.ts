import { 
  GitHubRepoRef, 
  GitHubFileContent, 
  GitHubCreatePrOptions, 
  GitHubCreateIssueOptions, 
  GitHubSubmitReviewOptions,
  GitHubCommitPatch
} from './types';

export class GitHubService {
  private token: string;
  private appId: string;
  private privateKey: string;
  private inMemoryBranches = new Map<string, string>(); // ref -> sha
  private inMemoryFiles = new Map<string, string>(); // path -> content
  private nextPrNumber = 101;
  private nextIssueNumber = 201;

  constructor(
    token = process.env.GITHUB_TOKEN || '',
    appId = process.env.GITHUB_APP_ID || 'app-devforge-mock',
    privateKey = process.env.GITHUB_PRIVATE_KEY || 'mock-key'
  ) {
    this.token = token.trim();
    this.appId = appId;
    this.privateKey = privateKey;
    this.seedMockRepository();
  }

  isLiveMode(): boolean {
    return Boolean(
      this.token && 
      !this.token.includes('mock') && 
      this.token !== 'development' &&
      this.token.length > 10
    );
  }

  getMode(): 'live' | 'simulation' {
    return this.isLiveMode() ? 'live' : 'simulation';
  }

  getMaskedToken(): string {
    if (!this.token) return '[UNSET]';
    if (this.token.length <= 8) return '****';
    const prefix = this.token.slice(0, 4);
    const suffix = this.token.slice(-3);
    return `${prefix}...${suffix}`;
  }

  private seedMockRepository() {
    this.inMemoryBranches.set('main', 'c0ffee1234567890abcdef');
    this.inMemoryFiles.set(
      'apps/api/src/auth/auth.service.ts',
      `import { Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class AuthService {\n  async login(email: string) {\n    // Vulnerability: raw query\n    const query = \`SELECT * FROM users WHERE email = '\${email}'\`;\n    return query;\n  }\n}`
    );
    this.inMemoryFiles.set(
      'apps/api/src/auth/session.service.ts',
      `export class SessionService {\n  private cache = new Map<string, any>(); // Unbounded cache\n  set(k: string, v: any) { this.cache.set(k, v); }\n}`
    );
    this.inMemoryFiles.set(
      'packages/github-client/src/webhooks.ts',
      `export function handleWebhook(req: any) {\n  const event = req.body as any;\n  return event;\n}`
    );
  }

  private async githubFetch<T>(endpoint: string, options: RequestInit = {}): Promise<{ ok: boolean; status: number; data: T | null; rawText?: string }> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `https://api.github.com${endpoint}`;
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'DevForge-GitHub-Client',
        'X-GitHub-Api-Version': '2022-11-28',
        'Authorization': `Bearer ${this.token}`,
        ...((options.headers as Record<string, string>) || {})
      };

      const res = await fetch(url, {
        ...options,
        headers
      });

      if (!res.ok) {
        return { ok: false, status: res.status, data: null };
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json() as T;
        return { ok: true, status: res.status, data };
      } else {
        const rawText = await res.text();
        return { ok: true, status: res.status, data: null, rawText };
      }
    } catch {
      return { ok: false, status: 500, data: null };
    }
  }

  async getRepositoryTree(ref: GitHubRepoRef, commitSha = 'main'): Promise<string[]> {
    if (this.isLiveMode()) {
      const res = await this.githubFetch<{ tree: Array<{ path: string; type: string }> }>(
        `/repos/${ref.owner}/${ref.repo}/git/trees/${commitSha}?recursive=1`
      );
      if (res.ok && res.data?.tree) {
        return res.data.tree.filter(item => item.type === 'blob').map(item => item.path);
      }
    }
    return Array.from(this.inMemoryFiles.keys());
  }

  async getFileContent(ref: GitHubRepoRef, path: string, commitSha = 'main'): Promise<GitHubFileContent | null> {
    if (this.isLiveMode()) {
      const res = await this.githubFetch<{ content: string; encoding: string; sha: string; size: number }>(
        `/repos/${ref.owner}/${ref.repo}/contents/${path}?ref=${commitSha}`
      );
      if (res.ok && res.data) {
        const rawContent = res.data.encoding === 'base64'
          ? Buffer.from(res.data.content, 'base64').toString('utf-8')
          : res.data.content;
        return {
          path,
          content: rawContent,
          sha: res.data.sha,
          size: res.data.size
        };
      }
    }

    const content = this.inMemoryFiles.get(path);
    if (!content) return null;
    return {
      path,
      content,
      sha: 'blob-sha-' + Buffer.from(path).toString('hex').slice(0, 10),
      size: content.length
    };
  }

  async createBranch(ref: GitHubRepoRef, newBranch: string, fromSha = 'main'): Promise<{ ref: string; sha: string }> {
    if (this.isLiveMode()) {
      let resolvedSha = fromSha;
      if (fromSha === 'main' || fromSha === 'develop') {
        const refRes = await this.githubFetch<{ object: { sha: string } }>(
          `/repos/${ref.owner}/${ref.repo}/git/ref/heads/${fromSha}`
        );
        if (refRes.ok && refRes.data?.object?.sha) {
          resolvedSha = refRes.data.object.sha;
        }
      }

      const branchRes = await this.githubFetch<{ ref: string; object: { sha: string } }>(
        `/repos/${ref.owner}/${ref.repo}/git/refs`,
        {
          method: 'POST',
          body: JSON.stringify({
            ref: `refs/heads/${newBranch}`,
            sha: resolvedSha
          })
        }
      );

      if (branchRes.ok && branchRes.data) {
        return {
          ref: branchRes.data.ref,
          sha: branchRes.data.object.sha
        };
      }
    }

    const baseSha = this.inMemoryBranches.get(fromSha) || 'c0ffee1234567890abcdef';
    this.inMemoryBranches.set(newBranch, baseSha);
    return {
      ref: `refs/heads/${newBranch}`,
      sha: baseSha
    };
  }

  async commitAndPush(ref: GitHubRepoRef, branch: string, message: string, patches: GitHubCommitPatch[]): Promise<{ commitSha: string }> {
    for (const patch of patches) {
      this.inMemoryFiles.set(patch.path, patch.content);
    }
    const newSha = 'commit-' + Math.random().toString(36).substring(2, 10);
    this.inMemoryBranches.set(branch, newSha);
    return { commitSha: newSha };
  }

  async createPullRequest(ref: GitHubRepoRef, options: GitHubCreatePrOptions): Promise<{ number: number; htmlUrl: string; sha: string }> {
    if (this.isLiveMode()) {
      const res = await this.githubFetch<{ number: number; html_url: string; head: { sha: string } }>(
        `/repos/${ref.owner}/${ref.repo}/pulls`,
        {
          method: 'POST',
          body: JSON.stringify({
            title: options.title,
            body: options.body,
            head: options.head,
            base: options.base,
            draft: options.draft ?? false
          })
        }
      );
      if (res.ok && res.data) {
        return {
          number: res.data.number,
          htmlUrl: res.data.html_url,
          sha: res.data.head?.sha || 'commit-sha'
        };
      }
    }

    const prNumber = this.nextPrNumber++;
    const headSha = this.inMemoryBranches.get(options.head) || 'c0ffee999';
    return {
      number: prNumber,
      htmlUrl: `https://github.com/${ref.owner}/${ref.repo}/pull/${prNumber}`,
      sha: headSha
    };
  }

  async submitPullRequestReview(ref: GitHubRepoRef, options: GitHubSubmitReviewOptions): Promise<{ id: number; verdict: string }> {
    if (this.isLiveMode()) {
      const res = await this.githubFetch<{ id: number }>(
        `/repos/${ref.owner}/${ref.repo}/pulls/${options.pullNumber}/reviews`,
        {
          method: 'POST',
          body: JSON.stringify({
            commit_id: options.commitSha,
            body: options.body,
            event: options.event,
            comments: options.comments?.map(c => ({
              path: c.path,
              line: c.line,
              body: c.body,
              side: c.side || 'RIGHT'
            }))
          })
        }
      );
      if (res.ok && res.data) {
        return {
          id: res.data.id,
          verdict: options.event
        };
      }
    }

    return {
      id: Math.floor(Math.random() * 100000),
      verdict: options.event
    };
  }

  async createIssue(ref: GitHubRepoRef, options: GitHubCreateIssueOptions): Promise<{ number: number; htmlUrl: string }> {
    if (this.isLiveMode()) {
      const res = await this.githubFetch<{ number: number; html_url: string }>(
        `/repos/${ref.owner}/${ref.repo}/issues`,
        {
          method: 'POST',
          body: JSON.stringify({
            title: options.title,
            body: options.body,
            labels: options.labels,
            assignees: options.assignees
          })
        }
      );
      if (res.ok && res.data) {
        return {
          number: res.data.number,
          htmlUrl: res.data.html_url
        };
      }
    }

    const issueNumber = this.nextIssueNumber++;
    return {
      number: issueNumber,
      htmlUrl: `https://github.com/${ref.owner}/${ref.repo}/issues/${issueNumber}`
    };
  }

  async getPullRequestDiff(ref: GitHubRepoRef, pullNumber: number): Promise<string> {
    if (this.isLiveMode()) {
      const res = await this.githubFetch<unknown>(
        `/repos/${ref.owner}/${ref.repo}/pulls/${pullNumber}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3.diff'
          }
        }
      );
      if (res.ok && res.rawText) {
        return res.rawText;
      }
    }

    return `diff --git a/apps/api/src/auth/auth.service.ts b/apps/api/src/auth/auth.service.ts
--- a/apps/api/src/auth/auth.service.ts
+++ b/apps/api/src/auth/auth.service.ts
@@ -4,3 +4,5 @@
-    const query = \`SELECT * FROM users WHERE email = '\${email}'\`;
+    const user = await this.prisma.user.findUnique({ where: { email } });
+    return user;`;
  }
}

export const githubService = new GitHubService();
