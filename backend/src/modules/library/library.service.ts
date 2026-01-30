import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { FeesService } from '../fees/fees.service';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  serialNo: string;
  status: 'AVAILABLE' | 'ISSUED' | 'LOST';
  issuedTo?: string; // Student ID
  dueDate?: Date;
}

@Injectable()
export class LibraryService {
  private readonly logger = new Logger(LibraryService.name);

  // In-memory mock DB for now, would be TypeORM Repository in real DB
  private books: Map<string, Book> = new Map();

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly feesService: FeesService,
  ) {
    // Seed some dummy books
    this.addBook({
      title: 'Introduction to Algorithms',
      author: 'Cormen',
      isbn: '9780262033848',
      serialNo: 'LIB-CS-001',
    });
    this.addBook({
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      serialNo: 'LIB-CS-002',
    });
  }

  addBook(data: Partial<Book>) {
    const id = `book_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newBook: Book = {
      id,
      title: data.title || 'Unknown',
      author: data.author || 'Unknown',
      isbn: data.isbn || '000-000',
      serialNo: data.serialNo || `SN-${Date.now()}`,
      status: 'AVAILABLE',
    };
    this.books.set(id, newBook);
    this.logger.log(`Book Added: ${newBook.title} (${newBook.serialNo})`);
    return newBook;
  }

  getAllBooks() {
    return Array.from(this.books.values());
  }

  async issueBook(bookId: string, studentId: string) {
    const book = this.books.get(bookId);
    if (!book) throw new NotFoundException('Book not found');
    if (book.status !== 'AVAILABLE')
      throw new BadRequestException('Book is not available');

    // 1. Update DB State
    book.status = 'ISSUED';
    book.issuedTo = studentId;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 Days loan
    book.dueDate = dueDate;
    this.books.set(bookId, book);

    // 2. Record on Blockchain (Proof of Issue)
    // We record: "Student X borrowed Book Y on Date Z"
    const txHash = await this.blockchainService.recordPayment(
      studentId,
      `ISSUE_${book.serialNo}`,
      0,
      'LIB_ISSUE', // Using currency field as 'Action Type' for generic recording
    );

    this.logger.log(
      `Book Issued: ${book.serialNo} to ${studentId}. TxHash: ${txHash}`,
    );

    return {
      success: true,
      book,
      transactionHash: txHash,
      message: `Book issued successfully. Due date: ${dueDate.toDateString()}`,
    };
  }

  async returnBook(bookId: string, studentId: string) {
    const book = this.books.get(bookId);
    if (!book) throw new NotFoundException('Book not found');
    if (book.status !== 'ISSUED' || book.issuedTo !== studentId)
      throw new BadRequestException('Book not issued to this student');

    const now = new Date();
    let lateFee = 0;

    if (book.dueDate && now > book.dueDate) {
      const diffTime = Math.abs(now.getTime() - book.dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      lateFee = diffDays * 10;
    }

    book.status = 'AVAILABLE';
    book.issuedTo = undefined;
    book.dueDate = undefined;
    this.books.set(bookId, book);

    const txHash = await this.blockchainService.recordPayment(
      studentId,
      `RETURN_${book.serialNo}`,
      lateFee,
      'INR',
    );

    let paymentIntent = null;
    if (lateFee > 0) {
      paymentIntent = await this.feesService.createPaymentIntent(
        lateFee,
        'INR',
        studentId,
      );
    }

    return {
      success: true,
      returnTxHash: txHash,
      lateFee,
      lateFeePaymentIntent: paymentIntent,
      message:
        lateFee > 0
          ? `Book returned late. Fine: ₹${lateFee}`
          : 'Book returned on time.',
    };
  }
}
