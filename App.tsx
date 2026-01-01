import React, { useState } from 'react';
import PublicWebsite from './components/PublicWebsite';
import ERPPortal from './components/ERPPortal';
import ArchitectureView from './components/ArchitectureView';
import Login from './components/Login';
import PaymentPage from './components/PaymentPage';
import { 
  PlacementPage, 
  CampusLifePage, 
  ResearchPage, 
  AlumniPage, 
  GalleryPage, 
  DownloadsPage, 
  NAACPage 
} from './components/CollegePages';
import { 
  AntiRaggingPage, 
  RTIPage, 
  MandatoryDisclosurePage, 
  ContactPage, 
  FAQPage 
} from './components/CompliancePages';
import { 
  AdminDashboard, 
  UserManagement, 
  FeeManagement, 
  AdmissionManagement 
} from './components/AdminPanel';
import { AppMode, UserRole } from './types';
import { 
  Layers, 
  Layout, 
  CreditCard, 
  Users, 
  Briefcase, 
  GraduationCap,
  Building2,
  Image,
  Download,
  Award,
  Shield,
  FileText,
  Phone,
  HelpCircle,
  Settings,
  BookOpen
} from 'lucide-react';
import './services/i18n'; // Initialize i18n

// Extended App Modes for all pages
type ExtendedMode = AppMode | 
  'PLACEMENTS' | 
  'CAMPUS_LIFE' | 
  'RESEARCH' | 
  'ALUMNI' | 
  'GALLERY' | 
  'DOWNLOADS' | 
  'NAAC' | 
  'ANTI_RAGGING' | 
  'RTI' | 
  'MANDATORY_DISCLOSURE' | 
  'CONTACT' | 
  'FAQ' | 
  'PAYMENT' |
  'ADMIN_DASHBOARD' |
  'USER_MANAGEMENT' |
  'FEE_MANAGEMENT' |
  'ADMISSION_MANAGEMENT';

