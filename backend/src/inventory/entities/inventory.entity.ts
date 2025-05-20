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
  @CreateDateColumn({ name: 'expiry', type: 'timestamp' })
  expiry: Date;
  @Column({ default: null })
  lotNumber: string;
  @Column({default: null}) 
  starting_quantity: number;
  @Column({default: null}) 
  used_quantity: number;
  @Column({default: null}) 
  added_quantity: number;
  @CreateDateColumn({ name: 'date_supplied', type: 'timestamp' })
  supply_date: Date;
  @Column({ default: null })
  totalend_quantity: number;
  @Column({ default: null })
  reorder_status: string;
  @Column({ default: null })
  supplier: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  created_at: Date;
  @CreateDateColumn({ name: 'updated_at', type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',

   })
  updated_at: Date;

}
