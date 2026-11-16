import { aiService, ModelRegistry } from '@devforge/ai-core';
import { AgentRegistry } from '@devforge/agent-core';
import { AIProviderName } from '@devforge/shared-types';

export async function testApiE2E(): Promise<{ name: string; passed: boolean; details: string }> {
  const testName = 'Multi-Provider AI & Agent Registry Contract Suite';
  try {
    // 1. Verify all 3 AI providers respond
    const health = await aiService.healthCheckAll();
    if (!health[AIProviderName.ANTHROPIC].healthy) throw new Error('Anthropic health check failed');
    if (!health[AIProviderName.OPENAI].healthy) throw new Error('OpenAI health check failed');
    if (!health[AIProviderName.GEMINI].healthy) throw new Error('Gemini health check failed');

    // 2. Verify model registry counts
    const models = ModelRegistry.listModels();
    if (models.length < 5) {
      throw new Error(`Expected at least 5 registered models, found ${models.length}`);
    }

    // 3. Verify agent registry
    const agents = AgentRegistry.listAgents();
    if (agents.length < 6) {
      throw new Error(`Expected at least 6 registered specialized agents, found ${agents.length}`);
    }

    // 4. Token & Cost Accounting verification
    const metricsBefore = aiService.getMetrics();
    const testGen = await aiService.generateWithFallback(AIProviderName.ANTHROPIC, {
      model: 'claude-3-5-sonnet',
      messages: [{ role: 'user', content: 'Testing AI accounting' }]
    });
    const metricsAfter = aiService.getMetrics();

    if (metricsAfter.totalCalls <= metricsBefore.totalCalls) {
      throw new Error('Token accountant failed to record AI generation call');
    }

    return {
      name: testName,
      passed: true,
      details: `All 3 AI providers (Anthropic, OpenAI, Gemini) verified healthy. ${models.length} models and ${agents.length} specialized agents registered. Token accountant tracked call (${testGen.usage.totalTokens} tokens, $${testGen.costUsd}).`
    };
  } catch (err: any) {
    return {
      name: testName,
      passed: false,
      details: `FAILED: ${err.message}`
    };
  }
}
