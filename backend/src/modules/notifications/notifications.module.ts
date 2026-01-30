import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CommunicationModule } from '../communication/communication.module';

@Module({
  imports: [CommunicationModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
