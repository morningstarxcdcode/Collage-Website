import { Notice, UserRole, User, FacultyProfile } from './types';

export const APP_NAME = "EduNexus Institute";

export const MOCK_USER: User = {
  id: 'STU-2024-001',
  name: 'Rahul Sharma',
  email: 'rahul.s@edunexus.ac.in',
  role: UserRole.STUDENT,
  avatarUrl: 'https://picsum.photos/200'
};

export const NOTICES: Notice[] = [
  { id: '1', title: 'End Semester Examination Schedule Released', date: '2024-05-20', category: 'ACADEMIC', isNew: true },
  { id: '2', title: 'Fee Payment Deadline Extended', date: '2024-05-18', category: 'ADMIN', isNew: true },
  { id: '3', title: 'TechFest 2024 Registration Open', date: '2024-05-15', category: 'EVENT', isNew: false },
];

export const FACULTY_MEMBERS: FacultyProfile[] = [
  { 
    id: 'FAC-01', 
    name: 'Dr. Arjun Mehta', 
    designation: 'HOD & Professor', 
    department: 'Computer Science', 
    education: 'Ph.D. (IIT Delhi), M.Tech (IIT Bombay)', 
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    specialization: 'Artificial Intelligence & Machine Learning'
  },
  { 
    id: 'FAC-02', 
    name: 'Prof. Sarah Williams', 
    designation: 'Associate Professor', 
    department: 'Business Administration', 
    education: 'MBA (IIM Ahmedabad), Ph.D. (Stanford)', 
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    specialization: 'Strategic Management & Finance'
  },
  { 
    id: 'FAC-03', 
    name: 'Dr. Vikram Singh', 
    designation: 'Assistant Professor', 
    department: 'Mechanical Engineering', 
    education: 'Ph.D. (IISc Bangalore)', 
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    specialization: 'Robotics & Automation'
  },
  { 
    id: 'FAC-04', 
    name: 'Dr. Anita Desai', 
    designation: 'Professor', 
    department: 'Electronics & Comm.', 
    education: 'Ph.D. (BITS Pilani)', 
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    specialization: 'VLSI Design & IoT'
  },
];

