import { AgentRole, AgentExecutionContext, AgentExecutionResult } from '@devforge/shared-types';

export class AgentExecutionManager {
  static createContext(
    agentRole: AgentRole, 
    repoId: string, 
    orgId: string, 
    commitSha: string, 
    branch: string,
    metadata: Record<string, unknown> = {}
  ): AgentExecutionContext {
    return {
      executionId: `exec-${agentRole.toLowerCase()}-${Date.now()}`,
      agentRole,
      repositoryId: repoId,
      organizationId: orgId,
      commitSha,
      branch,
      metadata
    };
  }

  static successResult<T>(data: T, tokensUsed: number, costUsd: number, durationMs: number): AgentExecutionResult<T> {
    return {
      success: true,
      data,
      tokensUsed,
      costUsd,
      durationMs
    };
  }

  static failureResult(error: string, durationMs: number): AgentExecutionResult {
    return {
      success: false,
      error,
      tokensUsed: 0,
      costUsd: 0,
      durationMs
    };
  }
}
