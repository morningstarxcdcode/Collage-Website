import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Bell,
  CreditCard,
  FileText,
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Building2,
  Calendar,
  ChevronRight,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Shield,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// ============================================
// ADMIN DASHBOARD
// ============================================

interface AdminStats {
  totalStudents: number;
  totalFaculty: number;
  pendingAdmissions: number;
  pendingFees: number;
  recentApplications: number;
  totalRevenue: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 5280,
    totalFaculty: 350,
    pendingAdmissions: 156,
    pendingFees: 89,
    recentApplications: 432,
    totalRevenue: 15600000,
  });

  const statsCards = [
    { label: 'Total Students', value: stats.totalStudents.toLocaleString(), change: '+12%', icon: GraduationCap, color: 'blue' },
    { label: 'Total Faculty', value: stats.totalFaculty.toString(), change: '+5%', icon: Users, color: 'emerald' },
    { label: 'Pending Admissions', value: stats.pendingAdmissions.toString(), change: '-8%', icon: FileText, color: 'amber' },
    { label: 'Pending Fees', value: stats.pendingFees.toString(), change: '-15%', icon: CreditCard, color: 'rose' },
  ];

  const recentActivities = [
    { action: 'New admission application', user: 'Rahul Sharma', time: '5 mins ago', type: 'admission' },
    { action: 'Fee payment received', user: 'Priya Patel', time: '12 mins ago', type: 'payment' },
    { action: 'Course enrollment', user: 'Amit Kumar', time: '25 mins ago', type: 'course' },
    { action: 'Document uploaded', user: 'Sneha Reddy', time: '1 hour ago', type: 'document' },
    { action: 'Attendance marked', user: 'Dr. Ramesh', time: '2 hours ago', type: 'attendance' },
  ];

  const quickActions = [
    { label: 'Add Student', icon: Plus, color: 'blue' },
    { label: 'Add Faculty', icon: Users, color: 'emerald' },
    { label: 'Create Notice', icon: Bell, color: 'amber' },
    { label: 'Generate Report', icon: BarChart3, color: 'purple' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, Administrator</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              <TrendingUp className={`w-4 h-4 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
              <span className="text-sm text-slate-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                  <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <span className="text-sm font-medium text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Activities</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'payment' ? 'bg-green-100' :
                  activity.type === 'admission' ? 'bg-blue-100' :
                  activity.type === 'course' ? 'bg-purple-100' :
                  activity.type === 'document' ? 'bg-amber-100' :
                  'bg-slate-100'
                }`}>
                  {activity.type === 'payment' && <CreditCard className="w-5 h-5 text-green-600" />}
                  {activity.type === 'admission' && <FileText className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'course' && <BookOpen className="w-5 h-5 text-purple-600" />}
                  {activity.type === 'document' && <Upload className="w-5 h-5 text-amber-600" />}
                  {activity.type === 'attendance' && <CheckCircle className="w-5 h-5 text-slate-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-500">{activity.user}</p>
                </div>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Revenue Overview</h2>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <p className="text-slate-500">Revenue Chart</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">₹1.56 Cr</p>
              <p className="text-sm text-green-600">+18% this quarter</p>
            </div>
          </div>
        </div>

        {/* Enrollment Chart Placeholder */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Enrollment by Department</h2>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <p className="text-slate-500">Department Distribution</p>
              <div className="flex gap-4 justify-center mt-4">
                {[
                  { name: 'CSE', pct: '35%', color: 'bg-blue-500' },
                  { name: 'ECE', pct: '25%', color: 'bg-green-500' },
                  { name: 'ME', pct: '20%', color: 'bg-amber-500' },
                  { name: 'CE', pct: '20%', color: 'bg-purple-500' },
                ].map((dept, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`w-3 h-3 ${dept.color} rounded-full mx-auto mb-1`} />
                    <p className="text-xs text-slate-600">{dept.name}</p>
                    <p className="text-sm font-bold">{dept.pct}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// USER MANAGEMENT
// ============================================

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  avatar: string;
}

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const mockUsers: User[] = [
    { id: '1', name: 'Dr. Ramesh Kumar', email: 'ramesh@edunexus.edu.in', phone: '+91-9876543210', role: 'Faculty', department: 'Computer Science', status: 'active', joinDate: '2020-01-15', avatar: 'https://ui-avatars.com/api/?name=Ramesh+Kumar&background=3b82f6&color=fff' },
    { id: '2', name: 'Priya Sharma', email: 'priya@edunexus.edu.in', phone: '+91-9876543211', role: 'Student', department: 'Computer Science', status: 'active', joinDate: '2023-08-01', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=ec4899&color=fff' },
    { id: '3', name: 'Amit Singh', email: 'amit@edunexus.edu.in', phone: '+91-9876543212', role: 'Student', department: 'Electronics', status: 'pending', joinDate: '2024-01-10', avatar: 'https://ui-avatars.com/api/?name=Amit+Singh&background=10b981&color=fff' },
    { id: '4', name: 'Dr. Sunita Patel', email: 'sunita@edunexus.edu.in', phone: '+91-9876543213', role: 'Faculty', department: 'Mathematics', status: 'active', joinDate: '2019-06-20', avatar: 'https://ui-avatars.com/api/?name=Sunita+Patel&background=f59e0b&color=fff' },
    { id: '5', name: 'Rahul Verma', email: 'rahul@edunexus.edu.in', phone: '+91-9876543214', role: 'Staff', department: 'Administration', status: 'inactive', joinDate: '2021-03-15', avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=8b5cf6&color=fff' },
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage students, faculty, and staff accounts</p>
        </div>
        <button className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by role"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="staff">Staff</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 font-medium text-slate-600">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300"
                    onChange={(e) => setSelectedUsers(e.target.checked ? mockUsers.map(u => u.id) : [])}
                    aria-label="Select all users"
                  />
                </th>
                <th className="text-left p-4 font-medium text-slate-600">User</th>
                <th className="text-left p-4 font-medium text-slate-600">Role</th>
                <th className="text-left p-4 font-medium text-slate-600">Department</th>
                <th className="text-left p-4 font-medium text-slate-600">Status</th>
                <th className="text-left p-4 font-medium text-slate-600">Join Date</th>
                <th className="text-left p-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      aria-label={`Select user ${user.name}`}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'Faculty' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Student' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{user.department}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' :
                      user.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{user.joinDate}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">Showing 1-5 of {mockUsers.length} users</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FEE MANAGEMENT
// ============================================

interface FeeRecord {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  semester: string;
  totalFee: number;
  paid: number;
  due: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
}

export const FeeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockFeeRecords: FeeRecord[] = [
    { id: '1', studentName: 'Priya Sharma', studentId: 'STU001', course: 'B.Tech CSE', semester: '5th', totalFee: 125000, paid: 125000, due: 0, dueDate: '2024-01-15', status: 'paid' },
    { id: '2', studentName: 'Amit Singh', studentId: 'STU002', course: 'B.Tech ECE', semester: '3rd', totalFee: 120000, paid: 60000, due: 60000, dueDate: '2024-02-28', status: 'partial' },
    { id: '3', studentName: 'Rahul Verma', studentId: 'STU003', course: 'MBA', semester: '2nd', totalFee: 200000, paid: 0, due: 200000, dueDate: '2024-01-10', status: 'overdue' },
    { id: '4', studentName: 'Sneha Reddy', studentId: 'STU004', course: 'M.Tech', semester: '1st', totalFee: 150000, paid: 0, due: 150000, dueDate: '2024-03-01', status: 'pending' },
  ];

  const summaryStats = [
    { label: 'Total Collection', value: '₹1.56 Cr', change: '+12%', color: 'green' },
    { label: 'Pending Amount', value: '₹45 Lakhs', change: '-8%', color: 'amber' },
    { label: 'Overdue Amount', value: '₹12 Lakhs', change: '-15%', color: 'red' },
    { label: 'This Month', value: '₹28 Lakhs', change: '+22%', color: 'blue' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Fee Management</h1>
          <p className="text-slate-600 mt-1">Track and manage student fee payments</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            <span className={`text-sm text-${stat.color}-600`}>{stat.change} vs last month</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 font-medium text-slate-600">Student</th>
                <th className="text-left p-4 font-medium text-slate-600">Course</th>
                <th className="text-left p-4 font-medium text-slate-600">Total Fee</th>
                <th className="text-left p-4 font-medium text-slate-600">Paid</th>
                <th className="text-left p-4 font-medium text-slate-600">Due</th>
                <th className="text-left p-4 font-medium text-slate-600">Due Date</th>
                <th className="text-left p-4 font-medium text-slate-600">Status</th>
                <th className="text-left p-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockFeeRecords.map((record) => (
                <tr key={record.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-medium text-slate-900">{record.studentName}</p>
                    <p className="text-sm text-slate-500">{record.studentId}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-700">{record.course}</p>
                    <p className="text-sm text-slate-500">{record.semester} Sem</p>
                  </td>
                  <td className="p-4 font-medium text-slate-900">₹{record.totalFee.toLocaleString()}</td>
                  <td className="p-4 text-green-600 font-medium">₹{record.paid.toLocaleString()}</td>
                  <td className="p-4 text-red-600 font-medium">₹{record.due.toLocaleString()}</td>
                  <td className="p-4 text-slate-600">{record.dueDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      record.status === 'paid' ? 'bg-green-100 text-green-700' :
                      record.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                      record.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg transition-colors" title="Record Payment">
                        <CreditCard className="w-4 h-4 text-green-600" />
                      </button>
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Send Reminder">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ADMISSION MANAGEMENT
// ============================================

interface AdmissionApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  category: string;
  entranceScore: number;
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'waitlisted';
  appliedDate: string;
  documents: string[];
}

export const AdmissionManagement: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockApplications: AdmissionApplication[] = [
    { id: 'APP001', name: 'Rahul Kumar', email: 'rahul@email.com', phone: '+91-9876543210', course: 'B.Tech CSE', category: 'General', entranceScore: 185, status: 'pending', appliedDate: '2024-01-15', documents: ['10th Marksheet', '12th Marksheet', 'Entrance Score Card'] },
    { id: 'APP002', name: 'Priya Singh', email: 'priya@email.com', phone: '+91-9876543211', course: 'B.Tech ECE', category: 'OBC', entranceScore: 172, status: 'under-review', appliedDate: '2024-01-14', documents: ['10th Marksheet', '12th Marksheet', 'Caste Certificate'] },
    { id: 'APP003', name: 'Amit Sharma', email: 'amit@email.com', phone: '+91-9876543212', course: 'MBA', category: 'General', entranceScore: 245, status: 'approved', appliedDate: '2024-01-12', documents: ['Graduation Marksheet', 'CAT Score Card'] },
    { id: 'APP004', name: 'Sneha Patel', email: 'sneha@email.com', phone: '+91-9876543213', course: 'M.Tech', category: 'SC', entranceScore: 520, status: 'waitlisted', appliedDate: '2024-01-10', documents: ['B.Tech Marksheet', 'GATE Score Card', 'Caste Certificate'] },
  ];

  const statusCounts = {
    all: mockApplications.length,
    pending: mockApplications.filter(a => a.status === 'pending').length,
    'under-review': mockApplications.filter(a => a.status === 'under-review').length,
    approved: mockApplications.filter(a => a.status === 'approved').length,
    rejected: mockApplications.filter(a => a.status === 'rejected').length,
    waitlisted: mockApplications.filter(a => a.status === 'waitlisted').length,
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admission Management</h1>
          <p className="text-slate-600 mt-1">Review and process admission applications</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Applications
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="capitalize">{status.replace('-', ' ')}</span>
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">{count}</span>
          </button>
        ))}
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockApplications
          .filter(app => selectedStatus === 'all' || app.status === selectedStatus)
          .map((application) => (
          <div key={application.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{application.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    application.status === 'approved' ? 'bg-green-100 text-green-700' :
                    application.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    application.status === 'under-review' ? 'bg-blue-100 text-blue-700' :
                    application.status === 'waitlisted' ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {application.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{application.id}</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg" aria-label="More options">
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500">Course</p>
                <p className="font-medium text-slate-900">{application.course}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Category</p>
                <p className="font-medium text-slate-900">{application.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Entrance Score</p>
                <p className="font-medium text-slate-900">{application.entranceScore}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Applied On</p>
                <p className="font-medium text-slate-900">{application.appliedDate}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {application.documents.map((doc, idx) => (
                <span key={idx} className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
                  {doc}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <a href={`mailto:${application.email}`} className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600">
                <Mail className="w-4 h-4" />
                {application.email}
              </a>
              <a href={`tel:${application.phone}`} className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600">
                <Phone className="w-4 h-4" />
                {application.phone}
              </a>
            </div>

            {application.status === 'pending' && (
              <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Approve
                </button>
                <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                  Review
                </button>
                <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors">
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default {
  AdminDashboard,
  UserManagement,
  FeeManagement,
  AdmissionManagement
};
