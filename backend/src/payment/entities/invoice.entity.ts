import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Invoice {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;

  @Column({type:'int', nullable: true })
  patientId: number;

  @Column( {type:'varchar', nullable: true }) 
  payedId: string;

  @Column( {type:'float', nullable: true }) 
  amount: number;

  // @Column({type:'varchar', nullable: true })
  // payment_method: string;

  @Column({type:'varchar', default: null })
  invoice_no: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
   })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
   })
  updated_at: Date;

  @Column( { type:'float',nullable: true }) 
  discount_amount: number; 

  @Column( { type:'float',nullable: true }) 
  total_amount: number; 

  @Column({type:'int',nullable:true})
  discount_type:number;
  
}