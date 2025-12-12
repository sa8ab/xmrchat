import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperDmMessage } from './super-sm-message.entity';
import { Repository } from 'typeorm';
import { SuperDmMessageSenderType } from 'src/shared/constants';

@Injectable()
export class SuperDmMessagesService {
  constructor(
    @InjectRepository(SuperDmMessage)
    private superDmMessagesRepo: Repository<SuperDmMessage>,
  ) {}

  async readMessages(
    superDmId: string,
    senderType: SuperDmMessageSenderType = SuperDmMessageSenderType.VIEWER,
  ) {
    const unreadMessages = await this.superDmMessagesRepo.find({
      where: {
        superDm: { id: superDmId },
        read: false,
        senderType,
      },
    });

    unreadMessages.forEach((message) => {
      message.read = true;
    });

    const messages = await this.superDmMessagesRepo.save(unreadMessages);

    return messages;
  }
}
