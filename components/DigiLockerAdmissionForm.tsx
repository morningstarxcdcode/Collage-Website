import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  X,
  ChevronRight,
  Camera,
  Edit2,
  RefreshCw,
  Download,
  Eye,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  digiLockerService,
  DigiLockerProfile,
  AcademicRecord,
  DigiLockerDocument
} from '../services/digiLockerService';

// Types
interface FormData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  email: string;
  phone: string;
  alternatePhone: string;
  
  // Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  
  // Identity
  aadhaarNumber: string;
  panNumber: string;
  
  // Academic Information
  class10Board: string;
  class10Year: string;
  class10Percentage: string;
  class10School: string;
  
  class12Board: string;
  class12Year: string;
  class12Percentage: string;
  class12School: string;
  class12Stream: string;
  
  // Entrance Exam
  entranceExam: string;
  entranceScore: string;
  entranceRank: string;
  
  // Course Selection
  preferredCourse: string;
  preferredBranch: string;
  
  // Category
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | '';
  isPhysicallyChallenged: boolean;
  
  // Parents Information
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  annualIncome: string;
  
  // Declaration
  declaration: boolean;
}

interface DigiLockerAdmissionFormProps {
  onSubmit?: (formData: FormData, documents: DigiLockerDocument[]) => void;
  onCancel?: () => void;
}

