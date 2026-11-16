import { Module } from '@nestjs/common';
import { AuthController } from './modules/auth/auth.controller';
import { OrganizationsController } from './modules/organizations/organizations.controller';
import { RepositoriesController } from './modules/repositories/repositories.controller';
import { AuditsController } from './modules/audits/audits.controller';
import { PullRequestsController } from './modules/pull-requests/pull-requests.controller';
import { ProvidersController } from './modules/providers/providers.controller';
import { AgentsController } from './modules/agents/agents.controller';
import { GitHubController } from './modules/github/github.controller';

@Module({
  imports: [],
  controllers: [
    AuthController,
    OrganizationsController,
    RepositoriesController,
    AuditsController,
    PullRequestsController,
    ProvidersController,
    AgentsController,
    GitHubController
  ],
  providers: []
})
export class AppModule {}
