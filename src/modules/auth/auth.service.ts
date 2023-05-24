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

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signup(dto: SignupDto) {
    try {
      const password = await argon.hash(dto.password);
      const user = this.usersRepository.create({
        ...dto,
        password,
      });

      await this.usersRepository.save(user);

      return {
        success: true,
        user: _.pick(user, ['id', 'email']),
      };
    } catch (err) {
      if (err.code === '23505') {
        throw new BadRequestException('email has already been taken!');
      }

      throw err;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      const passwordMatched = await argon.verify(user.password, dto.password);

      if (passwordMatched) {
        return {
          success: true,
          user: _.pick(user, ['id', 'email']),
        };
      }
    }

    throw new ForbiddenException('Email or password is incorrect!');
  }
}
