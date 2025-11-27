import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString, IsString } from 'class-validator';

export class CreateInventoryTransactionDto {
  @ApiProperty()
  @IsNumber()
  inventoryItemId: number;

  @ApiProperty()
  @IsString()
  itemName: string;

  @ApiProperty()
  @IsString()
  transactionType: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  previousStock: number;

  @ApiProperty()
  @IsNumber()
  newStock: number;

  @ApiProperty()
  @IsString()
  supplier: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lotNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brand: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  performedBy: string;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  transaction_date: Date;
}

