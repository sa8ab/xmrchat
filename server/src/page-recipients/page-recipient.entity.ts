import { Page } from 'src/pages/page.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { PageRecipientVariant } from '../shared/constants/enum';

@Entity({ name: 'page_recipients' })
@Unique(['page', 'address'])
export class PageRecipient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    nullable: true,
    type: 'integer',
    default: 0,
    // transformer: {
    //   to: (data: number) => data,
    //   from: (data: string) => parseFloat(data),
    // },
  })
  percentage: number;

  @ManyToOne(() => Page, (page) => page.recipients, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  page: Page;

  @Column({ default: PageRecipientVariant.RECIPIENT })
  variant: PageRecipientVariant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
