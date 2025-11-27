import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoryTransactionService } from './inventory-transaction.service';
import { CreateInventoryTransactionDto } from './dto/create-inventory-transaction.dto';
import { UpdateInventoryTransactionDto } from './dto/update-inventory-transaction.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';

@ApiTags('Inventory Transactions')
@Controller('inventory-transaction')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class InventoryTransactionController {
  constructor(
    private readonly inventoryTransactionService: InventoryTransactionService,
  ) {}

  @Post()
  create(@Body() createTransactionDto: CreateInventoryTransactionDto) {
    return this.inventoryTransactionService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.inventoryTransactionService.findAll();
  }

  @Get('item/:inventoryItemId')
  findByInventoryItem(@Param('inventoryItemId') inventoryItemId: string) {
    return this.inventoryTransactionService.findByInventoryItem(+inventoryItemId);
  }

  @Get('type/:type')
  findByTransactionType(@Param('type') type: string) {
    return this.inventoryTransactionService.findByTransactionType(type);
  }

  @Get('date-range')
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.inventoryTransactionService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryTransactionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateInventoryTransactionDto,
  ) {
    return this.inventoryTransactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryTransactionService.remove(+id);
  }
}

