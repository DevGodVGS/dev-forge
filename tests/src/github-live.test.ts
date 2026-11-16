import { GitHubService } from '@devforge/github-client';

export async function testGitHubClientLive(): Promise<{ name: string; passed: boolean; details: string }> {
  const name = 'GitHub Client Live & Simulation Adapter Suite';
  try {
    // 1. Unset token simulation mode
    const simService = new GitHubService('');
    if (simService.isLiveMode()) {
      return { name, passed: false, details: 'Expected empty token to be in simulation mode' };
    }
    if (simService.getMode() !== 'simulation') {
      return { name, passed: false, details: 'Expected getMode() to return simulation' };
    }
    if (simService.getMaskedToken() !== '[UNSET]') {
      return { name, passed: false, details: `Expected masked token to be [UNSET], got ${simService.getMaskedToken()}` };
    }

    const tree = await simService.getRepositoryTree({ owner: 'DevGodVGS', repo: 'dev-forge' });
    if (!tree.includes('apps/api/src/auth/auth.service.ts')) {
      return { name, passed: false, details: 'Simulation tree missing seed files' };
    }

    // 2. Mock token simulation mode
    const mockService = new GitHubService('mock-token-12345');
    if (mockService.isLiveMode()) {
      return { name, passed: false, details: 'Expected mock token to be filtered out of live mode' };
    }

    // 3. Live mode detection and token masking
    const secretToken = 'ghp_secretTokenLive1234567890abcdef';
    const liveService = new GitHubService(secretToken);
    if (!liveService.isLiveMode()) {
      return { name, passed: false, details: 'Expected live token to enable live mode' };
    }
    if (liveService.getMode() !== 'live') {
      return { name, passed: false, details: 'Expected getMode() to return live' };
    }

    const masked = liveService.getMaskedToken();
    if (masked.includes('secretTokenLive')) {
      return { name, passed: false, details: `Masked token leaked secret content: ${masked}` };
    }
    if (!masked.startsWith('ghp_') || !masked.endsWith('def')) {
      return { name, passed: false, details: `Masked token format incorrect: ${masked}` };
    }

    // 4. Graceful fallback on network error/invalid host
    const branchRes = await liveService.createBranch({ owner: 'DevGodVGS', repo: 'dev-forge' }, 'test-branch');
    if (!branchRes.ref.includes('test-branch')) {
      return { name, passed: false, details: 'Branch creation fallback failed to return ref' };
    }

    return {
      name,
      passed: true,
      details: 'GitHubService correctly toggles simulation/live modes, safely masks sensitive tokens, and handles fallback.'
    };
  } catch (err: any) {
    return { name, passed: false, details: `Exception in GitHub client test: ${err.message}` };
  }
}
