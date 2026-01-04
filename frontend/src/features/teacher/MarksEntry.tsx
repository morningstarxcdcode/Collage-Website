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

export const MarksEntry: React.FC = () => {
  const [subjectCode, setSubjectCode] = useState('');
  const [semester, setSemester] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, { marks: string; grade: string }>>({});
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

  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
  };

  const handleMarksChange = (studentId: string, value: string) => {
    const numMarks = parseInt(value) || 0;
    const grade = calculateGrade(numMarks);
    setMarks(prev => ({
      ...prev,
      [studentId]: { marks: value, grade }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit marks for each student
      const promises = Object.entries(marks).map(async ([studentId, { marks: marksValue, grade }]) => {
        const numMarks = parseInt(marksValue);
        if (isNaN(numMarks)) return;

        await axios.post('/api/teachers/marks', {
          studentId,
          subjectCode,
          marks: numMarks,
          grade,
          semester: parseInt(semester),
          enteredBy: 'teacher-1', // In production, get from auth
        });
      });

      await Promise.all(promises);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit marks:', error);
      alert('Failed to submit marks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (value: string) => {
    setSubjectCode(value);
    setStudents(mockStudents); // In production, fetch students enrolled in this subject
  };

  if (submitted) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-6">
        <GlassCard className="text-center max-w-md w-full py-12">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Marks Submitted Successfully!
          </h2>
          <p className="text-slate-400 mb-6">
            All marks have been recorded and verified on blockchain.
          </p>
          <div className="bg-slate-900/50 p-4 rounded-lg text-left text-sm text-slate-300">
            <p><strong>Subject:</strong> {subjects.find(s => s.code === subjectCode)?.name}</p>
            <p><strong>Semester:</strong> {semester}</p>
            <p><strong>Students:</strong> {Object.keys(marks).length}</p>
          </div>
          <Button
            onClick={() => {
              setSubmitted(false);
              setMarks({});
              setSubjectCode('');
              setSemester('');
            }}
            className="mt-6 w-full"
          >
            Enter More Marks
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Enter Student Marks</h2>
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
                Semester
              </label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {subjectCode && semester && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Student Marks</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 text-slate-300">Enrollment No.</th>
                      <th className="text-left py-2 text-slate-300">Student Name</th>
                      <th className="text-left py-2 text-slate-300">Marks (out of 100)</th>
                      <th className="text-left py-2 text-slate-300">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} className="border-b border-slate-800">
                        <td className="py-3 text-slate-300">{student.enrollmentNumber}</td>
                        <td className="py-3 text-white">{student.name}</td>
                        <td className="py-3">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={marks[student.id]?.marks || ''}
                            onChange={(e) => handleMarksChange(student.id, e.target.value)}
                            className="w-20"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-3 text-slate-300">
                          {marks[student.id]?.grade || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !subjectCode || !semester || Object.keys(marks).length === 0}
              className="px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Marks'
              )}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};