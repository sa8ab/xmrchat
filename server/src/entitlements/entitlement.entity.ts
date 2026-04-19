import { Offering } from "src/offerings/offering.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'entitlements' })
export class Entitlement {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Offering, { onDelete: 'SET NULL', nullable: true })
  offering?: Offering

  @Column()
  name: string

  @Column({ type: 'integer', nullable: true })
  duration?: number

  @Column({ type: 'bigint' })
  amount: number

  @Column()
  description: string

  @Column({ type: 'timestamptz' })
  createdAt: Date
}