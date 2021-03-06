import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from '../dto';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signin(signInDto: SignInDto) {
    const jwtPayload = await this.userRepository.generateUserPayload(signInDto);
    const accessToken = await this.jwtService.sign(jwtPayload);
    return {
      accessToken,
      user: jwtPayload,
    };
  }

  signup(signUpDto: SignUpDto) {
    return this.userRepository.signUp(signUpDto);
  }
}
