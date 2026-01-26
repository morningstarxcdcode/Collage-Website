import React, { useState, useMemo } from 'react';
import { NOTICES, APP_NAME, FACULTY_MEMBERS } from '../constants';
import { askAdmissionsBot } from '../services/geminiService';
import { submitApplication, getDigiLockerMockData } from '../services/admissionService';
import { BookOpen, GraduationCap, Calendar, MapPin, Send, MessageSquare, Globe, CheckCircle, ChevronRight, Phone, Mail, Award, Users, Target, ArrowRight, ShieldCheck, Loader2, Lock, RefreshCw, X, User } from 'lucide-react';
import { AdmissionFormData, AppMode } from '../types';
import { useTranslation } from 'react-i18next';

interface PublicWebsiteProps {
  onNavigate: (mode: AppMode) => void;
}

type Page = 'HOME' | 'ABOUT' | 'ACADEMICS' | 'ADMISSIONS' | 'FACULTY' | 'CONTACT';

const PublicWebsite: React.FC<PublicWebsiteProps> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [activePage, setActivePage] = useState<Page>('HOME');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'bot', text: string}[]>([
    {role: 'bot', text: 'Namaste! How can I assist you with admissions today?'}
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Dynamic Academic Year Calculation
  const academicYear = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYearShort = (currentYear + 1).toString().slice(-2);
    // If before April, likely applying for current year session start? 
    // Standard Indian Academic year is July-June.
    return `${currentYear}-${nextYearShort}`;
  }, []);

  // Admission Form State
  const [admissionStep, setAdmissionStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  
  // DigiLocker State
  const [isDigiLockerLoading, setIsDigiLockerLoading] = useState(false);
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);

  const initialAdmissionData: AdmissionFormData = {
    firstName: '', lastName: '', email: '', phone: '', dob: '', 
    gender: 'Male', aadhaarNumber: '', courseInterest: 'B.Tech Computer Science', 
    marks10th: '', marks12th: '', address: '', state: '', isDigiLockerVerified: false
  };

  const [admissionData, setAdmissionData] = useState<AdmissionFormData>(initialAdmissionData);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const query = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: query }]);
    setIsTyping(true);
    const response = await askAdmissionsBot(query);
    setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
    setIsTyping(false);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleDigiLockerFetch = async () => {
    setIsDigiLockerLoading(true);
    try {
      // Simulation of Secure DigiLocker API Call
      const verifiedData = await getDigiLockerMockData();
      setAdmissionData(prev => ({
        ...prev,
        ...verifiedData
      }));
      setShowDigiLockerModal(false);
    } catch (e) {
      alert("Failed to fetch from DigiLocker. Please try again or fill manually.");
    } finally {
      setIsDigiLockerLoading(false);
    }
  };

  const handleResetVerification = () => {
    if (confirm("Resetting will clear verified data and allow manual entry. Are you sure?")) {
      setAdmissionData(prev => ({
        ...prev,
        firstName: '', lastName: '', dob: '', gender: 'Male', aadhaarNumber: '', address: '', state: '', marks10th: '', marks12th: '',
        isDigiLockerVerified: false
      }));
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitApplication(admissionData);
      setSubmittedAppId(result.id);
      setAdmissionStep(3);
    } catch (e) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDigiLockerModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
        <div className="bg-[#003865] p-4 flex justify-between items-start">
          <div className="flex items-center gap-3">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/DigiLocker_logo.png/640px-DigiLocker_logo.png" alt="DigiLocker" className="h-8 bg-white rounded px-1" />
             <div>
                <span className="text-white font-bold block text-sm">DigiLocker</span>
                <span className="text-blue-200 text-xs">Government of India</span>
             </div>
          </div>
          <button onClick={() => setShowDigiLockerModal(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">Consent to Share Data</h3>
          <p className="text-sm text-slate-600 mb-6 text-center leading-relaxed">
            By clicking "Allow Access", you authorize <b>EduNexus Institute</b> to access your verified documents from DigiLocker for the purpose of admission application.
          </p>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-sm text-slate-700 space-y-2">
             <p className="font-semibold flex items-center gap-2"><CheckCircle size={14} className="text-green-600" /> Aadhaar Profile (Name, DOB, Gender)</p>
             <p className="font-semibold flex items-center gap-2"><CheckCircle size={14} className="text-green-600" /> Class X Marksheet</p>
             <p className="font-semibold flex items-center gap-2"><CheckCircle size={14} className="text-green-600" /> Class XII Marksheet</p>
          </div>

          {isDigiLockerLoading ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
               <Loader2 className="w-8 h-8 text-[#003865] animate-spin" />
               <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800">Fetching Verified Documents...</p>
                  <p className="text-xs text-slate-500">Please wait while we securely retrieve your data.</p>
               </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button 
                onClick={handleDigiLockerFetch}
                className="w-full bg-[#003865] hover:bg-[#002845] text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                Allow Access & Auto-fill
              </button>
              <button 
                onClick={() => setShowDigiLockerModal(false)}
                className="w-full text-slate-500 hover:bg-slate-50 py-2.5 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          )}
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">
             <ShieldCheck size={12} /> Data is processed under IT Act, 2000 compliant standards.
          </div>
        </div>
      </div>
    </div>
  );

  const VerifiedBadge = () => (
    <span className="absolute right-3 top-3 flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 pointer-events-none">
       <CheckCircle size={12} /> Verified
    </span>
  );

  const renderAdmissionForm = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden my-12 relative">
      {showDigiLockerModal && renderDigiLockerModal()}
      
      <div className="bg-blue-600 p-6 text-white">
        <div className="flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-bold">Online Admission Application {academicYear}</h2>
              <p className="text-blue-100 text-sm mt-1">Application for Bachelor of Technology (B.Tech) & Post Graduate Programs</p>
           </div>
           {admissionData.isDigiLockerVerified && (
              <div className="hidden md:flex flex-col items-end">
                 <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded text-xs font-medium flex items-center gap-2">
                    <ShieldCheck size={14} className="text-green-300" /> Authenticated via DigiLocker
                 </div>
                 <button onClick={handleResetVerification} className="text-blue-200 text-xs hover:text-white mt-1 underline">Reset & Edit</button>
              </div>
           )}
        </div>
        
        <div className="flex items-center mt-8 text-sm">
          <div className={`flex items-center gap-2 ${admissionStep >= 1 ? 'text-white' : 'text-blue-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold ${admissionStep >= 1 ? 'bg-white text-blue-600' : 'border-blue-300'}`}>1</div>
            <span>Personal Details</span>
          </div>
          <div className="w-16 h-0.5 bg-blue-400 mx-3"></div>
          <div className={`flex items-center gap-2 ${admissionStep >= 2 ? 'text-white' : 'text-blue-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold ${admissionStep >= 2 ? 'bg-white text-blue-600' : 'border-blue-300'}`}>2</div>
            <span>Academic Profile</span>
          </div>
          <div className="w-16 h-0.5 bg-blue-400 mx-3"></div>
           <div className={`flex items-center gap-2 ${admissionStep >= 3 ? 'text-white' : 'text-blue-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold ${admissionStep >= 3 ? 'bg-white text-blue-600' : 'border-blue-300'}`}>3</div>
            <span>Review & Status</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {admissionStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            
            {/* DigiLocker Call to Action */}
            {!admissionData.isDigiLockerVerified && (
               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                 <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-sm shrink-0">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/DigiLocker_logo.png/640px-DigiLocker_logo.png" alt="DigiLocker" className="h-8" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900">Fast-Track Verification</h4>
                       <p className="text-sm text-slate-600 mt-1">Connect your DigiLocker account to auto-fill verified details. This speeds up your application processing.</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setShowDigiLockerModal(true)}
                   className="bg-[#003865] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#002845] transition flex items-center gap-2 whitespace-nowrap shadow-lg shadow-blue-900/10"
                 >
                   Fetch from DigiLocker
                 </button>
               </div>
            )}

            <div>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-600" /> Basic Information
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* First Name */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">First Name <span className="text-red-500">*</span></label>
                   <div className="relative">
                     <input 
                       type="text" 
                       readOnly={admissionData.isDigiLockerVerified}
                       className={`w-full border rounded-lg p-2.5 outline-none transition-all ${
                          admissionData.isDigiLockerVerified 
                             ? 'border-green-200 bg-green-50/50 text-slate-700 focus:ring-0 cursor-not-allowed' 
                             : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                       }`}
                       value={admissionData.firstName}
                       onChange={e => setAdmissionData({...admissionData, firstName: e.target.value})}
                     />
                     {admissionData.isDigiLockerVerified && <VerifiedBadge />}
                   </div>
                 </div>

                 {/* Last Name */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                   <div className="relative">
                     <input 
                       type="text" 
                       readOnly={admissionData.isDigiLockerVerified}
                       className={`w-full border rounded-lg p-2.5 outline-none transition-all ${
                          admissionData.isDigiLockerVerified 
                             ? 'border-green-200 bg-green-50/50 text-slate-700 focus:ring-0 cursor-not-allowed' 
                             : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                       }`}
                       value={admissionData.lastName}
                       onChange={e => setAdmissionData({...admissionData, lastName: e.target.value})}
                     />
                     {admissionData.isDigiLockerVerified && <VerifiedBadge />}
                   </div>
                 </div>

                 {/* DOB */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                   <div className="relative">
                     <input 
                       type="date" 
                       readOnly={admissionData.isDigiLockerVerified}
                       className={`w-full border rounded-lg p-2.5 outline-none transition-all ${
                          admissionData.isDigiLockerVerified 
                             ? 'border-green-200 bg-green-50/50 text-slate-700 focus:ring-0 cursor-not-allowed' 
                             : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                       }`}
                       value={admissionData.dob}
                       onChange={e => setAdmissionData({...admissionData, dob: e.target.value})}
                     />
                     {admissionData.isDigiLockerVerified && <VerifiedBadge />}
                   </div>
                 </div>

                 {/* Gender */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Gender <span className="text-red-500">*</span></label>
                   <div className="relative">
                     <select 
                       disabled={admissionData.isDigiLockerVerified}
                       className={`w-full border rounded-lg p-2.5 outline-none transition-all appearance-none ${
                          admissionData.isDigiLockerVerified 
                             ? 'border-green-200 bg-green-50/50 text-slate-700 focus:ring-0 cursor-not-allowed' 
                             : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                       }`}
                       value={admissionData.gender}
                       onChange={e => setAdmissionData({...admissionData, gender: e.target.value})}
                     >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                     </select>
                     {admissionData.isDigiLockerVerified && <VerifiedBadge />}
                   </div>
                 </div>

                 {/* Aadhaar (Masked) */}
                 {admissionData.isDigiLockerVerified && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Aadhaar Number (Masked)</label>
                      <div className="relative">
                        <div className="w-full border border-green-200 bg-green-50/50 rounded-lg p-2.5 flex items-center gap-2 text-slate-700 font-mono tracking-widest">
                           <Lock size={14} className="text-green-600" />
                           {admissionData.aadhaarNumber}
                        </div>
                        <VerifiedBadge />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">We do not store your full Aadhaar number, only the verification token.</p>
                    </div>
                 )}
               </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Phone size={20} className="text-blue-600" /> Contact Details
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="email" 
                        readOnly={admissionData.isDigiLockerVerified}
                        className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 ${admissionData.isDigiLockerVerified ? 'border-green-200 bg-green-50/50 focus:ring-green-500' : 'border-slate-300 focus:ring-blue-500'}`}
                        value={admissionData.email}
                        onChange={e => setAdmissionData({...admissionData, email: e.target.value})}
                      />
                      {admissionData.isDigiLockerVerified && <VerifiedBadge />}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number (+91) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        readOnly={admissionData.isDigiLockerVerified}
                        className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 ${admissionData.isDigiLockerVerified ? 'border-green-200 bg-green-50/50 focus:ring-green-500' : 'border-slate-300 focus:ring-blue-500'}`}
                        value={admissionData.phone}
                        onChange={e => setAdmissionData({...admissionData, phone: e.target.value})}
                      />
                      {admissionData.isDigiLockerVerified && <VerifiedBadge />}
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setAdmissionStep(2)} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30">
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {admissionStep === 2 && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
             <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <BookOpen size={20} className="text-blue-600" /> Program Selection
                </h3>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course Interested In</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={admissionData.courseInterest}
                  onChange={e => setAdmissionData({...admissionData, courseInterest: e.target.value})}
                >
                  <option>B.Tech Computer Science</option>
                  <option>B.Tech Mechanical Engineering</option>
                  <option>B.Tech Electronics & Comm</option>
                  <option>MBA (Finance/HR/Marketing)</option>
                  <option>M.Tech Artificial Intelligence</option>
                </select>
             </div>

             <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <Award size={20} className="text-blue-600" /> Educational Background
                </h3>
                {admissionData.isDigiLockerVerified && (
                   <p className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded mb-4 flex items-center gap-2">
                      <CheckCircle size={16} /> Marks fetched from Central Board (CBSE).
                   </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">10th Standard (%)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          readOnly={admissionData.isDigiLockerVerified}
                          className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 ${admissionData.isDigiLockerVerified ? 'border-green-200 bg-green-50/50 focus:ring-green-500 font-bold text-slate-800' : 'border-slate-300 focus:ring-blue-500'}`}
                          value={admissionData.marks10th}
                          onChange={e => setAdmissionData({...admissionData, marks10th: e.target.value})}
                        />
                        {admissionData.isDigiLockerVerified && <VerifiedBadge />}
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">12th Standard (%)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          readOnly={admissionData.isDigiLockerVerified}
                          className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 ${admissionData.isDigiLockerVerified ? 'border-green-200 bg-green-50/50 focus:ring-green-500 font-bold text-slate-800' : 'border-slate-300 focus:ring-blue-500'}`}
                          value={admissionData.marks12th}
                          onChange={e => setAdmissionData({...admissionData, marks12th: e.target.value})}
                        />
                        {admissionData.isDigiLockerVerified && <VerifiedBadge />}
                      </div>
                  </div>
                </div>
             </div>

             <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <MapPin size={20} className="text-blue-600" /> Permanent Address
                </h3>
                <textarea 
                  className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 ${admissionData.isDigiLockerVerified ? 'border-green-200 bg-green-50/50 focus:ring-green-500' : 'border-slate-300 focus:ring-blue-500'}`}
                  rows={3}
                  readOnly={admissionData.isDigiLockerVerified}
                  value={admissionData.address}
                  onChange={e => setAdmissionData({...admissionData, address: e.target.value})}
                ></textarea>
                {admissionData.isDigiLockerVerified && (
                   <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle size={12} /> Address verified from Aadhaar UIDAI.</p>
                )}
             </div>

             <div className="flex justify-between pt-4">
                <button onClick={() => setAdmissionStep(1)} className="text-slate-600 px-6 py-2 rounded-lg hover:bg-slate-100 font-medium">
                  {t('common.back')}
                </button>
                <button 
                  onClick={handleFinalSubmit} 
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-600/30"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Submitting Application...
                    </>
                  ) : (
                    <>Submit Application <CheckCircle size={18} /></>
                  )}
                </button>
             </div>
           </div>
        )}

        {admissionStep === 3 && (
          <div className="text-center animate-in fade-in zoom-in duration-300 py-12">
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100 border-4 border-white">
                <CheckCircle size={40} />
             </div>
             <h3 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted Successfully!</h3>
             <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
                <p className="text-sm text-slate-500 mb-1">Application Reference ID</p>
                <p className="font-mono font-bold text-xl text-blue-700 tracking-wider mb-4">{submittedAppId}</p>
                <div className="border-t border-slate-200 pt-4">
                   <p className="text-sm text-slate-600">
                     A confirmation email has been sent to <b>{admissionData.email}</b>.
                   </p>
                   {admissionData.isDigiLockerVerified && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-green-700 bg-green-100 py-2 rounded">
                         <ShieldCheck size={14} /> Documents Verified via DigiLocker
                      </div>
                   )}
                </div>
             </div>
             
             <div className="flex justify-center gap-4">
                <button onClick={() => {setAdmissionStep(1); setActivePage('HOME'); setSubmittedAppId(null);}} className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 font-medium transition">
                  Return to Home
                </button>
                <button className="text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 font-medium transition">
                  Download Receipt
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
         <div className="bg-slate-900 text-slate-300 text-xs py-2">
            <div className="container mx-auto px-6 flex justify-between">
               <span>{APP_NAME} | ISO 9001:2015 Certified</span>
               <div className="flex gap-4">
                  <span className="flex items-center gap-1"><Phone size={12} /> +91 98765 43210</span>
                  <span className="flex items-center gap-1"><Mail size={12} /> info@edunexus.ac.in</span>
               </div>
            </div>
         </div>
         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-2xl text-blue-900 cursor-pointer" onClick={() => setActivePage('HOME')}>
               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">EN</div>
               {t('app.name')}
            </div>
            <nav className="hidden md:flex gap-8 font-medium text-slate-600">
               <button onClick={() => setActivePage('HOME')} className={`hover:text-blue-600 transition ${activePage === 'HOME' ? 'text-blue-600' : ''}`}>{t('nav.home')}</button>
               <button onClick={() => setActivePage('ABOUT')} className={`hover:text-blue-600 transition ${activePage === 'ABOUT' ? 'text-blue-600' : ''}`}>{t('nav.about')}</button>
               <button onClick={() => setActivePage('ACADEMICS')} className={`hover:text-blue-600 transition ${activePage === 'ACADEMICS' ? 'text-blue-600' : ''}`}>{t('nav.academics')}</button>
               <button onClick={() => setActivePage('ADMISSIONS')} className={`hover:text-blue-600 transition ${activePage === 'ADMISSIONS' ? 'text-blue-600' : ''}`}>{t('nav.admissions')}</button>
               <button onClick={() => setActivePage('FACULTY')} className={`hover:text-blue-600 transition ${activePage === 'FACULTY' ? 'text-blue-600' : ''}`}>{t('nav.faculty')}</button>
               <button onClick={() => setActivePage('CONTACT')} className={`hover:text-blue-600 transition ${activePage === 'CONTACT' ? 'text-blue-600' : ''}`}>{t('nav.contact')}</button>
            </nav>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1 text-slate-700 text-sm font-semibold border border-slate-300 rounded px-2 py-1">
                  <Globe size={14} />
                  <select 
                    value={i18n.language} 
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="bg-transparent border-none outline-none appearance-none cursor-pointer uppercase"
                  >
                    <option value="en">EN</option>
                    <option value="hi">HI</option>
                  </select>
               </div>
               <button 
                onClick={() => onNavigate(AppMode.LOGIN)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-lg shadow-blue-200"
               >
                 {t('common.login')}
               </button>
            </div>
         </div>
      </header>

      {/* Dynamic Content */}
      {activePage === 'HOME' && (
        <>
          {/* Hero Section */}
          <div className="relative bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-20 bg-cover bg-center"></div>
            <div className="container mx-auto px-6 py-24 relative z-10">
              <div className="max-w-3xl">
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block backdrop-blur-md">
                  {t('hero.tagline')}
                </span>
                <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
                  {t('hero.title_prefix')} <span className="text-blue-400">{t('hero.title_highlight')}</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                  {t('hero.description')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setActivePage('ADMISSIONS')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/50">
                    {t('hero.apply_now')}
                  </button>
                  <button onClick={() => setActivePage('ACADEMICS')} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3 rounded-lg font-semibold transition-all">
                    {t('hero.explore')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats / Info */}
          <section className="bg-blue-600 text-white py-12">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-blue-500">
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100 text-sm uppercase tracking-wide">Courses Offered</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1200+</div>
                <div className="text-blue-100 text-sm uppercase tracking-wide">Placements</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">150</div>
                <div className="text-blue-100 text-sm uppercase tracking-wide">Expert Faculty</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">25 Acres</div>
                <div className="text-blue-100 text-sm uppercase tracking-wide">Green Campus</div>
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* News & Notices */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Latest Notices
                </h3>
                <div className="space-y-4">
                  {NOTICES.map(notice => (
                    <div key={notice.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:border-blue-300 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">{notice.date}</span>
                        {notice.isNew && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">NEW</span>}
                      </div>
                      <h4 className="text-sm font-medium text-slate-800 group-hover:text-blue-600 line-clamp-2">{notice.title}</h4>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 text-sm text-blue-600 font-medium hover:underline">View Archive &rarr;</button>
              </div>
            </div>

            {/* Academic Programs Preview */}
            <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold font-serif mb-8 text-slate-900">Academic Programs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div onClick={() => setActivePage('ACADEMICS')} className="cursor-pointer group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300">
                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Engineering" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">B.Tech / M.Tech</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Computer Science & Engg</h3>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">State-of-the-art labs with AI, Cloud Computing, and Blockchain specializations.</p>
                            <div className="flex items-center text-sm text-slate-500 gap-4">
                                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 4 Years</span>
                                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> 120 Seats</span>
                            </div>
                        </div>
                    </div>

                    <div onClick={() => setActivePage('ACADEMICS')} className="cursor-pointer group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300">
                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Management" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">MBA</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Business Administration</h3>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">Creating future leaders with a focus on Finance, Marketing, and HR management.</p>
                            <div className="flex items-center text-sm text-slate-500 gap-4">
                                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 2 Years</span>
                                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> 60 Seats</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </>
      )}

      {activePage === 'ABOUT' && (
        <div className="container mx-auto px-6 py-12">
           <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-6">About EduNexus</h1>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
                 <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Campus" className="w-full h-64 object-cover" />
                 <div className="p-8">
                    <p className="text-lg text-slate-700 leading-relaxed mb-6">
                       Established in 1995, EduNexus Institute of Technology has emerged as one of India's leading institutions for technical education. Sprawling over a 25-acre lush green campus in Greater Noida, we offer a vibrant environment that fosters innovation, critical thinking, and holistic development.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="bg-slate-50 p-6 rounded-lg">
                          <Target className="w-8 h-8 text-blue-600 mb-4" />
                          <h3 className="font-bold text-slate-900 mb-2">Our Mission</h3>
                          <p className="text-sm text-slate-600">To provide world-class technical education and cultivate ethical leaders who contribute to nation-building.</p>
                       </div>
                       <div className="bg-slate-50 p-6 rounded-lg">
                          <Users className="w-8 h-8 text-blue-600 mb-4" />
                          <h3 className="font-bold text-slate-900 mb-2">Our Vision</h3>
                          <p className="text-sm text-slate-600">To be recognized globally as a center of excellence in research, innovation, and entrepreneurship.</p>
                       </div>
                       <div className="bg-slate-50 p-6 rounded-lg">
                          <Award className="w-8 h-8 text-blue-600 mb-4" />
                          <h3 className="font-bold text-slate-900 mb-2">Accreditation</h3>
                          <p className="text-sm text-slate-600">NAAC 'A+' Grade accredited and NBA accredited for all major B.Tech programs.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activePage === 'ACADEMICS' && (
         <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12 text-center">Academic Programs</h1>
            <div className="space-y-12">
               {/* Undergraduate */}
               <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-blue-600 pl-4">Undergraduate (B.Tech)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {['Computer Science', 'Mechanical Engineering', 'Electronics & Comm.', 'Civil Engineering', 'Information Tech', 'Artificial Intelligence'].map((course, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                           <h3 className="font-bold text-lg mb-2">{course}</h3>
                           <p className="text-sm text-slate-500 mb-4">4 Years • Full Time</p>
                           <button onClick={() => setActivePage('ADMISSIONS')} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">Apply Now <ArrowRight size={14} /></button>
                        </div>
                     ))}
                  </div>
               </div>
               
               {/* Postgraduate */}
               <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-amber-500 pl-4">Postgraduate (M.Tech / MBA)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {['M.Tech in Data Science', 'M.Tech in VLSI', 'MBA (Dual Specialization)', 'M.Tech in Thermal Engg'].map((course, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                           <h3 className="font-bold text-lg mb-2">{course}</h3>
                           <p className="text-sm text-slate-500 mb-4">2 Years • Full Time</p>
                           <button onClick={() => setActivePage('ADMISSIONS')} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">Apply Now <ArrowRight size={14} /></button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {activePage === 'FACULTY' && (
         <div className="container mx-auto px-6 py-12">
            <div className="text-center mb-12">
               <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Meet Our Distinguished Faculty</h1>
               <p className="text-slate-600 max-w-2xl mx-auto">Mentors, researchers, and industry experts guiding the next generation of innovators.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {FACULTY_MEMBERS.map(faculty => (
                  <div key={faculty.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all group">
                     <div className="h-64 overflow-hidden">
                        <img src={faculty.imageUrl} alt={faculty.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>
                     <div className="p-6 text-center">
                        <h3 className="font-bold text-lg text-slate-900">{faculty.name}</h3>
                        <p className="text-blue-600 font-medium text-sm mb-2">{faculty.designation}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-4">{faculty.department}</p>
                        <div className="border-t border-slate-100 pt-4 text-left">
                           <div className="mb-2">
                              <p className="text-xs text-slate-400 font-bold uppercase">Education</p>
                              <p className="text-sm text-slate-700 truncate">{faculty.education}</p>
                           </div>
                           <div>
                              <p className="text-xs text-slate-400 font-bold uppercase">Expertise</p>
                              <p className="text-sm text-slate-700 truncate">{faculty.specialization}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {activePage === 'ADMISSIONS' && (
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Join Our Community of Innovators</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">Fill out the form below to begin your journey with EduNexus. Our admissions team will review your application and contact you within 48 hours.</p>
          </div>
          {renderAdmissionForm()}
        </div>
      )}

      {activePage === 'CONTACT' && (
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-6">Get in Touch</h1>
              <p className="text-slate-600 mb-8">Have questions about admissions, campus life, or placements? Visit us or drop a message.</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><MapPin size={24} /></div>
                  <div>
                    <h3 className="font-bold text-slate-900">Campus Address</h3>
                    <p className="text-slate-600">EduNexus Institute of Technology,<br/>Knowledge Park III, Greater Noida,<br/>Uttar Pradesh - 201306, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Phone size={24} /></div>
                  <div>
                    <h3 className="font-bold text-slate-900">Phone Numbers</h3>
                    <p className="text-slate-600">Admissions: +91 98765 43210</p>
                    <p className="text-slate-600">Admin Office: 0120-4567890</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Mail size={24} /></div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email Us</h3>
                    <p className="text-slate-600">admissions@edunexus.ac.in</p>
                    <p className="text-slate-600">registrar@edunexus.ac.in</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
               <h3 className="text-xl font-bold mb-4">Send us a Message</h3>
               <form className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                     <input type="text" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                     <input type="email" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                     <textarea rows={4} className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="How can we help?"></textarea>
                  </div>
                  <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition">Send Message</button>
               </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen && (
          <button 
            onClick={() => setChatOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg shadow-blue-900/30 transition-transform hover:scale-110 flex items-center justify-center group"
          >
            <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition" />
          </button>
        )}
        
        {chatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 md:w-96 flex flex-col h-[500px] animate-in slide-in-from-bottom-10 fade-in">
            <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h4 className="font-bold">Admissions Assistant</h4>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Powered by Gemini 3 Pro
                </p>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-thin">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-tl-none shadow-sm flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                 </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-200 bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about fees, courses..." 
                  className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                 <MapPin className="w-4 h-4" /> Campus Address
              </h4>
              <p>EduNexus Institute,<br/>Knowledge Park III,<br/>Greater Noida, UP - 201306</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white">Mandatory Disclosure</a></li>
              </ul>
            </div>
            <div>
              <p>&copy; 2024 {APP_NAME}. All rights reserved.</p>
              <p className="mt-2 text-xs">Designed with ❤️ in India.</p>
            </div>
          </div>
      </footer>
    </div>
  );
};

export default PublicWebsite;