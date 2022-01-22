import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRepository } from './repository/service.repository';
import { Injectable } from '@nestjs/common';
import {
  FilterServicesDto,
  CreateServiceVersionDto,
  CreateServiceDto,
  UpdateServiceDto,
} from '@catalog/service/dto';
import { Version, Service } from '@catalog/service/entities';
@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}

  create = (createServiceDto: CreateServiceDto) =>
    this.serviceRepository.createService(createServiceDto);

  findAllServices = (offset: number) =>
    this.serviceRepository.findAllServices(offset);

  findOne = (id: string) => this.serviceRepository.findServiceByUUID(id);

  update = (id: string, updateServiceDto: UpdateServiceDto) =>
    this.serviceRepository.updateService(id, updateServiceDto);

  remove = (id: string): Promise<Service> =>
    this.serviceRepository.removeServiceByUUID(id);

  createServiceVersion = (
    createServiceVersionDto: CreateServiceVersionDto,
  ): Promise<Version> =>
    this.serviceRepository.createServiceVersion(createServiceVersionDto);

  filterServices = (filterServicesDto: FilterServicesDto): Promise<Service[]> =>
    this.serviceRepository.filterServices(filterServicesDto);
}
