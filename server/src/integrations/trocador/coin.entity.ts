import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'coins' })
@Unique('name-and-ticker', ['name', 'ticker'])
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ticker: string;

  @Column()
  network: string;

  @Column()
  image: string;

  @Column('bigint')
  minimum: number;

  @Column('bigint')
  maximum: number;
}
