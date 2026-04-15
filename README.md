## Project Description

TripTogether is a web-based collaborative platform designed to help groups plan trips and make decisions efficiently.

Planning a trip with multiple people often leads to unstructured discussions, duplicated ideas, and difficulty reaching a final decision. TripTogether solves this problem by providing a centralized system where users can:

- create trips
- invite members
- propose destinations
- vote on preferred options
- view summarized results

The system transforms informal group discussions into a structured and data-driven decision-making process.

## System Architecture Overview

The system follows a Layered Architecture with a Modular Monolith design.

### Architecture Layers
- Presentation Layer
  - Next.js pages and API routes
  - Handles user interaction and HTTP requests
- Application Layer
  - Services (Auth, Trip, Destination, Voting, Summary)
  - Contains business logic and use cases
- Domain Layer
  - Entities and business rules
  - Example: trip rules, voting constraints
- Infrastructure Layer
  - Database (PostgreSQL)
  - Prisma ORM
  - JWT authentication

### Architecture Style
- Layered Architecture
- Modular Monolith
- Designed for future migration to Microservices

## User Roles & Permissions

### 1. Trip Owner

#### Responsibilities

- Create and manage trips
- Invite members
- Finalize trip

#### Permissions

- Full control over trip
- View summary results
- Close voting

### 2. Member

#### Responsibilities

- Propose destinations
- Vote on destinations

#### Permissions

- Join trip via invite code
- View trip data
- Participate in voting

### 3. Admin

#### Responsibilities

- Manage system users
- Monitor system

#### Permissions

- Access system-level data
- Manage accounts

## Technology Stack

### Frontend
- Next.js (React)
- TypeScript
- Tailwind CSS

### Backend / API
- Next.js Route Handlers
- Node.js

### Database
- PostgreSQL
- Prisma ORM

### Authentication
- JWT (JSON Web Token)
- bcryptjs (password hashing)

### Validation
- Zod

## Installation & Setup Instructions

###  1. Clone Repository

```
git clone <your-repo-url>
cd trip-together
```

### 2. Install Dependencies
```
npm install
```

### 3. Setup Environment Variables
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/TripTogether_DB"
JWT_SECRET="your-secret-key"
```

### 4. Setup Database
```
npx prisma migrate dev
npx prisma generate
```

### 5. Seed Initial Data
```
npm run seed
```

## How to Run the System

### 1. Run Development Server
```
npm run dev
<!-- Open browser: http://localhost:3000 -->
```

![image](src/screenshot/Screenshot(315).png)

# Architecture
The system follows a Layered Architecture as the primary architectural pattern.
The architecture is designed to support future migration to Microservices Architecture if the system scales.

``` 
TripTogether/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── login/page.tsx
│   │   ├── trips/page.tsx
│   │   ├── trips/[id]/page.tsx
│   │   └── api/
│   │       ├── trips/route.ts
│   │       └── auth/login/route.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── trip/
│   │   │   ├── trip.controller.ts
│   │   │   ├── trip.service.ts
│   │   │   ├── trip.repository.ts
│   │   │   └── trip.types.ts
│   │   │
│   │   ├── destination/
│   │   ├── voting/
│   │   └── summary/
│   │
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── user.ts
│   │   │   ├── trip.ts
│   │   │   ├── destination.ts
│   │   │   └── vote.ts
│   │   └── rules/
│   │       └── trip.rules.ts
│   │
│   ├── infrastructure/
│   │   ├── db/
│   │   │   └── prisma.ts
│   │   └── utils/
│   │       └── api-response.ts
│   │
│   └── lib/
│       └── env.ts
│
├── prisma/
│   └── schema.prisma
├── package.json
└── .env
```