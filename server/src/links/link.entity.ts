import { Page } from '../pages/page.entity';
import { LinkPlatformEnum } from '../shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'links' })
@Unique('unique-page-and-platform', ['page.id', 'platform'])
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;

  @Column()
  platform: string;

  @Column({ nullable: true })
  value: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: any;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @RelationId((l: Link) => l.page)
  page_id: number;
}
