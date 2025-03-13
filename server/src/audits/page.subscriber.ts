import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Page } from 'src/pages/page.entity';
import { Injectable } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { AuditTypeEnum } from 'src/shared/constants';

@Injectable()
@EventSubscriber()
export class PageSubscriber implements EntitySubscriberInterface<Page> {
  constructor(
    readonly connection: Connection,
    private auditsService: AuditsService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Page;
  }

  afterUpdate(event: UpdateEvent<Page>): Promise<any> | void {
    const logs = [];

    const updatedColumns = event.updatedColumns
      .map((c) => c.propertyName)
      .map((c) => {
        return {
          field: c,
          valueFrom: event.databaseEntity[c],
          value: event.entity[c],
        };
      })
      .forEach((c) => {
        logs.push({
          path: c.field,
          mode: 'ANY',
          oldValue: c.valueFrom,
          value: c.value,
        });
      });

    return this.auditsService.createLog(AuditTypeEnum.PAGE_UPDATED, logs);
  }
}
