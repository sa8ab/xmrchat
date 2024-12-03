import { Page } from '../pages/page.entity';
import { LinkPlatformEnum } from '../shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'links' })
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;

  @Column()
  platform: string;

  @Column()
  value: string;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @RelationId((l: Link) => l.page)
  page_id: number;
}
