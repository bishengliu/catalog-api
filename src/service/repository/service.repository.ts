import { Version } from './../entities/version.entity';
import { CreateServiceDto } from './../dto/create-service.dto';
import { CreateServiceVersionDto } from './../dto/create-service-version.dto';
import { Service } from './../entities/service.entity';
import { isUuid } from 'uuidv4';

import { EntityRepository, Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateServiceDto } from '../dto/update-service.dto';

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

  async findServiceByUUID(uuid: string): Promise<Service> {
    if (!isUuid(uuid)) throw new BadRequestException();
    const service = await this.findOne(uuid);
    if (!service) throw new NotFoundException();
    return service;
  }

  async updateService(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    try {
      const service = await this.findServiceByUUID(id);

      service.service = updateServiceDto.service;
      service.description = updateServiceDto.description;
      await service.save();
      return service;
    } catch (error) {
      this.logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Service already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async createServiceVersion(
    createServiceVersionDto: CreateServiceVersionDto,
  ): Promise<Version> {
    const service = await this.findServiceByUUID(createServiceVersionDto.uuid);

    try {
      const version = new Version();
      version.service = service;
      version.version = createServiceVersionDto.version;
      await version.save();
      return version;
    } catch (error) {
      this.logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException(
          'Service with the same version already exists',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async removeServiceByUUID(uuid: string): Promise<Service> {
    const service = await this.findServiceByUUID(uuid);

    try {
      await this.remove(service);
      return service;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
