import { Injectable } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { TelegramService } from './telegram.service';
import { SmsService } from './sms.service';

@Injectable()
export class CommunicationService {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly telegramService: TelegramService,
    private readonly smsService: SmsService,
  ) {}

  async sendWhatsApp(to: string, message: string) {
    return this.whatsappService.sendMessage(to, message);
  }

  sendWhatsAppImage(to: string, imageUrl: string, caption: string): void {
    this.whatsappService.sendImage(to, imageUrl, caption);
  }

  async sendTelegram(chatId: string, message: string) {
    return this.telegramService.sendMessage(chatId, message);
  }

  async sendSMS(to: string, message: string) {
    return this.smsService.sendSms(to, message);
  }

  async sendNotification(
    userContact: { phone?: string; telegramChatId?: string },
    message: string,
  ) {
    const results = { whatsapp: false, sms: false, telegram: false };

    if (userContact.phone) {
      results.whatsapp = await this.sendWhatsApp(userContact.phone, message);
      results.sms = await this.sendSMS(userContact.phone, message);
    }

    if (userContact.telegramChatId) {
      results.telegram = await this.sendTelegram(
        userContact.telegramChatId,
        message,
      );
    }

    return results;
  }
}
