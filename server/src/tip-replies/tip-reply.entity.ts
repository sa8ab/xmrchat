import { Tip } from 'src/tips/tip.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tip_replies' })
export class TipReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  message: string;

  @ManyToOne(() => Tip, (t: Tip) => t.tipReplies, { onDelete: 'CASCADE' })
  tip: Tip;

  @RelationId((t: TipReply) => t.tip)
  tipId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
