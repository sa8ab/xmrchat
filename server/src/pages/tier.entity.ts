import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Page } from './page.entity';

@Entity({ name: 'tiers' })
export class Tier {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Page, (p: Page) => p.tiers, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ foreignKeyConstraintName: 'tiers_page_id_fkey' })
  page: Page;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  amount: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
