import { Version, Service } from '@catalog/service/entities';
import {
  CreateServiceDto,
  CreateServiceVersionDto,
  UpdateServiceDto,
  FilterServicesDto,
  FilterKey,
  OrderByKey,
} from '@catalog/service/dto';
import { isUuid } from 'uuidv4';

import { EntityRepository, Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
    return await this.findServiceByUUID(service.id);
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

  async filterServices(
    filterServicesDto: FilterServicesDto,
  ): Promise<Service[]> {
    const query = this.createQueryBuilder('service').leftJoinAndSelect(
      'service.versions',
      'version',
    );
    // filter
    switch (filterServicesDto.filterKey) {
      case FilterKey.SERVICE:
        query.where('service.service like :service', {
          service: `%${filterServicesDto.filterValue}%`,
        });
        break;
      case FilterKey.DESCRIPTION:
        query.where('service.description like :description', {
          description: `%${filterServicesDto.filterValue}%`,
        });
        break;
      default:
        // no filter
        break;
    }

    // orderby
    switch (filterServicesDto.OrderBy) {
      case OrderByKey.SERVICE:
        query.orderBy('service.service');
        break;
      case OrderByKey.CREATEDATE:
        query.orderBy('service.createAt');
        break;
      default:
        break;
    }

    // pagination
    const offset = filterServicesDto.offset || 0;
    const limits = filterServicesDto.limits || 100;
    query.skip(offset).take(limits);
    return await query.getMany();
  }

  async findAllServices(offset: number): Promise<Service[]> {
    const skipOffset = offset || 0;
    const query = this.createQueryBuilder('service')
      .leftJoinAndSelect('service.versions', 'version')
      .skip(skipOffset)
      .take(100);
    return await query.getMany();
  }
}
