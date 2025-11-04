import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Post('invoice')
  invoice(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.invoice(createPaymentDto);
  }

  

  @Get('/findAllPendingPayment')
  findAllPendingPayment() {
    return this.paymentService.findAllPendingPayment();
  }

    @Get('/fullyPaid')
  fullyPaid() {
    return this.paymentService.fullyPaid();
  }

    @Get('/findOnePatientPayment/:id')
  findOnePatientPayment(@Param('id') id: string) {
    return this.paymentService.findOnePatientPayment(+id);
  }
 
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
