import { Controller, Get, Post, Param, Body, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { devForgeStore } from '@devforge/database';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('api/v1/repositories')
@UseGuards(AuthGuard)
export class RepositoriesController {
  @Get()
  async list(@Req() req: any) {
    const orgId = req.organization?.id || 'org-default-001';
    return devForgeStore.listRepositories(orgId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const repo = await devForgeStore.getRepository(id);
    if (!repo) {
      throw new NotFoundException(`Repository ${id} not found`);
    }
    return repo;
  }

  @Post('connect')
  async connect(@Req() req: any, @Body() body: { fullName: string; cloneUrl?: string }) {
    const orgId = req.organization?.id || 'org-default-001';
    const newRepo = {
      id: `repo-${Date.now()}`,
      organizationId: orgId,
      installationId: 'inst-github-001',
      githubRepoId: 500000 + Math.floor(Math.random() * 100000),
      fullName: body.fullName,
      defaultBranch: 'main',
      isPrivate: true,
      cloneUrl: body.cloneUrl || `https://github.com/${body.fullName}.git`,
      language: 'TypeScript',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return devForgeStore.createRepository(newRepo);
  }
}
