import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ type: String })
  @IsUUID(4)
  userId: string;

  @ApiProperty({ type: String })
  @IsUUID(4)
  serviceId: string;
}
