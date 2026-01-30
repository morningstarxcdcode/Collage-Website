import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { StudentsService, Student, Transaction } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get(':id')
  getStudent(@Param('id') id: string): Student | null {
    return this.studentsService.getStudentById(id);
  }

  @Get(':id/transactions')
  getStudentTransactions(@Param('id') id: string): Transaction[] {
    return this.studentsService.getStudentTransactions(id);
  }

  @Put(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() updates: Partial<Student>,
  ): Promise<Student | null> {
    return this.studentsService.updateStudentProfile(id, updates);
  }

  @Post(':id/transactions')
  async recordTransaction(
    @Param('id') studentId: string,
    @Body() transaction: Omit<Transaction, 'id' | 'studentId' | 'verified'>,
  ): Promise<Transaction> {
    return this.studentsService.recordTransaction({
      ...transaction,
      studentId,
    });
  }
}
