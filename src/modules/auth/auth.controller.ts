import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
// import {Request} from "express";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    console.log('-req1', dto);
    return this.authService.signup();
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
