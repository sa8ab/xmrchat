import { User } from '../../users/user.entity';
import { UserTokenType } from '../../shared/constants/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity({ name: 'user-tokens' })
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column('enum', {
    enum: UserTokenType,
  })
  type: UserTokenType;

  @Column('timestamptz')
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'user-tokens_user_id_fkey' })
  user: User;

  @RelationId((ut: UserToken) => ut.user)
  userId: number;
}
