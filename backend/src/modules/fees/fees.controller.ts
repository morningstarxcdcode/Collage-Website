import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FeesService } from './fees.service';

interface VerifyPaymentDto {
  provider: 'razorpay' | 'stripe';
  paymentId?: string;
  orderId?: string;
  paymentIntentId?: string;
  amount?: number;
  currency?: string;
  studentId: string;
  phone: string;
}

@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post('create-intent')
  async createPaymentIntent(
    @Body()
    body: {
      amount: number;
      currency?: string;
      studentId: string;
      phone: string;
    },
  ) {
    if (!body.amount || !body.studentId) {
      throw new BadRequestException('Amount and studentId are required');
    }
    return this.feesService.createPaymentIntent(
      body.amount,
      body.currency || 'inr',
      body.studentId,
    );
  }

  @Post('verify')
  async verifyPayment(@Body() body: VerifyPaymentDto) {
    return this.feesService.verifyPayment(body);
  }

  @Get('history/:studentId')
  getPaymentHistory(@Param('studentId') studentId: string) {
    // Mock history - in production, fetch from DB filtered by studentId
    return [
      {
        id: 'pay_123',
        studentId: studentId,
        amount: 45000,
        date: new Date(),
        status: 'verified',
        txHash: '0x123...',
      },
    ];
  }
}
