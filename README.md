# EduNexus - Indian College ERP & Portal

> Production-Ready Educational Platform with Reown AppKit, Universal Payments, Blockchain Verification & Role-Based Dashboards

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (20.10+)
- Node.js 18+ (for local development)

### One-Command Launch

```bash
make up
```

**Access Points:**

- 🌐 Frontend: http://localhost:5173
- 🔌 Backend API: http://localhost:3000
- 🗄️ Database: localhost:5432

## 📦 Tech Stack

| Layer         | Technology                               |
| ------------- | ---------------------------------------- |
| Frontend      | React 19 + TypeScript + Tailwind CSS + Reown AppKit |
| Backend       | NestJS + TypeORM + PostgreSQL            |
| Auth          | Reown AppKit (Google + Wallet) + Firebase |
| Payments      | Universal (Stripe/Razorpay) + Gasless Blockchain |
| Verification  | DigiLocker API + Blockchain Proof        |
| Notifications | WhatsApp + Telegram + SMS                |
| Immutability  | Polygon Blockchain Ledger                |
| Library       | Book Tracking with Serial No & Late Fees |

## 🎯 Key Features

- **Role-Based Dashboards**: Student, Teacher, HOD, Library, Admin
- **Universal Payments**: Auto-detect currency, QR code scan, gasless blockchain recording
- **Library Management**: Issue/Return books with blockchain verification, late fee calculation
- **Responsive Design**: Mobile-first, premium glassmorphism UI
- **Production Ready**: Error boundaries, loading states, extensive testing

## 💰 Subscription Plans (Indian Private Colleges)

| Degree          | Monthly (INR) | Annual (INR) |
| --------------- | ------------- | ------------ |
| B.Tech Standard | ₹14,500       | ₹1,48,750    |
| B.Tech AI/ML    | ₹18,750       | ₹1,91,250    |
| M.Tech          | ₹12,000       | ₹1,23,250    |
| MBA Standard    | ₹23,750       | ₹2,42,250    |
| MBA Executive   | ₹28,750       | ₹2,93,250    |
| BCA             | ₹7,000        | ₹72,250      |
| MCA             | ₹10,500       | ₹1,06,250    |
| Ph.D.           | ₹7,900        | ₹80,750      |

**Currency Support:** Auto-conversion for INR, USD, EUR, GBP, AUD, CAD, SGD, AED, JPY, CNY, SAR, KWD

## 🔧 Development Commands

```bash
# Start all services
make up

# Stop all services
make down

# View logs
make logs

# Rebuild after code changes
make build

# Access backend shell
make shell-api

# Access frontend shell
make shell-web
```

## 🐳 Docker Deployment

### Production Build

```bash
docker-compose -f docker-compose.yml up -d --build
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_PROJECT_ID=your_project

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# DigiLocker
VITE_DIGILOCKER_CLIENT_ID=your_client_id

# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/edunexus
```

## 🔄 Migration Guide

### Database Migration

```bash
# Export from current PostgreSQL
pg_dump -U postgres edunexus > backup.sql

# Import to new server
psql -U postgres edunexus < backup.sql
```

### Full System Migration

1. Copy entire project folder
2. Update `.env` with new credentials
3. Run `docker-compose up -d`

## 📂 Project Structure

```
edunexus/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/   # 9 major components (300KB+)
│   │   ├── services/     # Firebase, Stripe, DigiLocker
│   │   └── features/     # Page-specific modules
│   └── Dockerfile
├── backend/           # NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Firebase token verification
│   │   │   ├── fees/          # Stripe + Currency conversion
│   │   │   ├── blockchain/    # Payment ledger
│   │   │   └── notifications/ # WhatsApp/Telegram
│   │   └── smart-contracts/   # Solidity contracts
│   └── Dockerfile
├── docker-compose.yml
├── Makefile
└── .env.example
```

## ✅ Feature Verification

| Feature          | Test Command                 |
| ---------------- | ---------------------------- |
| Firebase Auth    | Login with Google/Email      |
| Stripe Payment   | Complete checkout flow       |
| Currency Convert | Select non-INR currency      |
| DigiLocker       | Use "Demo Profile" button    |
| Blockchain       | Check API logs after payment |

## 📄 License

Copyright © 2024 EduNexus Foundation. All Rights Reserved.
