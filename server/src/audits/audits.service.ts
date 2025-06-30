import { Inject, Injectable, Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ClsService } from 'nestjs-cls';
import { AuditLog } from 'src/shared/types';

@Injectable()
export class AuditsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private clsService: ClsService,
  ) {}
  private nestLogger = new NestLogger(AuditsService.name);

  async createLog(log: AuditLog) {
    const user = this.clsService.get('user');
    this.logger.info(
      `
      [ ${log.type} by ${user?.email || '-'} ]
      Name: ${log.tableName}
      Entity Id: ${log.entityId || '-'}
      Comment: ${log.comment || '-'}
      Changes: ${JSON.stringify(log.changes)}
      `,
    );
  }
}
