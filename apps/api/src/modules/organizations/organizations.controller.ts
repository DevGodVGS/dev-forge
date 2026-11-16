import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { devForgeStore } from '@devforge/database';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('api/v1/organizations')
@UseGuards(AuthGuard)
export class OrganizationsController {
  @Get()
  async list() {
    return devForgeStore.listOrganizations();
  }

  @Get('current')
  async getCurrent(@Req() req: any) {
    return req.organization;
  }
}
