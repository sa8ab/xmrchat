import { Tip } from '../tips/tip.entity';
import { Coin } from '../integrations/trocador/coin.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Swap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'trocador' })
  platform: string;

  @Column()
  swapId: string;

  @Column({ type: 'numeric' })
  inputAmount: number;

  @Column()
  swapAddress: string;

  @Column()
  status: string;

  @ManyToOne(() => Coin, { eager: true, onDelete: 'CASCADE' })
  coin: Coin;

  @OneToOne(() => Tip, (t: Tip) => t.swap, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'swap_tip_id_fkey' })
  tip: Tip;

  @RelationId((s: Swap) => s.tip)
  tipId: number;

  @Column({ type: 'jsonb' })
  context: Object;

  @Column({ type: 'numeric', nullable: true })
  eta: number;

  @Column({ nullable: true })
  statusMessage: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
