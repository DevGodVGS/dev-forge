# DevForge Database Design & Governance

## 1. Governance Rules
1. **Single Source of Truth:** All schema definitions reside exclusively in `packages/database/prisma/schema.prisma`.
2. **Schema Ownership:** Only the Database Architect and CTO may author or modify the canonical schema. Other agents submit model proposals.
3. **Multi-Tenancy:** Every top-level entity references `organizationId` with indexed foreign keys.
4. **Idempotency & Auditing:** All primary keys are UUIDv4. All records include `createdAt` and `updatedAt` in UTC.

## 2. Entity Relational Architecture

### 2.1 Identity & Organization
- `User`: id, email, passwordHash, name, avatarUrl, createdAt, updatedAt
- `Organization`: id, name, slug, plan, createdAt, updatedAt
- `Membership`: id, userId, organizationId, role (`OWNER`, `ADMIN`, `ENGINEER`, `VIEWER`), createdAt

### 2.2 GitHub Ecosystem
- `GitHubInstallation`: id, organizationId, installationId, accountName, targetType, encryptedTokens, createdAt
- `Repository`: id, organizationId, installationId, githubRepoId, fullName, defaultBranch, isPrivate, cloneUrl, language, createdAt
- `RepositoryPolicy`: id, repositoryId, autoAuditEnabled, maxRemediationRetries, requiredApprovalCount

### 2.3 Audits, Issues & Findings
- `AuditRun`: id, repositoryId, triggerType, status (`QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`), commitSha, branch, summary, score, startedAt, completedAt
- `AuditCoverage`: id, auditRunId, category (`SECURITY`, `BACKEND`, `FRONTEND`, `ARCHITECTURE`, `PERFORMANCE`, `EDGE_CASES`, `TESTING`), filesAnalyzed, score
- `Finding`: id, auditRunId, repositoryId, title, description, category, severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFORMATIONAL`), confidence (`HIGH`, `MEDIUM`, `LOW`), filePath, lineNumber, evidence, recommendation, acceptanceCriteria, status (`OPEN`, `TRIAGED`, `RESOLVED`, `IGNORED`), githubIssueId

### 2.4 Pull Requests & Review Loops
- `PullRequest`: id, repositoryId, githubPrNumber, title, body, sourceBranch, targetBranch, status (`OPEN`, `CLOSED`, `MERGED`), authorLogin, aiReviewStatus (`PENDING`, `APPROVED`, `CHANGES_REQUESTED`), humanApprovalStatus (`PENDING`, `APPROVED`, `REJECTED`)
- `PrReviewIteration`: id, pullRequestId, iterationNumber, reviewerAgent, verdict (`APPROVE`, `REQUEST_CHANGES`, `COMMENT`), summary, commitSha, createdAt
- `ReviewComment`: id, iterationId, filePath, lineNumber, diffHunk, body, severity, status (`OPEN`, `FIXED`, `DISMISSED`)

### 2.5 AI Infrastructure & Workflows
- `AIProviderConfig`: id, organizationId, provider (`ANTHROPIC`, `OPENAI`, `GEMINI`), encryptedApiKey, isDefault, activeModels, createdAt
- `WorkflowExecution`: id, organizationId, workflowType (`AUDIT`, `REMEDIATION`, `PR_REVIEW`), status (`PENDING`, `RUNNING`, `SUCCESS`, `FAILED`), inputPayload, outputPayload, startedAt, completedAt
- `WorkflowStep`: id, workflowExecutionId, stepName, agentRole, status, input, output, tokensUsed, costEstimate, startedAt, completedAt
- `AgentExecution`: id, stepId, agentRole, provider, model, promptTokens, completionTokens, costUsd, latencyMs, status
- `AuditLog`: id, organizationId, actorId, action, targetResource, metadata, ipAddress, createdAt
