# DevForge Architecture Specification

## 1. Executive Summary & Product Vision
DevForge is an enterprise-grade Autonomous AI Engineering Platform engineered to transition software projects from repository onboarding to release-ready code with continuous human-in-the-loop governance. DevForge connects to GitHub repositories, conducts holistic codebase audits (security, quality, architecture, performance, edge-cases), triages actionable issues into prioritized backlogs, synthesizes verified fixes through specialized autonomous agents, submits GitHub Pull Requests, and runs independent adversarial code reviews until standards are met.

## 2. Core Architectural Principles
1. **Contract-First & Architecture-Driven:** Shared data types, API schemas, and database entities are strictly defined in centralized packages before feature implementation.
2. **Provider-Agnostic AI Tier:** Model routing across Anthropic Claude 3.5/3.7, OpenAI GPT-4o, and Google Gemini 1.5/2.0 Pro through a resilient adapter and fallback layer with real-time token and cost attribution.
3. **Continuous Integration & Isolation:** Monorepo package boundaries are strictly enforced. Integration builds run across all workspace packages at every phase.
4. **Human-in-the-Loop Governance:** Autonomous agents can generate branches, code, tests, and PRs, but merging to main/production and production deployments strictly require human sign-off via GitHub.
5. **Air-Gapped Execution & Security-by-Default:** Sandboxed execution prevents untrusted repository code from executing within the core control plane.

## 3. High-Level System Topology

```
                  ┌──────────────────────────────────────────────┐
                  │          Developer / Team Lead               │
                  └──────────────┬───────────────────────────────┘
                                 │ HTTPS (JWT / RBAC)
                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │   DevForge Web (Next.js 14 App Router)       │
                  │   - Dashboard, Audits, PRs, Agents, Settings │
                  └──────────────┬───────────────────────────────┘
                                 │ REST API / WebSocket
                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │   DevForge API Gateway & Core (NestJS)       │
                  │   - Auth, Org, Repo, Audit, PR, Finding Svcs │
                  └──────┬──────────────────┬──────────────┬─────┘
                         │                  │              │
       ┌─────────────────┴─────┐            │              └──────────────┐
       ▼                       ▼            ▼                             ▼
┌──────────────┐     ┌──────────────┐ ┌───────────────┐            ┌──────────────┐
│  PostgreSQL  │     │ Redis Cache  │ │ Agent Engine  │            │ GitHub App   │
│  (Prisma)    │     │ & PubSub     │ │ Orchestrator  │            │ Octokit REST │
└──────────────┘     └──────────────┘ └───┬───────┬───┘            │ & Webhooks   │
                                          │       │                └──────────────┘
                                          ▼       ▼
                            ┌─────────────────┐ ┌─────────────────┐
                            │ Multi-Provider  │ │ Ephemeral       │
                            │ AI Adapter Core │ │ Sandbox Engine  │
                            │ Claude/GPT/Gem  │ │ Docker/microVM  │
                            └─────────────────┘ └─────────────────┘
```

## 4. Monorepo Package Topology
The repository is structured as a pnpm workspace:
- `apps/web`: Next.js App Router client application with Tailwind CSS, Lucide icons, and React Query.
- `apps/api`: NestJS backend API with modular controllers, services, guards, and interceptors.
- `packages/shared-types`: Canonical TypeScript interfaces, DTOs, enums, API request/response contracts.
- `packages/database`: PostgreSQL schema definitions, Prisma ORM client, seed scripts, migration governance.
- `packages/ai-core`: Multi-provider abstraction (Anthropic, OpenAI, Gemini), rate limiters, token/cost counters, tool call drivers.
- `packages/agent-core`: Agent definitions, task execution state machines, memory contexts, orchestrator workflows.
- `packages/github-client`: Scoped GitHub App client, Octokit wrapper, repository cloning/tree parsing, webhook validation, and PR/issue lifecycle operations.
- `infrastructure`: Docker Compose environments (Postgres, Redis, Temporal, LocalStack) and AWS Terraform templates.
- `tests`: End-to-end integration tests, mock server fixtures, and user journey automated test suites.

## 5. Security & Isolation Matrix
- **Tenant Isolation:** All database queries are scoped by `organizationId`. Cross-tenant data leakage is prevented via Prisma middleware and service-level tenant checks.
- **Credential Storage:** GitHub App installation private keys, AI provider API keys, and repository credentials are encrypted at rest using AES-256-GCM (backed by AWS KMS in production, local master key in dev).
- **Untrusted Code Execution:** Any execution of dynamic linting, test suites, or AST parsing of user code runs inside ephemeral, non-root, network-restricted containers.
