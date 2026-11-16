# DevForge Agent Ownership & Workstream Allocation

| Agent Role | Subagent / Capability | Scope & File Ownership | Primary Outputs |
|---|---|---|---|
| **CTO & Master Orchestrator** | Coordinator | Monorepo governance, roadmaps, cross-module integration | `docs/**`, Root configs, Release criteria |
| **Principal Architect** | Subagent: Architecture | Shared types, API contracts, cross-cutting models | `packages/shared-types/**`, system specifications |
| **Database Architect** | Subagent: Database | Prisma schema, migrations, seeds, multi-tenant isolation | `packages/database/**`, `docker-compose.yml` |
| **AI Platform Engineer** | Subagent: AI Engine | Multi-provider adapters (Anthropic, OpenAI, Gemini), cost tracking | `packages/ai-core/**` |
| **Multi-Agent Orchestration Engineer** | Subagent: Orchestration | Agent registry, workflow state machines, durable tasks | `packages/agent-core/**` |
| **GitHub Integration Engineer** | Subagent: GitHub | GitHub App integration, Octokit wrapper, webhooks, PR/Issue APIs | `packages/github-client/**` |
| **Backend Engineering Lead** | Subagent: Backend | NestJS modules, controllers, services, guards, RBAC | `apps/api/**` |
| **Frontend Engineering Lead** | Subagent: Frontend | Next.js 14 App Router, UI shell, dashboard, audit & PR views | `apps/web/**` |
| **Security Engineer** | Subagent: Security | Threat modeling, sandboxing, auth & secret audits | Security audit suites, validation checks |
| **QA & Test Lead** | Subagent: QA | E2E integration tests, workflow journey test suites | `tests/**`, automated test runners |
