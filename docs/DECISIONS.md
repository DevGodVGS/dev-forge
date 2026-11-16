# DevForge Architecture Decision Records (ADR)

## ADR-001: Monorepo Package Topology with PNPM
- **Status:** Accepted
- **Context:** To ensure tight contract alignment between backend, frontend, database, AI core, and agent orchestration.
- **Decision:** Use a pnpm workspace monorepo. Shared types and database schemas are independent packages referenced via workspace protocols (`workspace:*`).

## ADR-002: Multi-Provider AI Abstraction Strategy
- **Status:** Accepted
- **Context:** DevForge must avoid vendor lock-in and allow assigning different specialized models (Claude 3.5 Sonnet, GPT-4o, Gemini 2.0 Flash) to specific tasks based on reasoning strengths and latency.
- **Decision:** Create `packages/ai-core` implementing `IAIProviderAdapter`. All model calls pass through this abstraction with uniform structured outputs, token logging, and cost estimation.

## ADR-003: Human-in-the-Loop Safeguards for Code Merge
- **Status:** Accepted
- **Context:** Autonomous code generation could introduce regressions or unauthorized infrastructure modifications.
- **Decision:** AI agents have authority to create branches, push commits, and open PRs. Merging to `main`/`master` and production deployments strictly require human approval via GitHub.

## ADR-004: Independent Reviewer Isolation
- **Status:** Accepted
- **Context:** If the same AI agent context that authored code reviews that code, it suffers from confirmation bias.
- **Decision:** The PR Reviewer agent runs in an isolated context with fresh prompts, adversarial evaluation criteria, and a different provider/model if configured.
