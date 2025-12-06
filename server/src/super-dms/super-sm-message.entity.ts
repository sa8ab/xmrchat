import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuperDm } from './super-dm.entity';

@Entity({ name: 'super_dm_messages' })
export class SuperDmMessage {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => SuperDm, (s: SuperDm) => s.messages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  superDm: SuperDm;

  @Column()
  content: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
