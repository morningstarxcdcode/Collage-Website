import { Injectable, Logger } from '@nestjs/common';

interface ExamRegistrationData {
  studentId: string;
  examId: string;
  subjects?: string[];
}

@Injectable()
export class ExamsService {
  private readonly logger = new Logger(ExamsService.name);

  registerStudent(data: ExamRegistrationData) {
    this.logger.log(`Registering student for exams: ${JSON.stringify(data)}`);
    return {
      success: true,
      registrationId: 'REG-' + Math.floor(Math.random() * 100000),
      message: 'Exam registration successful',
    };
  }

  getUpcomingExams() {
    return [
      {
        id: 'EX-001',
        name: 'Semester 4 End Term',
        startDate: '2024-05-15',
        endDate: '2024-05-30',
        fee: 3000,
      },
    ];
  }
}
