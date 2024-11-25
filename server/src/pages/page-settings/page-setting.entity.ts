import {
  PageSettingCategory,
  PageSettingKey,
  PageSettingValueType,
} from '../../shared/constants/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}
