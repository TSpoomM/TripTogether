# TripTogether – Group Trip Planning & Decision Support System

## Overview

TripTogether is a web-based collaborative platform designed to help small groups plan trips and make travel decisions together. The system allows users to propose destinations, vote on preferred options, and generate a summarized travel plan based on group preferences.

Planning a trip with multiple people often results in long discussions, disagreements, and unorganized ideas. TripTogether provides a structured environment where group members can contribute suggestions, vote on options, and reach a clear decision efficiently.

The system is designed using modern software architecture principles, supporting layered architecture and scalable service-based design.

---

# Problem Statement

Planning trips in groups can be inefficient and confusing due to:

* Unstructured discussions in messaging apps
* Difficulty comparing multiple destination options
* Lack of a centralized platform for group decision-making
* Conflicts between member preferences, budgets, and schedules

Without a structured system, reaching a final decision often takes a long time and leads to frustration among group members.

---

# Objectives

The main objectives of TripTogether are:

* Provide a collaborative platform for group travel planning
* Enable structured destination proposals and voting
* Support decision-making through ranking and summarized results
* Allow users to manage trips and invite participants
* Provide role-based access control for system users

---

# Key Features

## Trip Creation

Users can create a new trip and define basic information such as trip name, description, date range, and preferences.

## Destination Proposal

Trip members can propose travel destinations including name, category, estimated budget, and description.

## Voting System

Members can vote for destinations proposed by other users to express their preferences.

## Trip Summary

The system calculates ranking scores based on votes and presents the most preferred destinations.

## Member Management

Trip owners can invite members and manage participant permissions.

## Notification System

Users receive notifications when new destinations are proposed or when votes are submitted.

---

# User Roles

## 1. Trip Owner

Responsibilities:

* Create and manage trips
* Invite members to join a trip
* Configure trip preferences
* Close voting and finalize trip decisions

Permissions:

* Full control over trip settings
* Manage participants
* View trip summary and final results

---

## 2. Member

Responsibilities:

* Propose travel destinations
* Vote for preferred destinations
* Participate in trip discussions

Permissions:

* Add destination proposals
* Submit votes
* View trip details and voting results

---

## 3. System Administrator

Responsibilities:

* Manage system users
* Monitor platform activity
* Maintain system integrity

Permissions:

* Manage user accounts
* Remove inappropriate content
* Access system-wide reports

---

# System Workflow

1. A user registers and logs into the system.
2. The user creates a new trip as the Trip Owner.
3. The Trip Owner invites members to join the trip.
4. Members propose travel destinations.
5. Members vote on their preferred destinations.
6. The system calculates ranking scores based on votes.
7. The Trip Owner reviews the results and finalizes the destination.

---

# System Architecture

The system follows a **Layered Architecture** approach to separate responsibilities and improve maintainability.

Layers include:

* **Presentation Layer**
  Handles the user interface and interaction with the system.

* **Application Layer**
  Contains business logic and coordinates application workflows.

* **Domain Layer**
  Defines core entities such as Trip, Destination, and Vote.

* **Infrastructure Layer**
  Manages database access, external services, and system integrations.

The architecture is designed to support future extension into a **Microservices Architecture**, where services such as authentication, trip management, and voting can be separated into independent services.

---

# Technology Stack

Frontend:

* React / Next.js
* Tailwind CSS

Backend:

* Node.js
* NestJS

Database:

* PostgreSQL

Authentication:

* JWT (JSON Web Token)

Optional Future Services:

* Notification Service
* Recommendation Service
* API Gateway

---

# Future Improvements

Possible future enhancements include:

* Integration with map services
* AI-based travel recommendation
* Real-time collaboration features
* Mobile application support
* Integration with booking platforms

---

# License

This project is developed for educational purposes as part of a Software Architecture course.


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