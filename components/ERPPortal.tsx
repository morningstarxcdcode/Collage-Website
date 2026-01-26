import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_USER, NOTICES } from '../constants';
import { UserRole, FeeRecord, ChatMessage, SearchResult, AppMode, AdmissionApplication } from '../types';
import { useTranslation } from 'react-i18next';
import { getAllApplications, updateApplicationStatus } from '../services/admissionService';
import { 
  LayoutDashboard, 
  QrCode, 
  BookOpen, 
  CreditCard, 
  Bell, 
  User, 
  LogOut,
  FileText,
  CheckCircle,
  Menu,
  X,
  Upload,
  Users,
  BarChart,
  ShieldAlert,
  MessageCircle,
  Search,
  Settings,
  Plus,
  ChevronRight,
  Save,
  Trash2,
  Edit2,
  FileCheck
} from 'lucide-react';
import DigiLockerAdmissionForm from './DigiLockerAdmissionForm';

// --- MOCK DATA FOR ERP ---
const FEES: FeeRecord[] = [
  { id: 'FEE-101', sem: 4, amount: 45000, dueDate: '2024-05-30', status: 'PENDING', description: 'Semester 4 Tuition Fee' },
  { id: 'FEE-102', sem: 4, amount: 5000, dueDate: '2024-05-30', status: 'PENDING', description: 'Exam Fee' },
  { id: 'FEE-099', sem: 3, amount: 48000, dueDate: '2023-12-15', status: 'PAID', description: 'Semester 3 Tuition Fee' },
];

const CHAT_MESSAGES: ChatMessage[] = [
  { id: '1', senderId: 'FAC-01', senderName: 'Prof. Mehta', text: 'Class, please submit the assignment by 5 PM.', timestamp: '10:30 AM', isMine: false },
  { id: '2', senderId: 'STU-01', senderName: 'Me', text: 'Sir, is the handwritten format allowed?', timestamp: '10:32 AM', isMine: true },
  { id: '3', senderId: 'FAC-01', senderName: 'Prof. Mehta', text: 'Yes, just scan and upload PDF.', timestamp: '10:33 AM', isMine: false },
];

const MOCK_STUDENTS = [
    { id: 'STU-001', name: 'Rahul Sharma', dept: 'CS', year: '2nd' },
    { id: 'STU-002', name: 'Priya Patel', dept: 'Mech', year: '3rd' },
    { id: 'STU-003', name: 'Amit Kumar', dept: 'CS', year: '4th' },
    { id: 'STU-004', name: 'Sneha Gupta', dept: 'EC', year: '1st' },
];

const MOCK_COURSES = [
    { id: 'CS-301', name: 'Data Structures', code: 'CS301' },
    { id: 'CS-302', name: 'Operating Systems', code: 'CS302' },
    { id: 'CS-305', name: 'Computer Networks', code: 'CS305' },
];

// --- COMPONENTS ---

const QRCodeMock: React.FC<{value: string}> = ({ value }) => (
  <div className="bg-white p-2 rounded shadow-inner inline-block border-4 border-slate-800">
    <div className="w-48 h-48 bg-slate-900 flex items-center justify-center text-white text-xs text-center p-2 break-all">
       [QR CODE]<br/>{value.substring(0, 20)}...
    </div>
  </div>
);

interface ERPPortalProps {
  initialRole?: UserRole;
  onLogout: () => void;
}

