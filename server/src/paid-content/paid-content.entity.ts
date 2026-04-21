import { Page } from 'src/pages/page.entity';
import { PaidContentTypeEnum } from 'src/shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'paid_content' })
export class PaidContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'integer', nullable: true })
  duration?: number;

  @Column({ type: 'bigint' })
  amount: string;

  @Column({ default: PaidContentTypeEnum.TELEGRAM })
  type: PaidContentTypeEnum;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @RelationId((p: PaidContent) => p.page)
  pageId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
