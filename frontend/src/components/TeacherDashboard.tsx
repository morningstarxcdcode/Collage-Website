import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuthService } from '../services/AuthService';
import { MarksEntry } from '../features/teacher/MarksEntry';
import { AttendanceMarking } from '../features/teacher/AttendanceMarking';
import { TeacherReports } from '../features/teacher/TeacherReports';
import { useState } from 'react';

const TeacherDashboard: React.FC = () => {
  const { userIdentity } = useAuthService();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'marks' | 'attendance' | 'reports'>('dashboard');

  if (!userIdentity.isConnected || userIdentity.role !== 'teacher') {
    return <div>Please login as a teacher.</div>;
  }

  // Render different pages based on currentPage
  if (currentPage === 'marks') {
    return (
      <div>
        <Button
          onClick={() => setCurrentPage('dashboard')}
          variant="outline"
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <MarksEntry />
      </div>
    );
  }

  if (currentPage === 'attendance') {
    return (
      <div>
        <Button
          onClick={() => setCurrentPage('dashboard')}
          variant="outline"
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <AttendanceMarking />
      </div>
    );
  }

  if (currentPage === 'reports') {
    return (
      <div>
        <Button
          onClick={() => setCurrentPage('dashboard')}
          variant="outline"
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <TeacherReports />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Teacher Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Submit Marks</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setCurrentPage('marks')}>Enter Student Marks</Button>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setCurrentPage('attendance')}>Mark Attendance</Button>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setCurrentPage('reports')}>View Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;