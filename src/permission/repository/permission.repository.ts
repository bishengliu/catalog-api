import { UserRepository } from './../../auth/repository/user.repository';
import { EntityRepository, Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { isUuid } from 'uuidv4';
import { Permission } from '../entities/permission.entity';
import { RemovePermissionDto } from '../dto/remove-permission.dto';
import { CreatePermissionDto } from './../dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(Permission)
export class PermissionRepository extends Repository<Permission> {
  private readonly logger = new Logger(PermissionRepository.name);

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super();
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const { userId, serviceId } = createPermissionDto;

    try {
      // if (await this.find({ userId: userId, serviceId: serviceId })) {
      //   return {
      //     message: `user(${userId}) already has the full access to service ${serviceId}`,
      //   };
      // }

      const permission = new Permission();
      permission.userId = userId;
      permission.serviceId = serviceId;
      await permission.save();

      return {
        message: `successfully give user(${userId}) full access to service ${serviceId}`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async removePermission(removePermissionDto: RemovePermissionDto) {
    const { userId, serviceId } = removePermissionDto;
    try {
      const permission = await this.findOne({
        userId: userId,
        serviceId: serviceId,
      });
      if (!permission) {
        throw new NotFoundException();
      }

      await this.remove(permission);
      return {
        message: `successfully remove user(${userId}) from accessing to service ${serviceId}`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getPermissions(userId: string) {
    try {
      if (!isUuid(userId)) {
        throw new BadRequestException();
      }
      return await this.find({ userId: userId });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
