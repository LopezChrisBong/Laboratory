import { Injectable, Logger } from '@nestjs/common';
import { PhilSmsProvider } from './provider/philsms.provider';
import {
  SendSmsDto,
  SendMmsDto,
  SendVoiceDto,
  SmsResponse,
  BulkSmsDto,
} from './interfaces/sms-options.interface';
import { SendSMSDTO } from './dto/send-sms.dto';
import { DataSource } from 'typeorm';
import { Sms } from 'src/entities';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(
    private philSmsProvider: PhilSmsProvider,
    private dataSource: DataSource,
  ) {}

  async sendSms(dto: SendSMSDTO): Promise<SmsResponse> {
    try {
      let res = await this.philSmsProvider.sendSms(dto);

      if (res.success) {
        let sms = this.dataSource.manager.create(Sms, {
          message: res.data.data.message,
          recipient: res.data.data.to,
          is_sent: true,
        });
        await this.dataSource.manager.save(sms);
      } else {
        let sms = this.dataSource.manager.create(Sms, {
          message: dto.message,
          recipient: dto.recipient,
          is_sent: false,
        });
        await this.dataSource.manager.save(sms);
      }
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async sendMms(dto: SendMmsDto): Promise<SmsResponse> {
    return this.philSmsProvider.sendMms(dto);
  }

  async sendVoice(dto: SendVoiceDto): Promise<SmsResponse> {
    return this.philSmsProvider.sendVoice(dto);
  }

  // async sendBulkSms(dto: BulkSmsDto): Promise<SmsResponse[]> {
  //   this.logger.log(`Sending bulk SMS to ${dto.recipients.length} recipients`);

  //   const promises = dto.recipients.map((recipient) =>
  //     this.sendSms({
  //       recipient,
  //       message: dto.message,
  //       senderId: dto.senderId,
  //       type: dto.type,
  //     }),
  //   );

  //   const results = await Promise.allSettled(promises);

  //   return results.map((result, index) => {
  //     if (result.status === 'fulfilled') {
  //       return result.value;
  //     } else {
  //       this.logger.error(
  //         `Failed to send SMS to ${dto.recipients[index]}: ${result.reason}`,
  //       );
  //       return {
  //         success: false,
  //         error: result.reason.message,
  //       };
  //     }
  //   });
  // }

  async getMessageStatus(messageId: string): Promise<SmsResponse> {
    return this.philSmsProvider.getMessageStatus(messageId);
  }

  async getBalance(): Promise<{
    success: boolean;
    balance?: number;
    currency?: string;
    error?: string;
  }> {
    return this.philSmsProvider.getBalance();
  }

  // async sendOtp(
  //   phoneNumber: string,
  //   code: string,
  //   senderId?: string,
  // ): Promise<SmsResponse> {
  //   const message = `Your verification code is: ${code}. Do not share this code with anyone.`;
  //   return this.sendSms({
  //     recipient: phoneNumber,
  //     message,
  //     senderId: senderId || 'OTP',
  //     type: 'plain',
  //   });
  // }
}
