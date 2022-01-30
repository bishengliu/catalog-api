import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { PermissionRepository } from '../../permission/repository/permission.repository';
import { ServiceRepository } from '../../service/repository/service.repository';
@Injectable()
export class FilterInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FilterInterceptor.name);
  constructor(
    @InjectRepository(PermissionRepository)
    private permissionRepository: PermissionRepository,
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (user.isAdmin) {
      return next.handle();
    }
    const permittedServices: string[] = await this.getPermissons(user.id);
    this.logger.debug(permittedServices);
    return next
      .handle()
      .pipe(
        map((data) =>
          data.filter((item) => permittedServices.indexOf(item.id) !== -1),
        ),
      );
  }

  async getPermissons(userId: string): Promise<string[]> {
    try {
      const perms = await this.permissionRepository.find({
        where: { userId: userId },
      });
      const selfServices = await this.serviceRepository.find({
        where: { userId: userId },
      });

      if (!perms && !selfServices) return [];

      return perms
        .map((perm) => perm.serviceId)
        .concat(selfServices.map((service) => service.id));
    } catch (error) {
      this.logger.error(error);
      this.logger.error('Something went wrong, give no permissions!');
      return [];
    }
  }
}
