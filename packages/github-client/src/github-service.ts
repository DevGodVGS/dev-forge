import { 
  GitHubRepoRef, 
  GitHubFileContent, 
  GitHubCreatePrOptions, 
  GitHubCreateIssueOptions, 
  GitHubSubmitReviewOptions,
  GitHubCommitPatch
} from './types';

export class GitHubService {
  private appId: string;
  private privateKey: string;
  private inMemoryBranches = new Map<string, string>(); // ref -> sha
  private inMemoryFiles = new Map<string, string>(); // path -> content
  private nextPrNumber = 101;
  private nextIssueNumber = 201;

  constructor(appId = 'app-devforge-mock', privateKey = 'mock-key') {
    this.appId = appId;
    this.privateKey = privateKey;
    this.seedMockRepository();
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

  async getRepositoryTree(ref: GitHubRepoRef, commitSha = 'main'): Promise<string[]> {
    return Array.from(this.inMemoryFiles.keys());
  }

  async getFileContent(ref: GitHubRepoRef, path: string, commitSha = 'main'): Promise<GitHubFileContent | null> {
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
    const prNumber = this.nextPrNumber++;
    const headSha = this.inMemoryBranches.get(options.head) || 'c0ffee999';
    return {
      number: prNumber,
      htmlUrl: `https://github.com/${ref.owner}/${ref.repo}/pull/${prNumber}`,
      sha: headSha
    };
  }

  async submitPullRequestReview(ref: GitHubRepoRef, options: GitHubSubmitReviewOptions): Promise<{ id: number; verdict: string }> {
    return {
      id: Math.floor(Math.random() * 100000),
      verdict: options.event
    };
  }

  async createIssue(ref: GitHubRepoRef, options: GitHubCreateIssueOptions): Promise<{ number: number; htmlUrl: string }> {
    const issueNumber = this.nextIssueNumber++;
    return {
      number: issueNumber,
      htmlUrl: `https://github.com/${ref.owner}/${ref.repo}/issues/${issueNumber}`
    };
  }

  async getPullRequestDiff(ref: GitHubRepoRef, pullNumber: number): Promise<string> {
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
