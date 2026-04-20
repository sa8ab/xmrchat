import { Page } from 'src/pages/page.entity';
import { OfferingTypeEnum } from 'src/shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'offerings' })
export class Offering {
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

  @Column({ default: OfferingTypeEnum.TELEGRAM })
  type: OfferingTypeEnum;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @RelationId((o: Offering) => o.page)
  pageId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
