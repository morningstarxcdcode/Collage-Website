import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuthService } from '../services/AuthService';
import { DepartmentOverview } from '../features/hod/DepartmentOverview';
import { useState } from 'react';

const HODDashboard: React.FC = () => {
  const { userIdentity } = useAuthService();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'overview' | 'faculty' | 'approvals'>('dashboard');

  if (!userIdentity.isConnected || userIdentity.role !== 'hod') {
    return <div>Please login as HOD.</div>;
  }

  // Render different pages based on currentPage
  if (currentPage === 'overview') {
    return (
      <div>
        <Button
          onClick={() => setCurrentPage('dashboard')}
          variant="outline"
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <DepartmentOverview />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">HOD Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setCurrentPage('overview')}>View Department Stats</Button>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Faculty Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Faculty</Button>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Pending Approvals</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;