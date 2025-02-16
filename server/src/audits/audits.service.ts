import { Inject, Injectable, Logger as NestLogger } from '@nestjs/common';
import { Page } from 'src/pages/page.entity';
import diff from 'microdiff';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AuditTypeEnum } from 'src/shared/constants';
import { ClsService } from 'nestjs-cls';
// import { diff } from 'just-diff';

@Injectable()
export class AuditsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private clsService: ClsService,
  ) {}
  private nestLogger = new NestLogger(AuditsService.name);

  private pageForeignFieldMap = {
    tiers: { valueField: 'name', isArray: true },
    logo: { valueField: 'name' },
    coverImage: { valueField: 'name' },
    payment: { valueField: 'name' },
    links: { valueField: 'name', isArray: true },
    settings: { valueField: 'name', isArray: true },
  };

  add(type: AuditTypeEnum, prevObj, newObj) {
    try {
      if (type === AuditTypeEnum.PAGE_UPDATED)
        return this.pageUpdate(prevObj, newObj);
    } catch (error) {
      this.nestLogger.log('Adding audit failed', error);
    }
  }

  pageUpdate(prevObj: Page, newObj: Page) {
    const logItems: any = [];

    const diffs = diff(prevObj, newObj);

    diffs.forEach((d) => {
      const path = d.path[0];
      const foreignField = this.pageForeignFieldMap[d.path[0]];
      if (foreignField) {
        // If checking nested item return it.
        if (d.path.length >= 3) return;

        if (foreignField.isArray) {
          logItems.push({
            path,
            mode: d.type,
            oldValue: prevObj[path].map(
              (item) => item[foreignField.valueField],
            ),
            value: newObj[path].map((item) => item[foreignField.valueField]),
          });
          return;
        }

        const oldFieldName = (d as any).oldValue?.[foreignField.valueField];
        const fieldName = (d as any).value?.[foreignField.valueField];
        logItems.push({
          path,
          mode: d.type,
          oldValue: oldFieldName,
          value: fieldName,
        });
        return;
      }

      logItems.push({
        path,
        mode: d.type,
        oldValue: (d as any).oldValue,
        value: (d as any).value,
      });
    });

    this.createLog(AuditTypeEnum.PAGE_UPDATED, logItems);
  }

  async createLog(
    type: AuditTypeEnum,
    params: {
      path: string | number;
      mode: string;
      oldValue: object;
      value: object;
    }[],
  ) {
    const user = this.clsService.get('user');
    this.logger.info(`${type} by ${user?.email}`);

    params.forEach((l) => {
      this.logger.info(`${l.path} - ${l.mode}. ${l.oldValue} --> ${l.value}.`);
    });
    this.logger.info(`---------------------------------`);
  }
}
