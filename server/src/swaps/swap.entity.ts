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
import { SuperDm } from 'src/super-dms/super-dm.entity';

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

  @OneToOne(() => SuperDm, (s) => s.swap, { onDelete: 'CASCADE' })
  @JoinColumn()
  superDm: SuperDm;

  @RelationId((s: Swap) => s.superDm)
  superDmId: string;

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
