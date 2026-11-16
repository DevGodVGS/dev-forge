import { Controller, Get, Post, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { devForgeStore } from '@devforge/database';
import { PrReviewWorkflowEngine } from '@devforge/agent-core';
import { TriggerPrReviewDto, HumanApprovalStatus } from '@devforge/shared-types';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('api/v1/pull-requests')
@UseGuards(AuthGuard)
export class PullRequestsController {
  @Get('repository/:repoId')
  async listByRepo(@Param('repoId') repoId: string) {
    return devForgeStore.listPullRequests(repoId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const pr = await devForgeStore.getPullRequest(id);
    if (!pr) {
      throw new NotFoundException(`Pull request ${id} not found`);
    }
    return pr;
  }

  @Get(':id/reviews')
  async listReviews(@Param('id') id: string) {
    return devForgeStore.listReviewIterations(id);
  }

  @Post('review')
  async triggerReview(@Body() dto: TriggerPrReviewDto) {
    return PrReviewWorkflowEngine.reviewPullRequest(dto.pullRequestId);
  }

  @Post(':id/approve')
  async humanApprove(@Param('id') id: string) {
    const pr = await devForgeStore.getPullRequest(id);
    if (!pr) {
      throw new NotFoundException(`Pull request ${id} not found`);
    }
    return devForgeStore.updatePullRequest(id, {
      humanApprovalStatus: HumanApprovalStatus.APPROVED
    });
  }
}
