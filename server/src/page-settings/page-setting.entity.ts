import {
  PageSettingCategory,
  PageSettingKey,
  PageSettingValueType,
} from '../shared/constants/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Page } from '../pages/page.entity';

@Entity({ name: 'page-settings' })
export class PageSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;

  @Column({ type: 'enum', enum: PageSettingCategory })
  category: PageSettingCategory;

  @Column({ type: 'enum', enum: PageSettingKey })
  key: PageSettingKey;

  @Column({ type: 'enum', enum: PageSettingValueType })
  type: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @ManyToOne(() => Page, (p: Page) => p.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'page-settings_page_id_fkey' })
  page: Page;

  @RelationId((s: PageSetting) => s.page)
  pageId: number;
}
