import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateInventoryTransactionDto } from './dto/create-inventory-transaction.dto';
import { UpdateInventoryTransactionDto } from './dto/update-inventory-transaction.dto';
import { InventoryTransaction } from './entities/inventory-transaction.entity';

@Injectable()
export class InventoryTransactionService {
  constructor(
    @InjectRepository(InventoryTransaction)
    private transactionRepository: Repository<InventoryTransaction>,
  ) {}

  async create(createTransactionDto: CreateInventoryTransactionDto) {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async findAll() {
    return await this.transactionRepository.find({
      order: {
        transaction_date: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return await this.transactionRepository.findOne({ where: { id } });
  }

  async findByInventoryItem(inventoryItemId: number) {
    return await this.transactionRepository.find({
      where: { inventoryItemId },
      order: {
        transaction_date: 'DESC',
      },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date) {
    return await this.transactionRepository.find({
      where: {
        transaction_date: Between(startDate, endDate),
      },
      order: {
        transaction_date: 'DESC',
      },
    });
  }

  async findByTransactionType(type: string) {
    return await this.transactionRepository.find({
      where: { transactionType: type },
      order: {
        transaction_date: 'DESC',
      },
    });
  }

  async update(id: number, updateTransactionDto: UpdateInventoryTransactionDto) {
    return await this.transactionRepository.update(id, updateTransactionDto);
  }

  async remove(id: number) {
    return await this.transactionRepository.delete(id);
  }
}

