import { Link } from 'src/links/link.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'link_verifications' })
export class LinkVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Link, { onDelete: 'CASCADE' })
  @JoinColumn()
  link: Link;

  @Column({ nullable: true })
  url?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
