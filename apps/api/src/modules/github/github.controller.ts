import { Controller, Post, Get, Headers, Body, UnauthorizedException, Param } from '@nestjs/common';
import { GitHubWebhookValidator, githubService } from '@devforge/github-client';
import { devForgeStore } from '@devforge/database';

@Controller('api/v1/github')
export class GitHubController {
  @Post('webhooks')
  async handleWebhook(
    @Headers('x-hub-signature-256') signature: string,
    @Body() payload: any
  ) {
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET || 'devforge-secret-key';
    const rawPayload = JSON.stringify(payload);

    // Verify cryptographic signature
    const isValid = GitHubWebhookValidator.verifySignature(rawPayload, signature, webhookSecret);
    if (!isValid && process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Invalid GitHub webhook HMAC-SHA256 signature');
    }

    return { received: true, action: payload.action, timestamp: new Date().toISOString() };
  }

  @Get('repositories/:id/tree')
  async getTree(@Param('id') id: string) {
    const repo = await devForgeStore.getRepository(id);
    if (!repo) return [];
    const [owner, repoName] = repo.fullName.split('/');
    return githubService.getRepositoryTree({ owner, repo: repoName });
  }
}
