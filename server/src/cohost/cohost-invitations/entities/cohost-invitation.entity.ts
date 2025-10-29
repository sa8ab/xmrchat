import { Page } from 'src/pages/page.entity';
import { CohostInvitationStatus } from 'src/shared/constants';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cohost_invitations' })
export class CohostInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @RelationId((ci: CohostInvitation) => ci.user)
  userId: number;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  page: Page;

  @RelationId((ci: CohostInvitation) => ci.page)
  pageId: number;

  @Column()
  code: string;

  @Column({ default: CohostInvitationStatus.PENDING })
  status: CohostInvitationStatus;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
