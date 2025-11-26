import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Inventory {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;
  @Column({ default: null })
  itemName: string;
  @Column({ default: null })
  brand: string;
  @Column({default: null}) 
  unit: string;
  @Column({ default: null}) 
  usageType: string;
  @Column({ name: 'expiry', type: 'timestamp', nullable: true })
  expiry: Date;
  @Column({ default: null })
  lotNumber: string;
  @Column({default: null, nullable: true}) 
  starting_quantity: number;
  @Column({default: null, nullable: true}) 
  used_quantity: number;
  @Column({default: null, nullable: true}) 
  added_quantity: number;
  @Column({default: null, nullable: true}) 
  quantity_needed: number;
  @CreateDateColumn({ name: 'date_supplied', type: 'timestamp', nullable: true })
  supply_date: Date;
  @Column({ default: null, nullable: true }) 
  totalend_quantity: number;
  @Column({ default: null })
  reorder_status: string;
  @Column({ default: null, nullable: true })
  quantity_status: string;
  @Column({ default: null, nullable: true })
  expiry_status: string;
  @Column({ default: null })
  supplier: string;
  @Column({ default: null, nullable: true })
  transactionType: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  created_at: Date;
  @CreateDateColumn({ name: 'updated_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  updated_at: Date;

}
