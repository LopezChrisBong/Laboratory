import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryService {
constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
    // Initialize quantities to 0 if null or undefined for calculations
    createInventoryDto.starting_quantity = createInventoryDto.starting_quantity || 0;
    createInventoryDto.used_quantity = createInventoryDto.used_quantity || 0;
    createInventoryDto.added_quantity = createInventoryDto.added_quantity || 0;

    if (createInventoryDto.transactionType === 'Resupply') {
        createInventoryDto.used_quantity = 0; // Only added quantity is relevant for resupply
    } else if (createInventoryDto.transactionType === 'Consumed') {
        createInventoryDto.added_quantity = 0; // Only used quantity is relevant for consumed
    }

    if (createInventoryDto.added_quantity < 0) {
        throw new Error('Added quantity cannot be negative.');
    }

    const totalEndQuantity = createInventoryDto.starting_quantity - createInventoryDto.used_quantity + createInventoryDto.added_quantity;

    if (totalEndQuantity < 0) {
        throw new Error('Used quantity exceeds available stock.');
    }

    createInventoryDto.totalend_quantity = totalEndQuantity;
    return await this.inventoryRepository.save(createInventoryDto);
  }

  findAll() {
    return this.inventoryRepository.find();
  }

  findOne(id: number) {
    return this.inventoryRepository.findOne({where: {id: id}});
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const existingInventory = await this.inventoryRepository.findOne({where: {id: id}});
    if (!existingInventory) {
        throw new Error('Inventory item not found.');
    }

    // Initialize quantities to existing values if not provided in DTO
    const newStartingQuantity = updateInventoryDto.starting_quantity ?? existingInventory.starting_quantity ?? 0;
    let newUsedQuantity = updateInventoryDto.used_quantity ?? existingInventory.used_quantity ?? 0;
    let newAddedQuantity = updateInventoryDto.added_quantity ?? existingInventory.added_quantity ?? 0;

    // Adjust quantities based on transaction type if provided
    if (updateInventoryDto.transactionType === 'Resupply') {
        newUsedQuantity = 0; // Only added quantity is relevant for resupply
    } else if (updateInventoryDto.transactionType === 'Consumed') {
        newAddedQuantity = 0; // Only used quantity is relevant for consumed
    }

    if (newAddedQuantity < 0) {
        throw new Error('Added quantity cannot be negative.');
    }

    const totalEndQuantity = newStartingQuantity - newUsedQuantity + newAddedQuantity;

    if (totalEndQuantity < 0) {
        throw new Error('Used quantity exceeds available stock.');
    }

    updateInventoryDto.totalend_quantity = totalEndQuantity;

    return await this.inventoryRepository.update(id, updateInventoryDto);
  }

  remove(id: number) {
    return this.inventoryRepository.delete(id);
  }

  
  async findByName(name: string) {
    return await this.inventoryRepository.findOne({where: {itemName: name}});    
  }
}
