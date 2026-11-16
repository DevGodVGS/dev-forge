export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
    requestId: string;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface LoginDto {
  email: string;
  password?: string;
  passwordHash?: string;
}

export interface SignupDto {
  email: string;
  password: string;
  name: string;
  organizationName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    role: string;
  };
}

export interface TriggerAuditDto {
  repositoryId: string;
  branch?: string;
  commitSha?: string;
  categories?: string[];
}

export interface TriageFindingDto {
  findingId: string;
  labels?: string[];
  assignee?: string;
}

export interface TriggerRemediationDto {
  findingId: string;
  targetBranch?: string;
}

export interface TriggerPrReviewDto {
  pullRequestId: string;
  forceFreshReview?: boolean;
}

export interface TriggerPrCorrectionDto {
  pullRequestId: string;
  iterationId: string;
}
