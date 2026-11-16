# DevForge API Contracts & Conventions

## 1. Protocol & Response Format
All REST API endpoints are served under `/api/v1`. 

### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-11-16T18:50:00.000Z",
    "requestId": "req_uuid_12345",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Repository not found or access denied",
    "details": {},
    "timestamp": "2026-11-16T18:50:00.000Z",
    "requestId": "req_uuid_12345"
  }
}
```

## 2. Authentication & Authorization
- Bearer token authentication via HTTP Header: `Authorization: Bearer <jwt_access_token>`.
- Tenant context passed via: `X-Organization-Id: <org_uuid>` or inferred from user membership.
- RBAC roles: `OWNER`, `ADMIN`, `ENGINEER`, `VIEWER`.

## 3. Core API Endpoints

### 3.1 Authentication & Organization
- `POST /api/v1/auth/signup`: Register new user and initial organization.
- `POST /api/v1/auth/login`: Authenticate and issue JWT.
- `GET /api/v1/auth/me`: Retrieve current user profile, permissions, and organizations.
- `GET /api/v1/organizations`: List user organizations.
- `POST /api/v1/organizations`: Create organization.
- `GET /api/v1/organizations/:id/members`: List organization team members and roles.

### 3.2 GitHub Integration & Repositories
- `GET /api/v1/github/installations`: List connected GitHub App installations.
- `POST /api/v1/github/installations/callback`: Process GitHub App installation handshake.
- `POST /api/v1/github/webhooks`: Ingest and verify GitHub webhooks (`x-hub-signature-256`).
- `GET /api/v1/repositories`: List registered repositories for the active tenant.
- `POST /api/v1/repositories/connect`: Onboard a repository from a GitHub installation.
- `GET /api/v1/repositories/:id`: Retrieve repository details, policies, and health metrics.

### 3.3 Audits & Findings (Workflow A)
- `POST /api/v1/audits`: Trigger repository audit execution.
- `GET /api/v1/audits`: List audit runs for an organization/repository.
- `GET /api/v1/audits/:id`: Retrieve audit execution status, coverage, and metrics.
- `GET /api/v1/audits/:id/findings`: Retrieve paginated list of categorized findings.
- `POST /api/v1/audits/:id/findings/:findingId/triage`: Convert finding to GitHub Issue.

### 3.4 Remediation & PR Review Loop (Workflow B)
- `POST /api/v1/remediations`: Trigger autonomous remediation of an issue.
- `GET /api/v1/pull-requests`: List tracked pull requests.
- `POST /api/v1/pull-requests/review`: Trigger independent multi-agent PR review.
- `GET /api/v1/pull-requests/:id/reviews`: Retrieve historical AI review iterations & comments.
- `POST /api/v1/pull-requests/:id/remediate`: Trigger automated correction loop on review findings.

### 3.5 AI Platform & Agent Center
- `GET /api/v1/providers`: List available and configured AI providers (Anthropic, OpenAI, Gemini).
- `POST /api/v1/providers/verify`: Validate API credentials and model latency.
- `GET /api/v1/agents`: List registered agent specifications and role configurations.
- `GET /api/v1/workflows/:id/timeline`: Stream or fetch execution history and telemetry.
