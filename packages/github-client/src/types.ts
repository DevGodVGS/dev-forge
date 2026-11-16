export interface GitHubRepoRef {
  owner: string;
  repo: string;
}

export interface GitHubFileContent {
  path: string;
  content: string;
  sha?: string;
  size?: number;
}

export interface GitHubCreatePrOptions {
  title: string;
  body: string;
  head: string;
  base: string;
  draft?: boolean;
}

export interface GitHubCreateIssueOptions {
  title: string;
  body: string;
  labels?: string[];
  assignees?: string[];
}

export interface GitHubReviewCommentOptions {
  path: string;
  line: number;
  body: string;
  side?: 'RIGHT' | 'LEFT';
}

export interface GitHubSubmitReviewOptions {
  pullNumber: number;
  commitSha: string;
  body: string;
  event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
  comments?: GitHubReviewCommentOptions[];
}

export interface GitHubCommitPatch {
  path: string;
  content: string;
}

export interface GitHubWebhookPayload {
  action: string;
  repository?: {
    id: number;
    full_name: string;
    default_branch: string;
    private: boolean;
    clone_url: string;
  };
  installation?: {
    id: number;
  };
  pull_request?: {
    number: number;
    title: string;
    body: string;
    state: string;
    head: { ref: string; sha: string };
    base: { ref: string; sha: string };
    html_url: string;
  };
  issue?: {
    number: number;
    title: string;
    body: string;
    labels: Array<{ name: string }>;
  };
}
