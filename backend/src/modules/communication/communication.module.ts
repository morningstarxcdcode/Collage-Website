import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommunicationService } from './communication.service';
import { WhatsappService } from './whatsapp.service';
import { TelegramService } from './telegram.service';
import { SmsService } from './sms.service';

@Global() // Make it global so it can be used easily in other modules without importing everywhere
@Module({
  imports: [ConfigModule],
  providers: [
    CommunicationService,
    WhatsappService,
    TelegramService,
    SmsService,
  ],
  exports: [CommunicationService],
})
export class CommunicationModule {}
