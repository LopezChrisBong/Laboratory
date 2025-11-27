import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import {
  SendSmsDto,
  SendMmsDto,
  SendVoiceDto,
  BulkSmsDto,
} from './interfaces/sms-options.interface';
import { SmsService } from './sms.service';
import { SendSMSDTO } from './dto/send-sms.dto';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  async sendSms(@Body() dto: SendSMSDTO) {
    return this.smsService.sendSms(dto);
  }

  // @Post('send-mms')
  // async sendMms(@Body() dto: SendMmsDto) {
  //   return this.smsService.sendMms(dto);
  // }

  // @Post('send-voice')
  // async sendVoice(@Body() dto: SendVoiceDto) {
  //   return this.smsService.sendVoice(dto);
  // }

  // @Post('send-bulk')
  // async sendBulkSms(@Body() dto: BulkSmsDto) {
  //   return this.smsService.sendBulkSms(dto);
  // }

  // @Post('send-otp')
  // async sendOtp(
  //   @Body() dto: { phoneNumber: string; code: string; senderId?: string },
  // ) {
  //   return this.smsService.sendOtp(dto.phoneNumber, dto.code, dto.senderId);
  // }

  @Get()
  adad() {
    console.log('sdasdasdasd');
  }

  @Get('status/:messageId')
  async getMessageStatus(@Param('messageId') messageId: string) {
    // console.log('amdamsd', messageId);
    return this.smsService.getMessageStatus(messageId);
  }

  @Get('balance')
  async getBalance() {
    return this.smsService.getBalance();
  }
}
