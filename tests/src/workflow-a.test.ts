import { AuditWorkflowEngine } from '@devforge/agent-core';
import { devForgeStore } from '@devforge/database';
import { AuditStatus, FindingSeverity, FindingStatus } from '@devforge/shared-types';

export async function testWorkflowA(): Promise<{ name: string; passed: boolean; details: string }> {
  const testName = 'Workflow A: Repository Audit & Autonomous Remediation Journey';
  try {
    const repo = (await devForgeStore.listRepositories('org-default-001'))[0];
    if (!repo) throw new Error('Repository not found in test store');

    // Execute Workflow A
    const result = await AuditWorkflowEngine.runRepositoryAudit(repo.id, 'main', true);

    // Assertions
    if (result.auditRun.status !== AuditStatus.COMPLETED) {
      throw new Error(`Expected audit status COMPLETED, got ${result.auditRun.status}`);
    }

    if (result.findings.length === 0) {
      throw new Error('Audit engine produced 0 findings');
    }

    const criticalFinding = result.findings.find(f => f.severity === FindingSeverity.CRITICAL);
    if (!criticalFinding) {
      throw new Error('Expected at least one CRITICAL finding for remediation');
    }

    if (result.createdIssues.length === 0) {
      throw new Error('Expected GitHub issues to be created for triaged findings');
    }

    if (result.remediatedPrs.length === 0) {
      throw new Error('Expected autonomous PR creation for critical security finding');
    }

    const pr = result.remediatedPrs[0];
    if (!pr.sourceBranch.startsWith('forge/issue-')) {
      throw new Error(`Invalid remediation branch naming: ${pr.sourceBranch}`);
    }

    return {
      name: testName,
      passed: true,
      details: `Audit completed successfully. Found ${result.findings.length} findings. Triaged ${result.createdIssues.length} issues. Created remediation PR #${pr.githubPrNumber} (${pr.sourceBranch}).`
    };
  } catch (err: any) {
    return {
      name: testName,
      passed: false,
      details: `FAILED: ${err.message}`
    };
  }
}
