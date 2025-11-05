import { Module } from '@nestjs/common';
import { PageTipTiersService } from './page-tip-tiers.service';
import { PageTipTiersController } from './page-tip-tiers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageTipTier } from './page-tip-tier.entity';
import { File } from 'src/files/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PageTipTier, File])],
  providers: [PageTipTiersService],
  controllers: [PageTipTiersController],
})
export class PageTipTiersModule {}
