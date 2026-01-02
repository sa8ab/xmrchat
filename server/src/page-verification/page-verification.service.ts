import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageVerification } from './page-verification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PageVerificationService {
  constructor(
    @InjectRepository(PageVerification)
    private repo: Repository<PageVerification>,
  ) {}
}
