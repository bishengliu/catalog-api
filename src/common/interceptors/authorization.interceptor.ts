import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (user && (user.isAdmin || this.shouldProceed())) {
      return next.handle();
    }

    // throw exception
    throw new UnauthorizedException();
  }

  shouldProceed() {
    //todo: check permissions
    return false;
  }
}
