import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface Fast2SmsResponse {
  return: boolean;
  request_id: string;
  message: string[];
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private configService: ConfigService) {}

  async sendSms(to: string, message: string): Promise<boolean> {
    const provider =
      this.configService.get<string>('SMS_PROVIDER') || 'GENERIC';

    try {
      if (provider === 'FAST2SMS') {
        return await this.sendFast2Sms(to, message);
      } else if (provider === 'TWILIO') {
        this.logger.warn('Twilio SMS not yet implemented.');
        return false;
      } else {
        this.logger.warn(
          'No valid SMS_PROVIDER configured. Simulating SMS send.',
        );
        this.logger.log(`[SIMULATION] SMS to ${to}: ${message}`);
        return true;
      }
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}`, error);
      return false;
    }
  }

  private async sendFast2Sms(to: string, message: string): Promise<boolean> {
    const apiKey = this.configService.get<string>('FAST2SMS_API_KEY');
    if (!apiKey) {
      this.logger.error('FAST2SMS_API_KEY is missing.');
      return false;
    }
    try {
      const response = await axios.post<Fast2SmsResponse>(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          route: 'v3',
          sender_id: 'TXTIND',
          message: message,
          language: 'english',
          flash: 0,
          numbers: to,
        },
        {
          headers: {
            authorization: apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.return;
    } catch (err) {
      this.logger.error('Fast2SMS request failed', err);
      return false;
    }
  }
}
