import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);
  private isReady = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.client.on('qr', (qr) => {
      this.logger.log(`QR RECEIVED: ${qr.substring(0, 30)}...`);
      this.logger.warn(
        'Please scan the QR code with WhatsApp to authenticate.',
      );
    });

    this.client.on('ready', () => {
      this.isReady = true;
      this.logger.log('WhatsApp Client is ready!');
    });

    this.client.on('authenticated', () => {
      this.logger.log('WhatsApp Client is authenticated!');
    });

    this.client.on('auth_failure', (msg) => {
      this.logger.error('WhatsApp Authentication failure', msg);
    });
  }

  onModuleInit() {
    this.logger.log('Initializing WhatsApp Client...');
    this.client.initialize().catch((err) => {
      this.logger.error('Failed to initialize WhatsApp client', err);
    });
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    if (!this.isReady) {
      this.logger.warn(
        'WhatsApp client is not ready. Message queued or failed.',
      );
      return false;
    }
    try {
      const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
      await this.client.sendMessage(chatId, message);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message to ${to}`, error);
      return false;
    }
  }

  sendImage(to: string, imageUrl: string, caption: string): void {
    if (!this.client || !this.isReady) {
      this.logger.warn('WhatsApp Client not ready');
      return;
    }
    // Mock implementation - log instead of actually sending
    this.logger.log(
      `[MOCK] WhatsApp Image to ${to}: [Image: ${imageUrl}] Caption: ${caption}`,
    );
  }
}
