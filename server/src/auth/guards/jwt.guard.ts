import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) {
    // ? Allow request to continue even if authentication fails
    // ? Will be handled on auth.guard
    // ? This is being used to set the user on Request object
    try {
      await super.canActivate(context);
    } catch (error) {}

    return true;
  }
}
