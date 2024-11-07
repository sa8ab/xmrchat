import { SetMetadata } from '@nestjs/common';
import { ROLES_METADATA } from 'src/shared/constants';

export enum RolesEnum {
  OWNER,
  USER,
}

export const Roles = (...args: RolesEnum[]) =>
  SetMetadata(ROLES_METADATA, args);
