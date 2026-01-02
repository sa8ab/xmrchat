import { Page } from 'src/pages/page.entity';
import { PageVerificationTypeEnum } from 'src/shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'page_verifications' })
@Unique(['page.id', 'type'])
export class PageVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @Column({})
  type: PageVerificationTypeEnum;

  @Column({ nullable: true })
  url?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
