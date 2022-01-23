import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './permission.controller';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
