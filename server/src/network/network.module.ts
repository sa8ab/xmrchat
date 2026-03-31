import { Global, Module } from '@nestjs/common';
import { NetworkService } from './network.service';

@Global()
@Module({
  providers: [NetworkService],
  exports: [NetworkService]
})
export class NetworkModule { }
