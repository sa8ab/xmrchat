import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Page } from 'src/pages/page.entity';
import { IntegrationConfigType } from 'src/shared/constants';

@Entity('integration_configs')
@Unique('unique-page-and-type', ['page.id', 'type'])
export class IntegrationConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: IntegrationConfigType })
  type: IntegrationConfigType;

  @Column({ type: 'jsonb', nullable: true })
  config: any;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
