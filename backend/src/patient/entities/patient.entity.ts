import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Patient {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;
  @Column({ default: null })
  p_name: string;
  @Column({ default: null })
  address: string;
  @Column({ default: null })
  contact_no: string;
  @Column({ default: null })
  dob: string;
  @Column({ default: null })
  civil_status: string;
  @Column({ default: null })
  occupation: string;
  @Column({ default: null })
  gender: string;
  @Column({ default: null })
  age: string;
  @Column({ default: null })
  region: string;
  @Column({ default: null })
  province: string;
  @Column({ default: null })
  city_muni: string;
  @Column({ default: null })
  baranggay: string;
  @Column({ default: null })
  purok: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  created_at: Date;
  @CreateDateColumn({ name: 'updated_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  updated_at: Date;
}