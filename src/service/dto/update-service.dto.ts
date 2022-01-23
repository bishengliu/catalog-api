import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiProperty({
    type: String,
    minimum: 3,
    maximum: 20,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  service: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  description: string;
}
