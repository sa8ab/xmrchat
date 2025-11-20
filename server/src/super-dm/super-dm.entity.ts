import { Page } from 'src/pages/page.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { SuperDmMessage } from './super-sm-message.entity';

@Entity({ name: 'super_dms' })
export class SuperDm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @RelationId((s: SuperDm) => s.page)
  pageId: number;

  @Column({ nullable: false })
  publicKey: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => SuperDmMessage, (m: SuperDmMessage) => m.superDm)
  messages: SuperDmMessage[];
}