export const DigiLockerAdmissionForm: React.FC<DigiLockerAdmissionFormProps> = ({ onSubmit, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    alternatePhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    aadhaarNumber: '',
    panNumber: '',
    class10Board: '',
    class10Year: '',
    class10Percentage: '',
    class10School: '',
    class12Board: '',
    class12Year: '',
    class12Percentage: '',
    class12School: '',
    class12Stream: '',
    entranceExam: '',
    entranceScore: '',
    entranceRank: '',
    preferredCourse: '',
    preferredBranch: '',
    category: '',
    isPhysicallyChallenged: false,
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    annualIncome: '',
    declaration: false,
  });

  // DigiLocker state
  const [isDigiLockerConnected, setIsDigiLockerConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [digiLockerProfile, setDigiLockerProfile] = useState<DigiLockerProfile | null>(null);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [verifiedDocuments, setVerifiedDocuments] = useState<DigiLockerDocument[]>([]);
  
  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 5;

  // Connect to DigiLocker
  const connectDigiLocker = async () => {
    setIsConnecting(true);
    try {
      const authUrl = await digiLockerService.initiateOAuth();
      // In real implementation, redirect to DigiLocker
      // For demo, simulate successful connection
      setTimeout(() => {
        handleDigiLockerCallback('mock_auth_code');
      }, 2000);
    } catch (error) {
      console.error('DigiLocker connection failed:', error);
      setIsConnecting(false);
    }
  };

  // Handle DigiLocker callback
  const handleDigiLockerCallback = async (code: string) => {
    try {
      await digiLockerService.handleCallback(code);
      setIsDigiLockerConnected(true);
      
      // Fetch profile and documents
      const profile = await digiLockerService.fetchProfile();
      setDigiLockerProfile(profile);
      
      const records = await digiLockerService.fetchAcademicRecords();
      setAcademicRecords(records);
      
      const docs = profile.documents;
      setVerifiedDocuments(docs);
      
      setShowDigiLockerModal(false);
      setIsConnecting(false);
    } catch (error) {
      console.error('DigiLocker callback error:', error);
      setIsConnecting(false);
    }
  };

  // Auto-fill form from DigiLocker
  const autoFillFromDigiLocker = async () => {
    if (!isDigiLockerConnected) return;
    
    setIsAutoFilling(true);
    try {
      const autoFillData = await digiLockerService.getAutoFillData();
      
      setFormData(prev => ({
        ...prev,
        fullName: autoFillData.fullName,
        dateOfBirth: autoFillData.dateOfBirth,
        gender: autoFillData.gender as 'male' | 'female' | 'other',
        email: autoFillData.email || prev.email,
        phone: autoFillData.phone || prev.phone,
        addressLine1: autoFillData.address?.addressLine1 || '',
        addressLine2: autoFillData.address?.addressLine2 || '',
        city: autoFillData.address?.city || '',
        state: autoFillData.address?.state || '',
        pincode: autoFillData.address?.pincode || '',
        aadhaarNumber: autoFillData.aadhaarNumber,
        panNumber: autoFillData.panNumber || '',
        fatherName: autoFillData.fatherName || '',
        motherName: autoFillData.motherName || '',
        class10Board: autoFillData.class10?.board || '',
        class10Year: autoFillData.class10?.year?.toString() || '',
        class10Percentage: autoFillData.class10?.percentage?.toString() || '',
        class10School: autoFillData.class10?.school || '',
        class12Board: autoFillData.class12?.board || '',
        class12Year: autoFillData.class12?.year?.toString() || '',
        class12Percentage: autoFillData.class12?.percentage?.toString() || '',
        class12School: autoFillData.class12?.school || '',
        class12Stream: autoFillData.class12?.subjects?.join(', ') || '',
      }));
    } catch (error) {
      console.error('Auto-fill error:', error);
    } finally {
      setIsAutoFilling(false);
    }
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1: // Personal Information
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        break;
      case 2: // Address
        if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.pincode) newErrors.pincode = 'PIN code is required';
        break;
      case 3: // Academic Information
        if (!formData.class10Board) newErrors.class10Board = 'Class 10 board is required';
        if (!formData.class10Percentage) newErrors.class10Percentage = 'Class 10 percentage is required';
        if (!formData.class12Board) newErrors.class12Board = 'Class 12 board is required';
        if (!formData.class12Percentage) newErrors.class12Percentage = 'Class 12 percentage is required';
        break;
      case 4: // Course Selection
        if (!formData.preferredCourse) newErrors.preferredCourse = 'Course selection is required';
        if (!formData.category) newErrors.category = 'Category is required';
        break;
      case 5: // Declaration
        if (!formData.declaration) newErrors.declaration = 'Declaration is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit?.(formData, verifiedDocuments);
    }
  };

  // Input change handler
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Courses data
  const courses = [
    { id: 'btech', name: 'B.Tech', branches: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'] },
    { id: 'mtech', name: 'M.Tech', branches: ['Computer Science', 'VLSI', 'Structural Engineering', 'Power Systems'] },
    { id: 'mba', name: 'MBA', branches: ['Finance', 'Marketing', 'HR', 'Operations', 'IT'] },
    { id: 'bca', name: 'BCA', branches: ['General'] },
    { id: 'mca', name: 'MCA', branches: ['General'] },
  ];

  const selectedCourse = courses.find(c => c.id === formData.preferredCourse);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admission Application Form</h1>
              <p className="text-slate-600 mt-1">Academic Year 2025-26</p>
            </div>
            
            {/* DigiLocker Integration Button */}
            {!isDigiLockerConnected ? (
              <button
                onClick={() => setShowDigiLockerModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <Shield className="w-5 h-5" />
                Connect DigiLocker
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">DigiLocker Connected</span>
                </div>
                <button
                  onClick={autoFillFromDigiLocker}
                  disabled={isAutoFilling}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isAutoFilling ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                  Auto-Fill Form
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            {[
              { num: 1, label: 'Personal Info' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Academic' },
              { num: 4, label: 'Course' },
              { num: 5, label: 'Review' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep >= step.num 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {currentStep > step.num ? <CheckCircle className="w-5 h-5" /> : step.num}
                </div>
                <span className={`text-xs mt-2 ${currentStep >= step.num ? 'text-blue-600' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h2>
              
              {/* Photo Upload */}
              <div className="flex items-start gap-8 mb-8">
                <div className="w-32 h-40 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center">
                  <Camera className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500">Passport Photo</span>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name (as per documents) *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.fullName ? 'border-red-500' : 'border-slate-200'
                      }`}
                      placeholder="Enter full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.dateOfBirth ? 'border-red-500' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.gender ? 'border-red-500' : 'border-slate-200'
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {/* Identity Documents */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Aadhaar Number
                    {isDigiLockerConnected && (
                      <span className="ml-2 text-green-600 text-xs">✓ Verified via DigiLocker</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Address Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.addressLine1 ? 'border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="House/Flat No., Building Name, Street"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Locality, Landmark"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.state ? 'border-red-500' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Select State</option>
                    {['Andhra Pradesh', 'Karnataka', 'Kerala', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'].map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.pincode ? 'border-red-500' : 'border-slate-200'
                    }`}
                    maxLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Academic Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Academic Information</h2>
              
              {/* Class 10 */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Class 10 (Secondary)
                  {academicRecords.find(r => r.examType === 'class_10') && (
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✓ Verified via DigiLocker
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Board *</label>
                    <select
                      value={formData.class10Board}
                      onChange={(e) => handleInputChange('class10Board', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Year of Passing</label>
                    <input
                      type="text"
                      value={formData.class10Year}
                      onChange={(e) => handleInputChange('class10Year', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2022"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Percentage/CGPA *</label>
                    <input
                      type="text"
                      value={formData.class10Percentage}
                      onChange={(e) => handleInputChange('class10Percentage', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="85%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
                    <input
                      type="text"
                      value={formData.class10School}
                      onChange={(e) => handleInputChange('class10School', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Class 12 */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Class 12 (Senior Secondary)
                  {academicRecords.find(r => r.examType === 'class_12') && (
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✓ Verified via DigiLocker
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Board *</label>
                    <select
                      value={formData.class12Board}
                      onChange={(e) => handleInputChange('class12Board', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ISC</option>
                      <option value="State Board">State Board</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Year of Passing</label>
                    <input
                      type="text"
                      value={formData.class12Year}
                      onChange={(e) => handleInputChange('class12Year', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Percentage/CGPA *</label>
                    <input
                      type="text"
                      value={formData.class12Percentage}
                      onChange={(e) => handleInputChange('class12Percentage', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="82%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stream</label>
                    <select
                      value={formData.class12Stream}
                      onChange={(e) => handleInputChange('class12Stream', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Stream</option>
                      <option value="Science (PCM)">Science (PCM)</option>
                      <option value="Science (PCB)">Science (PCB)</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Entrance Exam */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4">Entrance Examination Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Entrance Exam</label>
                    <select
                      value={formData.entranceExam}
                      onChange={(e) => handleInputChange('entranceExam', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select Exam</option>
                      <option value="JEE Main">JEE Main</option>
                      <option value="JEE Advanced">JEE Advanced</option>
                      <option value="State CET">State CET</option>
                      <option value="GATE">GATE</option>
                      <option value="CAT">CAT</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Score/Percentile</label>
                    <input
                      type="text"
                      value={formData.entranceScore}
                      onChange={(e) => handleInputChange('entranceScore', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="98.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">All India Rank</label>
                    <input
                      type="text"
                      value={formData.entranceRank}
                      onChange={(e) => handleInputChange('entranceRank', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="15000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Course Selection & Category */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Course Selection & Category</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Course *</label>
                  <select
                    value={formData.preferredCourse}
                    onChange={(e) => handleInputChange('preferredCourse', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.preferredCourse ? 'border-red-500' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Branch</label>
                  <select
                    value={formData.preferredBranch}
                    onChange={(e) => handleInputChange('preferredBranch', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedCourse}
                  >
                    <option value="">Select Branch</option>
                    {selectedCourse?.branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.category ? 'border-red-500' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPhysicallyChallenged}
                      onChange={(e) => handleInputChange('isPhysicallyChallenged', e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Physically Challenged (PwD)</span>
                  </label>
                </div>
              </div>

              {/* Parents Information */}
              <div className="bg-slate-50 rounded-xl p-6 mt-8">
                <h3 className="font-bold text-slate-800 mb-4">Parents / Guardian Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Father's Name</label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Father's Occupation</label>
                    <input
                      type="text"
                      value={formData.fatherOccupation}
                      onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mother's Name</label>
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={(e) => handleInputChange('motherName', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mother's Occupation</label>
                    <input
                      type="text"
                      value={formData.motherOccupation}
                      onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Annual Family Income</label>
                  <select
                    value={formData.annualIncome}
                    onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Income Range</option>
                    <option value="Below 1 Lakh">Below ₹1 Lakh</option>
                    <option value="1-3 Lakhs">₹1 - 3 Lakhs</option>
                    <option value="3-5 Lakhs">₹3 - 5 Lakhs</option>
                    <option value="5-8 Lakhs">₹5 - 8 Lakhs</option>
                    <option value="8-10 Lakhs">₹8 - 10 Lakhs</option>
                    <option value="Above 10 Lakhs">Above ₹10 Lakhs</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Declaration */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Review & Submit</h2>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Personal Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-500">Name:</span> <span className="font-medium">{formData.fullName}</span></p>
                    <p><span className="text-slate-500">DOB:</span> <span className="font-medium">{formData.dateOfBirth}</span></p>
                    <p><span className="text-slate-500">Email:</span> <span className="font-medium">{formData.email}</span></p>
                    <p><span className="text-slate-500">Phone:</span> <span className="font-medium">{formData.phone}</span></p>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Academic Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-500">Class 10:</span> <span className="font-medium">{formData.class10Percentage} ({formData.class10Board})</span></p>
                    <p><span className="text-slate-500">Class 12:</span> <span className="font-medium">{formData.class12Percentage} ({formData.class12Board})</span></p>
                    <p><span className="text-slate-500">Entrance:</span> <span className="font-medium">{formData.entranceExam} - {formData.entranceScore}</span></p>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Course Preference</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-500">Course:</span> <span className="font-medium">{courses.find(c => c.id === formData.preferredCourse)?.name}</span></p>
                    <p><span className="text-slate-500">Branch:</span> <span className="font-medium">{formData.preferredBranch || 'Not specified'}</span></p>
                    <p><span className="text-slate-500">Category:</span> <span className="font-medium">{formData.category}</span></p>
                  </div>
                </div>
                
                <div className="bg-amber-50 rounded-xl p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Documents Status</h3>
                  <div className="space-y-2 text-sm">
                    {verifiedDocuments.length > 0 ? (
                      verifiedDocuments.map((doc, idx) => (
                        <p key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{doc.name}</span>
                        </p>
                      ))
                    ) : (
                      <p className="text-slate-500">No verified documents from DigiLocker</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <div className="bg-slate-100 rounded-xl p-6 mt-8">
                <h3 className="font-bold text-slate-800 mb-4">Declaration</h3>
                <div className="bg-white rounded-lg p-4 mb-4 text-sm text-slate-600 max-h-40 overflow-y-auto">
                  <p className="mb-2">I hereby declare that:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>All the information provided by me in this application form is true and correct to the best of my knowledge.</li>
                    <li>I have read and understood the eligibility criteria for the course I am applying for.</li>
                    <li>I understand that any false statement or misrepresentation of facts may lead to cancellation of my admission.</li>
                    <li>I agree to abide by all the rules and regulations of the institution.</li>
                    <li>I authorize the institution to verify my documents and background information.</li>
                  </ol>
                </div>
                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-lg border-2 transition-colors ${
                  formData.declaration ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.declaration}
                    onChange={(e) => handleInputChange('declaration', e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">
                    I have read and agree to the above declaration. I confirm that all information provided is accurate.
                  </span>
                </label>
                {errors.declaration && <p className="text-red-500 text-sm mt-2">{errors.declaration}</p>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={currentStep === 1 ? onCancel : prevStep}
              className="px-6 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Application
              </button>
            )}
          </div>
        </div>

        {/* DigiLocker Connection Modal */}
        {showDigiLockerModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Connect DigiLocker</h2>
                <button onClick={() => setShowDigiLockerModal(false)} className="p-2 hover:bg-slate-100 rounded-lg" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-blue-600" />
                </div>
                <p className="text-slate-600 mb-4">
                  Connect your DigiLocker account to auto-fill verified documents and information directly from government records.
                </p>
                <div className="bg-slate-50 rounded-xl p-4 text-left text-sm">
                  <p className="font-medium text-slate-800 mb-2">Benefits:</p>
                  <ul className="space-y-1 text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Auto-fill personal information</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Verified academic records</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Aadhaar-linked documents</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Faster application processing</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={connectDigiLocker}
                disabled={isConnecting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5" />
                    Connect with DigiLocker
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-slate-500 mt-4">
                Your data is secure and only used for admission purposes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigiLockerAdmissionForm;
