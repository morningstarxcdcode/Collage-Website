import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { FeesModule } from '../fees/fees.module'; // Import to use FeesService

@Module({
  imports: [BlockchainModule, FeesModule],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
