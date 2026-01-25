# EduNexus Phases Blueprint (Phase 1–3)

## Phase 1 — Foundation & Design (Months 1–2)

### 1) Product Manager (PM)
**Outputs**
- Stakeholder interviews summary (Principal, HoDs, Accounts, Admissions, Students)
- Pain points & opportunity map
- Feature roadmap: MVP → v1.0 → Future features
- Backlog with epics, user stories, acceptance criteria
- Sprint plan (2-week sprints)

**Sample User Stories (extract)**
- As a student, I want to scan a QR to mark attendance so I can avoid manual roll call.
- As an admissions officer, I want to review applicant documents in one panel to reduce processing time.
- As an accountant, I want to see fee dues by cohort to trigger reminders quickly.

### 2) UI/UX Designer
**Outputs**
- High-fidelity prototypes (Public website + ERP)
- User flow diagrams: admissions, fee payment, results publishing
- Mobile-first design system (typography, spacing, color tokens)
- Accessibility checklist (WCAG AA)
- Motion design guidelines (60 FPS animations)

### 3) Technical Architect / Lead Engineer
**Outputs**
- System architecture blueprint (frontend + backend + services)
- Database schema (PostgreSQL + Firebase mapping for MVP)
- API contracts (OpenAPI spec)
- CI/CD pipeline blueprint
- Coding standards & security baselines

## Master Sitemap (Synthesized Blueprint)

### Public Website
- Home
- About (Vision, Mission, Leadership)
- Academics
  - Programs (UG/PG/PhD)
  - Departments
  - Faculty profiles
- Admissions
  - How to Apply
  - Eligibility
  - Fees & Scholarships
  - Online Application (DigiLocker)
- Placements
- Research & Innovation
- Campus Life
- Alumni Network
- News & Events
- Gallery
- Downloads
- Contact

### Compliance
- NAAC
- NIRF
- Mandatory Disclosure (AICTE)
- Anti-Ragging Cell
- RTI

### ERP Portal
- Student Dashboard
- Attendance (QR)
- Fees & Payments
- LMS
- Notices & Chat
- Results
- Profile

### Admin Panel
- Users & Roles
- Admissions Review
- Fee Management
- Reports & Analytics
- Content Management

## Phase 2 — Core Development & Testing (Months 3–9)

### Backend Engineering
- NestJS + PostgreSQL services
- Secure REST APIs
- RBAC policies
- WebSockets for chat
- S3-compatible file storage
- Integrations (Payments, SMS, Email)

### Frontend Engineering
- React + TypeScript UI
- State management (React Query + Zustand)
- API integration
- Motion and micro-interactions

### DevOps / SRE
- Docker + docker-compose
- GitHub Actions CI/CD
- Monitoring & alerts
- Database backups & DR

### QA
- Manual testing
- E2E automation (Playwright/Cypress)
- Load testing

## Phase 3 — Launch, Maintenance & Growth (Ongoing)

### IT Support / System Operator
- User onboarding
- Operations training
- Issue triage and escalation

### Digital Marketing
- SEO, content publishing
- Admissions campaigns
- News & Events management

## Architecture for Scale (Target)

- Frontend: Next.js SSR/ISR for content-heavy pages
- CDN: Global asset delivery (Cloudflare/Vercel Edge)
- Headless CMS: Strapi/Sanity for content
- Services: Serverless APIs for admissions, payments
- DB: PostgreSQL + Redis cache
- Observability: Metrics, tracing, alerts

## Current Implementation Status (Workspace)

- Public website + ERP portal built in React + Vite
- Firebase (mock) services added for rapid MVP
- Stripe subscriptions with multi-currency conversion
- DigiLocker integration and auto-fill admission form
- Admin panel and compliance pages included

Next Step: If strict SSR/ISR is required, migrate frontend to Next.js with the current design system and components.