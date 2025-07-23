import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Messages } from 'src/utils/messages';
import { ResponseUtil } from 'src/utils/response.utils';
import { Not } from 'typeorm';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUsers(@Request() req: any) {
    const { tenantId, userId } = req.user;
    const result = await this.userService.findAllByTenant(tenantId, userId);
    return ResponseUtil.success(result, Messages.getSuccessfully);
  }
}
