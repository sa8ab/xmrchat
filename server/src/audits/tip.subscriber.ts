import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  Repository,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { Tip } from 'src/tips/tip.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoneroUtils } from 'monero-ts';

@Injectable()
@EventSubscriber()
export class TipSubscriber implements EntitySubscriberInterface<Tip> {
  constructor(
    readonly connection: Connection,
    private auditsService: AuditsService,
    @InjectRepository(Tip) private repo: Repository<Tip>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Tip;
  }

  async afterUpdate(event: UpdateEvent<Tip>) {
    const name = event.metadata.name;
    const entityId = event.databaseEntity?.id;
    const type = 'UPDATE';
    const changes = {};
    let comment = '';

    event.updatedColumns.forEach((c) => {
      const valueFrom = c.getEntityValue(event.databaseEntity);
      const value = c.getEntityValue(event.entity);

      changes[c.propertyName] = {
        from: valueFrom,
        to: value,
      };
    });

    const webhookExpired = event.updatedColumns
      .map((c) => c.propertyName)
      .includes('webhookDeleted');

    if (webhookExpired && entityId) {
      const tip = await this.repo.findOne({
        where: { id: entityId },
        relations: { page: true, payment: true },
      });
      comment = `Tip ${tip.id} expired. Page: ${tip.page.path}. Amount: ${MoneroUtils.atomicUnitsToXmr(tip.payment.amount)}. 
        Name: ${tip.name}. Message: ${tip.message}. `;
    }

    this.auditsService.createLog({
      changes,
      tableName: name,
      entityId,
      type,
      comment,
    });
  }
}
