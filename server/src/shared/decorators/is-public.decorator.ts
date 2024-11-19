import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_METADATA } from 'src/shared/constants';

export const IsPublic = () => SetMetadata(IS_PUBLIC_METADATA, true);
