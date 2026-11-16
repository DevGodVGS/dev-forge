import { AgentRole, AIProviderName } from './enums';

export interface AgentDefinition {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  systemPrompt: string;
  defaultProvider: AIProviderName;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  allowedTools: string[];
}

export interface AgentExecutionContext {
  executionId: string;
  agentRole: AgentRole;
  repositoryId: string;
  commitSha: string;
  branch: string;
  organizationId: string;
  metadata: Record<string, unknown>;
}

export interface AgentExecutionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  tokensUsed: number;
  costUsd: number;
  durationMs: number;
}
