import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf | null = null;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      this.logger.warn(
        'TELEGRAM_BOT_TOKEN not found in config. Telegram service disabled.',
      );
      return;
    }

    this.bot = new Telegraf(token);

    this.bot.start((ctx) => {
      void ctx.reply(
        'Welcome to EduNexus Bot! You are now subscribed to notifications.',
      );
      this.logger.log(
        `New user subscribed: ${ctx.from?.id} (${ctx.from?.username})`,
      );
    });

    void this.bot
      .launch()
      .then(() => {
        this.logger.log('Telegram Bot launched!');
      })
      .catch((err) => {
        this.logger.error('Failed to launch Telegram Bot', err);
      });

    // Graceful stop
    process.once('SIGINT', () => this.bot?.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot?.stop('SIGTERM'));
  }

  async sendMessage(chatId: string, message: string): Promise<boolean> {
    if (!this.bot) return false;
    try {
      await this.bot.telegram.sendMessage(chatId, message);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send Telegram message to ${chatId}`, error);
      return false;
    }
  }
}
