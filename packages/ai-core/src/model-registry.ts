import { AIProviderName } from '@devforge/shared-types';
import { ModelSpec } from './types';
import { MODEL_PRICING } from './pricing';

export class ModelRegistry {
  private static models: Map<string, ModelSpec> = new Map([
    // Anthropic
    [
      'claude-3-5-sonnet',
      {
        id: 'claude-3-5-sonnet',
        provider: AIProviderName.ANTHROPIC,
        name: 'Claude 3.5 Sonnet',
        contextWindow: 200_000,
        maxOutputTokens: 8192,
        supportsStructuredJson: true,
        supportsStreaming: true,
        promptCostPer1M: MODEL_PRICING['claude-3-5-sonnet'].promptCostPer1M,
        completionCostPer1M: MODEL_PRICING['claude-3-5-sonnet'].completionCostPer1M
      }
    ],
    [
      'claude-3-7-sonnet',
      {
        id: 'claude-3-7-sonnet',
        provider: AIProviderName.ANTHROPIC,
        name: 'Claude 3.7 Sonnet',
        contextWindow: 200_000,
        maxOutputTokens: 16384,
        supportsStructuredJson: true,
        supportsStreaming: true,
        promptCostPer1M: MODEL_PRICING['claude-3-7-sonnet'].promptCostPer1M,
        completionCostPer1M: MODEL_PRICING['claude-3-7-sonnet'].completionCostPer1M
      }
    ],
    // OpenAI
    [
      'gpt-4o',
      {
        id: 'gpt-4o',
        provider: AIProviderName.OPENAI,
        name: 'GPT-4o (Omni)',
        contextWindow: 128_000,
        maxOutputTokens: 4096,
        supportsStructuredJson: true,
        supportsStreaming: true,
        promptCostPer1M: MODEL_PRICING['gpt-4o'].promptCostPer1M,
        completionCostPer1M: MODEL_PRICING['gpt-4o'].completionCostPer1M
      }
    ],
    [
      'gpt-4o-mini',
      {
        id: 'gpt-4o-mini',
        provider: AIProviderName.OPENAI,
        name: 'GPT-4o Mini',
        contextWindow: 128_000,
        maxOutputTokens: 4096,
        supportsStructuredJson: true,
        supportsStreaming: true,
        promptCostPer1M: MODEL_PRICING['gpt-4o-mini'].promptCostPer1M,
        completionCostPer1M: MODEL_PRICING['gpt-4o-mini'].completionCostPer1M
      }
    ],
    // Gemini
    [
      'gemini-2.0-flash',
      {
        id: 'gemini-2.0-flash',
        provider: AIProviderName.GEMINI,
        name: 'Gemini 2.0 Flash',
        contextWindow: 1_000_000,
        maxOutputTokens: 8192,
        supportsStructuredJson: true,
        supportsStreaming: true,
        promptCostPer1M: MODEL_PRICING['gemini-2.0-flash'].promptCostPer1M,
        completionCostPer1M: MODEL_PRICING['gemini-2.0-flash'].completionCostPer1M
      }
    ],
    [
      'gemini-1.5-pro',
      {
        id: 'gemini-1.5-pro',
        provider: AIProviderName.GEMINI,
        name: 'Gemini 1.5 Pro',
        contextWindow: 2_000_000,
        maxOutputTokens: 8192,
        supportsStructuredJson: true,
        supportsStreaming: true,
        promptCostPer1M: MODEL_PRICING['gemini-1.5-pro'].promptCostPer1M,
        completionCostPer1M: MODEL_PRICING['gemini-1.5-pro'].completionCostPer1M
      }
    ]
  ]);

  static getModel(modelId: string): ModelSpec | undefined {
    return this.models.get(modelId);
  }

  static listModels(provider?: AIProviderName): ModelSpec[] {
    const list = Array.from(this.models.values());
    return provider ? list.filter(m => m.provider === provider) : list;
  }
}
