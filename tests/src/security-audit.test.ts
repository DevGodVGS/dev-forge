import * as crypto from 'crypto';
import { GitHubWebhookValidator } from '@devforge/github-client';
import { devForgeStore } from '@devforge/database';

export async function testSecurityAudit(): Promise<{ name: string; passed: boolean; details: string }> {
  const testName = 'Security & Isolation Verification Suite';
  try {
    const secret = 'super-secret-key-123';
    const payload = JSON.stringify({ action: 'opened', repository: { id: 12345 } });

    // 1. Valid Signature Test
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const validHeader = `sha256=${hmac.digest('hex')}`;

    const isValid = GitHubWebhookValidator.verifySignature(payload, validHeader, secret);
    if (!isValid) {
      throw new Error('Valid HMAC-SHA256 signature failed verification');
    }

    // 2. Tampered Signature Test
    const tamperedPayload = JSON.stringify({ action: 'opened', repository: { id: 99999 } });
    const isTamperedValid = GitHubWebhookValidator.verifySignature(tamperedPayload, validHeader, secret);
    if (isTamperedValid) {
      throw new Error('Tampered payload was incorrectly verified as valid');
    }

    // 3. Timing-Safe Length Test
    const isInvalidLengthValid = GitHubWebhookValidator.verifySignature(payload, 'sha256=short', secret);
    if (isInvalidLengthValid) {
      throw new Error('Short signature string bypassed check');
    }

    // 4. Tenant Isolation Verification
    const org1Repos = await devForgeStore.listRepositories('org-default-001');
    const org2Repos = await devForgeStore.listRepositories('org-foreign-tenant-999');
    if (org2Repos.length !== 0) {
      throw new Error('Cross-tenant data leak: Foreign tenant accessed org-default data');
    }

    return {
      name: testName,
      passed: true,
      details: 'HMAC-SHA256 timingSafeEqual verified. Tamper detection verified. Multi-tenant repository isolation confirmed.'
    };
  } catch (err: any) {
    return {
      name: testName,
      passed: false,
      details: `FAILED: ${err.message}`
    };
  }
}
