import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, Contract } from 'ethers';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider | null = null;
  private relayerWallet: ethers.Wallet | null = null;
  private contract: any = null;

  private readonly contractABI = [
    'function recordPayment(string _paymentId, uint256 _amount, string _currency) public',
    'function verifyPayment(string _paymentId) public view returns (bool, uint256, uint256)',
    'event PaymentRecorded(string indexed paymentId, bytes32 paymentHash, uint256 timestamp)',
  ];

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const rpcUrl = this.configService.get<string>('BLOCKCHAIN_RPC_URL');
    const privateKey = this.configService.get<string>('RELAYER_PRIVATE_KEY');
    const contractAddress = this.configService.get<string>(
      'PAYMENT_LEDGER_CONTRACT_ADDRESS',
    );

    if (rpcUrl && privateKey && contractAddress) {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.relayerWallet = new ethers.Wallet(privateKey, this.provider);
      this.contract = new Contract(
        contractAddress,
        this.contractABI,
        this.relayerWallet,
      );
      this.logger.log(
        `Blockchain Service initialized. Relayer Address: ${this.relayerWallet.address}, Contract: ${contractAddress}`,
      );
    } else {
      this.logger.warn(
        'Blockchain config missing. Service running in mock mode.',
      );
    }
  }

  async recordPayment(
    studentId: string,
    paymentId: string,
    amount: number,
    currency: string,
  ): Promise<string> {
    if (!this.contract) {
      this.logger.warn(`Mocking Blockchain Transaction for ${paymentId}`);
      return 'mock_tx_hash_' + paymentId;
    }

    let retries = 3;
    while (retries > 0) {
      try {
        this.logger.log(`Recording payment ${paymentId} on-chain...`);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const tx = await this.contract.recordPayment(
          paymentId,
          ethers.parseEther(amount.toString()),
          currency,
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const receipt = await tx.wait();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.logger.log(`Transaction confirmed! Hash: ${receipt.hash}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return receipt.hash;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Blockchain error: ${message}`);
        retries--;
        if (retries > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 * (4 - retries)),
          ); // Exponential backoff
        }
      }
    }
    throw new Error('Failed to record payment on blockchain after retries');
  }

  async verifyPayment(
    paymentId: string,
  ): Promise<{ exists: boolean; amount: number; timestamp: number }> {
    if (!this.contract) {
      return { exists: false, amount: 0, timestamp: 0 };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const [exists, amount, timestamp] =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await this.contract.verifyPayment(paymentId);

      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      return {
        exists,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        amount: Number(ethers.formatEther(amount)),
        timestamp: Number(timestamp),
      };
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Verification error: ${message}`);
      return { exists: false, amount: 0, timestamp: 0 };
    }
  }

  async recordTransaction(data: {
    type: string;
    studentId: string;
    amount?: number;
    description?: string;
    data?: Record<string, unknown>;
    teacherId?: string;
    subjectCode?: string;
    marks?: number;
    timestamp?: string;
    grade?: string;
    status?: string;
    date?: string;
  }): Promise<string> {
    if (!this.contract) {
      this.logger.warn(`Mocking Blockchain Transaction for ${data.type}`);
      return 'mock_tx_hash_' + data.type + '_' + Date.now();
    }

    // For now, treat all transactions as payments
    // In a real implementation, you'd have different contract methods for different transaction types
    if (data.amount) {
      return this.recordPayment(data.studentId, data.type, data.amount, 'INR');
    } else {
      // Mock for non-payment transactions
      return 'mock_tx_hash_' + data.type + '_' + Date.now();
    }
  }
}
