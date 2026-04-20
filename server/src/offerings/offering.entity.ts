import { Page } from 'src/pages/page.entity';
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

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @RelationId((o: Offering) => o.page)
  pageId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
