import { SetMetadata } from '@nestjs/common';
import { ROLES_METADATA, RolesEnum } from 'src/shared/constants';

export const Roles = (...args: RolesEnum[]) =>
  SetMetadata(ROLES_METADATA, args);
