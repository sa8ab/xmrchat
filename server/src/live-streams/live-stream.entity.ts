import { Page } from 'src/pages/page.entity';
import { LiveStreamPlatformEnum } from 'src/shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'live_streams' })
export class LiveStream {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  platform: LiveStreamPlatformEnum;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  channelId: string;

  @Column({ nullable: true })
  channelName: string;

  @Column({ nullable: true })
  videoId: string;

  @Column({ nullable: true, type: 'integer' })
  viewerCount: number;

  @Column({ nullable: true, type: 'timestamptz' })
  startedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
