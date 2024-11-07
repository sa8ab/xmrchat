import { User } from '../users/user.entity';
import { File as FileEntity } from '../files/file.entity';
import { Payment } from '../payments/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { Tier } from './tier.entity';

@Entity({ name: 'pages' })
@Unique(['path'])
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  primaryAddress: string;

  @Column()
  secretViewKey: string;

  @Column({ nullable: true })
  twitchChannel: string;

  @Column('boolean', { default: true })
  isPublic: boolean;

  @OneToOne(() => FileEntity, { eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'pages_cover_image_id_fkey' })
  coverImage: FileEntity;

  @OneToOne(() => FileEntity, { eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'pages_logo_id_fkey' })
  logo: FileEntity;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'pages_user_id_fkey' })
  user: User;

  @RelationId((p: Page) => p.user)
  userId: number;

  @OneToOne(() => Payment, (p: Payment) => p.page, { eager: true })
  payment: Payment;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  createdAt: Date;

  @OneToMany(() => Tier, (t: Tier) => t.page, {
    cascade: true,
  })
  tiers: Tier[];
}