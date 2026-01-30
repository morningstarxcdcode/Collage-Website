import { Controller, Post, Body, Get } from '@nestjs/common';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('register')
  registerForExam(
    @Body() body: { studentId: string; examId: string; subjects?: string[] },
  ) {
    return this.examsService.registerStudent(body);
  }

  @Get('upcoming')
  getUpcomingExams() {
    return this.examsService.getUpcomingExams();
  }
}
