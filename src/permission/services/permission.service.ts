import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionRepository } from '../repository/permission.repository';
import { RemovePermissionDto } from './../dto/remove-permission.dto';
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionRepository)
    private serviceRepository: PermissionRepository,
  ) {}
  grantAccess(createPermissionDto: CreatePermissionDto) {
    return this.serviceRepository.createPermission(createPermissionDto);
  }

  removeAccess(removePermissionDto: RemovePermissionDto) {
    return this.serviceRepository.removePermission(removePermissionDto);
  }

  getAccesses(id: string) {
    return this.serviceRepository.getPermissions(id);
  }
}
