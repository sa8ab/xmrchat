import { FileType } from '../shared/constants/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'files' })
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column('enum', {
    enum: FileType,
  })
  type: FileType;

  //? some files might be private, should be accesses using id, path would be null
  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  thumbnail: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
