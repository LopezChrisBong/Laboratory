import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryTransactionService } from './inventory-transaction.service';
import { InventoryTransactionController } from './inventory-transaction.controller';
import { InventoryTransaction } from './entities/inventory-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryTransaction])],
  controllers: [InventoryTransactionController],
  providers: [InventoryTransactionService],
  exports: [InventoryTransactionService],
})
export class InventoryTransactionModule {}

