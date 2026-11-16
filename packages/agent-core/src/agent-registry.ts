import { AgentRole, AIProviderName, AgentDefinition } from '@devforge/shared-types';

export class AgentRegistry {
  private static agents: Map<AgentRole, AgentDefinition> = new Map([
    [
      AgentRole.SECURITY_AUDITOR,
      {
        id: 'agent-security-auditor',
        role: AgentRole.SECURITY_AUDITOR,
        name: 'DevForge Principal Security Auditor',
        description: 'Audits codebases for OWASP Top 10, injection, authentication bypass, secret leaks, and insecure deserialization.',
        systemPrompt: 'You are an elite application security engineer. Analyze AST, source code, and configuration for critical vulnerabilities. Ground every finding with evidence, file, line number, impact, and actionable remediation.',
        defaultProvider: AIProviderName.ANTHROPIC,
        defaultModel: 'claude-3-5-sonnet',
        temperature: 0.1,
        maxTokens: 4096,
        allowedTools: ['read_file', 'inspect_ast', 'check_dependencies']
      }
    ],
    [
      AgentRole.BACKEND_AUDITOR,
      {
        id: 'agent-backend-auditor',
        role: AgentRole.BACKEND_AUDITOR,
        name: 'DevForge Backend & Systems Architect',
        description: 'Analyzes database query efficiency, concurrency, memory leaks, transaction atomicity, and API consistency.',
        systemPrompt: 'You are a principal backend engineer. Inspect server-side logic for N+1 queries, race conditions, unhandled async promises, and memory leaks.',
        defaultProvider: AIProviderName.OPENAI,
        defaultModel: 'gpt-4o',
        temperature: 0.2,
        maxTokens: 4096,
        allowedTools: ['read_file', 'inspect_queries']
      }
    ],
    [
      AgentRole.FRONTEND_AUDITOR,
      {
        id: 'agent-frontend-auditor',
        role: AgentRole.FRONTEND_AUDITOR,
        name: 'DevForge Frontend & A11y Specialist',
        description: 'Audits React component hierarchies, render performance, state management, accessibility (WCAG), and responsive UX.',
        systemPrompt: 'You are a senior frontend architect. Inspect component trees, hook dependencies, state re-renders, and WCAG accessibility standards.',
        defaultProvider: AIProviderName.ANTHROPIC,
        defaultModel: 'claude-3-5-sonnet',
        temperature: 0.2,
        maxTokens: 4096,
        allowedTools: ['read_file', 'inspect_components']
      }
    ],
    [
      AgentRole.ARCHITECTURE_AUDITOR,
      {
        id: 'agent-architecture-auditor',
        role: AgentRole.ARCHITECTURE_AUDITOR,
        name: 'DevForge Architecture & Modularity Reviewer',
        description: 'Analyzes SOLID adherence, package boundaries, circular dependencies, and dead code.',
        systemPrompt: 'You are an enterprise software architect. Review high-level design, coupling, cohesion, and abstraction boundaries.',
        defaultProvider: AIProviderName.GEMINI,
        defaultModel: 'gemini-2.0-flash',
        temperature: 0.1,
        maxTokens: 4096,
        allowedTools: ['read_file', 'inspect_topology']
      }
    ],
    [
      AgentRole.REMEDIATION_AGENT,
      {
        id: 'agent-remediation',
        role: AgentRole.REMEDIATION_AGENT,
        name: 'DevForge Autonomous Remediation Engineer',
        description: 'Synthesizes minimal, robust patches and regression test suites for triaged findings.',
        systemPrompt: 'You are an expert software developer specializing in bug remediation. Author targeted, clean patches that fix root causes and add automated tests.',
        defaultProvider: AIProviderName.ANTHROPIC,
        defaultModel: 'claude-3-5-sonnet',
        temperature: 0.2,
        maxTokens: 4096,
        allowedTools: ['read_file', 'write_patch', 'run_test']
      }
    ],
    [
      AgentRole.PR_REVIEWER_AGENT,
      {
        id: 'agent-pr-reviewer',
        role: AgentRole.PR_REVIEWER_AGENT,
        name: 'DevForge Adversarial PR Reviewer',
        description: 'Performs independent, adversarial review of Pull Request diffs to prevent regressions and security slips.',
        systemPrompt: 'You are an independent adversarial code reviewer. You did not write this code. Search aggressively for edge-case failures, regression risks, and missed requirements.',
        defaultProvider: AIProviderName.GEMINI,
        defaultModel: 'gemini-2.0-flash',
        temperature: 0.1,
        maxTokens: 4096,
        allowedTools: ['read_diff', 'post_comment']
      }
    ],
    [
      AgentRole.CORRECTION_AGENT,
      {
        id: 'agent-correction',
        role: AgentRole.CORRECTION_AGENT,
        name: 'DevForge PR Review Correction Agent',
        description: 'Addresses adversarial PR review findings and updates PR branches until standards pass.',
        systemPrompt: 'You are a focused resolution agent. Review comments and apply corrective changes to the pull request branch.',
        defaultProvider: AIProviderName.OPENAI,
        defaultModel: 'gpt-4o',
        temperature: 0.2,
        maxTokens: 4096,
        allowedTools: ['read_comment', 'apply_patch']
      }
    ]
  ]);

  static getAgent(role: AgentRole): AgentDefinition {
    const agent = this.agents.get(role);
    if (!agent) {
      throw new Error(`Agent for role ${role} not registered`);
    }
    return agent;
  }

  static listAgents(): AgentDefinition[] {
    return Array.from(this.agents.values());
  }
}
