/**
 * Firebase Configuration & Services
 * EduNexus - Indian College ERP & Portal
 * 
 * This module provides complete Firebase integration including:
 * - Authentication (Email, Phone, Google)
 * - Firestore Database
 * - Cloud Storage
 * - Real-time listeners
 */

// Firebase configuration - Using emulator/mock for development
// In production, replace with actual Firebase config
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "edunexus-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "edunexus-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "edunexus-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXX"
};

// Type definitions for our Firebase data structures
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN' | 'STAFF' | 'PARENT';
  createdAt: string;
  lastLoginAt: string;
}

export interface StudentProfile {
  uid: string;
  enrollmentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  aadhaarNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  bloodGroup: string;
  nationality: string;
  category: 'GENERAL' | 'OBC' | 'SC' | 'ST' | 'EWS';
  courseId: string;
  departmentId: string;
  batchYear: number;
  currentSemester: number;
  section: string;
  hostelId?: string;
  isDigiLockerVerified: boolean;
  photoUrl?: string;
  documentsUrl: DocumentRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: 'AADHAAR' | 'PAN' | 'PASSPORT' | 'MARKSHEET_10' | 'MARKSHEET_12' | 'DEGREE' | 'TRANSFER_CERT' | 'MIGRATION_CERT' | 'PHOTO' | 'OTHER';
  url: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  uploadedAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  fullName: string;
  departmentId: string;
  durationYears: number;
  totalSemesters: number;
  degreeType: 'UNDERGRADUATE' | 'POSTGRADUATE' | 'DOCTORATE' | 'DIPLOMA' | 'CERTIFICATE';
  specialization?: string;
  description: string;
  eligibility: string;
  totalSeats: number;
  availableSeats: number;
  annualFee: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  fullName: string;
  hodId?: string;
  hodName?: string;
  description: string;
  establishedYear: number;
  totalFaculty: number;
  totalStudents: number;
  facilities: string[];
  imageUrl?: string;
  isActive: boolean;
}

export interface FeeStructure {
  id: string;
  courseId: string;
  academicYear: string;
  semester: number;
  tuitionFee: number;
  developmentFee: number;
  examFee: number;
  libraryFee: number;
  laboratoryFee: number;
  hostelFee?: number;
  transportFee?: number;
  miscFee: number;
  totalFee: number;
  currency: string;
  dueDate: string;
  lateFeePerDay: number;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  currency: string;
  originalAmount?: number;
  originalCurrency?: string;
  exchangeRate?: number;
  paymentMethod: 'STRIPE' | 'UPI' | 'NETBANKING' | 'CARD' | 'WALLET' | 'CASH' | 'CHEQUE' | 'DD';
  stripePaymentId?: string;
  stripeSessionId?: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  description: string;
  receiptNumber?: string;
  receiptUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  studentId: string;
  courseId: string;
  planId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED' | 'PENDING';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  amountPerCycle: number;
  currency: string;
  totalPaid: number;
  totalDue: number;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  subjectId: string;
  lectureId: string;
  facultyId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  markedAt: string;
  markedBy: string;
  deviceFingerprint?: string;
  geoLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  qrTokenUsed?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'ACADEMIC' | 'ADMIN' | 'EVENT' | 'URGENT' | 'PLACEMENT' | 'EXAM' | 'FEE' | 'HOSTEL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  targetAudience: ('ALL' | 'STUDENTS' | 'FACULTY' | 'STAFF' | 'PARENTS')[];
  departmentIds?: string[];
  attachmentUrls?: string[];
  publishedBy: string;
  publishedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

// ============================================
// MOCK DATABASE - Simulating Firebase Firestore
// ============================================

class MockFirestore {
  private collections: Map<string, Map<string, any>> = new Map();
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor() {
    this.initializeCollections();
  }

