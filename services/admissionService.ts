import { AdmissionApplication, AdmissionFormData } from '../types';

// In-memory storage for the session (Simulating Database)
let MOCK_APPLICATIONS: AdmissionApplication[] = [
  {
    id: 'APP-2024-1001',
    firstName: 'Amit',
    lastName: 'Verma',
    email: 'amit.v@example.com',
    phone: '9876543210',
    dob: '2006-05-15',
    gender: 'Male',
    aadhaarNumber: 'XXXX-XXXX-1234',
    courseInterest: 'B.Tech Computer Science',
    marks10th: '92.4',
    marks12th: '89.6',
    address: 'Sector 62, Noida, UP',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isDigiLockerVerified: true
  },
  {
    id: 'APP-2024-1002',
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.r@example.com',
    phone: '9876543211',
    dob: '2006-08-20',
    gender: 'Female',
    aadhaarNumber: 'XXXX-XXXX-5678',
    courseInterest: 'MBA (Finance/HR/Marketing)',
    marks10th: '88.0',
    marks12th: '91.2',
    address: 'Indiranagar, Bangalore, Karnataka',
    status: 'APPROVED',
    submittedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    isDigiLockerVerified: false
  }
];

export const submitApplication = async (data: AdmissionFormData): Promise<AdmissionApplication> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const currentYear = new Date().getFullYear();
  const randomId = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  const newId = `APP-${currentYear}-${randomId}`;

  const newApplication: AdmissionApplication = {
    ...data,
    id: newId,
    status: 'PENDING',
    submittedAt: new Date().toISOString()
  };

  MOCK_APPLICATIONS = [newApplication, ...MOCK_APPLICATIONS];
  
  console.log("Application Submitted to Database:", newApplication);
  return newApplication;
};

export const getAllApplications = async (): Promise<AdmissionApplication[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...MOCK_APPLICATIONS];
};

export const updateApplicationStatus = async (id: string, status: 'APPROVED' | 'REJECTED'): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  MOCK_APPLICATIONS = MOCK_APPLICATIONS.map(app => 
    app.id === id ? { ...app, status } : app
  );
};

export const getDigiLockerMockData = async (): Promise<Partial<AdmissionFormData>> => {
  // Simulating a secure fetch from MeitY DigiLocker API (OAuth 2.0 Flow)
  // This would typically return a verified JSON document signed by the issuer.
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return {
    firstName: "Aarav",
    lastName: "Patel",
    email: "aarav.p.verified@digilocker.in",
    phone: "9876543210",
    dob: "2006-08-15",
    gender: "Male",
    aadhaarNumber: "XXXX-XXXX-4521", // Always store/display masked
    address: "B-102, Galaxy Towers, Satellite Road, Ahmedabad, Gujarat - 380015",
    state: "Gujarat",
    marks10th: "94.2", // Fetched from CBSE/State Board
    marks12th: "91.5", // Fetched from CBSE/State Board
    isDigiLockerVerified: true
  };
};