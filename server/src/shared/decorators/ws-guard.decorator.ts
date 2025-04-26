import { SetMetadata } from '@nestjs/common';
import { WS_GUARD_METADATA } from 'src/shared/constants';

export const WsGuard = () => SetMetadata(WS_GUARD_METADATA, true);
