/**
 * Type Definitions
 * EduNexus - Indian College ERP & Portal
 * Complete type system for the entire application
 */

// ============================================
// ENUMS
// ============================================

export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  PARENT = 'PARENT',
  HOD = 'HOD',
  PRINCIPAL = 'PRINCIPAL',
  ACCOUNTANT = 'ACCOUNTANT',
  LIBRARIAN = 'LIBRARIAN'
}

export enum AppMode {
  PUBLIC_WEBSITE = 'PUBLIC_WEBSITE',
  LOGIN = 'LOGIN',
  ERP_PORTAL = 'ERP_PORTAL',
  ARCHITECTURE_DOCS = 'ARCHITECTURE_DOCS',
  ADMIN_PANEL = 'ADMIN_PANEL',
  BILLING = 'BILLING'
}

export enum DegreeType {
  DIPLOMA = 'DIPLOMA',
  UNDERGRADUATE = 'UNDERGRADUATE',
  POSTGRADUATE = 'POSTGRADUATE',
  DOCTORATE = 'DOCTORATE',
  CERTIFICATE = 'CERTIFICATE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
  ON_DUTY = 'ON_DUTY'
}

export enum Category {
  GENERAL = 'GENERAL',
  OBC = 'OBC',
  SC = 'SC',
  ST = 'ST',
  EWS = 'EWS',
  PWD = 'PWD'
}

// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// NOTICE & CONTENT TYPES
// ============================================

export interface Notice {
  id: string;
  title: string;
  content?: string;
  date: string;
  category: 'ACADEMIC' | 'ADMIN' | 'EVENT' | 'EXAM' | 'PLACEMENT' | 'FEE' | 'URGENT';
  isNew: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  attachmentUrl?: string;
}

// ============================================
// ACADEMIC TYPES
// ============================================

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  faculty: string;
  semester: number;
  departmentId?: string;
  description?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  fullName: string;
  hodName?: string;
  description?: string;
  totalFaculty?: number;
  totalStudents?: number;
  facilities?: string[];
  imageUrl?: string;
  isActive: boolean;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  fullName: string;
  departmentId: string;
  degreeType: DegreeType;
  durationYears: number;
  totalSemesters: number;
  specialization?: string;
  description: string;
  eligibility: string;
  totalSeats: number;
  availableSeats: number;
  annualFee: number;
  currency: string;
  isActive: boolean;
}

// ============================================
// ADMISSION TYPES
// ============================================

export interface AdmissionFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  dob: string;
  gender?: string;
  aadhaarNumber?: string;
  courseInterest: string;
  marks10th: string;
  marks12th: string;
  board10th?: string;
  board12th?: string;
  address: string;
  state?: string;
  city?: string;
  pincode?: string;
  fatherName?: string;
  motherName?: string;
  guardianPhone?: string;
  category?: Category;
  nationality?: string;
  isDigiLockerVerified?: boolean;
  digiLockerVerificationId?: string;
  photoUrl?: string;
}

export interface AdmissionApplication extends AdmissionFormData {
  id: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WAITLISTED';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
  meritRank?: number;
}

// ============================================
// FEE & PAYMENT TYPES
// ============================================

export interface FeeRecord {
  id: string;
  sem: number;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  description: string;
  paidAmount?: number;
  paidDate?: string;
  receiptNumber?: string;
  breakdown?: FeeBreakdown;
}

export interface FeeBreakdown {
  tuitionFee: number;
  developmentFee: number;
  examFee: number;
  libraryFee: number;
  laboratoryFee: number;
  hostelFee?: number;
  transportFee?: number;
  miscFee: number;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  studentId: string;
  feeId: string;
  amount: number;
  currency: string;
  originalAmount?: number;
  originalCurrency?: string;
  exchangeRate?: number;
  paymentMethod: string;
  status: PaymentStatus;
  description: string;
  receiptNumber?: string;
  receiptUrl?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  studentId: string;
  planId: string;
  planName: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  amountPerCycle: number;
  currency: string;
  nextPaymentDate?: string;
  autoRenew: boolean;
}

// ============================================
// CHAT & COMMUNICATION TYPES
// ============================================

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  isRead?: boolean;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  type: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO';
  size: number;
}

// ============================================
// SEARCH & NAVIGATION TYPES
// ============================================

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'NAVIGATION' | 'FEE' | 'CHAT' | 'NOTICE' | 'COURSE' | 'STUDENT' | 'FACULTY' | 'DOCUMENT';
  action: () => void;
}

// ============================================
// ARCHITECTURE DOCS TYPES
// ============================================

export interface ArchitectureSection {
  id: string;
  title: string;
  content: string;
  type: 'diagram' | 'code' | 'text' | 'schema';
}

// ============================================
// FACULTY TYPES
// ============================================

export interface FacultyProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  education: string;
  imageUrl: string;
  specialization: string;
  email?: string;
  phone?: string;
  experience?: number;
  publications?: number;
  researchAreas?: string[];
  bio?: string;
}

// ============================================
// RESULTS & GRADES TYPES
// ============================================

export interface ExamResult {
  id: string;
  examName: string;
  semester: number;
  subjects: SubjectResult[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  sgpa: number;
  cgpa?: number;
  result: 'PASS' | 'FAIL' | 'COMPARTMENT' | 'ABSENT';
  publishedAt: string;
}

export interface SubjectResult {
  courseId: string;
  courseName: string;
  courseCode: string;
  credits: number;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  gradePoints: number;
  status: 'PASS' | 'FAIL' | 'ABSENT';
}

// ============================================
// PLACEMENT TYPES
// ============================================

export interface PlacementDrive {
  id: string;
  companyName: string;
  companyLogo?: string;
  jobTitle: string;
  packageLPA: number;
  location: string[];
  deadline: string;
  driveDate: string;
  eligibleBranches: string[];
  minCGPA: number;
  description: string;
  isActive: boolean;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface LoginProps {
  onLoginSuccess: (role: UserRole) => void;
  onBack: () => void;
}

export interface ERPPortalProps {
  initialRole?: UserRole;
  onLogout: () => void;
}

export interface PublicWebsiteProps {
  onNavigate: (mode: AppMode) => void;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Theme = 'light' | 'dark' | 'system';

export interface AppConfig {
  theme: Theme;
  language: string;
  currency: string;
}