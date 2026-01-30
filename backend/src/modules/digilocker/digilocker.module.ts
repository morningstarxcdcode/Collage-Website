import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DigilockerService } from './digilocker.service';
import { DigilockerController } from './digilocker.controller';

@Module({
  imports: [ConfigModule],
  controllers: [DigilockerController],
  providers: [DigilockerService],
  exports: [DigilockerService],
})
export class DigilockerModule {}
