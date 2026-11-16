import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AgentRegistry } from '@devforge/agent-core';
import { AgentRole } from '@devforge/shared-types';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('api/v1/agents')
@UseGuards(AuthGuard)
export class AgentsController {
  @Get()
  async list() {
    return AgentRegistry.listAgents();
  }

  @Get(':role')
  async getOne(@Param('role') role: AgentRole) {
    return AgentRegistry.getAgent(role);
  }
}
