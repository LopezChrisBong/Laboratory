import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sms {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 15 })
  recipient: string;

  @Column({ type: 'tinyint', nullable: false })
  is_sent: boolean;
}
