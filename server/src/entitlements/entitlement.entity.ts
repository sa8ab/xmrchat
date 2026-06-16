import { Page } from 'src/pages/page.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { PaidContentTypeEnum } from 'src/shared/constants';
import { Payment } from 'src/payments/payment.entity';

@Entity({ name: 'entitlements' })
export class Entitlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'integer', nullable: true })
  duration?: number;

  @Column({ type: 'bigint' })
  amount: string;

  @Column({ default: PaidContentTypeEnum.TELEGRAM })
  type: PaidContentTypeEnum;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, any>;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @RelationId((e: Entitlement) => e.page)
  pageId: number;

  @OneToOne(() => Payment, (p: Payment) => p.entitlement)
  payment: Payment;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
