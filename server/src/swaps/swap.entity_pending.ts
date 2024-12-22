import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Swap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { default: 'trocador' })
  platform: string;

  @Column('numeric')
  swapId: string;

  @Column({ type: 'varchar', length: 32 })
  inputAmount: string;

  @Column('varchar')
  swapAddress: string;

  @Column('varchar')
  status: string;

  // coin: Relation to coins

  // tip: Relation to tips

  @Column({ type: 'jsonb' })
  context: Object;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
