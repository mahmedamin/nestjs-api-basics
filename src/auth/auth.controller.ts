import {Body, Controller, Post, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
// import {Request} from "express";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: any) {
    console.log('-req1', body);
    return this.authService.signup();
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
