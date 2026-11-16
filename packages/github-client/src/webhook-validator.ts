import * as crypto from 'crypto';

export class GitHubWebhookValidator {
  /**
   * Verifies the GitHub webhook signature using timingSafeEqual to prevent timing attacks.
   * Header: X-Hub-Signature-256
   */
  static verifySignature(rawPayload: string | Buffer, signatureHeader: string | undefined, secret: string): boolean {
    if (!signatureHeader || !secret) {
      return false;
    }

    const payloadBuffer = typeof rawPayload === 'string' ? Buffer.from(rawPayload) : rawPayload;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payloadBuffer);
    const expectedSignature = `sha256=${hmac.digest('hex')}`;

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const actualBuffer = Buffer.from(signatureHeader, 'utf8');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  }
}
