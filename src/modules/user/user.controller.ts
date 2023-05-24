import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Request } from 'express';
import { JwtGuard } from '../auth/guards';
import * as _ from 'lodash';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private service: UserService) {}
  @Get('me')
  async getMe(@Req() req: Request) {
    const reqUser = req.user as {
      userId: number;
    };
    const user = await this.service.getById(reqUser.userId);
    return {
      user,
    };
  }
}
