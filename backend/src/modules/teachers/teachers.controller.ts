import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import {
  TeachersService,
  Teacher,
  MarkEntry,
  AttendanceRecord,
} from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get(':id')
  getTeacher(@Param('id') id: string): Teacher | null {
    return this.teachersService.getTeacherById(id);
  }

  @Get(':id/marks')
  getTeacherMarks(@Param('id') id: string): MarkEntry[] {
    return this.teachersService.getTeacherMarks(id);
  }

  @Post('marks')
  async enterMarks(
    @Body() markEntry: Omit<MarkEntry, 'id' | 'enteredAt' | 'verified'>,
  ): Promise<MarkEntry> {
    return this.teachersService.enterMarks(markEntry);
  }

  @Post('attendance')
  async markAttendance(
    @Body()
    attendanceEntry: Omit<AttendanceRecord, 'id' | 'enteredAt' | 'verified'>,
  ): Promise<AttendanceRecord> {
    return this.teachersService.markAttendance(attendanceEntry);
  }

  @Get('attendance/student/:studentId')
  async getStudentAttendance(
    @Param('studentId') studentId: string,
  ): Promise<AttendanceRecord[]> {
    return this.teachersService.getStudentAttendance(studentId);
  }

  @Get('attendance/class/:subjectCode/:date')
  async getClassAttendance(
    @Param('subjectCode') subjectCode: string,
    @Param('date') date: string,
  ): Promise<AttendanceRecord[]> {
    return this.teachersService.getClassAttendance(subjectCode, date);
  }
}
