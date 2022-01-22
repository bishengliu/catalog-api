import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    type: String,
    minimum: 3,
    maximum: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  service: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  version: string;
}
