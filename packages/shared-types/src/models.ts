import { 
  UserRole, 
  FindingSeverity, 
  FindingCategory, 
  FindingConfidence, 
  FindingStatus, 
  AuditStatus, 
  PullRequestStatus, 
  AIReviewVerdict, 
  HumanApprovalStatus, 
  AIProviderName,
  WorkflowType,
  WorkflowStatus,
  AgentRole
} from './enums';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'FREE' | 'TEAM' | 'ENTERPRISE';
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
  createdAt: string;
  user?: User;
}

export interface GitHubInstallation {
  id: string;
  organizationId: string;
  installationId: number;
  accountName: string;
  targetType: 'User' | 'Organization';
  createdAt: string;
}

export interface Repository {
  id: string;
  organizationId: string;
  installationId: string;
  githubRepoId: number;
  fullName: string;
  defaultBranch: string;
  isPrivate: boolean;
  cloneUrl: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditRun {
  id: string;
  repositoryId: string;
  triggerType: 'MANUAL' | 'SCHEDULED' | 'WEBHOOK';
  status: AuditStatus;
  commitSha: string;
  branch: string;
  summary?: string;
  score?: number;
  startedAt: string;
  completedAt?: string;
  findingsCount?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
}

export interface Finding {
  id: string;
  auditRunId: string;
  repositoryId: string;
  title: string;
  description: string;
  category: FindingCategory;
  severity: FindingSeverity;
  confidence: FindingConfidence;
  filePath: string;
  lineNumber?: number;
  evidence: string;
  recommendation: string;
  acceptanceCriteria: string[];
  status: FindingStatus;
  githubIssueId?: number;
  githubIssueUrl?: string;
  createdAt: string;
}

export interface PullRequest {
  id: string;
  repositoryId: string;
  githubPrNumber: number;
  title: string;
  body: string;
  sourceBranch: string;
  targetBranch: string;
  status: PullRequestStatus;
  authorLogin: string;
  aiReviewStatus: AIReviewVerdict;
  humanApprovalStatus: HumanApprovalStatus;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewIteration {
  id: string;
  pullRequestId: string;
  iterationNumber: number;
  reviewerAgent: string;
  verdict: AIReviewVerdict;
  summary: string;
  commitSha: string;
  createdAt: string;
  comments: ReviewComment[];
}

export interface ReviewComment {
  id: string;
  iterationId: string;
  filePath: string;
  lineNumber: number;
  diffHunk: string;
  body: string;
  severity: FindingSeverity;
  status: 'OPEN' | 'FIXED' | 'DISMISSED';
}

export interface WorkflowExecution {
  id: string;
  organizationId: string;
  repositoryId: string;
  workflowType: WorkflowType;
  status: WorkflowStatus;
  inputPayload: Record<string, unknown>;
  outputPayload?: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  workflowExecutionId: string;
  stepName: string;
  agentRole: AgentRole;
  status: WorkflowStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  tokensUsed: number;
  costEstimateUsd: number;
  startedAt: string;
  completedAt?: string;
}
