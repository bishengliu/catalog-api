import { Version } from './entities/version.entity';
import { CreateServiceVersionDto } from './dto/create-service-version.dto';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceRepository } from './repository/service.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}

  create(createServiceDto: CreateServiceDto) {
    return this.serviceRepository.createService(createServiceDto);
  }

  findAll() {
    return this.serviceRepository.find({});
  }

  findOne = (id: string) => this.serviceRepository.findServiceByUUID(id);

  update = (id: string, updateServiceDto: UpdateServiceDto) =>
    this.serviceRepository.updateService(id, updateServiceDto);

  remove = (id: string): Promise<Service> =>
    this.serviceRepository.removeServiceByUUID(id);

  createServiceVersion = (
    createServiceVersionDto: CreateServiceVersionDto,
  ): Promise<Version> =>
    this.serviceRepository.createServiceVersion(createServiceVersionDto);
}
