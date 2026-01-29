/**
 * DigiLocker Integration Service
 * EduNexus - Indian College ERP & Portal
 * 
 * Features:
 * - Mock DigiLocker OAuth 2.0 flow
 * - Document verification
 * - Auto-fill form data from verified documents
 * - Aadhaar, PAN, Marksheets, Certificates
 */

export interface DigiLockerDocument {
  id: string;
  name: string;
  type: DocumentType;
  issuer: string;
  issueDate: string;
  uri: string;
  isVerified: boolean;
  verificationTimestamp?: string;
}

export type DocumentType = 
  | 'AADHAAR'
  | 'PAN'
  | 'DRIVING_LICENSE'
  | 'VOTER_ID'
  | 'PASSPORT'
  | 'CLASS_10_MARKSHEET'
  | 'CLASS_12_MARKSHEET'
  | 'DEGREE_CERTIFICATE'
  | 'MIGRATION_CERTIFICATE'
  | 'TRANSFER_CERTIFICATE'
  | 'CASTE_CERTIFICATE'
  | 'INCOME_CERTIFICATE'
  | 'DOMICILE_CERTIFICATE';

export interface DigiLockerProfile {
  digiLockerId: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email?: string;
  aadhaarLast4: string;
  maskedAadhaar: string;
  address: DigiLockerAddress;
  photo?: string;
  documents: DigiLockerDocument[];
  eaadharXml?: string;
  isVerified: boolean;
  verificationTimestamp: string;
}

export interface DigiLockerAddress {
  house: string;
  street: string;
  landmark: string;
  locality: string;
  vtc: string; // Village/Town/City
  district: string;
  state: string;
  pincode: string;
  country: string;
  fullAddress: string;
}

export interface AcademicRecord {
  board: string;
  yearOfPassing: number;
  rollNumber: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade?: string;
  cgpa?: number;
  subjects: SubjectRecord[];
  documentUri: string;
  isVerified: boolean;
  examType?: string; // Added for form display
}

export interface SubjectRecord {
  name: string;
  code?: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
}

export interface DigiLockerAutoFillData {
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email?: string;
  aadhaarNumber: string;
  panNumber?: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  fatherName?: string;
  motherName?: string;
  class10?: {
    board: string;
    year: number;
    percentage: number;
    school: string;
  };
  class12?: {
    board: string;
    year: number;
    percentage: number;
    school: string;
    subjects: string[];
  };
  photoUrl?: string;
  isDigiLockerVerified: boolean;
  verificationId: string;
  verifiedAt: string;
}

// DigiLocker OAuth Configuration (Mock)
const DIGILOCKER_CONFIG = {
  clientId: import.meta.env.VITE_DIGILOCKER_CLIENT_ID || 'demo_client_id',
  clientSecret: import.meta.env.VITE_DIGILOCKER_CLIENT_SECRET || 'demo_client_secret',
  redirectUri: import.meta.env.VITE_DIGILOCKER_REDIRECT_URI || 'https://edunexus.ac.in/digilocker/callback',
  authUrl: 'https://digilocker.meity.gov.in/public/oauth2/1/authorize',
  tokenUrl: 'https://digilocker.meity.gov.in/public/oauth2/1/token',
  apiUrl: 'https://digilocker.meity.gov.in/public/oauth2/3'
};

