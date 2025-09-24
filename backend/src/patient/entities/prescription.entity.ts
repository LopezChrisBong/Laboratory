import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Prescription {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;

  @Column({type:'int', nullable:false })
  patientID: number;

  @Column({type:'int', nullable:false })
  doctorID: number;

  @Column({ type:'varchar', nullable:false })
  address: string;

  @Column({ type:'varchar', nullable:false })
  name: string;

   @Column({ type:'varchar',nullable:false})
  description: string;

  @Column({type:'varchar', nullable:false })
  age: string;

  @Column({type:'varchar', nullable:false })
  date: string;


  @CreateDateColumn({ name: 'created_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  created_at: Date;
  @CreateDateColumn({ name: 'updated_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  updated_at: Date;
}