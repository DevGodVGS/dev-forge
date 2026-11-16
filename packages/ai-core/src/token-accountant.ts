import { TokenUsage } from '@devforge/shared-types';
import { calculateModelCost } from './pricing';

export interface ExecutionMetrics {
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalCostUsd: number;
  totalCalls: number;
  averageLatencyMs: number;
}

export class TokenAccountant {
  private totalPromptTokens = 0;
  private totalCompletionTokens = 0;
  private totalCostUsd = 0;
  private totalCalls = 0;
  private latencies: number[] = [];

  recordUsage(model: string, usage: TokenUsage, latencyMs: number): number {
    const cost = calculateModelCost(model, usage.promptTokens, usage.completionTokens);
    this.totalPromptTokens += usage.promptTokens;
    this.totalCompletionTokens += usage.completionTokens;
    this.totalCostUsd += cost;
    this.totalCalls += 1;
    this.latencies.push(latencyMs);
    return cost;
  }

  getMetrics(): ExecutionMetrics {
    const avgLatency = this.latencies.length > 0 
      ? this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length 
      : 0;

    return {
      totalPromptTokens: this.totalPromptTokens,
      totalCompletionTokens: this.totalCompletionTokens,
      totalCostUsd: Number(this.totalCostUsd.toFixed(6)),
      totalCalls: this.totalCalls,
      averageLatencyMs: Math.round(avgLatency)
    };
  }

  reset(): void {
    this.totalPromptTokens = 0;
    this.totalCompletionTokens = 0;
    this.totalCostUsd = 0;
    this.totalCalls = 0;
    this.latencies = [];
  }
}
