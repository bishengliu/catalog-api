import { Version } from './../entities/version.entity';
import { CreateServiceDto } from './../dto/create-service.dto';
import { Service } from './../entities/service.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  private readonly logger = new Logger(ServiceRepository.name);

  async createService(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = new Service();
    try {
      service.service = createServiceDto.service;
      service.description = createServiceDto.description;
      await service.save();

      const version = new Version();
      version.service = service;
      version.version = createServiceDto.version;
      await version.save();
    } catch (error) {
      this.logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Service already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return service;
  }
}
