
import { ApiProperty } from "@nestjs/swagger";
export class CreateInventoryDto {
                  // hahahahhaha
        @ApiProperty()
        itemName: string;
        @ApiProperty()
        brand: string;
        @ApiProperty()
        unit: string;
        @ApiProperty()
        usageType: string;
        @ApiProperty()
        lotNumber: string;
        @ApiProperty()
        expiry: Date; 
        @ApiProperty()
        starting_quantity: number;
        @ApiProperty()
        used_quantity: number;
        @ApiProperty()
        added_quantity: number;
        @ApiProperty()
        supply_date: Date;
        @ApiProperty()
        totalend_quantity: number;
        @ApiProperty()
        reorder_status: string;
        @ApiProperty()
        supplier: string;
        @ApiProperty()
        created_at: Date;
        @ApiProperty()
        updated_at: Date;
}

