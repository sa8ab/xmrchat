import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Page } from 'src/pages/page.entity';
import { Injectable, Logger } from '@nestjs/common';
import { BeforeQueryEvent } from 'typeorm/subscriber/event/QueryEvent';

@Injectable()
@EventSubscriber()
export class PageSubscriber implements EntitySubscriberInterface<Page> {
  private logger = new Logger(PageSubscriber.name);

  constructor() {}

  listenTo() {
    return Page;
  }

  async beforeInsert(event: InsertEvent<Page>) {}

  afterUpdate(event: UpdateEvent<Page>): Promise<any> | void {
    this.logger.log({
      updatedColumns: event.updatedColumns.map((c) => c.propertyName),
    });
    this.logger.log({
      updatedRelations: event.updatedRelations.map((c) =>
        c.foreignKeys.map((f) => f.name),
      ),
    });
  }

  beforeQuery(event: BeforeQueryEvent<Page>): Promise<any> | void {
    // this.logger.log({ event });
  }
}