  private initializeCollections() {
    // Initialize with sample data
    this.collections.set('users', new Map());
    this.collections.set('students', new Map());
    this.collections.set('faculty', new Map());
    this.collections.set('courses', new Map());
    this.collections.set('departments', new Map());
    this.collections.set('feeStructures', new Map());
    this.collections.set('payments', new Map());
    this.collections.set('subscriptions', new Map());
    this.collections.set('attendance', new Map());
    this.collections.set('notices', new Map());
    this.collections.set('admissions', new Map());
    
    // Seed initial data
    this.seedDepartments();
    this.seedCourses();
    this.seedFeeStructures();
    this.seedNotices();
  }

  private seedDepartments() {
    const departments: Department[] = [
      {
        id: 'dept-cse',
        code: 'CSE',
        name: 'Computer Science',
        fullName: 'Department of Computer Science & Engineering',
        hodName: 'Dr. Arjun Mehta',
        description: 'State-of-the-art labs with AI, Cloud Computing, and Blockchain specializations.',
        establishedYear: 1995,
        totalFaculty: 45,
        totalStudents: 720,
        facilities: ['AI Lab', 'Cloud Computing Lab', 'Cybersecurity Lab', 'IoT Lab', 'Research Center'],
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
        isActive: true
      },
      {
        id: 'dept-mech',
        code: 'MECH',
        name: 'Mechanical Engineering',
        fullName: 'Department of Mechanical Engineering',
        hodName: 'Dr. Vikram Singh',
        description: 'World-class workshops and modern CAD/CAM facilities.',
        establishedYear: 1995,
        totalFaculty: 38,
        totalStudents: 480,
        facilities: ['CAD/CAM Lab', 'Robotics Lab', 'Thermal Lab', 'Material Testing Lab'],
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
        isActive: true
      },
      {
        id: 'dept-ece',
        code: 'ECE',
        name: 'Electronics & Communication',
        fullName: 'Department of Electronics & Communication Engineering',
        hodName: 'Dr. Anita Desai',
        description: 'Advanced VLSI design and communication systems.',
        establishedYear: 1998,
        totalFaculty: 32,
        totalStudents: 420,
        facilities: ['VLSI Lab', 'Communication Lab', 'Embedded Systems Lab', 'Signal Processing Lab'],
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
        isActive: true
      },
      {
        id: 'dept-civil',
        code: 'CIVIL',
        name: 'Civil Engineering',
        fullName: 'Department of Civil Engineering',
        hodName: 'Dr. Rajesh Kumar',
        description: 'Sustainable construction and infrastructure development.',
        establishedYear: 1995,
        totalFaculty: 28,
        totalStudents: 360,
        facilities: ['Surveying Lab', 'Geotechnical Lab', 'Structural Lab', 'Environmental Lab'],
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
        isActive: true
      },
      {
        id: 'dept-mba',
        code: 'MBA',
        name: 'Business Administration',
        fullName: 'School of Business & Management',
        hodName: 'Prof. Sarah Williams',
        description: 'Creating future leaders with a focus on Finance, Marketing, and HR management.',
        establishedYear: 2002,
        totalFaculty: 24,
        totalStudents: 240,
        facilities: ['Bloomberg Terminal', 'SAP Lab', 'Incubation Center', 'Conference Hall'],
        imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600',
        isActive: true
      },
      {
        id: 'dept-it',
        code: 'IT',
        name: 'Information Technology',
        fullName: 'Department of Information Technology',
        hodName: 'Dr. Priya Sharma',
        description: 'Cutting-edge IT infrastructure and software development.',
        establishedYear: 2000,
        totalFaculty: 30,
        totalStudents: 480,
        facilities: ['Software Lab', 'Network Lab', 'Database Lab', 'Web Development Lab'],
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
        isActive: true
      },
      {
        id: 'dept-ai',
        code: 'AIML',
        name: 'AI & Machine Learning',
        fullName: 'Department of Artificial Intelligence & Machine Learning',
        hodName: 'Dr. Sanjay Patel',
        description: 'Next-generation AI research and applications.',
        establishedYear: 2020,
        totalFaculty: 18,
        totalStudents: 180,
        facilities: ['GPU Computing Lab', 'Deep Learning Lab', 'NLP Lab', 'Computer Vision Lab'],
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
        isActive: true
      },
      {
        id: 'dept-biotec',
        code: 'BIOTECH',
        name: 'Biotechnology',
        fullName: 'Department of Biotechnology',
        hodName: 'Dr. Kavitha Menon',
        description: 'Life sciences research and bioinformatics.',
        establishedYear: 2005,
        totalFaculty: 22,
        totalStudents: 240,
        facilities: ['Microbiology Lab', 'Biochemistry Lab', 'Bioinformatics Lab', 'Research Lab'],
        imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600',
        isActive: true
      }
    ];

    departments.forEach(dept => {
      this.collections.get('departments')?.set(dept.id, dept);
    });
  }

