import { PartialType } from '@nestjs/swagger';
import { SignInDto } from './signin.dto';

export class SignUpDto extends PartialType(SignInDto) {}
