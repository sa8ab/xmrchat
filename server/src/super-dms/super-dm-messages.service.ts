import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async readMessages(superDmId: string) {
    const unreadMessages = await this.superDmMessagesRepo.find({
      where: {
        superDm: { id: superDmId },
        read: false,
        senderType: SuperDmMessageSenderType.VIEWER,
      },
    });

    unreadMessages.map((message) => (message.read = true));
    await this.superDmMessagesRepo.save(unreadMessages);

    return { message: 'Messages read updated successfully.' };
  }
}
