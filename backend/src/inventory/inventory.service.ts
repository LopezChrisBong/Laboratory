import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryTransactionService } from '../inventory-transaction/inventory-transaction.service';

@Injectable()
export class InventoryService {
constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private inventoryTransactionService: InventoryTransactionService,
  ) {}

  /**
   * Calculate quantity status based on stock levels
   * Uses quantity_needed as the base for percentage calculation
   */
  private calculateQuantityStatus(
    totalEndQuantity: number,
    quantityNeeded: number,
  ): string {
    if (totalEndQuantity === 0) {
      return 'Consumed';
    }

    // Use quantity_needed as the base for percentage calculation
    if (quantityNeeded > 0) {
      const percentageAvailable = (totalEndQuantity / quantityNeeded) * 100;

      if (percentageAvailable <= 25) {
        return 'Inadequate';
      }

      if (percentageAvailable <= 50) {
        return 'Lacking';
      }
    }

    return 'Sufficient';
  }

  /**
   * Calculate expiry status based on expiry date
   */
  private calculateExpiryStatus(expiryDate: Date): string {
    if (!expiryDate) {
      return 'N/A';
    }

    const now = new Date();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

    if (new Date(expiryDate) <= now) {
      return 'Expired';
    }

    if (new Date(expiryDate) <= twoMonthsFromNow) {
      return 'Nearly Expiry';
    }

    return 'Valid';
  }

  /**
   * Calculate combined status for backward compatibility
   */
  private calculateStatus(
    totalEndQuantity: number,
    quantityNeeded: number,
    expiryDate: Date,
  ): string {
    const expiryStatus = this.calculateExpiryStatus(expiryDate);
    const quantityStatus = this.calculateQuantityStatus(totalEndQuantity, quantityNeeded);

    // Priority: Expired > Nearly Expiry > Quantity Status
    if (expiryStatus === 'Expired') {
      return 'Expired';
    }

    if (expiryStatus === 'Nearly Expiry') {
      return 'Nearly Expiry';
    }

    return quantityStatus;
  }

  async create(createInventoryDto: CreateInventoryDto) {
    // Initialize quantities to 0 if null or undefined for calculations
    createInventoryDto.starting_quantity = createInventoryDto.starting_quantity || 0;
    createInventoryDto.used_quantity = createInventoryDto.used_quantity || 0;
    createInventoryDto.added_quantity = createInventoryDto.added_quantity || 0;

    // Validate: quantities cannot be negative
    if (createInventoryDto.starting_quantity < 0) {
      throw new Error('Starting quantity cannot be negative.');
    }
    if (createInventoryDto.used_quantity < 0) {
      throw new Error('Used quantity cannot be negative.');
    }
    if (createInventoryDto.added_quantity < 0) {
      throw new Error('Added quantity cannot be negative.');
    }

    let totalEndQuantity = 0;

    if (createInventoryDto.transactionType === 'Resupply') {
      // For resupply: starting_quantity + added_quantity = total_end_quantity
      totalEndQuantity = createInventoryDto.starting_quantity + createInventoryDto.added_quantity;
      // Don't reset used_quantity, it persists from previous consumption
    } else if (createInventoryDto.transactionType === 'Consumed') {
      // For consumed: starting_quantity - used_quantity = total_end_quantity
      totalEndQuantity = createInventoryDto.starting_quantity - createInventoryDto.used_quantity;
      createInventoryDto.added_quantity = 0; // No resupply in consumed transaction
      
      // Validate: used_quantity cannot exceed starting_quantity
      if (createInventoryDto.used_quantity > createInventoryDto.starting_quantity) {
        throw new Error(`Used quantity (${createInventoryDto.used_quantity}) cannot exceed available stock (${createInventoryDto.starting_quantity}).`);
      }
    } else {
      // Default calculation
      totalEndQuantity = createInventoryDto.starting_quantity - createInventoryDto.used_quantity + createInventoryDto.added_quantity;
    }

    if (totalEndQuantity < 0) {
        throw new Error('Used quantity exceeds available stock.');
    }

    createInventoryDto.totalend_quantity = totalEndQuantity;

    // Automatically calculate statuses
    const quantityNeeded = createInventoryDto.quantity_needed || createInventoryDto.starting_quantity || 0;
    createInventoryDto.quantity_status = this.calculateQuantityStatus(
      totalEndQuantity,
      quantityNeeded,
    );
    createInventoryDto.expiry_status = this.calculateExpiryStatus(
      createInventoryDto.expiry,
    );
    createInventoryDto.reorder_status = this.calculateStatus(
      totalEndQuantity,
      quantityNeeded,
      createInventoryDto.expiry,
    );

    const savedInventory = await this.inventoryRepository.save(createInventoryDto);

    // Log transaction if it's a Resupply or Consumed type
    if (createInventoryDto.transactionType === 'Resupply' || createInventoryDto.transactionType === 'Consumed') {
      await this.inventoryTransactionService.create({
        inventoryItemId: savedInventory.id,
        itemName: savedInventory.itemName,
        transactionType: createInventoryDto.transactionType,
        quantity: createInventoryDto.transactionType === 'Resupply' 
          ? createInventoryDto.added_quantity 
          : createInventoryDto.used_quantity,
        previousStock: createInventoryDto.starting_quantity,
        newStock: totalEndQuantity,
        supplier: createInventoryDto.supplier,
        lotNumber: createInventoryDto.lotNumber,
        brand: createInventoryDto.brand,
        notes: `Initial ${createInventoryDto.transactionType} transaction`,
        performedBy: 'System', // You can pass user info from request if needed
        transaction_date: new Date(),
      });
    }

    return savedInventory;
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

    // Get current values
    const currentStartingQty = existingInventory.starting_quantity || 0;
    const currentUsedQty = existingInventory.used_quantity || 0;
    const currentAddedQty = existingInventory.added_quantity || 0;
    const currentTotalEndQty = existingInventory.totalend_quantity || 0;

    // Use updated values if provided, otherwise keep existing
    let newStartingQuantity = updateInventoryDto.starting_quantity ?? currentStartingQty;
    let newUsedQuantity = updateInventoryDto.used_quantity ?? currentUsedQty;
    let newAddedQuantity = updateInventoryDto.added_quantity ?? currentAddedQty;
    let totalEndQuantity = 0;
    let transactionQuantity = 0;
    let transactionType = null;

    // Check if added_quantity changed (Resupply transaction)
    if (updateInventoryDto.added_quantity !== undefined && updateInventoryDto.added_quantity !== currentAddedQty) {
      transactionQuantity = updateInventoryDto.added_quantity - currentAddedQty;
      
      // Validate: added_quantity cannot be negative
      if (updateInventoryDto.added_quantity < 0) {
        throw new Error('Added quantity cannot be negative.');
      }
      
      // Add to starting quantity
      newStartingQuantity = currentStartingQty + transactionQuantity;
      // Reset added_quantity to 0 after applying
      newAddedQuantity = 0;
      transactionType = 'Resupply';
    }
    
    // Check if used_quantity changed (Consumed transaction)
    if (updateInventoryDto.used_quantity !== undefined && updateInventoryDto.used_quantity !== currentUsedQty) {
      transactionQuantity = updateInventoryDto.used_quantity - currentUsedQty;
      
      // Validate: used_quantity cannot be negative
      if (updateInventoryDto.used_quantity < 0) {
        throw new Error('Used quantity cannot be negative.');
      }
      
      // Validate: used_quantity cannot exceed current total end quantity
      if (updateInventoryDto.used_quantity > currentTotalEndQty) {
        throw new Error(`Used quantity (${updateInventoryDto.used_quantity}) cannot exceed available stock (${currentTotalEndQty}).`);
      }
      
      // Subtract from starting quantity
      newStartingQuantity = currentStartingQty - transactionQuantity;
      // Reset used_quantity to 0 after applying
      newUsedQuantity = 0;
      transactionType = 'Consumed';
    }

    // Calculate total end quantity
    // Formula: starting_quantity - used_quantity + added_quantity = total_end_quantity
    totalEndQuantity = newStartingQuantity - newUsedQuantity + newAddedQuantity;

    if (totalEndQuantity < 0) {
        throw new Error('Used quantity exceeds available stock.');
    }

    updateInventoryDto.starting_quantity = newStartingQuantity;
    updateInventoryDto.used_quantity = newUsedQuantity;
    updateInventoryDto.added_quantity = newAddedQuantity;
    updateInventoryDto.totalend_quantity = totalEndQuantity;

    // Use quantity_needed for status calculation, fallback to starting_quantity if not set
    const quantityNeeded = updateInventoryDto.quantity_needed ?? existingInventory.quantity_needed ?? newStartingQuantity;

    // Automatically calculate statuses
    updateInventoryDto.quantity_status = this.calculateQuantityStatus(
      totalEndQuantity,
      quantityNeeded,
    );
    updateInventoryDto.expiry_status = this.calculateExpiryStatus(
      updateInventoryDto.expiry ?? existingInventory.expiry,
    );
    updateInventoryDto.reorder_status = this.calculateStatus(
      totalEndQuantity,
      quantityNeeded,
      updateInventoryDto.expiry ?? existingInventory.expiry,
    );

    const result = await this.inventoryRepository.update(id, updateInventoryDto);

    // Log transaction if there was a quantity change
    if (transactionType && transactionQuantity !== 0) {
      await this.inventoryTransactionService.create({
        inventoryItemId: id,
        itemName: updateInventoryDto.itemName ?? existingInventory.itemName,
        transactionType: transactionType,
        quantity: Math.abs(transactionQuantity),
        previousStock: currentTotalEndQty,
        newStock: totalEndQuantity,
        supplier: updateInventoryDto.supplier ?? existingInventory.supplier,
        lotNumber: updateInventoryDto.lotNumber ?? existingInventory.lotNumber,
        brand: updateInventoryDto.brand ?? existingInventory.brand,
        notes: `${transactionType} transaction - ${Math.abs(transactionQuantity)} units`,
        performedBy: 'System', // You can pass user info from request if needed
        transaction_date: new Date(),
      });
    }

    return result;
  }

  remove(id: number) {
    return this.inventoryRepository.delete(id);
  }

  
  async findByName(name: string) {
    return await this.inventoryRepository.findOne({where: {itemName: name}});    
  }
}
