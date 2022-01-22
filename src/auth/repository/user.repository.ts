import { SignInDto } from './../dto/signin.dto';
import { EntityRepository, Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { SignUpDto, SignInDto } from '../dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);

  async signUp(signUpDto: SignUpDto) {
    const { username, password } = signUpDto;
    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      this.logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(SignInDto: SignInDto) {
    const { username, password } = SignInDto;
    const user = await this.findOne({ username });
    if (!user || !user.isValidPassword(password))
      throw new BadRequestException(
        "the combination of username and password does't exist",
      );
    // need to return jwt payload
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
