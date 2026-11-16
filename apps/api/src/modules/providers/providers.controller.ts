import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { devForgeStore } from '@devforge/database';
import { aiService, ModelRegistry } from '@devforge/ai-core';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('api/v1/providers')
@UseGuards(AuthGuard)
export class ProvidersController {
  @Get()
  async list(@Req() req: any) {
    const orgId = req.organization?.id || 'org-default-001';
    const configs = await devForgeStore.listProviders(orgId);
    const models = ModelRegistry.listModels();
    return {
      configs,
      models,
      metrics: aiService.getMetrics()
    };
  }

  @Post('verify')
  async verify() {
    return aiService.healthCheckAll();
  }

  @Post('credentials')
  async updateCredentials(@Req() req: any, @Body() body: { provider: string; apiKey: string }) {
    const masked = body.apiKey && body.apiKey.length > 8 
      ? `${body.apiKey.slice(0, 4)}...${body.apiKey.slice(-3)}`
      : '****';
    return {
      success: true,
      provider: body.provider,
      maskedKey: masked,
      updatedAt: new Date().toISOString()
    };
  }
}
