import { Page } from 'src/pages/page.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { SuperDmMessage } from './super-sm-message.entity';
import { Payment } from 'src/payments/payment.entity';
import { Swap } from 'src/swaps/swap.entity';

@Entity({ name: 'super_dms' })
export class SuperDm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @RelationId((s: SuperDm) => s.page)
  pageId: number;

  @Column({ nullable: false })
  publicKey: string;

  @OneToOne(() => Swap, (s) => s.superDm)
  swap: Swap;

  @OneToOne(() => Payment, (p) => p.superDm)
  payment: Payment;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => SuperDmMessage, (m: SuperDmMessage) => m.superDm)
  messages: SuperDmMessage[];
}