// Mock verified data for demonstration
const MOCK_PROFILES: DigiLockerProfile[] = [
  {
    digiLockerId: 'DL-2024-87654321',
    name: 'Aarav Kumar Patel',
    dob: '2006-08-15',
    gender: 'Male',
    mobile: '9876543210',
    email: 'aarav.patel@email.com',
    aadhaarLast4: '4521',
    maskedAadhaar: 'XXXX-XXXX-4521',
    address: {
      house: 'B-102',
      street: 'Galaxy Towers',
      landmark: 'Near City Mall',
      locality: 'Satellite Road',
      vtc: 'Ahmedabad',
      district: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380015',
      country: 'India',
      fullAddress: 'B-102, Galaxy Towers, Satellite Road, Near City Mall, Ahmedabad, Gujarat - 380015'
    },
    photo: 'https://ui-avatars.com/api/?name=Aarav+Patel&background=3b82f6&color=fff&size=200',
    documents: [
      { id: 'doc-1', name: 'Aadhaar Card', type: 'AADHAAR', issuer: 'UIDAI', issueDate: '2020-01-15', uri: 'aadhaar://aadhaar/XXXX4521', isVerified: true, verificationTimestamp: new Date().toISOString() },
      { id: 'doc-2', name: 'Class X Marksheet', type: 'CLASS_10_MARKSHEET', issuer: 'CBSE', issueDate: '2022-06-15', uri: 'cbse://results/2022/10/12345', isVerified: true, verificationTimestamp: new Date().toISOString() },
      { id: 'doc-3', name: 'Class XII Marksheet', type: 'CLASS_12_MARKSHEET', issuer: 'CBSE', issueDate: '2024-06-20', uri: 'cbse://results/2024/12/12345', isVerified: true, verificationTimestamp: new Date().toISOString() }
    ],
    isVerified: true,
    verificationTimestamp: new Date().toISOString()
  },
  {
    digiLockerId: 'DL-2024-12345678',
    name: 'Priya Sharma',
    dob: '2005-12-20',
    gender: 'Female',
    mobile: '9876543211',
    email: 'priya.sharma@email.com',
    aadhaarLast4: '7890',
    maskedAadhaar: 'XXXX-XXXX-7890',
    address: {
      house: '45-A',
      street: 'MG Road',
      landmark: 'Opposite Central Park',
      locality: 'Civil Lines',
      vtc: 'New Delhi',
      district: 'Central Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India',
      fullAddress: '45-A, MG Road, Civil Lines, Opposite Central Park, New Delhi - 110001'
    },
    photo: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=ec4899&color=fff&size=200',
    documents: [
      { id: 'doc-1', name: 'Aadhaar Card', type: 'AADHAAR', issuer: 'UIDAI', issueDate: '2019-05-20', uri: 'aadhaar://aadhaar/XXXX7890', isVerified: true },
      { id: 'doc-2', name: 'Class X Marksheet', type: 'CLASS_10_MARKSHEET', issuer: 'CBSE', issueDate: '2021-06-10', uri: 'cbse://results/2021/10/67890', isVerified: true },
      { id: 'doc-3', name: 'Class XII Marksheet', type: 'CLASS_12_MARKSHEET', issuer: 'CBSE', issueDate: '2023-06-15', uri: 'cbse://results/2023/12/67890', isVerified: true },
      { id: 'doc-4', name: 'Caste Certificate', type: 'CASTE_CERTIFICATE', issuer: 'Revenue Dept, Delhi', issueDate: '2023-08-01', uri: 'delhi://caste/2023/12345', isVerified: true }
    ],
    isVerified: true,
    verificationTimestamp: new Date().toISOString()
  }
];

// Mock academic records
const MOCK_ACADEMIC_RECORDS: Record<string, { class10?: AcademicRecord; class12?: AcademicRecord }> = {
  'DL-2024-87654321': {
    class10: {
      board: 'Central Board of Secondary Education (CBSE)',
      yearOfPassing: 2022,
      rollNumber: '12345678',
      totalMarks: 471,
      maxMarks: 500,
      percentage: 94.2,
      grade: 'A1',
      subjects: [
        { name: 'English', code: '184', marksObtained: 95, maxMarks: 100, grade: 'A1' },
        { name: 'Hindi', code: '002', marksObtained: 92, maxMarks: 100, grade: 'A1' },
        { name: 'Mathematics', code: '041', marksObtained: 98, maxMarks: 100, grade: 'A1' },
        { name: 'Science', code: '086', marksObtained: 94, maxMarks: 100, grade: 'A1' },
        { name: 'Social Science', code: '087', marksObtained: 92, maxMarks: 100, grade: 'A1' }
      ],
      documentUri: 'cbse://results/2022/10/12345',
      isVerified: true
    },
    class12: {
      board: 'Central Board of Secondary Education (CBSE)',
      yearOfPassing: 2024,
      rollNumber: '87654321',
      totalMarks: 457,
      maxMarks: 500,
      percentage: 91.4,
      grade: 'A1',
      subjects: [
        { name: 'English Core', code: '301', marksObtained: 88, maxMarks: 100, grade: 'A2' },
        { name: 'Physics', code: '042', marksObtained: 92, maxMarks: 100, grade: 'A1' },
        { name: 'Chemistry', code: '043', marksObtained: 89, maxMarks: 100, grade: 'A2' },
        { name: 'Mathematics', code: '041', marksObtained: 95, maxMarks: 100, grade: 'A1' },
        { name: 'Computer Science', code: '083', marksObtained: 93, maxMarks: 100, grade: 'A1' }
      ],
      documentUri: 'cbse://results/2024/12/87654321',
      isVerified: true
    }
  },
  'DL-2024-12345678': {
    class10: {
      board: 'Central Board of Secondary Education (CBSE)',
      yearOfPassing: 2021,
      rollNumber: '67890123',
      totalMarks: 465,
      maxMarks: 500,
      percentage: 93.0,
      grade: 'A1',
      subjects: [
        { name: 'English', code: '184', marksObtained: 94, maxMarks: 100, grade: 'A1' },
        { name: 'Hindi', code: '002', marksObtained: 90, maxMarks: 100, grade: 'A1' },
        { name: 'Mathematics', code: '041', marksObtained: 96, maxMarks: 100, grade: 'A1' },
        { name: 'Science', code: '086', marksObtained: 92, maxMarks: 100, grade: 'A1' },
        { name: 'Social Science', code: '087', marksObtained: 93, maxMarks: 100, grade: 'A1' }
      ],
      documentUri: 'cbse://results/2021/10/67890',
      isVerified: true
    },
    class12: {
      board: 'Central Board of Secondary Education (CBSE)',
      yearOfPassing: 2023,
      rollNumber: '32109876',
      totalMarks: 475,
      maxMarks: 500,
      percentage: 95.0,
      grade: 'A1',
      subjects: [
        { name: 'English Core', code: '301', marksObtained: 92, maxMarks: 100, grade: 'A1' },
        { name: 'Physics', code: '042', marksObtained: 96, maxMarks: 100, grade: 'A1' },
        { name: 'Chemistry', code: '043', marksObtained: 94, maxMarks: 100, grade: 'A1' },
        { name: 'Mathematics', code: '041', marksObtained: 98, maxMarks: 100, grade: 'A1' },
        { name: 'Biology', code: '044', marksObtained: 95, maxMarks: 100, grade: 'A1' }
      ],
      documentUri: 'cbse://results/2023/12/32109876',
      isVerified: true
    }
  }
};