export const ARCHITECTURE_DOCS_DATA = [
  {
    id: 'arch-diagram',
    title: 'System Architecture Diagram',
    type: 'diagram',
    content: `
[Client Layer]
   |
   +-- Browser / Mobile App (React + PWA)
   |     |
   |     +-- WebSocket Client (Socket.IO)
   |
[Load Balancer / Gateway]
   |
   +-- Nginx (Reverse Proxy, SSL Termination, Gzip)
   |
[Application Layer (Docker Swarm/K8s)]
   |
   +-- API Gateway Service (NestJS)
   |    |-- Auth Module (JWT, RBAC)
   |    |-- Rate Limiter
   |
   +-- Core Services
        |-- SIS Service (Student Data)
        |-- LMS Service (Lectures, Assignments)
        |-- Finance Service (Fees, Payment Gateway Webhooks)
        |-- Notification Service (Queue Consumer)
        |-- I18n Service (Translation Management)
   |
[Data Layer]
   |
   +-- PostgreSQL (Primary Relational DB - Users, Courses, Txns, Translations)
   |-- Redis (Caching, Session Store, Pub/Sub for Realtime)
   |-- S3 Compatible Storage (MinIO/AWS - Docs, Videos)
    `
  },
  {
    id: 'folder-structure',
    title: 'Monorepo Structure',
    type: 'code',
    content: `
root/
├── apps/
│   ├── client/                 # React Frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── locales/        # Static Translation JSONs
│   │   │   └── services/
│   │   ├── Dockerfile
│   │
│   ├── mobile/                 # React Native App (iOS/Android)
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── navigation/
│   │   │   └── offline/        # WatermelonDB Sync Logic
│   │
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── i18n/       # Dynamic Translation Module
│   │   │   │   ├── academic/
│   │   │   │   └── finance/
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │
│   └── worker/                 # Background Job Processor
├── libs/                       # Shared Libraries
│   ├── types/
│   └── utils/
├── docker-compose.yml
└── README.md
    `
  },
  {
    id: 'db-schema',
    title: 'Core Database Schema',
    type: 'schema',
    content: `
Table: users
- id: UUID (PK)
- mobile: VARCHAR(15) (Unique)
- email: VARCHAR(255) (Unique)
- password_hash: VARCHAR
- role: ENUM('STUDENT','FACULTY','ADMIN')
- preferred_lang: VARCHAR(5) DEFAULT 'en'

Table: languages
- code: VARCHAR(5) (PK) (e.g., 'en', 'hi', 'ta')
- name: VARCHAR
- is_active: BOOLEAN

Table: translations
- id: UUID (PK)
- key: VARCHAR (Index) (e.g., 'home.welcome_msg')
- lang_code: VARCHAR(5) (FK)
- value: TEXT
- last_updated: TIMESTAMP

Table: attendance_logs
- id: UUID (PK)
- course_id: UUID (FK)
- student_id: UUID (FK)
- lecture_id: UUID (FK)
- status: ENUM('PRESENT','ABSENT')
- timestamp: TIMESTAMP
- device_fingerprint: VARCHAR (Security)
    `
  },
  {
    id: 'project-roadmap',
    title: 'Project Roadmap & Team',
    type: 'text',
    content: `
### Team Structure Overview
For a project of this scale and complexity, a team of 8-12 core members is realistic for the primary development phase, supported by other specialists as needed.

| Phase | Core Roles | Team Size | Duration (Approx.) |
| :--- | :--- | :--- | :--- |
| Phase 1: Foundation & Design | Product Manager, UI/UX Designer, Technical Architect | 3 | 1-2 Months |
| Phase 2: Core Development | Backend Team, Frontend Team, DevOps Engineer, QA Engineer | 6-8 | 6-9 Months |
| Phase 3: Launch & Maintenance | IT Support Specialist, Core Dev Team, Digital Marketer | 5-7+ | Ongoing |

---

### Phase 1: Foundation & Design (Months 1-2)
This phase is about planning and strategy. The goal is to create a complete blueprint before a single line of production code is written.

**1. Product Manager (PM)**
- **Core Responsibilities**:
  - Acts as the CEO of the product. They are the primary bridge between college stakeholders (Principal, Staff, Teachers) and the technical team.
  - Conducts user interviews with college staff to understand real-world pain points.
  - Defines the entire feature set and creates a detailed project roadmap (MVP -> v1.0 -> Future Features).
  - Writes user stories and acceptance criteria for every feature (e.g., "As a student, I want to scan a QR code to mark my attendance so that I don't have to wait for a manual roll call.").
  - Manages the project backlog and prioritizes features for each development sprint.
- **Key Skills**: Agile/Scrum Methodologies, JIRA/Trello, User Research, Excellent Communication.
- **Team**: 1 Full-time.

**2. UI/UX Designer**
- **Core Responsibilities**:
  - Designs the entire user experience, from the public website's aesthetic to the functional layout of the ERP dashboards.
  - Creates user flow diagrams for complex processes like the multi-step admission form, result publication, and fee payment.
  - Builds high-fidelity, interactive mockups and prototypes in tools like Figma.
  - Designs the modern, smooth transitions and animations specified in the requirements.
  - Ensures the design is mobile-first and considers accessibility (WCAG) standards.
- **Key Skills**: Figma/Sketch, Prototyping, User-Centered Design, Mobile UI/UX.
- **Team**: 1 Full-time.

**3. Technical Architect / Lead Engineer**
- **Core Responsibilities**:
  - Owns the entire technical blueprint. They translate the Product Manager's requirements into a technical design.
  - Designs the system architecture, database schema (PostgreSQL), and defines all REST API contracts.
  - Selects the specific libraries and frameworks to be used within the tech constraints (e.g., choosing NestJS over Express and justifying why).
  - Sets up the initial project structure (monorepo), boilerplate, and the foundational CI/CD pipeline in GitHub Actions.
  - Defines coding standards, security best practices, and ensures the plan is scalable.
- **Key Skills**: System Design, Full-Stack Expertise (React, NestJS), PostgreSQL & Redis, Docker, CI/CD, Software Architecture Patterns.
- **Team**: 1 Full-time (this is the most senior technical role).

---

### Phase 2: Core Development & Testing (Months 3-9)
This is the main building phase where the team expands to execute the architect's plan.

**4. Backend Engineers**
- **Core Responsibilities**:
  - Develop the entire server-side application using NestJS and TypeScript.
  - Build and secure all REST API endpoints.
  - Implement the database logic using an ORM like TypeORM/Prisma with PostgreSQL.
  - Handle complex business logic for attendance, result calculation, and role-based permissions (RBAC).
  - Integrate third-party services: Razorpay/PayU for payments, Twilio/Msg91 for SMS OTPs, and an email service like SendGrid.
  - Build the real-time chat server using WebSockets (Socket.IO).
  - Implement the secure file upload logic with S3-compatible storage and signed URLs.
- **Key Skills**: Node.js, NestJS/TypeScript, PostgreSQL, Redis, REST APIs, WebSockets, JWT/Authentication.
- **Team**: 2-3 Full-time.

**5. Frontend Engineers**
- **Core Responsibilities**:
  - Translate the Figma designs into pixel-perfect, responsive React components using TypeScript.
  - Build the entire user interface for the public website, student portal, teacher dashboard, and admin panel.
  - Manage application state effectively (using tools like Redux Toolkit, Zustand, or React Query).
  - Integrate the frontend with the backend REST APIs, handling data fetching, submission, and error handling.
  - Implement the specified smooth transitions and animations (using Framer Motion or a similar library).
- **Key Skills**: React, TypeScript, Modern CSS (Tailwind CSS/MUI), State Management, API Integration.
- **Team**: 2-3 Full-time.

**6. DevOps / Site Reliability Engineer (SRE)**
- **Core Responsibilities**:
  - Writes the Dockerfile and docker-compose.yml files to containerize the entire application stack.
  - Owns and manages the CI/CD pipeline in GitHub Actions, ensuring smooth, automated deployments.
  - Provisions and manages the cloud infrastructure (e.g., servers, databases, S3 buckets on AWS, Azure, or GCP).
  - Implements logging, monitoring, and alerting systems to ensure the platform is stable and performant.
  - Manages database backups and disaster recovery plans.
- **Key Skills**: Docker, GitHub Actions, Cloud Platforms (AWS/GCP), Infrastructure as Code (Terraform), Linux/Shell Scripting.
- **Team**: 1 Full-time.

**7. Quality Assurance (QA) Engineer**
- **Core Responsibilities**:
  - Manually test all user flows to ensure they meet the requirements defined by the Product Manager.
  - Write and maintain automated end-to-end tests (using tools like Cypress or Playwright) for critical paths like login, payment, and result checking.
  - Perform performance and load testing to ensure the system can handle thousands of concurrent users.
  - Manages the bug tracking process, clearly documenting issues for the development team.
- **Key Skills**: Manual & Automated Testing, Test Planning, Cypress/Selenium, JIRA.
- **Team**: 1-2 Full-time.

---

### Phase 3: Launch, Maintenance & Growth (Ongoing)
After the initial launch, the team composition shifts to support, maintain, and grow the platform.

**8. IT Support Specialist / System Operator**
- **Core Responsibilities**:
  - Acts as the first line of support for the non-technical college staff using the ERP.
  - Onboards and trains new users (teachers, accountants, etc.) on how to use the system.
  - Manages user accounts, roles, and permissions through the admin dashboard.
  - Helps troubleshoot day-to-day issues and escalates technical bugs to the development team.
  - Generates custom reports for the college management as needed.
- **Key Skills**: Excellent Communication, Problem-Solving, Empathy, Deep understanding of the application's features.
- **Team**: 1-2 Full-time (Crucial for successful adoption by the college).

**9. Digital Marketing Specialist**
- **Core Responsibilities**:
  - Manages the public-facing website's content and SEO to attract prospective students.
  - Runs online admission campaigns on social media and other platforms.
  - Manages the "News & Events" section of the website.
- **Key Skills**: SEO, Content Management, Social Media Marketing.
- **Team**: 1 Part-time or a contract-based role.
    `
  },
  {
    id: 'i18n-arch',
    title: 'Multi-language Architecture',
    type: 'text',
    content: `
1. **Goal**: Support English, Hindi, and Regional Languages dynamically.

2. **Backend (NestJS + nestjs-i18n)**:
   - 'translations' table stores key-value pairs per language.
   - API: GET /i18n/:lang_code returns a flattened JSON for the client.
   - Redis Caching: Translation responses cached for 1 hour; invalidated on Admin update.
   - Admin Panel: Interface to add/edit translation keys without redeployment.

3. **Frontend (React + i18next)**:
   - Uses 'i18next-http-backend' to fetch translations from API on init.
   - Fallback to bundled 'en.json' if API fails.
   - User preference stored in LocalStorage and User Profile (DB).

4. **Workflow**:
   - User selects 'Hindi'.
   - App calls GET /api/i18n/hi.
   - i18next instance updates resources.
   - React components re-render automatically.
    `
  },
  {
    id: 'mobile-arch',
    title: 'Native Mobile App Architecture',
    type: 'text',
    content: `
1. **Tech Stack**:
   - Framework: React Native (0.74+) with New Architecture enabled.
   - Language: TypeScript.
   - UI: NativeWind (Tailwind for RN) or Restyle.

2. **Key Features & Implementation**:
   - **Offline-First**: Uses WatermelonDB (SQLite) to sync Course Schedule and Profile data. Allows viewing timetable without internet.
   - **QR Attendance**: uses 'react-native-vision-camera'. Logic: Scan -> Get Token -> Sign with Device Key -> POST to server with Geo-location.
   - **Push Notifications**: Firebase Cloud Messaging (FCM). Topics: 'course_{id}', 'student_{id}'.
   - **Biometrics**: 'react-native-biometrics' for quick login (FaceID/TouchID).

3. **Cross-Platform Strategy**:
   - Single codebase for 95% of logic.
   - Platform-specific files (*.ios.ts, *.android.ts) only for intricate file system access or specific permissions handling.
    `
  },
  {
    id: 'complex-logic',
    title: 'QR Attendance Logic',
    type: 'text',
    content: `
1. Faculty initiates attendance in class.
2. Backend generates a signed JWT token containing: { lectureId, timestamp, nonce }.
3. This token is displayed as a changing QR code on the projector (rotates every 10s).
4. Student App scans QR.
5. App validates User Location (Geofencing check) matching Classroom coordinates.
6. App sends POST /attendance/mark payload: { qrToken, studentId, deviceId, gpsCoords }.
7. Server verifies:
   - Token signature validity.
   - Token expiration.
   - GPS proximity.
   - Single device ID restriction (prevent proxy).
8. Success response confirms attendance.
    `
  }
];