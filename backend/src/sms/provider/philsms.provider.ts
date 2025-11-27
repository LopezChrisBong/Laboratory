import { Injectable, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SMS_OPTIONS } from '../constants/sms.constants';
import {
  SmsModuleOptions,
  SendSmsDto,
  SendMmsDto,
  SendVoiceDto,
  SmsResponse,
} from '../interfaces/sms-options.interface';
import { SendSMSDTO } from '../dto/send-sms.dto';

@Injectable()
export class PhilSmsProvider {
  private readonly logger = new Logger(PhilSmsProvider.name);
  private readonly baseUrl: string;

  constructor(
    @Inject(SMS_OPTIONS) private options: SmsModuleOptions,
    private httpService: HttpService,
  ) {
    this.baseUrl = 'https://app.philsms.com/api/v3/';
  }

  async sendSms(dto: SendSMSDTO): Promise<SmsResponse> {
    try {
      const payload = {
        recipient: this.formatPhoneNumber(dto.recipient),
        sender_id: process.env.PHILSMS_SENDER_ID,
        type: 'plain',
        message: this.formatMesage(dto.message),
      };
      console.log(`Sending SMS to ${payload.recipient}`);

      const response = await firstValueFrom(
        this.httpService.post(
          'https://dashboard.philsms.com/api/v3/sms/send',
          payload,
          {
            headers: {
              Authorization: `Bearer ${process.env.PHILSMS_API_TOKEN}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        ),
      );
      //   console.log('res', response);
      console.log(`SMS sent successfully: ${response.data.uid}`);

      //   this.logger.log(`SMS sent successfully: ${response.data.uid}`);

      return {
        success: true,
        messageId: response.data.uid,
        status: response.data.status,
        data: response.data,
      };
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async sendMms(dto: SendMmsDto): Promise<SmsResponse> {
    try {
      const payload = {
        recipient: this.formatPhoneNumber(dto.recipient),
        sender_id: dto.senderId || this.options.defaultSenderId,
        type: 'mms',
        message: dto.message,
        media_url: dto.mediaUrl,
      };

      this.logger.debug(`Sending MMS to ${payload.recipient}`);

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/sms/send`, payload, {
          headers: {
            Authorization: `Bearer ${this.options.apiToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );

      this.logger.log(`MMS sent successfully: ${response.data.uid}`);

      return {
        success: true,
        messageId: response.data.uid,
        status: response.data.status,
        data: response.data,
      };
    } catch (error) {
      this.logger.error(`Failed to send MMS: ${error.message}`);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async sendVoice(dto: SendVoiceDto): Promise<SmsResponse> {
    try {
      const payload = {
        recipient: this.formatPhoneNumber(dto.recipient),
        type: 'voice',
        language: dto.language || 'en-gb',
        gender: dto.gender || 'female',
        message: dto.message,
      };

      this.logger.debug(`Sending voice message to ${payload.recipient}`);

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/sms/send`, payload, {
          headers: {
            Authorization: `Bearer ${this.options.apiToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );

      this.logger.log(`Voice message sent successfully: ${response.data.uid}`);

      return {
        success: true,
        messageId: response.data.uid,
        status: response.data.status,
        data: response.data,
      };
    } catch (error) {
      this.logger.error(`Failed to send voice message: ${error.message}`);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async getMessageStatus(messageId: string): Promise<SmsResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/sms/${messageId}`, {
          headers: {
            Authorization: `Bearer ${this.options.apiToken}`,
            Accept: 'application/json',
          },
        }),
      );

      return {
        success: true,
        messageId: response.data.uid,
        status: response.data.status,
        data: response.data,
      };
    } catch (error) {
      this.logger.error(`Failed to get message status: ${error.message}`);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async getBalance(): Promise<{
    success: boolean;
    balance?: number;
    currency?: string;
    error?: string;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${this.options.apiToken}`,
            Accept: 'application/json',
          },
        }),
      );

      return {
        success: true,
        balance: response.data.sms_credit,
        currency: response.data.currency,
      };
    } catch (error) {
      this.logger.error(`Failed to get balance: ${error.message}`);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove spaces, dashes, and other non-numeric characters
    let cleaned = phone.replace(/[^\d+]/g, '');

    // If it starts with 0, replace with 63 (Philippines country code)
    if (cleaned.startsWith('0')) {
      cleaned = '63' + cleaned.substring(1);
    }

    // If it doesn't start with + or country code, add 63
    if (!cleaned.startsWith('+') && !cleaned.startsWith('63')) {
      cleaned = '63' + cleaned;
    }

    // Remove + if present for API compatibility
    cleaned = cleaned.replace('+', '');

    return cleaned;
  }

  private formatMesage(message: string) {
    return (message += '\n\n-PARAGON Diagnostics And Multi-Specialty Clinic');
  }
}
