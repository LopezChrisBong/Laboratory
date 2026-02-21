import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
import * as Twilio from 'twilio';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private client;
  constructor(
    private philSmsProvider: PhilSmsProvider,
    private dataSource: DataSource,
  ) {
    this.client = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

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

  // async sendSmsTwilio(dto: SendSMSDTO) {
  //   console.log(dto);
  //   return await this.client.messages.create({
  //     body: dto.message,
  //     from: process.env.TWILIO_PHONE_NUMBER,
  //     to: dto.recipient,
  //   });
  // }
  async sendSmsTwilio(dto: SendSMSDTO) {
    try {
      console.log(dto);
      console.log('TWILIO SID:', process.env.TWILIO_ACCOUNT_SID);
      console.log('TWILIO TOKEN:', process.env.TWILIO_AUTH_TOKEN);
      console.log('TWILIO NUMBER:', process.env.TWILIO_PHONE_NUMBER);
      const response = await this.client.messages.create({
        body: dto.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: dto.recipient,
      });

      return {
        success: true,
        sid: response.sid,
        status: response.status,
      };
    } catch (error) {
      console.error('Twilio Error:', error);

      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to send SMS',
        error: error.message,
      });
    }
  }

  async sendSMS(dto: SendSMSDTO) {
    const apiKey = process.env.TXTBOX_API_KEY;
    console.log(dto);
    // try {
    //   const response = await axios.post('https://www.txtbox.com/api/sms', {
    //     api_key: apiKey,
    //     to: phone,
    //     message: message,
    //   });

    //   return response.data;
    // } catch (error) {
    //   console.error(error.response?.data || error.message);
    //   throw error;
    // }
  }

  private readonly apiKey = process.env.SEMAPHORE_API_KEY;
  private readonly baseUrl = process.env.SEMAPHORE_BASE_URL;

  async sendSmsSemaphore(dto: SendSMSDTO) {
    try {
      let mobile = dto.recipient.trim().replace(/[\s-]/g, '');

      if (mobile.startsWith('09')) {
        mobile = '639' + mobile.substring(2);
      } else if (mobile.startsWith('+639')) {
        mobile = mobile.substring(1);
      } else if (!mobile.startsWith('639')) {
        throw new Error('Invalid Philippine mobile number format');
      }

      dto.recipient = mobile;
      console.log(dto);
      const response = await axios.post(
        this.baseUrl,
        {
          apikey: this.apiKey,
          number: dto.recipient,
          message: dto.message,
          sendername: process.env.SEMAPHORE_SENDER_NAME,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const smsResponse = Array.isArray(response.data)
        ? response.data[0]
        : null;

      const sms = this.dataSource.manager.create(Sms, {
        message: dto.message,
        recipient: dto.recipient,
        is_sent: !!smsResponse,
        // provider_message_id: smsResponse?.message_id || null,
        // status: smsResponse?.status || 'FAILED',
      });

      await this.dataSource.manager.save(sms);

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Unknown SMS error';

      console.error('Semaphore Error:', errorMessage);

      await this.dataSource.manager.save(
        this.dataSource.manager.create(Sms, {
          message: dto.message,
          recipient: dto.recipient,
          is_sent: false,
          // status: 'FAILED',
        }),
      );

      throw new Error(errorMessage);
    }
  }

  //   async sendSmsSemaphore(dto: SendSMSDTO) {
  //   try {
  //     let mobile = dto.recipient.trim().replace(/[\s-]/g, '');

  //     if (mobile.startsWith('09')) {
  //       mobile = '+63' + mobile.substring(1);
  //     } else if (!mobile.startsWith('+63')) {
  //       throw new Error('Invalid Philippine mobile number format');
  //     }

  //     const response = await this.retry(() =>
  //       axios.post(this.baseUrl, {
  //         apikey: this.apiKey,
  //         number: mobile,
  //         message: dto.message,
  //       }),
  //     );

  //     const result = response.data[0];

  //     await this.dataSource.manager.save(
  //       this.dataSource.manager.create(Sms, {
  //         message: dto.message,
  //         recipient: result.recipient,
  //         // message_id: result.message_id,
  //         // status: result.status,
  //         is_sent: true,
  //       }),
  //     );

  //     return {
  //       success: true,
  //       messageId: result.message_id,
  //       status: result.status,
  //     };
  //   } catch (error) {
  //     await this.dataSource.manager.save(
  //       this.dataSource.manager.create(Sms, {
  //         message: dto.message,
  //         recipient: dto.recipient,
  //         is_sent: false,
  //       }),
  //     );
  //     console.log(error);
  //     throw error;
  //   }
  // }

  // async retry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  //   try {
  //     return await fn();
  //   } catch (error) {
  //     if (retries <= 0) throw error;

  //     await new Promise((res) => setTimeout(res, delay));
  //     return this.retry(fn, retries - 1, delay * 2);
  //   }
  // }
}
