import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Payment {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;
  @Column({ default: null })
  patientId: number;
  @Column({ default: null })
  labtestTypeId: number;
  @Column('double precision', { nullable: true }) // or use 'float' if using MySQL
  amount: number;
  @CreateDateColumn({ name: 'date_conducted', type: 'timestamp' })
  date_paid: Date;
  @Column({ default: null })
  payment_method: string;
  @Column({ default: null })
  invoice_no: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  created_at: Date;
  @CreateDateColumn({ name: 'updated_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  updated_at: Date;
  @Column('double precision', { nullable: true }) // or use 'float' if using MySQL
  discount_amount: number; 
  @Column('double precision', { nullable: true }) // or use 'float' if using MySQL
  final_amount: number;
  @Column({default:null})
  discount_type:string;
}