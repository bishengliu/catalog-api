import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './repository/permission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@catalog/auth/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionRepository])],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
