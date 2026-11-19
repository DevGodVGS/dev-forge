# DevForge: Production-Ready Multi-Provider AI Engineering Platform

> Enterprise-grade Autonomous AI Engineering Platform engineered to transition software projects from repository onboarding to release-ready code with continuous human-in-the-loop governance.

---

## 🚀 Overview

**DevForge** connects to GitHub repositories, conducts holistic codebase audits (security, code quality, architecture, performance, edge-cases), triages actionable issues into prioritized backlogs, synthesizes verified fixes through specialized autonomous agents, submits GitHub Pull Requests, and runs independent adversarial code reviews until standards are met.

---

## 🏛️ Architecture & System Topology

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
│  PostgreSQL  │     │ Redis Cache  │ │ Agent Engine  │            │  GitHub App  │
└──────────────┘     └──────────────┘ └───────────────┘            └──────────────┘
```

---

## 📦 Monorepo Structure

DevForge is organized as a high-performance `pnpm` workspace monorepo:

```
dev-forge/
├── apps/
│   ├── api/             # NestJS API gateway & core business domain services
│   └── web/             # Next.js 14 App Router UI (React, Tailwind CSS, Lucide)
├── packages/
│   ├── agent-core/      # Autonomous agent orchestration, tools & task runners
│   ├── ai-core/         # Multi-provider LLM adapters (Claude, GPT-4o, Gemini)
│   ├── database/        # PostgreSQL schema, migrations, and database client
│   ├── github-client/   # GitHub App integration, Webhooks & PR automation
│   └── shared-types/    # Unified TypeScript DTOs, schemas & contracts
├── docs/                # Comprehensive architecture specifications & contracts
├── tests/               # End-to-end and cross-package integration tests
├── docker-compose.yml   # Local infrastructure (PostgreSQL 16, Redis 7)
├── package.json         # Root scripts & dev dependencies
└── pnpm-workspace.yaml  # Monorepo workspace configuration
```

---

## ✨ Key Features

- **Multi-Provider AI Tier**: Resilient adapter layer routing across **Anthropic Claude 3.5/3.7**, **OpenAI GPT-4o**, and **Google Gemini 1.5/2.0 Pro** with automated fallbacks, cost monitoring, and token attribution.
- **Holistic Codebase Audits**: Scans entire code repositories across security vulnerabilities, architectural consistency, test coverage gaps, and performance bottlenecks.
- **Autonomous Fix Synthesis**: Specialized engineering agents plan, code, test, and package complete solutions for identified backlog items.
- **Human-in-the-Loop Governance**: Full control with pull request reviews, approval workflows, and audit trails.
- **Production-Ready Toolchain**: Type-safe end-to-end contracts, strict linting, Dockerized services, and CI-ready test suites.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Radix UI, TanStack Query
- **Backend**: NestJS, Node.js, TypeScript, Express / Fastify
- **Data & Caching**: PostgreSQL, Redis, Prisma / TypeORM
- **AI Models**: Anthropic Claude, OpenAI GPT-4o, Google Gemini Pro
- **DevOps**: Docker, Docker Compose, GitHub Actions, pnpm

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** >= 20.x
- **pnpm** >= 9.x (`corepack enable pnpm`)
- **Docker & Docker Compose**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/DevGodVGS/dev-forge.git
cd dev-forge

# Install workspace dependencies
pnpm install
```

### 3. Start Infrastructure
```bash
# Launch PostgreSQL and Redis
docker-compose up -d
```

### 4. Development Modes
```bash
# Run API service
pnpm dev:api

# Run Web UI
pnpm dev:web

# Run full project typecheck & lint
pnpm typecheck
pnpm lint
```

---

## 📄 License

Maintained by [DevGodVGS](https://github.com/DevGodVGS). Distributed under the MIT License.
