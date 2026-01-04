import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FileText, Users, TrendingUp, Calendar } from 'lucide-react';

interface StudentReport {
  id: string;
  name: string;
  enrollmentNumber: string;
  subject: string;
  marks: number;
  grade: string;
  attendance: number;
}

interface ClassReport {
  subjectCode: string;
  subjectName: string;
  totalStudents: number;
  averageMarks: number;
  averageAttendance: number;
  passPercentage: number;
}

export const TeacherReports: React.FC = () => {
  const [reportType, setReportType] = useState<'student' | 'class'>('student');
  const [subjectCode, setSubjectCode] = useState('');
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);
  const [classReport, setClassReport] = useState<ClassReport | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data - in production, fetch from backend
  const subjects = [
    { code: 'CS101', name: 'Data Structures' },
    { code: 'CS102', name: 'Database Management' },
    { code: 'CS103', name: 'Operating Systems' },
  ];

  const mockStudentReports: StudentReport[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      enrollmentNumber: 'CS2024001',
      subject: 'Data Structures',
      marks: 85,
      grade: 'A',
      attendance: 92,
    },
    {
      id: '2',
      name: 'Priya Patel',
      enrollmentNumber: 'CS2024002',
      subject: 'Data Structures',
      marks: 78,
      grade: 'B+',
      attendance: 88,
    },
    {
      id: '3',
      name: 'Amit Kumar',
      enrollmentNumber: 'CS2024003',
      subject: 'Data Structures',
      marks: 92,
      grade: 'A+',
      attendance: 95,
    },
  ];

  const mockClassReport: ClassReport = {
    subjectCode: 'CS101',
    subjectName: 'Data Structures',
    totalStudents: 45,
    averageMarks: 82.5,
    averageAttendance: 89.2,
    passPercentage: 94.4,
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      if (reportType === 'student') {
        // In production: await axios.get(`/api/teachers/reports/students?subject=${subjectCode}`);
        setStudentReports(mockStudentReports);
        setClassReport(null);
      } else {
        // In production: await axios.get(`/api/teachers/reports/class?subject=${subjectCode}`);
        setClassReport(mockClassReport);
        setStudentReports([]);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-green-400';
      case 'A': return 'text-green-400';
      case 'B+': return 'text-blue-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-400';
    if (attendance >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Reports & Analytics</h2>
      </div>

      <GlassCard className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Report Type
            </label>
            <Select value={reportType} onValueChange={(value: 'student' | 'class') => setReportType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student-wise Report</SelectItem>
                <SelectItem value="class">Class-wise Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Subject
            </label>
            <Select value={subjectCode} onValueChange={setSubjectCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.code} value={subject.code}>
                    {subject.code} - {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleGenerateReport}
              disabled={!subjectCode || loading}
              className="w-full"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Class Report */}
      {classReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classReport.totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classReport.averageMarks}%</div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classReport.averageAttendance}%</div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Percentage</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classReport.passPercentage}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student Reports */}
      {studentReports.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Student Performance Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 text-slate-300">Enrollment No.</th>
                  <th className="text-left py-3 text-slate-300">Student Name</th>
                  <th className="text-left py-3 text-slate-300">Subject</th>
                  <th className="text-left py-3 text-slate-300">Marks</th>
                  <th className="text-left py-3 text-slate-300">Grade</th>
                  <th className="text-left py-3 text-slate-300">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {studentReports.map(student => (
                  <tr key={student.id} className="border-b border-slate-800">
                    <td className="py-3 text-slate-300">{student.enrollmentNumber}</td>
                    <td className="py-3 text-white font-medium">{student.name}</td>
                    <td className="py-3 text-slate-300">{student.subject}</td>
                    <td className="py-3 text-white">{student.marks}%</td>
                    <td className="py-3">
                      <Badge className={`${getGradeColor(student.grade)} bg-transparent border`}>
                        {student.grade}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <span className={getAttendanceColor(student.attendance)}>
                        {student.attendance}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};