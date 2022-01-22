import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { SignUpDto, SignInDto } from '../dto';
import { JwtPayload } from '../interfaces/jwt-payload';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);

  async signUp(signUpDto: SignUpDto) {
    const { username, password } = signUpDto;
    const user = new User();
    user.username = username;
    try {
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, user.salt);
      await user.save();
      return {
        username: user.username,
        message: 'signup successful',
      };
    } catch (error) {
      this.logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async generateUserPayload(SignInDto: SignInDto): Promise<JwtPayload> {
    const { username, password } = SignInDto;
    const user = await this.findOne({ username });
    if (!user || !user.isValidPassword(password))
      throw new UnauthorizedException(
        'the combination of username and password is invalid',
      );
    return { username, isAdmin: user.isAdmin };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
