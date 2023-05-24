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
        user: {
          id: user.id,
          createdAt: user.createdAt,
        },
      };
    } catch (err) {
      if (err.code === '23505') {
        throw new BadRequestException('email has already been taken!');
      }

      throw err;
    }
  }

  login() {
    return {
      msg: '-!login!-',
    };
  }
}
