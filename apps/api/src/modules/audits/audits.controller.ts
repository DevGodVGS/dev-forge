import { Controller, Get, Post, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { devForgeStore } from '@devforge/database';
import { AuditWorkflowEngine } from '@devforge/agent-core';
import { TriggerAuditDto, FindingStatus } from '@devforge/shared-types';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('api/v1/audits')
@UseGuards(AuthGuard)
export class AuditsController {
  @Post()
  async triggerAudit(@Body() dto: TriggerAuditDto) {
    const result = await AuditWorkflowEngine.runRepositoryAudit(
      dto.repositoryId,
      dto.branch || 'main',
      true // auto-remediate critical findings
    );
    return result;
  }

  @Get('repository/:repoId')
  async listByRepo(@Param('repoId') repoId: string) {
    return devForgeStore.listAudits(repoId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const audit = await devForgeStore.getAudit(id);
    if (!audit) {
      throw new NotFoundException(`Audit ${id} not found`);
    }
    return audit;
  }

  @Get(':id/findings')
  async listFindings(@Param('id') id: string) {
    return devForgeStore.listFindings(id);
  }

  @Post(':id/findings/:findingId/triage')
  async triageFinding(@Param('findingId') findingId: string) {
    const finding = await devForgeStore.getFinding(findingId);
    if (!finding) {
      throw new NotFoundException(`Finding ${findingId} not found`);
    }
    return devForgeStore.updateFinding(findingId, {
      status: FindingStatus.TRIAGED
    });
  }
}
