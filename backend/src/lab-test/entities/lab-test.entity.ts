import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class LabTest {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;
  @Column({ default: null })
  patientId: number;
  @Column({ default: null })
  testTypeId: number;
  @Column({ default: "" })
  result: String;
  @CreateDateColumn({ name: 'date_conducted', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  date_conducted: Date;
  @Column({ default: null })
  conducted_by: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  created_at: Date;
  @CreateDateColumn({ name: 'updated_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  updated_at: Date;
  
}