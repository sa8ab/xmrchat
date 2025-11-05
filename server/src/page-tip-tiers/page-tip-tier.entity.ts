import { File } from 'src/files/file.entity';
import { Page } from 'src/pages/page.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'page_tip_tiers' })
export class PageTipTier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'bigint', nullable: true })
  minAmount?: string;

  @Column({ type: 'bigint', nullable: true })
  maxAmount?: string;

  @Column({ length: 7, nullable: true })
  color?: string;

  @ManyToOne(() => File, { onDelete: 'SET NULL', nullable: true })
  sound: File;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;
}
