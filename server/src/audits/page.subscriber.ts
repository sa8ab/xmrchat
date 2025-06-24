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
    const tableName = event.metadata.name;
    const entityId = event.databaseEntity.id;
    const type = 'UPDATE';
    const changes = {};

    event.updatedColumns.forEach((c) => {
      const valueFrom = c.getEntityValue(event.databaseEntity);
      const value = c.getEntityValue(event.entity);

      changes[c.propertyName] = {
        from: valueFrom,
        to: value,
      };
    });

    event.updatedRelations.forEach((ur) => {
      const valueFrom = ur.getEntityValue(event.databaseEntity);
      const value = ur.getEntityValue(event.entity);

      changes[ur.propertyName] = {
        from: valueFrom,
        to: value,
      };
    });

    this.auditsService.createLog({
      changes,
      tableName,
      entityId,
      type,
    });
  }
}
