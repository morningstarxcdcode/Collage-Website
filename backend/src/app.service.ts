import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getStatus() {
    // Mock status - in production, check actual service health
    return {
      whatsapp: 'online',
      telegram: 'online',
      digilocker: 'online',
      sms: 'online',
    };
  }
}
