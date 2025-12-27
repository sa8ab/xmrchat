import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuperDm } from './super-dm.entity';
import { SuperDmMessageSenderType } from 'src/shared/constants';

@Entity({ name: 'super_dm_messages' })
export class SuperDmMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SuperDm, (s: SuperDm) => s.messages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  superDm: SuperDm;

  @Column({ default: SuperDmMessageSenderType.CREATOR })
  senderType: SuperDmMessageSenderType;

  @Column()
  content: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
