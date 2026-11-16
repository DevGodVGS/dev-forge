import { ModelPricing } from '@devforge/shared-types';

export const MODEL_PRICING: Record<string, ModelPricing> = {
  // Anthropic
  'claude-3-5-sonnet': {
    promptCostPer1M: 3.0,
    completionCostPer1M: 15.0
  },
  'claude-3-7-sonnet': {
    promptCostPer1M: 3.0,
    completionCostPer1M: 15.0
  },
  'claude-3-haiku': {
    promptCostPer1M: 0.25,
    completionCostPer1M: 1.25
  },

  // OpenAI
  'gpt-4o': {
    promptCostPer1M: 2.5,
    completionCostPer1M: 10.0
  },
  'gpt-4o-mini': {
    promptCostPer1M: 0.15,
    completionCostPer1M: 0.6
  },
  'o1-preview': {
    promptCostPer1M: 15.0,
    completionCostPer1M: 60.0
  },

  // Gemini
  'gemini-1.5-pro': {
    promptCostPer1M: 1.25,
    completionCostPer1M: 5.0
  },
  'gemini-2.0-flash': {
    promptCostPer1M: 0.1,
    completionCostPer1M: 0.4
  },
  'gemini-1.5-flash': {
    promptCostPer1M: 0.075,
    completionCostPer1M: 0.3
  }
};

export function calculateModelCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = MODEL_PRICING[model] || { promptCostPer1M: 1.0, completionCostPer1M: 2.0 };
  const promptCost = (promptTokens / 1_000_000) * pricing.promptCostPer1M;
  const completionCost = (completionTokens / 1_000_000) * pricing.completionCostPer1M;
  return Number((promptCost + completionCost).toFixed(6));
}
