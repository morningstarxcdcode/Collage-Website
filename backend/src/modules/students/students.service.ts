import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';

export interface Student {
  id: string;
  enrollmentNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  feesPaid: number;
  totalFees: number;
}

export interface Transaction {
  id: string;
  studentId: string;
  type: 'payment' | 'exam' | 'library';
  amount?: number;
  description: string;
  date: string;
  txHash?: string;
  verified: boolean;
}

@Injectable()
export class StudentsService {
  private students: Student[] = [
    {
      id: '1',
      enrollmentNumber: 'CS2024001',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91-9876543210',
      department: 'Computer Science',
      semester: 6,
      feesPaid: 35000,
      totalFees: 45000,
    },
  ];

  private transactions: Transaction[] = [
    {
      id: '1',
      studentId: '1',
      type: 'payment',
      amount: 35000,
      description: 'Semester Fee Payment',
      date: new Date().toISOString(),
      txHash: '0x1234567890abcdef',
      verified: true,
    },
  ];

  constructor(private blockchainService: BlockchainService) {}

  getStudentById(id: string): Student | null {
    return this.students.find((s) => s.id === id) || null;
  }

  getStudentTransactions(studentId: string): Transaction[] {
    return this.transactions.filter((t) => t.studentId === studentId);
  }

  async updateStudentProfile(
    studentId: string,
    updates: Partial<Student>,
  ): Promise<Student | null> {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return null;

    Object.assign(student, updates);

    // Record profile update on blockchain for verification
    try {
      await this.blockchainService.recordTransaction({
        type: 'profile_update',
        studentId,
        data: updates,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to record profile update on blockchain:', error);
    }

    return student;
  }

  async recordTransaction(
    transaction: Omit<Transaction, 'id' | 'verified'>,
  ): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      verified: false,
    };

    this.transactions.push(newTransaction);

    // Record on blockchain
    try {
      const txHash = await this.blockchainService.recordTransaction({
        type: transaction.type,
        studentId: transaction.studentId,
        amount: transaction.amount,
        description: transaction.description,
        timestamp: transaction.date,
      });

      newTransaction.txHash = txHash;
      newTransaction.verified = true;
    } catch (error) {
      console.error('Failed to record transaction on blockchain:', error);
    }

    return newTransaction;
  }
}
