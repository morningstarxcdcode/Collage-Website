import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Calendar,
  Award,
  AlertTriangle
} from 'lucide-react';

interface DepartmentStats {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  averageAttendance: number;
  passPercentage: number;
  revenue: number;
  pendingApprovals: number;
}

interface FacultyMember {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  subjects: string[];
  experience: number;
  qualification: string;
}

export const DepartmentOverview: React.FC = () => {
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production, fetch from backend
    const mockStats: DepartmentStats = {
      totalStudents: 450,
      totalFaculty: 25,
      totalCourses: 12,
      averageAttendance: 87.5,
      passPercentage: 92.3,
      revenue: 1250000,
      pendingApprovals: 8,
    };

    const mockFaculty: FacultyMember[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        department: 'Computer Science',
        designation: 'Professor',
        email: 'sarah.johnson@university.edu',
        phone: '+1-555-0123',
        subjects: ['Data Structures', 'Algorithms'],
        experience: 15,
        qualification: 'PhD Computer Science',
      },
      {
        id: '2',
        name: 'Prof. Michael Chen',
        department: 'Computer Science',
        designation: 'Associate Professor',
        email: 'michael.chen@university.edu',
        phone: '+1-555-0124',
        subjects: ['Database Systems', 'Web Development'],
        experience: 12,
        qualification: 'PhD Information Technology',
      },
      {
        id: '3',
        name: 'Dr. Emily Davis',
        department: 'Computer Science',
        designation: 'Assistant Professor',
        email: 'emily.davis@university.edu',
        phone: '+1-555-0125',
        subjects: ['Machine Learning', 'AI'],
        experience: 8,
        qualification: 'PhD Artificial Intelligence',
      },
    ];

    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      // In production: await axios.get('/api/hod/department/stats');
      setTimeout(() => {
        setStats(mockStats);
        setFaculty(mockFaculty);
        setLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Department Overview</h2>
        <Button variant="outline">Export Report</Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last semester
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalFaculty}</div>
            <p className="text-xs text-muted-foreground">
              5 professors, 12 assistant professors
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Percentage</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.passPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              +5.1% from last semester
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses}</div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{stats?.pendingApprovals}</div>
          </CardContent>
        </Card>
      </div>

      {/* Faculty List */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Faculty Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map(member => (
            <div key={member.id} className="bg-slate-900/50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-medium">{member.name}</h4>
                  <p className="text-slate-400 text-sm">{member.designation}</p>
                </div>
                <Badge variant="secondary">{member.experience} years</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-slate-300 text-sm">Subjects:</p>
                <div className="flex flex-wrap gap-1">
                  {member.subjects.map(subject => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};