class DigiLockerService {
  private currentSession: { accessToken: string; profile: DigiLockerProfile } | null = null;

  /**
   * Initiate DigiLocker OAuth flow
   * In production, this would redirect to DigiLocker's authorization page
   */
  initiateOAuth(): string {
    const state = this.generateState();
    const authUrl = `${DIGILOCKER_CONFIG.authUrl}?` +
      `response_type=code&` +
      `client_id=${DIGILOCKER_CONFIG.clientId}&` +
      `redirect_uri=${encodeURIComponent(DIGILOCKER_CONFIG.redirectUri)}&` +
      `state=${state}&` +
      `scope=openid`;
    
    // Store state for verification
    sessionStorage.setItem('digilocker_state', state);
    
    return authUrl;
  }

  /**
   * Simulate OAuth callback and token exchange
   * In production, this would exchange the authorization code for tokens
   */
  async handleCallback(code: string, state?: string): Promise<DigiLockerProfile> {
    // Verify state if provided
    if (state) {
      const storedState = sessionStorage.getItem('digilocker_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter. Possible CSRF attack.');
      }
    }

    await this.simulateApiDelay(1500);

    // Simulate token exchange
    const accessToken = `dl_access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get random mock profile
    const profile = MOCK_PROFILES[Math.floor(Math.random() * MOCK_PROFILES.length)];
    
    this.currentSession = { accessToken, profile };
    
    return profile;
  }

  /**
   * Fetch user profile from DigiLocker
   * Simulates the real API call
   */
  async fetchProfile(): Promise<DigiLockerProfile> {
    await this.simulateApiDelay(2000);
    
    // Return a random mock profile for demo
    const profileIndex = Math.floor(Math.random() * MOCK_PROFILES.length);
    const profile = { ...MOCK_PROFILES[profileIndex] };
    
    this.currentSession = {
      accessToken: `dl_demo_${Date.now()}`,
      profile
    };

    return profile;
  }

  /**
   * Get auto-fill data from DigiLocker profile
   * This transforms DigiLocker data into our admission form format
   */
  async getAutoFillData(): Promise<DigiLockerAutoFillData> {
    await this.simulateApiDelay(2500);
    
    // Get a random profile for demo
    const profileIndex = Math.floor(Math.random() * MOCK_PROFILES.length);
    const profile = MOCK_PROFILES[profileIndex];
    const academicRecords = MOCK_ACADEMIC_RECORDS[profile.digiLockerId];

    // Parse name into parts
    const nameParts = profile.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : undefined;

    return {
      firstName,
      middleName,
      lastName,
      fullName: profile.name,
      dateOfBirth: profile.dob,
      gender: profile.gender,
      phone: profile.mobile,
      email: profile.email,
      aadhaarNumber: profile.maskedAadhaar,
      panNumber: 'XXXXX0000X', // Mock PAN
      address: {
        addressLine1: profile.address.fullAddress,
        addressLine2: '',
        city: profile.address.vtc,
        state: profile.address.state,
        pincode: profile.address.pincode,
        country: profile.address.country
      },
      class10: academicRecords?.class10 ? {
        board: academicRecords.class10.board,
        year: academicRecords.class10.yearOfPassing,
        percentage: academicRecords.class10.percentage,
        school: 'Mock School 10th'
      } : undefined,
      class12: academicRecords?.class12 ? {
        board: academicRecords.class12.board,
        year: academicRecords.class12.yearOfPassing,
        percentage: academicRecords.class12.percentage,
        school: 'Mock School 12th',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'English']
      } : undefined,
      photoUrl: profile.photo,
      isDigiLockerVerified: true,
      verificationId: `DLV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      verifiedAt: new Date().toISOString()
    };
  }

  /**
   * Fetch specific document from DigiLocker
   */
  async fetchDocument(documentType: DocumentType): Promise<DigiLockerDocument | null> {
    await this.simulateApiDelay(1000);

    if (!this.currentSession) {
      throw new Error('Not authenticated with DigiLocker');
    }

    const document = this.currentSession.profile.documents.find(d => d.type === documentType);
    return document || null;
  }

  /**
   * Get academic records (Class 10 & 12 marksheets)
   */
  async getAcademicRecords(digiLockerId: string): Promise<{ class10?: AcademicRecord; class12?: AcademicRecord }> {
    await this.simulateApiDelay(1500);
    
    return MOCK_ACADEMIC_RECORDS[digiLockerId] || {};
  }

  /**
   * Verify document authenticity
   */
  async verifyDocument(documentUri: string): Promise<{ isValid: boolean; details: any }> {
    await this.simulateApiDelay(800);

    // Simulate verification
    return {
      isValid: true,
      details: {
        verificationId: `VER-${Date.now()}`,
        verifiedAt: new Date().toISOString(),
        issuerVerified: true,
        documentIntegrity: true
      }
    };
  }

  /**
   * Check if user has an active DigiLocker session
   */
  isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  /**
   * Get current session profile
   */
  getCurrentProfile(): DigiLockerProfile | null {
    return this.currentSession?.profile || null;
  }

  /**
   * Logout from DigiLocker
   */
  logout(): void {
    this.currentSession = null;
    sessionStorage.removeItem('digilocker_state');
  }

  /**
   * Get list of supported document types
   */
  getSupportedDocuments(): { type: DocumentType; name: string; issuer: string }[] {
    return [
      { type: 'AADHAAR', name: 'Aadhaar Card', issuer: 'UIDAI' },
      { type: 'PAN', name: 'PAN Card', issuer: 'Income Tax Department' },
      { type: 'DRIVING_LICENSE', name: 'Driving License', issuer: 'Regional Transport Office' },
      { type: 'VOTER_ID', name: 'Voter ID', issuer: 'Election Commission of India' },
      { type: 'PASSPORT', name: 'Passport', issuer: 'Ministry of External Affairs' },
      { type: 'CLASS_10_MARKSHEET', name: 'Class X Marksheet', issuer: 'CBSE/State Boards' },
      { type: 'CLASS_12_MARKSHEET', name: 'Class XII Marksheet', issuer: 'CBSE/State Boards' },
      { type: 'DEGREE_CERTIFICATE', name: 'Degree Certificate', issuer: 'Universities' },
      { type: 'MIGRATION_CERTIFICATE', name: 'Migration Certificate', issuer: 'Educational Institutions' },
      { type: 'TRANSFER_CERTIFICATE', name: 'Transfer Certificate', issuer: 'Educational Institutions' },
      { type: 'CASTE_CERTIFICATE', name: 'Caste Certificate', issuer: 'Revenue Department' },
      { type: 'INCOME_CERTIFICATE', name: 'Income Certificate', issuer: 'Revenue Department' },
      { type: 'DOMICILE_CERTIFICATE', name: 'Domicile Certificate', issuer: 'Revenue Department' }
    ];
  }

  /**
   * Fetch academic records as array for form display
   */
  async fetchAcademicRecords(): Promise<AcademicRecord[]> {
    if (!this.currentSession) {
      throw new Error('No active DigiLocker session');
    }

    const records = await this.getAcademicRecords(this.currentSession.profile.digiLockerId);
    const result: AcademicRecord[] = [];

    if (records.class10) {
      result.push({ ...records.class10, examType: 'class_10' });
    }
    if (records.class12) {
      result.push({ ...records.class12, examType: 'class_12' });
    }

    return result;
  }

  private generateState(): string {
    return Math.random().toString(36).substr(2, 16);
  }

  private async simulateApiDelay(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const digiLockerService = new DigiLockerService();

// Helper function for admission form integration
export const fetchDigiLockerDataForAdmission = async (): Promise<DigiLockerAutoFillData> => {
  return digiLockerService.getAutoFillData();
};