const App: React.FC = () => {
  const [mode, setMode] = useState<ExtendedMode>(AppMode.PUBLIC_WEBSITE);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT);
  const [showQuickNav, setShowQuickNav] = useState(false);

  const handleLoginSuccess = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
      setMode('ADMIN_DASHBOARD');
    } else {
      setMode(AppMode.ERP_PORTAL);
    }
  };

  const handleLogout = () => {
    setMode(AppMode.PUBLIC_WEBSITE);
    setUserRole(UserRole.STUDENT);
  };

  // Navigation items for quick access menu
  const navItems = [
    { mode: AppMode.PUBLIC_WEBSITE, label: 'Home', icon: Layout, color: 'blue' },
    { mode: 'PLACEMENTS' as ExtendedMode, label: 'Placements', icon: Briefcase, color: 'emerald' },
    { mode: 'CAMPUS_LIFE' as ExtendedMode, label: 'Campus Life', icon: Building2, color: 'purple' },
    { mode: 'RESEARCH' as ExtendedMode, label: 'Research', icon: BookOpen, color: 'indigo' },
    { mode: 'ALUMNI' as ExtendedMode, label: 'Alumni', icon: GraduationCap, color: 'amber' },
    { mode: 'GALLERY' as ExtendedMode, label: 'Gallery', icon: Image, color: 'pink' },
    { mode: 'DOWNLOADS' as ExtendedMode, label: 'Downloads', icon: Download, color: 'cyan' },
    { mode: 'NAAC' as ExtendedMode, label: 'NAAC', icon: Award, color: 'teal' },
    { mode: 'ANTI_RAGGING' as ExtendedMode, label: 'Anti-Ragging', icon: Shield, color: 'red' },
    { mode: 'RTI' as ExtendedMode, label: 'RTI', icon: FileText, color: 'violet' },
    { mode: 'MANDATORY_DISCLOSURE' as ExtendedMode, label: 'Disclosure', icon: FileText, color: 'slate' },
    { mode: 'CONTACT' as ExtendedMode, label: 'Contact', icon: Phone, color: 'blue' },
    { mode: 'FAQ' as ExtendedMode, label: 'FAQ', icon: HelpCircle, color: 'purple' },
    { mode: 'PAYMENT' as ExtendedMode, label: 'Payment', icon: CreditCard, color: 'green' },
    { mode: AppMode.ARCHITECTURE_DOCS, label: 'Architecture', icon: Layers, color: 'gray' },
  ];

  const adminNavItems = [
    { mode: 'ADMIN_DASHBOARD' as ExtendedMode, label: 'Dashboard', icon: Layout, color: 'blue' },
    { mode: 'USER_MANAGEMENT' as ExtendedMode, label: 'Users', icon: Users, color: 'emerald' },
    { mode: 'FEE_MANAGEMENT' as ExtendedMode, label: 'Fees', icon: CreditCard, color: 'amber' },
    { mode: 'ADMISSION_MANAGEMENT' as ExtendedMode, label: 'Admissions', icon: FileText, color: 'purple' },
  ];

  // Common header for internal pages
  const PageWrapper: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => setMode(AppMode.PUBLIC_WEBSITE)}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">EduNexus</span>
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMode(AppMode.PUBLIC_WEBSITE)}
                className="px-4 py-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => setMode(AppMode.LOGIN)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Login / Portal
              </button>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );

  return (
    <>
      {/* Quick Navigation Floating Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setShowQuickNav(!showQuickNav)}
          aria-label="Toggle quick navigation"
          title="Toggle quick navigation"
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
          <Settings className={`w-6 h-6 transition-transform ${showQuickNav ? 'rotate-90' : ''}`} />
        </button>
        
        {/* Quick Navigation Panel */}
        {showQuickNav && (
          <div className="absolute bottom-16 right-0 w-80 max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-4">
            <h3 className="font-bold text-slate-900 mb-3">Quick Navigation</h3>
            
            {/* Public Pages */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Public Pages</p>
              <div className="grid grid-cols-3 gap-2">
                {navItems.slice(0, 9).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMode(item.mode);
                      setShowQuickNav(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all hover:bg-slate-50 ${
                      mode === item.mode ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                    <span className="text-xs text-slate-600">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Compliance Pages */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Compliance & Info</p>
              <div className="grid grid-cols-3 gap-2">
                {navItems.slice(9).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMode(item.mode);
                      setShowQuickNav(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all hover:bg-slate-50 ${
                      mode === item.mode ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                    <span className="text-xs text-slate-600">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Section */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Admin Panel</p>
              <div className="grid grid-cols-2 gap-2">
                {adminNavItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMode(item.mode);
                      setShowQuickNav(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl transition-all hover:bg-slate-50 ${
                      mode === item.mode ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                    <span className="text-sm text-slate-600">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Routing */}
      {mode === AppMode.PUBLIC_WEBSITE && <PublicWebsite onNavigate={(m) => setMode(m as ExtendedMode)} />}
      {mode === AppMode.LOGIN && <Login onLoginSuccess={handleLoginSuccess} onBack={() => setMode(AppMode.PUBLIC_WEBSITE)} />}
      {mode === AppMode.ERP_PORTAL && <ERPPortal initialRole={userRole} onLogout={handleLogout} />}
      {mode === AppMode.ARCHITECTURE_DOCS && <ArchitectureView />}
      
      {/* College Pages */}
      {mode === 'PLACEMENTS' && <PageWrapper><PlacementPage /></PageWrapper>}
      {mode === 'CAMPUS_LIFE' && <PageWrapper><CampusLifePage /></PageWrapper>}
      {mode === 'RESEARCH' && <PageWrapper><ResearchPage /></PageWrapper>}
      {mode === 'ALUMNI' && <PageWrapper><AlumniPage /></PageWrapper>}
      {mode === 'GALLERY' && <PageWrapper><GalleryPage /></PageWrapper>}
      {mode === 'DOWNLOADS' && <PageWrapper><DownloadsPage /></PageWrapper>}
      {mode === 'NAAC' && <PageWrapper><NAACPage /></PageWrapper>}
      
      {/* Compliance Pages */}
      {mode === 'ANTI_RAGGING' && <PageWrapper><AntiRaggingPage /></PageWrapper>}
      {mode === 'RTI' && <PageWrapper><RTIPage /></PageWrapper>}
      {mode === 'MANDATORY_DISCLOSURE' && <PageWrapper><MandatoryDisclosurePage /></PageWrapper>}
      {mode === 'CONTACT' && <PageWrapper><ContactPage /></PageWrapper>}
      {mode === 'FAQ' && <PageWrapper><FAQPage /></PageWrapper>}
      
      {/* Payment Page */}
      {mode === 'PAYMENT' && <PaymentPage />}
      
      {/* Admin Panel Pages */}
      {mode === 'ADMIN_DASHBOARD' && <AdminDashboard />}
      {mode === 'USER_MANAGEMENT' && <UserManagement />}
      {mode === 'FEE_MANAGEMENT' && <FeeManagement />}
      {mode === 'ADMISSION_MANAGEMENT' && <AdmissionManagement />}
    </>
  );
};

export default App;