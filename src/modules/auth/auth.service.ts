import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import * as argon from 'argon2';
import { User } from '../user/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    try {
      const password: string = await argon.hash(dto.password);
      const user: User = this.usersRepository.create({
        ...dto,
        password,
      });

      await this.usersRepository.save(user);
      const token = await this.signToken(user);
      return {
        success: true,
        token,
      };
    } catch (err) {
      if (err.code === '23505') {
        throw new BadRequestException('email has already been taken!');
      }

      throw err;
    }
  }

  async login(dto: LoginDto) {
    const user: User = await this.usersRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      const passwordMatched: boolean = await argon.verify(
        user.password,
        dto.password,
      );

      if (passwordMatched) {
        const token = await this.signToken(user);
        return {
          success: true,
          token,
        };
      }
    }

    throw new ForbiddenException('Email or password is incorrect!');
  }

  signToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
