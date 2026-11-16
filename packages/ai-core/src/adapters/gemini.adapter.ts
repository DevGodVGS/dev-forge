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
import { IAIProviderAdapter, StreamTextRequest } from '../types';
import { calculateModelCost } from '../pricing';

export class GeminiAdapter implements IAIProviderAdapter {
  readonly provider = AIProviderName.GEMINI;
  private apiKey: string;

  constructor(apiKey = process.env.GEMINI_API_KEY || 'sk-gemini-mock-key') {
    this.apiKey = apiKey;
  }

  async generateText(request: GenerateTextRequest): Promise<GenerateTextResponse> {
    const startTime = Date.now();
    const promptLength = request.messages.reduce((acc, m) => acc + m.content.length, 0);
    const promptTokens = Math.max(10, Math.round(promptLength / 4));
    const completionTokens = Math.min(request.maxTokens || 1024, 210);

    const text = `[Gemini ${request.model}] Multi-modal and high-context codebase structural audit complete. Fast inference cycle verified.`;
    const latencyMs = Date.now() - startTime + 60;

    const usage: TokenUsage = {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    };

    return {
      text,
      usage,
      costUsd: this.calculateCost(request.model, usage),
      model: request.model,
      latencyMs
    };
  }

  async generateStructured<T>(request: GenerateStructuredRequest<T>): Promise<GenerateStructuredResponse<T>> {
    const startTime = Date.now();
    const promptLength = request.messages.reduce((acc, m) => acc + m.content.length, 0);
    const promptTokens = Math.max(14, Math.round(promptLength / 4));
    const completionTokens = Math.min(request.maxTokens || 2048, 320);

    let data: unknown;
    if (request.schemaDescription.includes('Finding')) {
      data = [
        {
          title: 'Missing Boundary Validation in External Webhook Payload Handler',
          description: 'Webhook body payload is cast directly to TypeScript type without runtime schema verification.',
          category: 'ARCHITECTURE',
          severity: 'MEDIUM',
          confidence: 'HIGH',
          filePath: 'packages/github-client/src/webhooks.ts',
          lineNumber: 64,
          evidence: 'const event = req.body as GitHubWebhookEvent; // Unvalidated typecast',
          recommendation: 'Use Zod schema parse or class-validator before dispatching to workers.',
          acceptanceCriteria: ['Runtime Zod schema validation added to webhook gateway', 'Invalid payloads return 400 Bad Request']
        }
      ];
    } else if (request.schemaDescription.includes('Review')) {
      data = {
        verdict: 'APPROVE',
        summary: 'Zod runtime schema parsing verified. Boundary defense solid.',
        comments: []
      };
    } else {
      data = { verified: true, score: 98 };
    }

    const latencyMs = Date.now() - startTime + 70;
    const usage: TokenUsage = {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    };

    return {
      data: data as T,
      rawText: JSON.stringify(data),
      usage,
      costUsd: this.calculateCost(request.model, usage),
      model: request.model,
      latencyMs
    };
  }

  async *streamText(request: StreamTextRequest): AsyncIterable<StreamChunk> {
    const tokens = ['[Gemini]', ' Fast', ' reasoning', ' engine', ' validating', ' architectural', ' contracts...'];
    for (const delta of tokens) {
      if (request.onChunk) request.onChunk(delta);
      yield { delta, isComplete: false };
    }
    yield { 
      delta: '', 
      isComplete: true, 
      usage: { promptTokens: 25, completionTokens: 10, totalTokens: 35 } 
    };
  }

  calculateCost(model: string, usage: TokenUsage): number {
    return calculateModelCost(model, usage.promptTokens, usage.completionTokens);
  }

  async verifyConnection(): Promise<ProviderHealthCheck> {
    return {
      healthy: true,
      latencyMs: 55
    };
  }
}
