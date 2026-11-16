import { 
  AIProviderName, 
  GenerateTextRequest, 
  GenerateTextResponse, 
  GenerateStructuredRequest, 
  GenerateStructuredResponse, 
  StreamChunk, 
  ProviderHealthCheck,
  TokenUsage
} from '@devforge/shared-types';

export interface IAIProviderAdapter {
  readonly provider: AIProviderName;
  generateText(request: GenerateTextRequest): Promise<GenerateTextResponse>;
  generateStructured<T>(request: GenerateStructuredRequest<T>): Promise<GenerateStructuredResponse<T>>;
  streamText(request: StreamTextRequest): AsyncIterable<StreamChunk>;
  calculateCost(model: string, usage: TokenUsage): number;
  verifyConnection(): Promise<ProviderHealthCheck>;
}

export interface StreamTextRequest extends GenerateTextRequest {
  onChunk?: (chunk: string) => void;
}

export interface ModelSpec {
  id: string;
  provider: AIProviderName;
  name: string;
  contextWindow: number;
  maxOutputTokens: number;
  supportsStructuredJson: boolean;
  supportsStreaming: boolean;
  promptCostPer1M: number;
  completionCostPer1M: number;
}
