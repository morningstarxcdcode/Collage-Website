import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  subjects: string[];
}

export interface MarkEntry {
  id: string;
  studentId: string;
  subjectCode: string;
  marks: number;
  grade: string;
  semester: number;
  enteredBy: string;
  enteredAt: string;
  txHash?: string;
  verified: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectCode: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  enteredBy: string;
  enteredAt: string;
  txHash?: string;
  verified: boolean;
}

@Injectable()
export class TeachersService {
  private teachers: Teacher[] = [
    {
      id: '1',
      employeeId: 'T001',
      name: 'Dr. Priya Singh',
      email: 'priya.singh@college.edu',
      phone: '+91-9876543211',
      department: 'Computer Science',
      designation: 'Associate Professor',
      subjects: ['CS101', 'CS102', 'CS103'],
    },
  ];

  private marks: MarkEntry[] = [];
  private attendance: AttendanceRecord[] = [];

  constructor(private blockchainService: BlockchainService) {}

  getTeacherById(id: string): Teacher | null {
    return this.teachers.find((t) => t.id === id) || null;
  }

  getTeacherMarks(teacherId: string): MarkEntry[] {
    return this.marks.filter((m) => m.enteredBy === teacherId);
  }

  async enterMarks(
    markEntry: Omit<MarkEntry, 'id' | 'enteredAt' | 'verified'>,
  ): Promise<MarkEntry> {
    const newMark: MarkEntry = {
      ...markEntry,
      id: Date.now().toString(),
      enteredAt: new Date().toISOString(),
      verified: false,
    };

    this.marks.push(newMark);

    // Record on blockchain for verification
    try {
      const txHash = await this.blockchainService.recordTransaction({
        type: 'marks_entry',
        studentId: markEntry.studentId,
        teacherId: markEntry.enteredBy,
        subjectCode: markEntry.subjectCode,
        marks: markEntry.marks,
        grade: markEntry.grade,
        timestamp: newMark.enteredAt,
      });

      newMark.txHash = txHash;
      newMark.verified = true;
    } catch (error) {
      console.error('Failed to record marks on blockchain:', error);
    }

    return newMark;
  }

  async markAttendance(
    attendanceEntry: Omit<AttendanceRecord, 'id' | 'enteredAt' | 'verified'>,
  ): Promise<AttendanceRecord> {
    const newAttendance: AttendanceRecord = {
      ...attendanceEntry,
      id: Date.now().toString(),
      enteredAt: new Date().toISOString(),
      verified: false,
    };

    this.attendance.push(newAttendance);

    // Record on blockchain for verification
    try {
      const txHash = await this.blockchainService.recordTransaction({
        type: 'attendance',
        studentId: attendanceEntry.studentId,
        teacherId: attendanceEntry.enteredBy,
        subjectCode: attendanceEntry.subjectCode,
        status: attendanceEntry.status,
        date: attendanceEntry.date,
        timestamp: newAttendance.enteredAt,
      });

      newAttendance.txHash = txHash;
      newAttendance.verified = true;
    } catch (error) {
      console.error('Failed to record attendance on blockchain:', error);
    }

    return newAttendance;
  }

  getStudentAttendance(studentId: string): Promise<AttendanceRecord[]> {
    return Promise.resolve(
      this.attendance.filter((a) => a.studentId === studentId),
    );
  }

  getClassAttendance(
    subjectCode: string,
    date: string,
  ): Promise<AttendanceRecord[]> {
    return Promise.resolve(
      this.attendance.filter(
        (a) => a.subjectCode === subjectCode && a.date === date,
      ),
    );
  }
}