  private seedCourses() {
    const courses: Course[] = [
      // B.Tech Courses
      {
        id: 'course-btech-cse',
        code: 'BTech-CSE',
        name: 'B.Tech CSE',
        fullName: 'Bachelor of Technology in Computer Science & Engineering',
        departmentId: 'dept-cse',
        durationYears: 4,
        totalSemesters: 8,
        degreeType: 'UNDERGRADUATE',
        description: 'Comprehensive program covering algorithms, data structures, software engineering, AI/ML, and more.',
        eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 60% marks. Valid JEE Main/State CET score.',
        totalSeats: 180,
        availableSeats: 45,
        annualFee: 175000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'course-btech-it',
        code: 'BTech-IT',
        name: 'B.Tech IT',
        fullName: 'Bachelor of Technology in Information Technology',
        departmentId: 'dept-it',
        durationYears: 4,
        totalSemesters: 8,
        degreeType: 'UNDERGRADUATE',
        description: 'Focus on IT infrastructure, software systems, and enterprise solutions.',
        eligibility: '10+2 with PCM, minimum 55% marks. Valid entrance exam score.',
        totalSeats: 120,
        availableSeats: 32,
        annualFee: 165000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'course-btech-ai',
        code: 'BTech-AIML',
        name: 'B.Tech AI/ML',
        fullName: 'Bachelor of Technology in Artificial Intelligence & Machine Learning',
        departmentId: 'dept-ai',
        durationYears: 4,
        totalSemesters: 8,
        degreeType: 'UNDERGRADUATE',
        specialization: 'Deep Learning, NLP, Computer Vision',
        description: 'Specialized program in AI, Machine Learning, Deep Learning, and Data Science.',
        eligibility: '10+2 with PCM, minimum 65% marks. Strong mathematical aptitude required.',
        totalSeats: 60,
        availableSeats: 15,
        annualFee: 225000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'course-btech-ece',
        code: 'BTech-ECE',
        name: 'B.Tech ECE',
        fullName: 'Bachelor of Technology in Electronics & Communication Engineering',
        departmentId: 'dept-ece',
        durationYears: 4,
        totalSemesters: 8,
        degreeType: 'UNDERGRADUATE',
        description: 'Comprehensive electronics and communication systems curriculum.',
        eligibility: '10+2 with PCM, minimum 55% marks.',
        totalSeats: 120,
        availableSeats: 28,
        annualFee: 160000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'course-btech-mech',
        code: 'BTech-MECH',
        name: 'B.Tech Mechanical',
        fullName: 'Bachelor of Technology in Mechanical Engineering',
        departmentId: 'dept-mech',
        durationYears: 4,
        totalSemesters: 8,
        degreeType: 'UNDERGRADUATE',
        description: 'Design, manufacturing, thermal, and automotive engineering.',
        eligibility: '10+2 with PCM, minimum 55% marks.',
        totalSeats: 120,
        availableSeats: 35,
        annualFee: 155000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'course-btech-civil',
        code: 'BTech-CIVIL',
        name: 'B.Tech Civil',
        fullName: 'Bachelor of Technology in Civil Engineering',
        departmentId: 'dept-civil',
        durationYears: 4,
        totalSemesters: 8,
        degreeType: 'UNDERGRADUATE',
        description: 'Infrastructure, construction, and sustainable development.',
        eligibility: '10+2 with PCM, minimum 50% marks.',
        totalSeats: 90,
        availableSeats: 25,
        annualFee: 145000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'course-btech-biotech',
        code: 'BTech-BIOTECH',
        name: 'B.Tech Biotechnology',
        fullName: 'Bachelor of Technology in Biotechnology',
        departmentId: 'dept-biotec',
        durationYears: 4,
        totalSemesters: 8,
        degreeType: 'UNDERGRADUATE',
        description: 'Life sciences, genetic engineering, and bioinformatics.',
        eligibility: '10+2 with PCM/PCB, minimum 55% marks.',
        totalSeats: 60,
        availableSeats: 18,
        annualFee: 170000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      // M.Tech Courses
      {
        id: 'course-mtech-cse',
        code: 'MTech-CSE',
        name: 'M.Tech CSE',
        fullName: 'Master of Technology in Computer Science & Engineering',
        departmentId: 'dept-cse',
        durationYears: 2,
        totalSemesters: 4,
        degreeType: 'POSTGRADUATE',
        specialization: 'Data Science, Cybersecurity',
        description: 'Advanced research-oriented program in computer science.',
        eligibility: 'B.Tech/BE in CS/IT with minimum 60% marks. Valid GATE score preferred.',
        totalSeats: 30,
        availableSeats: 12,
        annualFee: 145000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'course-mtech-ai',
        code: 'MTech-AI',
        name: 'M.Tech AI',
        fullName: 'Master of Technology in Artificial Intelligence',
        departmentId: 'dept-ai',
        durationYears: 2,
        totalSemesters: 4,
        degreeType: 'POSTGRADUATE',
        specialization: 'Machine Learning, Deep Learning',
        description: 'Advanced AI research and applications.',
        eligibility: 'B.Tech/BE/MCA with strong programming and mathematics background.',
        totalSeats: 24,
        availableSeats: 8,
        annualFee: 195000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      // MBA
      {
        id: 'course-mba',
        code: 'MBA',
        name: 'MBA',
        fullName: 'Master of Business Administration',
        departmentId: 'dept-mba',
        durationYears: 2,
        totalSemesters: 4,
        degreeType: 'POSTGRADUATE',
        specialization: 'Finance, Marketing, HR, Operations',
        description: 'Comprehensive business management program with industry exposure.',
        eligibility: 'Bachelor\'s degree with minimum 50% marks. Valid CAT/MAT/CMAT score.',
        totalSeats: 120,
        availableSeats: 40,
        annualFee: 285000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'course-mba-exec',
        code: 'EMBA',
        name: 'Executive MBA',
        fullName: 'Executive Master of Business Administration',
        departmentId: 'dept-mba',
        durationYears: 2,
        totalSemesters: 4,
        degreeType: 'POSTGRADUATE',
        specialization: 'Strategic Management, Leadership',
        description: 'Weekend program for working professionals.',
        eligibility: 'Bachelor\'s degree with 2+ years work experience.',
        totalSeats: 60,
        availableSeats: 25,
        annualFee: 345000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      // BCA/MCA
      {
        id: 'course-bca',
        code: 'BCA',
        name: 'BCA',
        fullName: 'Bachelor of Computer Applications',
        departmentId: 'dept-cse',
        durationYears: 3,
        totalSemesters: 6,
        degreeType: 'UNDERGRADUATE',
        description: 'Foundation program in computer applications and programming.',
        eligibility: '10+2 with Mathematics, minimum 50% marks.',
        totalSeats: 120,
        availableSeats: 40,
        annualFee: 85000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'course-mca',
        code: 'MCA',
        name: 'MCA',
        fullName: 'Master of Computer Applications',
        departmentId: 'dept-cse',
        durationYears: 2,
        totalSemesters: 4,
        degreeType: 'POSTGRADUATE',
        description: 'Advanced computer applications with specializations.',
        eligibility: 'BCA/B.Sc with Mathematics, minimum 55% marks.',
        totalSeats: 60,
        availableSeats: 22,
        annualFee: 125000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      // PhD Programs
      {
        id: 'course-phd-cse',
        code: 'PhD-CSE',
        name: 'Ph.D. Computer Science',
        fullName: 'Doctor of Philosophy in Computer Science',
        departmentId: 'dept-cse',
        durationYears: 4,
        totalSemesters: 8,
        degreeType: 'DOCTORATE',
        description: 'Research program in computer science.',
        eligibility: 'M.Tech/M.Phil with 60% marks. Valid NET/GATE score.',
        totalSeats: 15,
        availableSeats: 5,
        annualFee: 95000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      // Diploma Programs
      {
        id: 'course-dip-cse',
        code: 'DIP-CSE',
        name: 'Diploma in CSE',
        fullName: 'Diploma in Computer Science & Engineering',
        departmentId: 'dept-cse',
        durationYears: 3,
        totalSemesters: 6,
        degreeType: 'DIPLOMA',
        description: 'Practical-oriented diploma program.',
        eligibility: '10th pass with minimum 45% marks.',
        totalSeats: 60,
        availableSeats: 20,
        annualFee: 45000,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    courses.forEach(course => {
      this.collections.get('courses')?.set(course.id, course);
    });
  }

  private seedFeeStructures() {
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;

    const feeStructures: FeeStructure[] = [
      {
        id: 'fee-btech-cse-sem1',
        courseId: 'course-btech-cse',
        academicYear,
        semester: 1,
        tuitionFee: 150000,
        developmentFee: 10000,
        examFee: 5000,
        libraryFee: 2000,
        laboratoryFee: 5000,
        hostelFee: 60000,
        transportFee: 15000,
        miscFee: 3000,
        totalFee: 250000,
        currency: 'INR',
        dueDate: `${currentYear}-07-15`,
        lateFeePerDay: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: 'fee-btech-ai-sem1',
        courseId: 'course-btech-ai',
        academicYear,
        semester: 1,
        tuitionFee: 200000,
        developmentFee: 12000,
        examFee: 5000,
        libraryFee: 2500,
        laboratoryFee: 8000,
        hostelFee: 65000,
        transportFee: 15000,
        miscFee: 3500,
        totalFee: 311000,
        currency: 'INR',
        dueDate: `${currentYear}-07-15`,
        lateFeePerDay: 150,
        createdAt: new Date().toISOString()
      },
      {
        id: 'fee-mba-sem1',
        courseId: 'course-mba',
        academicYear,
        semester: 1,
        tuitionFee: 250000,
        developmentFee: 15000,
        examFee: 6000,
        libraryFee: 3000,
        laboratoryFee: 5000,
        hostelFee: 70000,
        transportFee: 18000,
        miscFee: 4000,
        totalFee: 371000,
        currency: 'INR',
        dueDate: `${currentYear}-07-15`,
        lateFeePerDay: 200,
        createdAt: new Date().toISOString()
      }
    ];

    feeStructures.forEach(fee => {
      this.collections.get('feeStructures')?.set(fee.id, fee);
    });
  }

  private seedNotices() {
    const notices: Notice[] = [
      {
        id: 'notice-1',
        title: 'Admissions Open for Academic Year 2026-27',
        content: 'Applications are now being accepted for all undergraduate and postgraduate programs. Apply before June 30, 2026 to avail early bird discount.',
        type: 'ADMIN',
        priority: 'HIGH',
        targetAudience: ['ALL'],
        publishedBy: 'Admissions Office',
        publishedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: 'notice-2',
        title: 'End Semester Examination Schedule Released',
        content: 'The detailed schedule for end semester examinations has been released. Please check the examination portal for your personalized timetable.',
        type: 'EXAM',
        priority: 'HIGH',
        targetAudience: ['STUDENTS'],
        publishedBy: 'Controller of Examinations',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        isActive: true
      },
      {
        id: 'notice-3',
        title: 'Campus Placement Drive - Top MNCs Visiting',
        content: 'Major companies including Google, Microsoft, Amazon, and Infosys will be visiting our campus next month. Register on the placement portal.',
        type: 'PLACEMENT',
        priority: 'HIGH',
        targetAudience: ['STUDENTS'],
        departmentIds: ['dept-cse', 'dept-it', 'dept-ece'],
        publishedBy: 'Training & Placement Cell',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        isActive: true
      },
      {
        id: 'notice-4',
        title: 'Fee Payment Deadline Extended',
        content: 'The deadline for semester fee payment has been extended by 15 days. Late fee will not be charged until the new deadline.',
        type: 'FEE',
        priority: 'MEDIUM',
        targetAudience: ['STUDENTS', 'PARENTS'],
        publishedBy: 'Accounts Department',
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        isActive: true
      },
      {
        id: 'notice-5',
        title: 'Annual Tech Fest - TechNova 2026',
        content: 'Register now for TechNova 2026 - the biggest tech fest in the region. Competitions, workshops, and exciting prizes await!',
        type: 'EVENT',
        priority: 'MEDIUM',
        targetAudience: ['ALL'],
        publishedBy: 'Student Council',
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        isActive: true
      },
      {
        id: 'notice-6',
        title: 'Library Working Hours Extended',
        content: 'During examination period, library will remain open 24x7. Students can access all resources including e-journals.',
        type: 'ACADEMIC',
        priority: 'LOW',
        targetAudience: ['STUDENTS', 'FACULTY'],
        publishedBy: 'Central Library',
        publishedAt: new Date(Date.now() - 432000000).toISOString(),
        isActive: true
      }
    ];

    notices.forEach(notice => {
      this.collections.get('notices')?.set(notice.id, notice);
    });
  }

  // CRUD Operations
  async getDocument<T>(collection: string, docId: string): Promise<T | null> {
    await this.simulateNetworkDelay();
    const coll = this.collections.get(collection);
    return coll?.get(docId) || null;
  }

  async getCollection<T>(collection: string): Promise<T[]> {
    await this.simulateNetworkDelay();
    const coll = this.collections.get(collection);
    return coll ? Array.from(coll.values()) : [];
  }

  async setDocument(collection: string, docId: string, data: any): Promise<void> {
    await this.simulateNetworkDelay();
    let coll = this.collections.get(collection);
    if (!coll) {
      coll = new Map();
      this.collections.set(collection, coll);
    }
    coll.set(docId, { ...data, updatedAt: new Date().toISOString() });
    this.notifyListeners(collection);
  }

  async addDocument(collection: string, data: any): Promise<string> {
    await this.simulateNetworkDelay();
    const docId = `${collection}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.setDocument(collection, docId, { ...data, id: docId, createdAt: new Date().toISOString() });
    return docId;
  }

  async updateDocument(collection: string, docId: string, data: Partial<any>): Promise<void> {
    await this.simulateNetworkDelay();
    const coll = this.collections.get(collection);
    if (coll && coll.has(docId)) {
      const existing = coll.get(docId);
      coll.set(docId, { ...existing, ...data, updatedAt: new Date().toISOString() });
      this.notifyListeners(collection);
    }
  }

  async deleteDocument(collection: string, docId: string): Promise<void> {
    await this.simulateNetworkDelay();
    const coll = this.collections.get(collection);
    if (coll) {
      coll.delete(docId);
      this.notifyListeners(collection);
    }
  }

  async query<T>(collection: string, field: string, operator: string, value: any): Promise<T[]> {
    await this.simulateNetworkDelay();
    const coll = this.collections.get(collection);
    if (!coll) return [];

    return Array.from(coll.values()).filter((doc: any) => {
      switch (operator) {
        case '==': return doc[field] === value;
        case '!=': return doc[field] !== value;
        case '>': return doc[field] > value;
        case '<': return doc[field] < value;
        case '>=': return doc[field] >= value;
        case '<=': return doc[field] <= value;
        case 'array-contains': return Array.isArray(doc[field]) && doc[field].includes(value);
        default: return false;
      }
    });
  }

  // Real-time listener simulation
  onSnapshot(collection: string, callback: (data: any[]) => void): () => void {
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, []);
    }
    this.listeners.get(collection)?.push(callback);
    
    // Initial data
    const coll = this.collections.get(collection);
    if (coll) {
      callback(Array.from(coll.values()));
    }

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(collection);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  private notifyListeners(collection: string) {
    const listeners = this.listeners.get(collection);
    const coll = this.collections.get(collection);
    if (listeners && coll) {
      listeners.forEach(callback => callback(Array.from(coll.values())));
    }
  }

  private async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }
}

// ============================================
// MOCK AUTH SERVICE
// ============================================

class MockAuth {
  private currentUser: FirebaseUser | null = null;
  private authListeners: ((user: FirebaseUser | null) => void)[] = [];

  async signInWithEmailPassword(email: string, password: string): Promise<FirebaseUser> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Determine role from email pattern (for demo)
    let role: FirebaseUser['role'] = 'STUDENT';
    if (email.includes('admin')) role = 'ADMIN';
    else if (email.includes('faculty') || email.includes('prof')) role = 'FACULTY';
    else if (email.includes('staff')) role = 'STAFF';
    else if (email.includes('parent')) role = 'PARENT';

    const user: FirebaseUser = {
      uid: `user-${Date.now()}`,
      email,
      displayName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff`,
      phoneNumber: null,
      emailVerified: true,
      role,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    this.currentUser = user;
    this.notifyAuthListeners();
    return user;
  }

  async signInWithPhone(phoneNumber: string, otp: string): Promise<FirebaseUser> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp !== '123456') {
      throw new Error('Invalid OTP');
    }

    const user: FirebaseUser = {
      uid: `user-${Date.now()}`,
      email: null,
      displayName: 'Student User',
      photoURL: null,
      phoneNumber,
      emailVerified: false,
      role: 'STUDENT',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    this.currentUser = user;
    this.notifyAuthListeners();
    return user;
  }

  async signOut(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.currentUser = null;
    this.notifyAuthListeners();
  }

  async sendOTP(phoneNumber: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`OTP sent to ${phoneNumber}: 123456 (for demo)`);
  }

  async resetPassword(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Password reset email sent to ${email}`);
  }

  getCurrentUser(): FirebaseUser | null {
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    this.authListeners.push(callback);
    callback(this.currentUser);
    
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  private notifyAuthListeners() {
    this.authListeners.forEach(callback => callback(this.currentUser));
  }
}

// ============================================
// MOCK STORAGE SERVICE
// ============================================

class MockStorage {
  private files: Map<string, { data: string; metadata: any }> = new Map();

  async uploadFile(path: string, file: File | Blob): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Generate a mock URL
    const url = `https://storage.edunexus.ac.in/${path}?token=${Date.now()}`;
    
    this.files.set(path, {
      data: url,
      metadata: {
        name: path.split('/').pop(),
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }
    });

    return url;
  }

  async getDownloadURL(path: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const file = this.files.get(path);
    if (!file) {
      return `https://storage.edunexus.ac.in/${path}?token=${Date.now()}`;
    }
    return file.data;
  }

  async deleteFile(path: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.files.delete(path);
  }
}

// ============================================
// EXPORTS - Singleton instances
// ============================================

export const db = new MockFirestore();
export const auth = new MockAuth();
export const storage = new MockStorage();

// Helper functions
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
