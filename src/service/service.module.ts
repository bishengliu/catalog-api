import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionRepository } from 'src/permission/repository/permission.repository';
import { ServiceService } from './services/service.service';
import { ServiceController } from './service.controller';
import { ServiceRepository } from './repository/service.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRepository]),
    TypeOrmModule.forFeature([PermissionRepository]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
