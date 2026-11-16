import { PrReviewWorkflowEngine } from '@devforge/agent-core';
import { devForgeStore } from '@devforge/database';
import { AIReviewVerdict, HumanApprovalStatus, PullRequest, PullRequestStatus } from '@devforge/shared-types';

export async function testWorkflowB(): Promise<{ name: string; passed: boolean; details: string }> {
  const testName = 'Workflow B: Existing PR Adversarial Review & Correction Loop Journey';
  try {
    const repo = (await devForgeStore.listRepositories('org-default-001'))[0];
    if (!repo) throw new Error('Repository not found');

    // Create a mock PR to review
    const prId = `pr-test-${Date.now()}`;
    const testPr: PullRequest = {
      id: prId,
      repositoryId: repo.id,
      githubPrNumber: 555,
      title: 'feat: add payment processing endpoint',
      body: 'Adds new checkout endpoint',
      sourceBranch: 'feature/checkout',
      targetBranch: 'main',
      status: PullRequestStatus.OPEN,
      authorLogin: 'developer-jane',
      aiReviewStatus: AIReviewVerdict.REQUEST_CHANGES,
      humanApprovalStatus: HumanApprovalStatus.PENDING,
      htmlUrl: 'https://github.com/acme-eng/payment-gateway-service/pull/555',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await devForgeStore.createPullRequest(testPr);

    // Execute Workflow B
    const result = await PrReviewWorkflowEngine.reviewPullRequest(prId, 3);

    // Assertions
    if (!result.latestIteration) {
      throw new Error('Review loop failed to produce review iterations');
    }

    if (result.allIterations.length === 0) {
      throw new Error('Expected at least 1 iteration in review history');
    }

    if (result.pullRequest.aiReviewStatus !== AIReviewVerdict.APPROVE) {
      throw new Error(`Expected AI review status to reach APPROVE, got ${result.pullRequest.aiReviewStatus}`);
    }

    // Critical Human Gate Assertion: Must NEVER be auto-approved by AI
    if (result.pullRequest.humanApprovalStatus !== HumanApprovalStatus.PENDING) {
      throw new Error(`CRITICAL SECURITY FAILURE: Human approval was altered to ${result.pullRequest.humanApprovalStatus}`);
    }

    return {
      name: testName,
      passed: true,
      details: `PR review loop completed. Iterations: ${result.allIterations.length}. Final AI Verdict: APPROVE. Human Gate strictly maintained in PENDING state.`
    };
  } catch (err: any) {
    return {
      name: testName,
      passed: false,
      details: `FAILED: ${err.message}`
    };
  }
}
