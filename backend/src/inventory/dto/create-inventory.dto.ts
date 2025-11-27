
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsDateString, IsString } from 'class-validator';

export class CreateInventoryDto {
        @ApiProperty()
        @IsString()
        itemName: string;
        @ApiProperty()
        @IsString()
        brand: string;
        @ApiProperty()
        @IsString()
        unit: string;
        @ApiProperty()
        @IsString()
        usageType: string;
        @ApiProperty({ required: false, type: String, format: 'date' })
        @IsOptional()
        @IsDateString()
        expiry: Date; 
        @ApiProperty()
        @IsString()
        lotNumber: string;
        @ApiProperty({ required: false })
        @IsOptional()
        @IsNumber()
        starting_quantity: number;
        @ApiProperty({ required: false })
        @IsOptional()
        @IsNumber()
        used_quantity: number;
        @ApiProperty({ required: false })
        @IsOptional()
        @IsNumber()
        added_quantity: number;
        @ApiProperty({ required: false })
        @IsOptional()
        @IsNumber()
        quantity_needed: number;
        @ApiProperty({ required: false, type: String, format: 'date' })
        @IsOptional()
        @IsDateString()
        supply_date: Date;
        @ApiProperty({ required: false })
        @IsOptional()
        @IsNumber()
        totalend_quantity: number;
        @ApiProperty()
        @IsString()
        reorder_status: string;
        @ApiProperty({ required: false })
        @IsOptional()
        @IsString()
        quantity_status: string;
        @ApiProperty({ required: false })
        @IsOptional()
        @IsString()
        expiry_status: string;
        @ApiProperty()
        @IsString()
        supplier: string;
        @ApiProperty({ required: false })
        @IsOptional()
        @IsString()
        transactionType: string;
        @ApiProperty({ required: false, type: String, format: 'date-time' })
        @IsOptional()
        @IsDateString()
        created_at: Date;
        @ApiProperty({ required: false, type: String, format: 'date-time' })
        @IsOptional()
        @IsDateString()
        updated_at: Date;
}

