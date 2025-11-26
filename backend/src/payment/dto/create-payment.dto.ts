import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
export class CreatePaymentDto {
  @ApiProperty()
  patientId: number;

  @ApiProperty()
  data: string;

  @ApiProperty()
  amount: number;

  // @ApiProperty()
  // payment_method: string;

  @ApiProperty()
  invoice_no: string;

  @ApiProperty()
  payedId: string;

  @ApiProperty()
  discount_amount: number;

  @ApiProperty()
  total_amount: number;

  @ApiProperty()
  discount_type: number;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  amount_paid: string;

  @ApiProperty()
  change: string;

  @ApiProperty()
  reference_number: string;

  @ApiProperty()
  paymentMethod: string;
}
