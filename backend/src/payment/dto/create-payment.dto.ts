
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
export class CreatePaymentDto {
                  // hahahahhaha
        @ApiProperty()
        patientId: number;
        @ApiProperty()
        labtestTypeId: number;
        @Type(() => Number)
        @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Amount must be a valid number' })
        amount: number;
        @ApiProperty()
        date_paid: Date;
        @ApiProperty()
        payment_method: string;
        @ApiProperty()
        invoice_no: string;
        @ApiProperty()
        created_at: Date;
        @ApiProperty()
        updated_at: Date;
        @ApiProperty({ type: Number, description: 'Discount amount as a double' })
        @Type(() => Number)
        @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Discount amount must be a valid number' })
        discount_amount: number;
        @ApiProperty({ type: Number, description: 'Discount amount as a double' })
        @Type(() => Number)
        @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Final amount must be a valid number' })
        final_amount: number;
        @ApiProperty()
        discount_type:string;
}

