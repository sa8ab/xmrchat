import { Module } from '@nestjs/common';
import { UserTokensService } from './user-tokens.service';
import { UserToken } from './user-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [UserTokensService],
  imports: [TypeOrmModule.forFeature([UserToken])],
  exports: [UserTokensService],
})
export class UserTokensModule {}
