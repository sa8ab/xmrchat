import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { IS_PUBLIC_METADATA, ROLES_METADATA } from 'src/shared/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private clsService: ClsService,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    this.clsService.set('user', request.user);

    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredRoles = this.reflector.getAllAndOverride(ROLES_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = request.user;

    if (isPublic) return true;

    if (!user) return false;

    if (!requiredRoles) return true;

    return requiredRoles.some((rr: string) => user.roles?.includes(rr));
  }
}
