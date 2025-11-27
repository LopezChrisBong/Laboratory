import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryTransactionModule } from '../inventory-transaction/inventory-transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory]),
    InventoryTransactionModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
