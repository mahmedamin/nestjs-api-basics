import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup() {
    return {
      msg: '-!signup!-',
    };
  }

  login() {
    return {
      msg: '-!login!-',
    };
  }
}
