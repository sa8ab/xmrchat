import { Payment } from '../payments/payment.entity';
import { Page } from '../pages/page.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';

@Entity({ name: 'tips' })
export class Tip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  message: string;

  @Column({ type: 'boolean' })
  private: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'tips_page_id_fkey' })
  page: Page;

  @RelationId((t: Tip) => t.page)
  pageId: number;

  @OneToOne(() => Payment, (p: Payment) => p.tip)
  payment: Payment;
}
