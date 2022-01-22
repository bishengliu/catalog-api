import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { SignInDto, SignUpDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }
}
