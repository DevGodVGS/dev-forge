import { 
  AIProviderName, 
  GenerateTextRequest, 
  GenerateTextResponse, 
  GenerateStructuredRequest, 
  GenerateStructuredResponse, 
  ProviderHealthCheck
} from '@devforge/shared-types';
import { IAIProviderAdapter } from './types';
import { AnthropicAdapter } from './adapters/anthropic.adapter';
import { OpenAIAdapter } from './adapters/openai.adapter';
import { GeminiAdapter } from './adapters/gemini.adapter';
import { TokenAccountant, ExecutionMetrics } from './token-accountant';
import { ModelRegistry } from './model-registry';

export class AIService {
  private adapters: Map<AIProviderName, IAIProviderAdapter> = new Map();
  private accountant = new TokenAccountant();

  constructor() {
    this.adapters.set(AIProviderName.ANTHROPIC, new AnthropicAdapter());
    this.adapters.set(AIProviderName.OPENAI, new OpenAIAdapter());
    this.adapters.set(AIProviderName.GEMINI, new GeminiAdapter());
  }

  getAdapter(provider: AIProviderName): IAIProviderAdapter {
    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new Error(`AI Provider ${provider} is not configured`);
    }
    return adapter;
  }

  async generateWithFallback(
    primaryProvider: AIProviderName, 
    request: GenerateTextRequest,
    timeoutMs = 30000
  ): Promise<GenerateTextResponse> {
    const fallbackOrder: AIProviderName[] = [
      primaryProvider,
      AIProviderName.ANTHROPIC,
      AIProviderName.OPENAI,
      AIProviderName.GEMINI
    ].filter((v, i, a) => a.indexOf(v) === i);

    let lastError: Error | undefined;

    for (const provider of fallbackOrder) {
      try {
        const adapter = this.getAdapter(provider);
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`AI generation timed out after ${timeoutMs}ms on provider ${provider}`)), timeoutMs)
        );
        const response = await Promise.race([adapter.generateText(request), timeoutPromise]);
        this.accountant.recordUsage(request.model, response.usage, response.latencyMs);
        return response;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Continue to next provider in fallback cascade
      }
    }

    throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
  }

  async generateStructured<T>(
    provider: AIProviderName,
    request: GenerateStructuredRequest<T>
  ): Promise<GenerateStructuredResponse<T>> {
    const adapter = this.getAdapter(provider);
    const response = await adapter.generateStructured<T>(request);
    this.accountant.recordUsage(request.model, response.usage, response.latencyMs);
    return response;
  }

  async healthCheckAll(): Promise<Record<AIProviderName, ProviderHealthCheck>> {
    const results: Partial<Record<AIProviderName, ProviderHealthCheck>> = {};
    for (const [provider, adapter] of this.adapters.entries()) {
      results[provider] = await adapter.verifyConnection();
    }
    return results as Record<AIProviderName, ProviderHealthCheck>;
  }

  getMetrics(): ExecutionMetrics {
    return this.accountant.getMetrics();
  }

  resetMetrics(): void {
    this.accountant.reset();
  }
}

export const aiService = new AIService();
