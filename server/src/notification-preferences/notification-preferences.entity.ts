import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Page } from 'src/pages/page.entity';
import {
  NotificationChannelEnum,
  NotificationPreferenceType,
} from 'src/shared/constants';

@Entity('notification_preferences')
@Unique('unique-page-and-type-and-channel', ['page.id', 'type', 'channel'])
export class NotificationPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: NotificationPreferenceType })
  type: NotificationPreferenceType;

  @Column({ type: 'enum', enum: NotificationChannelEnum })
  channel: NotificationChannelEnum;

  @Column({ type: 'boolean', nullable: true })
  enabled: boolean;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
