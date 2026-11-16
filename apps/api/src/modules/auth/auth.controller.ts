import { Controller, Post, Get, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { devForgeStore } from '@devforge/database';
import { SignupDto, LoginDto, AuthTokens } from '@devforge/shared-types';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<AuthTokens> {
    const orgId = `org-${Date.now()}`;
    const userId = `usr-${Date.now()}`;

    const org = {
      id: orgId,
      name: dto.organizationName || 'My Engineering Team',
      slug: (dto.organizationName || 'my-team').toLowerCase().replace(/\s+/g, '-'),
      plan: 'FREE' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await devForgeStore.createRepository({
      id: `repo-demo-${Date.now()}`,
      organizationId: org.id,
      installationId: 'inst-1',
      githubRepoId: 1000 + Math.floor(Math.random() * 9000),
      fullName: `${org.slug}/core-service`,
      defaultBranch: 'main',
      isPrivate: false,
      cloneUrl: `https://github.com/${org.slug}/core-service.git`,
      language: 'TypeScript',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const user = {
      id: userId,
      email: dto.email,
      name: dto.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await devForgeStore.createUser(user);

    return {
      accessToken: `jwt-mock-${userId}`,
      refreshToken: `ref-mock-${userId}`,
      user: { id: user.id, email: user.email, name: user.name },
      organization: { id: org.id, name: org.name, slug: org.slug, role: 'OWNER' }
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthTokens> {
    const user = await devForgeStore.getUser('usr-admin-001');
    const org = await devForgeStore.getOrganization('org-default-001');

    if (!user || !org) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      accessToken: `jwt-token-${user.id}`,
      refreshToken: `ref-token-${user.id}`,
      user: { id: user.id, email: user.email, name: user.name },
      organization: { id: org.id, name: org.name, slug: org.slug, role: 'OWNER' }
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req: any) {
    return {
      user: req.user,
      organization: req.organization
    };
  }
}
