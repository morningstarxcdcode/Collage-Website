import { Injectable, Logger } from '@nestjs/common';
import { CommunicationService } from '../communication/communication.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly communicationService: CommunicationService) {}

  async sendWhatsApp(to: string, message: string, imageUrl?: string) {
    this.logger.log(`[WhatsApp] Sending to ${to}`);
    const finalMessage = imageUrl
      ? `${message}\n\nAttachment: ${imageUrl}`
      : message;
    return this.communicationService.sendWhatsApp(to, finalMessage);
  }

  async sendTelegram(chatId: string, message: string, imageUrl?: string) {
    this.logger.log(`[Telegram] Sending to ${chatId}`);
    const finalMessage = imageUrl
      ? `${message}\n\nAttachment: ${imageUrl}`
      : message;
    return this.communicationService.sendTelegram(chatId, finalMessage);
  }

  async notifyPaymentDue(
    studentName: string,
    amount: string,
    currency: string,
    contact: { phone: string; telegramId?: string },
  ) {
    const msg = `Hello ${studentName}, your semester fees of ${currency} ${amount} is due. Please pay to avoid late fees.`;
    const invoiceImage = 'https://edunexus.in/assets/invoice-placeholder.png'; // Generated dynamically in real app

    await this.sendWhatsApp(contact.phone, msg, invoiceImage);
    if (contact.telegramId) {
      await this.sendTelegram(contact.telegramId, msg, invoiceImage);
    }
  }
}
