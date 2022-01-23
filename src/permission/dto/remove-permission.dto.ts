import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';

export class RemovePermissionDto extends PartialType(CreatePermissionDto) {}
