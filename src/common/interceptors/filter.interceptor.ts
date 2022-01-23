import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { PermissionRepository } from 'src/permission/repository/permission.repository';

@Injectable()
export class FilterInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FilterInterceptor.name);
  constructor(
    @InjectRepository(PermissionRepository)
    private permissionRepository: PermissionRepository,
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
      if (!perms) return [];
      return perms.map((perm) => perm.serviceId);
    } catch (error) {
      this.logger.error(error);
      this.logger.error('Something went wrong, give no permissions!');
      return [];
    }
  }
}
