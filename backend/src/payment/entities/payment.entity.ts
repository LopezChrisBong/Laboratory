import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Payment {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;

  @Column({type:'int', nullable: true })
  patientId: number;

  @Column({type:'longtext', nullable: true })
  data: string;

  @Column( {type:'float', nullable: true }) 
  amount: number;


  @Column({type:'boolean', default: false })
  status: Boolean;

  @Column({type:'int', nullable: true })
  doctorID: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
   })
  updated_at: Date;

}