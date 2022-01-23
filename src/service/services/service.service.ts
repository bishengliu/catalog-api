import { ServiceRepository } from '../repository/service.repository';
import { InjectRepository } from '@nestjs/typeorm';
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

  createService = (userId: string, createServiceDto: CreateServiceDto) =>
    this.serviceRepository.createService(userId, createServiceDto);

  findAllServices = (offset: number) =>
    this.serviceRepository.findAllServices(offset);

  findOneService = (id: string) => this.serviceRepository.findServiceByUUID(id);

  updateService = (id: string, updateServiceDto: UpdateServiceDto) =>
    this.serviceRepository.updateService(id, updateServiceDto);

  removeService = (id: string): Promise<Service> =>
    this.serviceRepository.removeServiceByUUID(id);

  createServiceVersion = (
    userId: string,
    createServiceVersionDto: CreateServiceVersionDto,
  ): Promise<Version> =>
    this.serviceRepository.createServiceVersion(
      userId,
      createServiceVersionDto,
    );

  filterServices = (filterServicesDto: FilterServicesDto): Promise<Service[]> =>
    this.serviceRepository.filterServices(filterServicesDto);
}
