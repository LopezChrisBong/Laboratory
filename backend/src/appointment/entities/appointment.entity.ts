import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Appointment {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;
  @Column({ default: null })
  patientId: number;
  @Column({ default: null })
  userId: number;
  @Column({ type: "date", default: "2022-01-01" })
  date: Date;
  @Column({ type: 'time', default: null })
  time: string;  // Will be stored as HH:MM:SS
  @Column({ default: null })
  status: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  created_at: Date;
  @CreateDateColumn({ name: 'updated_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  updated_at: Date;
  
}