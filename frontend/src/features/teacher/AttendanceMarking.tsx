import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Student {
  id: string;
  enrollmentNumber: string;
  name: string;
}

export const AttendanceMarking: React.FC = () => {
  const [subjectCode, setSubjectCode] = useState('');
  const [date, setDate] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock data - in production, fetch from backend
  const subjects = [
    { code: 'CS101', name: 'Data Structures' },
    { code: 'CS102', name: 'Database Management' },
    { code: 'CS103', name: 'Operating Systems' },
  ];

  const mockStudents: Student[] = [
    { id: '1', enrollmentNumber: 'CS2024001', name: 'Rahul Sharma' },
    { id: '2', enrollmentNumber: 'CS2024002', name: 'Priya Patel' },
    { id: '3', enrollmentNumber: 'CS2024003', name: 'Amit Kumar' },
  ];

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit attendance for each student
      const promises = Object.entries(attendance).map(async ([studentId, status]) => {
        await axios.post('/api/teachers/attendance', {
          studentId,
          subjectCode,
          date,
          status,
          enteredBy: 'teacher-1', // In production, get from auth
        });
      });

      await Promise.all(promises);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit attendance:', error);
      alert('Failed to submit attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (value: string) => {
    setSubjectCode(value);
    setStudents(mockStudents); // In production, fetch students enrolled in this subject
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-400';
      case 'absent': return 'text-red-400';
      case 'late': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500/20';
      case 'absent': return 'bg-red-500/20';
      case 'late': return 'bg-yellow-500/20';
      default: return 'bg-slate-500/20';
    }
  };

  if (submitted) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-6">
        <GlassCard className="text-center max-w-md w-full py-12">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Attendance Submitted Successfully!
          </h2>
          <p className="text-slate-400 mb-6">
            Attendance has been recorded and verified on blockchain.
          </p>
          <div className="bg-slate-900/50 p-4 rounded-lg text-left text-sm text-slate-300">
            <p><strong>Subject:</strong> {subjects.find(s => s.code === subjectCode)?.name}</p>
            <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
            <p><strong>Present:</strong> {Object.values(attendance).filter(s => s === 'present').length}</p>
            <p><strong>Absent:</strong> {Object.values(attendance).filter(s => s === 'absent').length}</p>
            <p><strong>Late:</strong> {Object.values(attendance).filter(s => s === 'late').length}</p>
          </div>
          <Button
            onClick={() => {
              setSubmitted(false);
              setAttendance({});
              setSubjectCode('');
              setDate('');
            }}
            className="mt-6 w-full"
          >
            Mark More Attendance
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Mark Attendance</h2>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subject
              </label>
              <Select value={subjectCode} onValueChange={handleSubjectChange}>
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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {subjectCode && date && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Student Attendance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map(student => (
                  <div key={student.id} className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-slate-400">{student.enrollmentNumber}</p>
                        <p className="text-white font-medium">{student.name}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusBg(attendance[student.id] || '')}`}>
                        <span className={getStatusColor(attendance[student.id] || '')}>
                          {attendance[student.id] || 'Not Marked'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                        onClick={() => handleAttendanceChange(student.id, 'present')}
                        className="flex-1 text-xs"
                      >
                        Present
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={attendance[student.id] === 'absent' ? 'destructive' : 'outline'}
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className="flex-1 text-xs"
                      >
                        Absent
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={attendance[student.id] === 'late' ? 'secondary' : 'outline'}
                        onClick={() => handleAttendanceChange(student.id, 'late')}
                        className="flex-1 text-xs"
                      >
                        Late
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !subjectCode || !date || Object.keys(attendance).length === 0}
              className="px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Attendance'
              )}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};