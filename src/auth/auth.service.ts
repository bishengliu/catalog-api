import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signin(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; user: JwtPayload }> {
    const jwtPayload = await this.userRepository.generateUserPayload(signInDto);
    const accessToken = await this.jwtService.sign(jwtPayload);
    return {
      accessToken,
      user: jwtPayload,
    };
  }

  signup(signUpDto: SignUpDto) {
    this.userRepository.signUp(signUpDto);
    return {
      username: signUpDto.username,
      message: 'signup successful',
    };
  }
}
