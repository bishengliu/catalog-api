import { Service } from '@catalog/service/entities/service.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceRepository } from './repository/service.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRepository])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
