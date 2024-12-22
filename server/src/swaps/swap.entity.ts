import { Tip } from '../tips/tip.entity';
import { Coin } from '../integrations/trocador/coin.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
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

  @Column({ type: 'varchar', length: 32 })
  inputAmount: string;

  @Column()
  swapAddress: string;

  @Column()
  status: string;

  @OneToOne(() => Coin, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'swap_coin_id_fkey' })
  coin: Coin;

  @OneToOne(() => Tip, (t: Tip) => t.swap, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'swap_tip_id_fkey' })
  tip: Tip;

  @Column({ type: 'jsonb' })
  context: Object;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
