import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { CommunicationModule } from '../communication/communication.module';

@Module({
  imports: [ConfigModule, BlockchainModule, CommunicationModule],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
