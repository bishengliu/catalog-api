import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionRepository } from 'src/permission/repository/permission.repository';

@Injectable()
export class AuthorizationInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(PermissionRepository)
    private permissionRepository: PermissionRepository,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (user && (user.isAdmin || (await this.shouldProceed(req)))) {
      return next.handle();
    }

    // throw exception
    throw new UnauthorizedException();
  }

  // non-admin permissions
  async shouldProceed(req: any) {
    if (req?.params['id']) {
      const userId = req.user.id;
      const serviceId = req?.params['id'];
      const perm = await this.permissionRepository.findOne({
        where: { userId, serviceId },
      });
      return perm ? true : false;
    }
    return false;
  }
}
