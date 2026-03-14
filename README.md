<div align="center">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg" width="60" alt="Spring Boot" />
&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="60" alt="React" />
&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="60" alt="TypeScript" />

# 🏥 clinic-management-system

**A full-stack university clinic management platform built with Spring Boot & React**

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![CI](https://github.com/MirceaAlin/clinic-management-system/actions/workflows/ci.yml/badge.svg)](https://github.com/MirceaAlin/clinic-management-system/actions/workflows/ci.yml)

[Overview](#-overview) · [Features](#-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [Docker](#-docker) · [API Docs](#-api-documentation) · [Project Structure](#-project-structure)

---

</div>

## 📋 Overview

**clinic-management-system** is a modern web application for managing university medical clinic operations. It provides role-based dashboards for **Administrators**, **Doctors**, and **Patients (Students)**, enabling streamlined management of appointments, consultations, medical records, and lab analyses — all through a clean, glassmorphism-styled interface.

> Built with Java 21 + Spring Boot 3.5 on the backend and React 18 + TypeScript on the frontend, orchestrated with Docker Compose and connected to a PostgreSQL 16 database.

---

## ✨ Features

### 👤 Role-Based Access Control
- **Admin** — full user management, activity logs, system oversight
- **Doctor** — view and manage patient records, consultations, lab analyses
- **Patient (Student)** — personal dashboard, appointments, medical file, profile

### 🗓️ Appointment Management
- Schedule appointments with available doctors
- View upcoming and past appointments per patient

### 🩺 Consultation Tracking
- Create and view full consultation records linked to patients and doctors
- Diagnoses, notes, and recommendations per consultation

### 🔬 Lab Analysis Module
- Record and visualize lab results per patient
- Interactive evolution charts powered by Recharts
- Filter analyses by category and date

### 👥 User Management
- Admin panel for creating, editing, and deleting users
- Doctor profiles with specialization and department data

### 🔐 Authentication
- Role-specific login flows (student / medical staff / admin)
- Protected routes based on authenticated role
- Session stored in localStorage

---

## 🏗️ Architecture

```
clinic-management-system/
│
├── backend/                  # Spring Boot REST API (Java 21, Gradle)
│   ├── Dockerfile
│   └── src/main/java/com/example/backend/
│       ├── config/           # CORS, DataInitializer
│       ├── controller/       # REST endpoints + DTOs
│       ├── domain/           # JPA entities
│       ├── repository/       # Spring Data JPA interfaces
│       └── service/          # Business logic layer
│
├── frontend/                 # React 18 + TypeScript (Vite 5)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── api/              # Fetch-based API clients
│       ├── components/       # Reusable UI components
│       ├── pages/            # Route-level page components
│       └── styles/           # Per-page CSS modules
│
└── docker-compose.yml        # One-command full-stack startup
```

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Framework | Spring Boot | 3.5.7 |
| Language (BE) | Java | 21 |
| Build Tool | Gradle | 8.x |
| Database | PostgreSQL | 16 |
| ORM | Spring Data JPA / Hibernate | — |
| Frontend Framework | React + TypeScript | 18 / 5.6 |
| Frontend Build | Vite | 5.x |
| Charts | Recharts | 2.x |
| Icons | Lucide React | 0.453 |
| Containerization | Docker + Compose | latest |
| Web Server | Nginx (Alpine) | latest |

---

## 🚀 Getting Started

### Option A — Docker (Recommended) 🐳

> Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

```bash
git clone https://github.com/MirceaAlin/clinic-management-system.git
cd clinic-management-system

# Copy environment config
cp .env.example .env        # Linux / macOS
Copy-Item .env.example .env # Windows PowerShell

docker compose up --build
```

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost |
| **Backend API** | http://localhost:8080/api |
| **Health Check** | http://localhost:8080/actuator/health |
| **Database** | localhost:5432 |

To stop:
```bash
docker compose down
```

To stop and remove all persisted data:
```bash
docker compose down -v
```

---

### Option B — Manual Setup

#### Prerequisites

- **Java 21+** — [Download](https://adoptium.net/)
- **Node.js 20+** — [Download](https://nodejs.org/)
- **PostgreSQL 16+** — [Download](https://www.postgresql.org/download/)

#### 1. Clone the repository

```bash
git clone https://github.com/MirceaAlin/clinic-management-system.git
cd clinic-management-system
```

#### 2. Database

```sql
CREATE DATABASE clinicadb;
```

#### 3. Backend

```bash
cd backend
```

Edit `src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/clinicadb
spring.datasource.username=postgres
spring.datasource.password=parola123
spring.jpa.hibernate.ddl-auto=update
```

Start the backend:

```bash
./gradlew bootRun        # Linux / macOS
gradlew.bat bootRun      # Windows
```

#### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: **http://localhost:5173**

> Vite automatically proxies `/api/*` → `http://localhost:8080` in dev mode.

---

### 🔑 Default Login Credentials

The `DataInitializer` automatically seeds the database on first startup:

| Role | Email | Password |
|------|-------|----------|
| ⚙️ **Admin** | `admin@studmed.ro` | `admin123` |
| 🩺 **Doctor** | `doctor@studmed.ro` | `doctor123` |
| 👨‍🎓 **Patient** | `patient@studmed.ro` | `patient123` |

> ⚠️ These are demo credentials. Change them before any public deployment.

---

## 🐳 Docker

The project includes full multi-stage Docker support:

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Orchestrates all 3 services (db, backend, frontend) |
| `backend/Dockerfile` | Multi-stage build: Gradle compile → JRE runtime |
| `frontend/Dockerfile` | Multi-stage build: Vite build → Nginx serve |
| `frontend/nginx.conf` | SPA routing + `/api` proxy + gzip compression |

The frontend Nginx container automatically proxies all `/api/*` requests to the backend — **no CORS issues in production**.

### Useful Docker commands

```bash
# Start in background
docker compose up -d --build

# View container status
docker compose ps

# Stream all logs
docker compose logs -f

# Stream backend logs only
docker compose logs -f backend

# Rebuild without cache
docker compose build --no-cache

# Full reset (removes volumes / DB data)
docker compose down -v
```

---

## 📡 API Documentation

Base URL: `http://localhost:8080/api`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Authenticate — returns user info |
| `POST` | `/auth/register` | Register new patient account |

**Login request body:**
```json
{
  "email": "doctor@studmed.ro",
  "password": "doctor123"
}
```

**Response:**
```json
{
  "id": 2,
  "firstName": "Maria",
  "lastName": "Popa",
  "email": "doctor@studmed.ro",
  "role": "DOCTOR"
}
```

### Users *(Admin only)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | List all users |
| `PUT` | `/users/{id}` | Update user fields |
| `DELETE` | `/users/{id}` | Delete user |

### Patients

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/patients` | List all patients |
| `GET` | `/patients/{id}` | Get patient by ID |
| `PUT` | `/patients/{id}` | Update patient info |

### Doctors

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/doctors` | List all doctors |
| `GET` | `/doctors/{id}` | Get doctor by ID |
| `GET` | `/doctors/{id}/patients` | Get patients of a doctor |

### Consultations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/consultations` | List all consultations |
| `GET` | `/consultations/patient/{id}` | Get consultations for patient |
| `GET` | `/consultations/doctor/{id}` | Get consultations for doctor |
| `POST` | `/consultations` | Create new consultation/appointment |
| `PUT` | `/consultations/{id}` | Update diagnosis / notes / status |
| `PUT` | `/consultations/{id}/finish` | Mark consultation as finished |
| `DELETE` | `/consultations/{id}` | Delete consultation |

### Analyses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analyses` | List all analyses |
| `GET` | `/analyses/{id}` | Get analysis by ID |
| `GET` | `/analyses/patient/{id}` | Get analyses for a patient |
| `POST` | `/analyses` | Submit new lab analysis |
| `DELETE` | `/analyses/{id}` | Delete analysis |

**POST `/analyses` body:**
```json
{
  "testName": "Hemoglobin",
  "result": "13.5",
  "unit": "g/dL",
  "normalRange": "12.0-16.0",
  "testDate": "2025-11-01",
  "patientId": 3
}
```

---

## 📁 Project Structure

<details>
<summary><strong>Backend — Spring Boot</strong></summary>

```
backend/
├── Dockerfile
├── build.gradle
├── settings.gradle
├── gradlew / gradlew.bat
└── src/
    ├── main/java/com/example/backend/
    │   ├── BackendApplication.java
    │   ├── config/
    │   │   ├── CorsConfig.java
    │   │   └── DataInitializer.java
    │   ├── controller/
    │   │   ├── AuthController.java
    │   │   ├── UserController.java
    │   │   ├── PatientController.java  + PatientDTO.java
    │   │   ├── DoctorController.java   + DoctorDTO.java
    │   │   ├── ConsultationController.java + ConsultationDTO.java
    │   │   │                               + ConsultationRequest.java
    │   │   └── AnalysisController.java + AnalysisRequest.java
    │   ├── domain/
    │   │   ├── User.java          ← abstract base (JOINED inheritance)
    │   │   ├── Admin.java
    │   │   ├── Doctor.java
    │   │   ├── Patient.java
    │   │   ├── Consultation.java
    │   │   ├── Analysis.java
    │   │   ├── Appointment.java
    │   │   └── Role.java          ← enum: PATIENT | DOCTOR | ADMIN
    │   ├── repository/
    │   └── service/
    ├── main/resources/
    │   └── application.properties
    └── test/                      ← JUnit 5 + MockMvc + Mockito
```

</details>

<details>
<summary><strong>Frontend — React + TypeScript</strong></summary>

```
frontend/
├── Dockerfile
├── nginx.conf
├── vite.config.ts
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx                    ← Router + ProtectedRoute
    ├── api/
    │   ├── client.ts              ← apiGet / apiPost / apiPut / apiDelete
    │   ├── auth.ts
    │   ├── doctors.ts
    │   └── analyses.ts
    ├── components/
    │   ├── GlassCard.tsx
    │   ├── GlassModal.tsx
    │   ├── OptionTile.tsx
    │   └── AnalysisChartCard.tsx
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── RoleLoginPage.tsx
    │   ├── AdminDashboard.tsx
    │   ├── UserManagement.tsx
    │   ├── ActivityLog.tsx
    │   ├── MedicalDashboard.tsx
    │   ├── MedicalPatientPage.tsx
    │   ├── StudentDashboard.tsx
    │   ├── StudentMedicalFile.tsx
    │   ├── StudentAppointments.tsx
    │   ├── StudentProfile.tsx
    │   └── AnalysisPage.tsx
    ├── styles/                    ← CSS per page module
    └── test/                      ← Vitest + Testing Library
```

</details>

---

## 🔄 Domain Model

```
User (abstract — JPA JOINED inheritance)
 ├── Admin
 ├── Doctor ──────┐
 └── Patient ─────┤
                  ▼
             Consultation
                  │
                  ▼
             Analysis
```

**Roles:** `ADMIN` | `DOCTOR` | `PATIENT`

---

## 🧪 Testing

### Backend

```bash
cd backend
./gradlew test
```

Tests use **H2 in-memory** database — no PostgreSQL required.

Coverage includes: `AuthController`, `PatientController`, `DoctorController`, `AnalysisController`, `PatientService`, `DoctorService`, `AnalysisService`, `ConsultationService`.

### Frontend

```bash
cd frontend
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage
```

Coverage includes: API clients (`client`, `auth`, `analyses`, `doctors`), `LoginPage`, `RoleLoginPage`, `ActivityLog`, `UserManagement`.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using Conventional Commits: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 🔒 Security

See [SECURITY.md](SECURITY.md) for the security policy and deployment checklist.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ using Spring Boot + React + PostgreSQL</sub>
</div>
