import { AIProviderName } from './enums';

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface GenerateTextRequest {
  model: string;
  systemPrompt?: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface GenerateTextResponse {
  text: string;
  usage: TokenUsage;
  costUsd: number;
  model: string;
  latencyMs: number;
}

export interface GenerateStructuredRequest<T> extends GenerateTextRequest {
  schemaDescription: string;
  jsonSchema?: Record<string, unknown>;
}

export interface GenerateStructuredResponse<T> {
  data: T;
  rawText: string;
  usage: TokenUsage;
  costUsd: number;
  model: string;
  latencyMs: number;
}

export interface StreamChunk {
  delta: string;
  isComplete: boolean;
  usage?: TokenUsage;
}

export interface ProviderHealthCheck {
  healthy: boolean;
  latencyMs: number;
  error?: string;
}

export interface ModelPricing {
  promptCostPer1M: number;
  completionCostPer1M: number;
}

export interface AIProviderConfig {
  id: string;
  organizationId: string;
  provider: AIProviderName;
  isDefault: boolean;
  activeModels: string[];
  createdAt: string;
}
