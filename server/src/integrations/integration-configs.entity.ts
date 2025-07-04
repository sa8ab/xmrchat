import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Page } from 'src/pages/page.entity';

export enum IntegrationConfigType {
  SINGAL = 'singal',
  TELEGRAM = 'telegram',
}

@Entity('integration_configs')
@Unique('unique-page-and-type', ['page.id', 'type'])
export class IntegrationConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: IntegrationConfigType })
  type: IntegrationConfigType;

  @Column({ type: 'jsonb' })
  config: any;

  @ManyToOne(() => Page)
  page: Page;
}
