import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Inventory } from 'src/inventory/entities/inventory.entity';

@Entity()
export class InventoryTransaction {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  inventoryItemId: number;

  @Column({ default: null })
  itemName: string;

  @Column({ default: null })
  transactionType: string; // 'Resupply' or 'Consumed'

  @Column({ default: 0 })
  quantity: number; // Positive for resupply, positive for consumed (we store absolute values)

  @Column({ default: 0 })
  previousStock: number; // Stock before this transaction

  @Column({ default: 0 })
  newStock: number; // Stock after this transaction

  @Column({ default: null })
  supplier: string;

  @Column({ default: null, nullable: true })
  lotNumber: string;

  @Column({ default: null, nullable: true })
  brand: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: null })
  performedBy: string; // User who performed the transaction

  @CreateDateColumn({ 
    name: 'transaction_date', 
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  transaction_date: Date;

  @CreateDateColumn({ 
    name: 'created_at', 
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}

