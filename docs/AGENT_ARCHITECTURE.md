# DevForge AI & Multi-Agent Architecture

## 1. Multi-Provider AI Abstraction (`packages/ai-core`)
The AI layer decouples business logic from upstream AI providers. Supported model families:
1. **Anthropic:** Claude 3.5 Sonnet, Claude 3.7 Sonnet, Claude 3 Opus
2. **OpenAI:** GPT-4o, GPT-4o-mini, o1-preview
3. **Google Gemini:** Gemini 1.5 Pro, Gemini 2.0 Flash, Gemini 1.5 Flash

### Core Interface
Every provider adapter implements `IAIProviderAdapter`:
```typescript
export interface IAIProviderAdapter {
  readonly provider: AIProviderName;
  generateText(request: GenerateTextRequest): Promise<GenerateTextResponse>;
  generateStructured<T>(request: GenerateStructuredRequest<T>): Promise<GenerateStructuredResponse<T>>;
  streamText(request: StreamTextRequest): AsyncIterable<StreamChunk>;
  calculateCost(model: string, usage: TokenUsage): number;
  verifyConnection(): Promise<ProviderHealthCheck>;
}
```

## 2. Multi-Agent Orchestration Framework (`packages/agent-core`)

### Specialized Agents & Roles
| Role | Primary Provider / Model | Focus |
|---|---|---|
| Security Auditor | Claude 3.5 Sonnet | Injection, Auth, SSRF, Secrets, AST review |
| Backend Auditor | Claude 3.5 Sonnet / GPT-4o | DB transactions, concurrency, memory leaks |
| Frontend Auditor | Claude 3.5 Sonnet / Gemini 1.5 Pro | React lifecycle, state, rendering, a11y |
| Architecture Auditor | Claude 3.7 Sonnet | SOLID, modularity, coupling, circular deps |
| Code Remediation Agent | Claude 3.5 Sonnet / GPT-4o | Root-cause analysis, patch synthesis, tests |
| Adversarial PR Reviewer | Gemini 2.0 Flash / Claude 3.5 Sonnet | Independent diff review, regression check |
| Review Correction Agent | GPT-4o / Claude 3.5 Sonnet | Addressing review feedback, iterative patch |

### Workflow State Machines
1. **Workflow A: Repository Audit & Remediation**
   ```
   [Clone Repo Tree] ──> [Parallel Domain Auditors] ──> [Finding Aggregator & Deduplicator]
                              │ (Security, Backend, Frontend, Arch)
                              ▼
                        [Prioritized Backlog & GitHub Issues]
                              │
                        [Remediation Planner] ──> [Branch & Patch Generator] ──> [PR Submission]
                              │
                        [Independent PR Review Loop (Workflow B)]
   ```

2. **Workflow B: Existing PR Review Loop**
   ```
   [Fetch PR Diff & Context] ──> [Adversarial Reviewer Agent]
                                            │
                             ┌──────────────┴──────────────┐
                             │                             │
                     [Changes Requested]             [Approved]
                             │                             │
                     [Correction Agent]           [Human Review Gate]
                             │                             │
                     [Apply Fix & Push]           [Human Merge on GitHub]
                             │
                     [Re-Review Iteration]
   ```
