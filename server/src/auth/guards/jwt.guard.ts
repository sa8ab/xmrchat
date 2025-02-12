import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  // Only throw errors if there is any. Don't throw unauthorized exception if user is not found.
  // Authentication will be handled on auth.guard
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