const ERPPortal: React.FC<ERPPortalProps> = ({ initialRole = UserRole.STUDENT, onLogout }) => {
  const { t } = useTranslation();
  // State
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(initialRole);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [attendanceStep, setAttendanceStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chats, setChats] = useState(CHAT_MESSAGES);
  
  // Admission Review State
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    if ((currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.STAFF) && activeTab === 'admission_review') {
      setIsLoadingApps(true);
      getAllApplications().then(apps => {
        setApplications(apps);
        setIsLoadingApps(false);
      });
    }
  }, [activeTab, currentUserRole]);

  const handleAppStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await updateApplicationStatus(id, status);
    // Refresh list
    const apps = await getAllApplications();
    setApplications(apps);
  };

  // --- MENU CONFIG ---
  const getMenuItems = () => {
    const base = [
       { id: 'dashboard', label: t('erp.dashboard'), icon: <LayoutDashboard size={20} /> },
       { id: 'chat', label: t('erp.chat'), icon: <MessageCircle size={20} /> },
    ];
    if (currentUserRole === UserRole.STUDENT) {
      return [
        ...base,
        { id: 'attendance', label: t('erp.attendance'), icon: <QrCode size={20} /> },
        { id: 'lms', label: t('erp.lms'), icon: <BookOpen size={20} /> },
        { id: 'finance', label: t('erp.finance'), icon: <CreditCard size={20} /> },
            { id: 'admission', label: 'Admission Form', icon: <FileText size={20} /> },
      ];
    } else if (currentUserRole === UserRole.FACULTY) {
      return [
        ...base,
        { id: 'courses', label: t('erp.courses'), icon: <BookOpen size={20} /> },
        { id: 'attendance_mgr', label: 'Mark Attendance', icon: <QrCode size={20} /> },
        { id: 'grading', label: t('erp.grading'), icon: <FileText size={20} /> },
      ];
    } else { // ADMIN & STAFF
      return [
        ...base,
        { id: 'users', label: t('erp.users'), icon: <Users size={20} /> },
        { id: 'admission_review', label: 'Admission Applications', icon: <FileCheck size={20} /> },
        { id: 'finance_admin', label: 'Finance Overview', icon: <BarChart size={20} /> },
        { id: 'logs', label: 'Audit Logs', icon: <ShieldAlert size={20} /> },
      ];
    }
  };

  // --- SEARCH LOGIC ---
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // 1. Navigation Search
    getMenuItems().forEach(item => {
        if (item.label.toLowerCase().includes(query)) {
            results.push({
                id: item.id,
                title: item.label,
                subtitle: 'Go to Module',
                type: 'NAVIGATION',
                action: () => { setActiveTab(item.id); setSearchQuery(''); setIsSearchFocused(false); }
            });
        }
    });

    // 2. Notices Search (All Roles)
    NOTICES.forEach(notice => {
        if (notice.title.toLowerCase().includes(query)) {
            results.push({
                id: notice.id,
                title: notice.title,
                subtitle: `Notice • ${notice.date}`,
                type: 'NOTICE',
                action: () => { 
                    setActiveTab('dashboard'); 
                    alert(`Opening Notice: ${notice.title}\n\n${notice.date}`); 
                    setSearchQuery(''); 
                    setIsSearchFocused(false); 
                }
            });
        }
    });

    // 3. Student Specific Search
    if (currentUserRole === UserRole.STUDENT) {
        FEES.forEach(fee => {
            if (fee.description.toLowerCase().includes(query) || fee.amount.toString().includes(query)) {
                results.push({
                    id: fee.id,
                    title: fee.description,
                    subtitle: `₹${fee.amount.toLocaleString()} • ${fee.status}`,
                    type: 'FEE',
                    action: () => { 
                        setActiveTab('finance'); 
                        setSelectedFee(fee); 
                        setShowPaymentModal(true); 
                        setSearchQuery(''); 
                        setIsSearchFocused(false); 
                    }
                });
            }
        });
    }

    // 4. Chat Search (All Roles)
    chats.forEach(chat => {
        if (chat.text.toLowerCase().includes(query) || chat.senderName.toLowerCase().includes(query)) {
            results.push({
                id: chat.id,
                title: chat.senderName,
                subtitle: chat.text,
                type: 'CHAT',
                action: () => { setActiveTab('chat'); setSearchQuery(''); setIsSearchFocused(false); }
            });
        }
    });

    // 5. Admin Specific Search
    if (currentUserRole === UserRole.ADMIN) {
        MOCK_STUDENTS.forEach(stu => {
            if (stu.name.toLowerCase().includes(query) || stu.id.toLowerCase().includes(query)) {
                results.push({
                    id: stu.id,
                    title: stu.name,
                    subtitle: `${stu.id} • ${stu.dept} Dept`,
                    type: 'STUDENT',
                    action: () => { setActiveTab('users'); alert(`Viewing profile for ${stu.name}`); setSearchQuery(''); setIsSearchFocused(false); }
                });
            }
        });
    }

    // 6. Course Search (All Roles)
    MOCK_COURSES.forEach(course => {
        if (course.name.toLowerCase().includes(query) || course.code.toLowerCase().includes(query)) {
             results.push({
                 id: course.id,
                 title: course.name,
                 subtitle: `Course Code: ${course.code}`,
                 type: 'COURSE',
                 action: () => { 
                     setActiveTab(currentUserRole === UserRole.FACULTY ? 'courses' : 'lms'); 
                     setSearchQuery(''); 
                     setIsSearchFocused(false); 
                 }
             });
        }
    });

    return results;
  }, [searchQuery, currentUserRole, chats]);

  // --- RENDERERS ---

  const renderFeeModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><CreditCard size={18} /> Secure Payment</h3>
               <button onClick={() => setShowPaymentModal(false)} className="hover:text-red-400" aria-label="Close payment modal" title="Close">
                  <X size={20} />
               </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-slate-500">Payment for</p>
            <p className="text-lg font-bold text-slate-800">{selectedFee?.description}</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">₹ {selectedFee?.amount.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="space-y-3">
             <div className="border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 border-blue-500 bg-blue-50/50">
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 bg-blue-600"></div>
                <span className="font-medium">Razorpay (Cards/UPI/NetBanking)</span>
             </div>
             <div className="border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                <span className="font-medium">PayU Money</span>
             </div>
          </div>

          <button 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-6 hover:bg-blue-700 transition"
            onClick={() => {
              alert("Redirecting to Razorpay Gateway...");
              setShowPaymentModal(false);
            }}
          >
            Proceed to Pay
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldAlert size={12} />
            Encrypted 256-bit SSL Connection
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    if (currentUserRole === UserRole.ADMIN) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">Total Revenue (YTD)</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">₹ 2.4 Cr</div>
                <div className="text-xs text-green-600 mt-2 flex items-center gap-1"><span className="bg-green-100 p-0.5 rounded">▲ 12%</span> vs last year</div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">Active Students</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">2,450</div>
                <div className="text-xs text-slate-400 mt-2">98% Attendance avg</div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">Faculty Count</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">145</div>
                <div className="text-xs text-slate-400 mt-2">5 Depts</div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">System Health</div>
                <div className="text-2xl font-bold text-green-600 mt-1">99.9%</div>
                <div className="text-xs text-slate-400 mt-2">All services operational</div>
             </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <h3 className="font-bold text-slate-800 mb-4">Recent Audit Logs</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th className="px-4 py-3">Timestamp</th>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3">IP Address</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {[1,2,3,4].map(i => (
                        <tr key={i} className="hover:bg-slate-50">
                           <td className="px-4 py-3 text-slate-500">2024-05-21 10:4{i} AM</td>
                           <td className="px-4 py-3 font-medium">ADMIN_01</td>
                           <td className="px-4 py-3">Updated Fee Structure for Batch 2024</td>
                           <td className="px-4 py-3 text-slate-500">192.168.1.{10+i}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      );
    }
    
    // Default Student/Faculty Dashboard
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">{currentUserRole === UserRole.FACULTY ? 'My Classes Today' : 'Current CGPA'}</div>
            <div className="text-3xl font-bold text-slate-900">{currentUserRole === UserRole.FACULTY ? '4' : '8.75'}</div>
            {currentUserRole === UserRole.STUDENT && <div className="text-xs text-green-600 font-medium mt-2">+0.2 from last sem</div>}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">{currentUserRole === UserRole.FACULTY ? 'Pending Grading' : 'Attendance'}</div>
            <div className="text-3xl font-bold text-slate-900">{currentUserRole === UserRole.FACULTY ? '25' : '92%'}</div>
            <div className="text-xs text-slate-400 mt-2">{currentUserRole === UserRole.FACULTY ? 'Assignments' : 'Total 145/158 Lectures'}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">{currentUserRole === UserRole.FACULTY ? 'Next Salary' : 'Fee Dues'}</div>
            <div className={`text-3xl font-bold ${currentUserRole === UserRole.FACULTY ? 'text-green-600' : 'text-red-600'}`}>
               {currentUserRole === UserRole.FACULTY ? '30th' : '₹ 45,000'}
            </div>
            {currentUserRole === UserRole.STUDENT && <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded mt-2 font-medium">Pay Now</button>}
          </div>
        </div>
        
        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
               <h3 className="font-semibold text-slate-800">Today's Schedule</h3>
               <span className="text-xs font-mono text-slate-500 bg-white border px-2 py-1 rounded">21 MAY 2024</span>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { time: '09:00 AM', subject: 'Data Structures', room: 'LH-101', status: 'completed' },
                { time: '11:00 AM', subject: 'Operating Systems', room: 'LAB-2', status: 'ongoing' },
                { time: '02:00 PM', subject: 'Soft Skills', room: 'AUD-1', status: 'upcoming' },
              ].map((cls, idx) => (
                <div key={idx} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{cls.time}</div>
                    <div className="text-sm text-slate-600">{cls.subject}</div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">{cls.room}</span>
                     {cls.status === 'ongoing' && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    );
  };

  const renderAttendance = () => (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">QR Attendance System</h2>
        <p className="text-slate-500 text-sm mb-8">Secure, location-based attendance marking.</p>

        {attendanceStep === 0 && (
          <div className="space-y-6">
            <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
               <p className="text-sm text-slate-600 mb-4">Click below to generate a secure session token for 'Operating Systems'</p>
               <button 
                 onClick={() => setAttendanceStep(1)}
                 className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
               >
                 Generate My QR
               </button>
            </div>
            <div className="text-xs text-slate-400">
              <p>Note: Your geolocation will be captured for verification.</p>
            </div>
          </div>
        )}

        {attendanceStep === 1 && (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="mb-6 relative">
              <QRCodeMock value={`ATT-2024-${Date.now()}-${MOCK_USER.id}`} />
              <div className="absolute -bottom-2 -right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200 flex items-center gap-1">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Live
              </div>
            </div>
            <p className="text-sm font-mono bg-slate-100 p-2 rounded text-slate-600 mb-6">Token expires in 09:58</p>
            
            <button 
               onClick={() => setAttendanceStep(2)}
               className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium"
            >
              Simulate Faculty Scan
            </button>
          </div>
        )}

        {attendanceStep === 2 && (
          <div className="py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Attendance Marked!</h3>
            <p className="text-slate-500 mt-2">Operating Systems • 11:05 AM</p>
            <button 
              onClick={() => setAttendanceStep(0)}
              className="mt-8 text-blue-600 text-sm font-medium hover:underline"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderLMS = () => (
     <div className="space-y-6">
        {/* Results Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" size={20} /> Examination Results
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 uppercase">Cumulative GPA</div>
                 <div className="text-3xl font-bold text-slate-900">8.75</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 uppercase">Last Sem SGPA</div>
                 <div className="text-2xl font-bold text-slate-700">8.42</div>
              </div>
           </div>
           <button className="mt-4 text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              Download Marksheet (PDF) <X size={12} className="rotate-45" />
           </button>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
           <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">My Courses</h3>
           </div>
           <div className="divide-y divide-slate-100">
              {['Data Structures', 'Operating Systems', 'Computer Networks'].map((course, i) => (
                 <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                          {course.substring(0, 2).toUpperCase()}
                       </div>
                       <div>
                          <h4 className="font-medium text-slate-900">{course}</h4>
                          <p className="text-xs text-slate-500">Prof. Sharma • 4 Credits</p>
                       </div>
                    </div>
                    <button className="px-3 py-1.5 border border-slate-300 rounded text-sm font-medium hover:bg-white hover:border-blue-500 hover:text-blue-600 transition">
                       View Materials
                    </button>
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

  const renderFacultyCourses = () => (
     <div className="space-y-6">
        <div className="flex justify-between items-center">
           <h2 className="text-xl font-bold text-slate-800">Course Management</h2>
           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <Plus size={16} /> Create New
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="font-bold text-lg">CS-302: Operating Systems</h3>
                    <p className="text-sm text-slate-500">B.Tech CS - Sem 4</p>
                 </div>
                 <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">Active</span>
              </div>
              <div className="space-y-2 mb-6">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Enrolled Students</span>
                    <span className="font-medium">64</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Assignments</span>
                    <span className="font-medium">3</span>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center justify-center gap-2">
                    <Upload size={16} /> Upload Lecture
                 </button>
                 <button className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
                    View Class
                 </button>
              </div>
           </div>
        </div>
     </div>
  );

  const renderFacultyAttendance = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">Manual Attendance Entry</h3>
          <p className="text-sm text-slate-500">CS-302 • Operating Systems • 21 May 2024</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
          <Save size={16} /> Save Attendance
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Roll No</th>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_STUDENTS.map((stu) => (
              <tr key={stu.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono">{stu.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{stu.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`att-${stu.id}`} defaultChecked className="text-blue-600 focus:ring-blue-500" /> 
                        <span className="text-green-700 font-medium">Present</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`att-${stu.id}`} className="text-red-600 focus:ring-red-500" />
                        <span className="text-red-700 font-medium">Absent</span>
                     </label>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input type="text" placeholder="Optional" className="border border-slate-300 rounded px-2 py-1 text-xs w-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFacultyGrading = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
         <div>
            <h3 className="font-bold text-slate-800">Student Grading</h3>
            <p className="text-sm text-slate-500">End Semester Evaluation • Spring 2024</p>
         </div>
         <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-2">
            <CheckCircle size={16} /> Publish Results
         </button>
      </div>
      <div className="overflow-x-auto">
         <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
               <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Mid Sem (30)</th>
                  <th className="px-6 py-3">End Sem (50)</th>
                  <th className="px-6 py-3">Internal (20)</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Grade</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_STUDENTS.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-mono">{stu.id}</td>
                     <td className="px-6 py-4 font-medium">{stu.name}</td>
                     <td className="px-6 py-4"><input className="w-16 border rounded p-1 text-center" defaultValue="25" /></td>
                     <td className="px-6 py-4"><input className="w-16 border rounded p-1 text-center" defaultValue="42" /></td>
                     <td className="px-6 py-4"><input className="w-16 border rounded p-1 text-center" defaultValue="18" /></td>
                     <td className="px-6 py-4 font-bold">85</td>
                     <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">A</span></td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );

  const renderAdmissionReview = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Admission Applications</h2>
          <div className="flex gap-2">
             <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium">Export CSV</button>
          </div>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoadingApps ? (
             <div className="p-12 text-center text-slate-500">Loading applications...</div>
          ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                     <tr>
                        <th className="px-6 py-3">Application ID</th>
                        <th className="px-6 py-3">Applicant Name</th>
                        <th className="px-6 py-3">Course</th>
                        <th className="px-6 py-3">12th %</th>
                        <th className="px-6 py-3">Verification</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {applications.map(app => (
                        <tr key={app.id} className="hover:bg-slate-50">
                           <td className="px-6 py-4 font-mono text-slate-500">{app.id}</td>
                           <td className="px-6 py-4 font-medium text-slate-900">
                              {app.firstName} {app.lastName}
                              <div className="text-xs text-slate-500">{app.email}</div>
                           </td>
                           <td className="px-6 py-4">{app.courseInterest}</td>
                           <td className="px-6 py-4 font-mono">{app.marks12th}%</td>
                           <td className="px-6 py-4">
                              {app.isDigiLockerVerified ? (
                                 <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded w-fit border border-green-200">
                                    <CheckCircle size={12} /> DigiLocker
                                 </span>
                              ) : (
                                 <span className="text-xs text-slate-400">Manual</span>
                              )}
                           </td>
                           <td className="px-6 py-4">
                              <span className={`text-xs px-2 py-1 rounded font-bold ${
                                 app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                 app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                 'bg-amber-100 text-amber-700'
                              }`}>
                                 {app.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 flex gap-2">
                              {app.status === 'PENDING' && (
                                 <>
                                    <button 
                                       onClick={() => handleAppStatusUpdate(app.id, 'APPROVED')}
                                       className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Approve"
                                    >
                                       <CheckCircle size={18} />
                                    </button>
                                    <button 
                                       onClick={() => handleAppStatusUpdate(app.id, 'REJECTED')}
                                       className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Reject"
                                    >
                                       <X size={18} />
                                    </button>
                                 </>
                              )}
                              <button className="p-1.5 text-slate-400 hover:text-blue-600" title="View Details">
                                 <FileText size={18} />
                              </button>
                           </td>
                        </tr>
                     ))}
                     {applications.length === 0 && (
                        <tr>
                           <td colSpan={7} className="text-center py-8 text-slate-500">No applications found.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
          )}
       </div>
    </div>
  );

  const renderAdminUserManagement = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">User Management</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
             <Plus size={16} /> Add New User
          </button>
       </div>
       
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
                   <input
                      className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm flex-1 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search by name, ID or email..."
                      aria-label="Search users"
                   />
                   <select className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm outline-none" aria-label="Filter by role">
                <option>All Roles</option>
                <option>Student</option>
                <option>Faculty</option>
                <option>Staff</option>
             </select>
          </div>
          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                   <th className="px-6 py-3">User ID</th>
                   <th className="px-6 py-3">Name</th>
                   <th className="px-6 py-3">Role</th>
                   <th className="px-6 py-3">Department</th>
                   <th className="px-6 py-3">Status</th>
                   <th className="px-6 py-3">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {MOCK_STUDENTS.map(stu => (
                   <tr key={stu.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-slate-500">{stu.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">{stu.name.charAt(0)}</div>
                         {stu.name}
                      </td>
                      <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">STUDENT</span></td>
                      <td className="px-6 py-4">{stu.dept}</td>
                      <td className="px-6 py-4"><span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active</span></td>
                      <td className="px-6 py-4 flex gap-2">
                         <button className="p-1 text-slate-400 hover:text-blue-600" aria-label="Edit user" title="Edit user"><Edit2 size={16} /></button>
                         <button className="p-1 text-slate-400 hover:text-red-600" aria-label="Delete user" title="Delete user"><Trash2 size={16} /></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
          <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
             <span>Showing 4 of 2450 users</span>
             <div className="flex gap-2">
                <button className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50">Previous</button>
                <button className="px-3 py-1 border rounded hover:bg-slate-50">Next</button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderFees = () => (
     <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl flex justify-between items-center">
           <div>
              <p className="text-blue-800 text-sm font-medium">Total Outstanding</p>
              <h2 className="text-3xl font-bold text-blue-900">₹ 50,000</h2>
           </div>
           <div className="text-right">
              <p className="text-xs text-blue-600 mb-1">Due by May 30, 2024</p>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Fee Breakdown</h3>
           </div>
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                 <tr>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {FEES.map(fee => (
                    <tr key={fee.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4 font-medium text-slate-900">{fee.description}</td>
                       <td className="px-6 py-4 text-slate-500">{fee.dueDate}</td>
                       <td className="px-6 py-4 font-mono">₹ {fee.amount.toLocaleString()}</td>
                       <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded font-bold ${
                             fee.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                             {fee.status}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          {fee.status === 'PENDING' && (
                             <button 
                                onClick={() => { setSelectedFee(fee); setShowPaymentModal(true); }}
                                className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-slate-800"
                             >
                                Pay Now
                             </button>
                          )}
                          {fee.status === 'PAID' && (
                             <button className="text-blue-600 hover:underline text-xs">Receipt</button>
                          )}
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
     </div>
  );

  const renderAdmissionForm = () => (
     <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <DigiLockerAdmissionForm
          onSubmit={() => {
            alert('Admission application submitted successfully.');
            setActiveTab('dashboard');
          }}
          onCancel={() => setActiveTab('dashboard')}
        />
     </div>
  );

  const renderChat = () => (
     <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[600px] flex overflow-hidden">
        {/* Chat Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col">
           <div className="p-4 border-b border-slate-200">
              <div className="relative">
                 <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder={t('erp.search_placeholder')}
                   className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500" 
                 />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Groups</div>
              <div className="bg-blue-100 text-blue-800 px-4 py-3 border-l-4 border-blue-600 cursor-pointer">
                 <div className="font-bold text-sm">CS-302 OS Class</div>
                 <div className="text-xs truncate opacity-70">Prof. Mehta: Yes, just scan...</div>
              </div>
              <div className="px-4 py-3 hover:bg-slate-100 cursor-pointer text-slate-600">
                 <div className="font-medium text-sm">Project Team Alpha</div>
                 <div className="text-xs truncate text-slate-400">Rohan: I will push the code.</div>
              </div>
              
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">Direct Messages</div>
              <div className="px-4 py-3 hover:bg-slate-100 cursor-pointer text-slate-600 flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-slate-300"></div>
                 <div>
                    <div className="font-medium text-sm">Amit Kumar</div>
                    <div className="text-xs text-green-600">Online</div>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
           <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">OS</div>
                 <div>
                    <h3 className="font-bold text-slate-800">CS-302 Operating Systems</h3>
                    <p className="text-xs text-slate-500">65 members • 4 online</p>
                 </div>
              </div>
              <Settings size={20} className="text-slate-400 cursor-pointer hover:text-slate-600" />
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {chats.map(msg => (
                 <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[70%]">
                       {!msg.isMine && <div className="text-xs text-slate-500 mb-1 ml-1">{msg.senderName}</div>}
                       <div className={`p-3 rounded-xl text-sm ${
                          msg.isMine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                       }`}>
                          {msg.text}
                       </div>
                       <div className={`text-[10px] text-slate-400 mt-1 ${msg.isMine ? 'text-right' : 'text-left'}`}>{msg.timestamp}</div>
                    </div>
                 </div>
              ))}
           </div>
           
           <div className="p-4 bg-white border-t border-slate-200">
              <form 
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatInput.trim()) return;
                  setChats([...chats, { 
                    id: Date.now().toString(), 
                    senderId: 'ME', 
                    senderName: 'Me', 
                    text: chatInput, 
                    timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
                    isMine: true 
                  }]);
                  setChatInput('');
                }}
              >
                 <button type="button" className="p-2 text-slate-400 hover:text-slate-600" aria-label="Attach file" title="Attach file"><Plus /></button>
                 <input 
                   type="text" 
                   value={chatInput}
                   onChange={e => setChatInput(e.target.value)}
                   className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                   placeholder="Type a message..." 
                 />
                 <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700" aria-label="Send message" title="Send message"><CheckCircle size={18} /></button>
              </form>
           </div>
        </div>
     </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans">
      {showPaymentModal && renderFeeModal()}

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
            <span className="font-bold text-lg text-slate-900">EduNexus ERP</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {getMenuItems().map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <img src={MOCK_USER.avatarUrl} className="w-8 h-8 rounded-full bg-slate-200" alt="User" />
            <div className="flex-1 overflow-hidden">
               <div className="text-sm font-medium text-slate-900 truncate">{currentUserRole === UserRole.STUDENT ? MOCK_USER.name : currentUserRole === UserRole.ADMIN ? 'Administrator' : 'Prof. Sharma'}</div>
               <div className="text-xs text-slate-500 truncate">{currentUserRole}</div>
            </div>
                  <button onClick={onLogout} className="text-slate-400 hover:text-red-500 cursor-pointer" aria-label="Log out" title="Log out">
                     <LogOut size={16} />
                  </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
           <div className="font-bold text-lg">EduNexus ERP</div>
           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             {mobileMenuOpen ? <X /> : <Menu />}
           </button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
           <div className="md:hidden bg-white border-b border-slate-200 absolute top-16 left-0 w-full z-50 shadow-lg">
             {getMenuItems().map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium border-b border-slate-100"
                >
                  {item.icon} {item.label}
                </button>
             ))}
             <button onClick={onLogout} className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600">
                <LogOut size={20} /> Logout
             </button>
           </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           <div className="max-w-6xl mx-auto">
              
              {/* Header with Global Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                 <h1 className="text-2xl font-bold text-slate-900 hidden md:block">
                    {getMenuItems().find(m => m.id === activeTab)?.label || t('erp.dashboard')}
                 </h1>
                 
                 <div className="flex items-center gap-4 flex-1 justify-end">
                    {/* Search Component */}
                    <div className="relative w-full max-w-md group">
                       <div className="relative">
                          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                          <input 
                            type="text" 
                            className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder={t('erp.search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay for click handling
                          />
                       </div>
                       
                       {/* Search Results Dropdown */}
                       {isSearchFocused && searchQuery.trim() && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
                             {searchResults.length > 0 ? (
                                <div className="py-2">
                                   {searchResults.map((result, idx) => (
                                      <div 
                                        key={`${result.type}-${result.id}-${idx}`}
                                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0"
                                        onMouseDown={(e) => { e.preventDefault(); result.action(); }}
                                      >
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                            result.type === 'FEE' ? 'bg-red-100 text-red-600' :
                                            result.type === 'CHAT' ? 'bg-blue-100 text-blue-600' :
                                            result.type === 'NAVIGATION' ? 'bg-slate-100 text-slate-600' :
                                            result.type === 'NOTICE' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-indigo-100 text-indigo-600'
                                         }`}>
                                            {result.type === 'FEE' && <CreditCard size={14} />}
                                            {result.type === 'CHAT' && <MessageCircle size={14} />}
                                            {result.type === 'NAVIGATION' && <ChevronRight size={14} />}
                                            {result.type === 'NOTICE' && <Bell size={14} />}
                                            {(result.type === 'COURSE' || result.type === 'STUDENT') && <BookOpen size={14} />}
                                         </div>
                                         <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-slate-900 truncate">{result.title}</div>
                                            {result.subtitle && <div className="text-xs text-slate-500 truncate">{result.subtitle}</div>}
                                         </div>
                                         <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{result.type}</div>
                                      </div>
                                   ))}
                                </div>
                             ) : (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                   No results found for "{searchQuery}"
                                </div>
                             )}
                          </div>
                       )}
                    </div>

                    {/* Icons */}
                    <div className="flex gap-4 shrink-0">
                       <div className="relative">
                          <button className="p-2 text-slate-500 hover:bg-white rounded-full transition" aria-label="Notifications" title="Notifications"><Bell size={20} /></button>
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-100"></span>
                       </div>
                          <button className="p-2 text-slate-500 hover:bg-white rounded-full transition" aria-label="User profile" title="User profile"><User size={20} /></button>
                    </div>
                 </div>
              </div>

              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'attendance' && renderAttendance()}
              {activeTab === 'finance' && renderFees()}
              {activeTab === 'lms' && renderLMS()}
              {activeTab === 'admission' && renderAdmissionForm()}
              {activeTab === 'courses' && renderFacultyCourses()}
              {activeTab === 'grading' && renderFacultyGrading()}
              {activeTab === 'attendance_mgr' && renderFacultyAttendance()}
              {activeTab === 'admission_review' && renderAdmissionReview()}
              {activeTab === 'chat' && renderChat()}
              {activeTab === 'users' && renderAdminUserManagement()}
              
              {!['dashboard', 'attendance', 'finance', 'lms', 'admission', 'courses', 'chat', 'users', 'grading', 'attendance_mgr', 'admission_review'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                   <LayoutDashboard size={48} className="mb-4 opacity-50" />
                   <p>Module loaded. Content simulated for MVP.</p>
                </div>
              )}
           </div>
        </main>
      </div>
    </div>
  );
};

export default ERPPortal;