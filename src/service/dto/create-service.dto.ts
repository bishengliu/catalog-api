import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    minimum: 3,
    maximum: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  service: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  version: string;
}
