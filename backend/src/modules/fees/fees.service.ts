import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CommunicationService } from '../communication/communication.service';
import * as QRCode from 'qrcode';

export interface PaymentIntentResponse {
  provider: 'razorpay' | 'stripe';
  orderId?: string;
  clientSecret?: string | null;
  publicKey?: string;
  qrCodeUrl: string;
  amount: number;
  currency: string;
}

export interface PaymentData {
  provider: 'razorpay' | 'stripe';
  paymentId?: string;
  orderId?: string;
  paymentIntentId?: string;
  amount?: number;
  currency?: string;
  studentId: string;
  phone: string;
}

@Injectable()
export class FeesService {
  private readonly logger = new Logger(FeesService.name);
  private stripe: Stripe | null = null;
  private razorpay: Razorpay | null = null;

  constructor(
    private configService: ConfigService,
    private blockchainService: BlockchainService,
    private communicationService: CommunicationService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey);
    }

    const rzpKey = this.configService.get<string>('RAZORPAY_KEY_ID');
    const rzpSecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (rzpKey && rzpSecret) {
      this.razorpay = new Razorpay({ key_id: rzpKey, key_secret: rzpSecret });
    }
  }

  detectCurrencyAndConvert(
    amount: number,
    userCurrency?: string,
  ): { amount: number; currency: string } {
    // Auto-detect currency based on IP or user input, default to INR for India
    const currency = userCurrency || 'INR';
    // For simplicity, assume amount is in base currency, convert if needed
    // Use an API like fixer.io for conversion, but mock here
    if (currency !== 'INR') {
      // Mock conversion
      const converted = amount * 0.012; // Example USD to INR
      return { amount: converted, currency };
    }
    return { amount, currency };
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'INR',
    studentId: string,
  ): Promise<PaymentIntentResponse> {
    const { amount: convertedAmount, currency: finalCurrency } =
      this.detectCurrencyAndConvert(amount, currency);

    this.logger.log(`Creating payment for ${convertedAmount} ${finalCurrency}`);

    let paymentIntent: PaymentIntentResponse;

    if (finalCurrency === 'INR' && this.razorpay) {
      const order = await this.razorpay.orders.create({
        amount: convertedAmount * 100,
        currency: 'INR',
        receipt: `receipt_${studentId}_${Date.now()}`,
      });
      paymentIntent = {
        provider: 'razorpay',
        orderId: order.id,
        publicKey: this.configService.get<string>('RAZORPAY_KEY_ID'),
        qrCodeUrl: await QRCode.toDataURL(
          `upi://pay?pa=merchant@upi&pn=Merchant&am=${convertedAmount}&cu=INR&tn=Fee Payment`,
        ),
        amount: convertedAmount,
        currency: finalCurrency,
      };
    } else if (this.stripe) {
      const stripeIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(convertedAmount * 100),
        currency: finalCurrency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
      });
      paymentIntent = {
        provider: 'stripe',
        clientSecret: stripeIntent.client_secret,
        publicKey: this.configService.get<string>('STRIPE_PUBLISHABLE_KEY'),
        qrCodeUrl: await QRCode.toDataURL(
          `https://checkout.stripe.com/pay/${stripeIntent.client_secret}`,
        ),
        amount: convertedAmount,
        currency: finalCurrency,
      };
    } else {
      throw new BadRequestException('No payment provider available');
    }

    return paymentIntent;
  }

  async verifyPayment(paymentData: PaymentData): Promise<{
    success: boolean;
    transactionHash: string;
    receiptUrl: string;
  }> {
    let isVerified = false;
    let paymentId = '';

    if (paymentData.provider === 'razorpay' && this.razorpay) {
      if (paymentData.paymentId && paymentData.orderId) {
        const order = await this.razorpay.orders.fetch(paymentData.orderId);
        if (order.status === 'paid') {
          isVerified = true;
          paymentId = paymentData.paymentId;
        }
      }
    } else if (
      paymentData.provider === 'stripe' &&
      this.stripe &&
      paymentData.paymentIntentId
    ) {
      const intent = await this.stripe.paymentIntents.retrieve(
        paymentData.paymentIntentId,
      );
      if (intent.status === 'succeeded') {
        isVerified = true;
        paymentId = intent.id;
      }
    }

    if (isVerified) {
      const txHash = await this.blockchainService.recordPayment(
        paymentData.studentId,
        paymentId,
        paymentData.amount || 0,
        paymentData.currency || 'INR',
      );

      const receiptUrl = this.generateReceiptImage(paymentData, txHash);

      const message = `Payment Successful! Amount: ${paymentData.currency} ${paymentData.amount}\nTxHash: ${txHash}\nReceipt: ${receiptUrl}`;

      this.communicationService.sendWhatsAppImage(
        paymentData.phone,
        receiptUrl,
        message,
      );
      await this.communicationService.sendSMS(
        paymentData.phone,
        `Fee Paid! Receipt: ${receiptUrl}`,
      );

      return {
        success: true,
        transactionHash: txHash,
        receiptUrl,
      };
    }

    throw new BadRequestException('Payment verification failed');
  }

  private generateReceiptImage(
    paymentData: PaymentData,
    txHash: string,
  ): string {
    // In production, generate a real receipt image using canvas or puppeteer
    // For now, return a mock URL
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Receipt:${txHash}`;
  }
}
