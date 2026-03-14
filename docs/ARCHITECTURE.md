# Architecture

## Overview

The system follows a classic **three-tier architecture**:

```
Tier 1 — Presentation:   React SPA served by Nginx
Tier 2 — Application:    Spring Boot REST API
Tier 3 — Data:           PostgreSQL 16
```

Communication between tiers:
- Browser → Nginx: HTTP on port 80
- Nginx → Spring Boot: HTTP internal proxy on port 8080 (`/api/`)
- Spring Boot → PostgreSQL: JDBC/JPA on port 5432

---

## Backend Architecture

### Layer Structure

```
Controllers  (@RestController)
    │  Receive HTTP, validate input, return DTOs (not JPA entities)
    ▼
Services     (@Service)
    │  Business logic, orchestrate operations
    │  Independent of HTTP layer
    ▼
Repositories (JpaRepository)
    │  Database access via Spring Data JPA
    │  Auto-generated queries from method names
    ▼
Domain       (@Entity)
    │  JPA entities with Hibernate relationships
    │  JOINED inheritance strategy for User hierarchy
```

### Key Design Decisions

**DTO Pattern** — Controllers always return DTOs, never JPA entities directly:
```java
// Always expose DTOs
return new PatientDTO(p.getId(), p.getFirstName(), ...);

// Never expose raw entities — risks infinite recursion and password leakage
```

**JOINED Inheritance** — The `User` hierarchy:
```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User { ... }

@Entity public class Patient extends User { ... }  // separate "patients" table
@Entity public class Doctor  extends User { ... }  // separate "doctors" table
@Entity public class Admin   extends User { ... }  // separate "admins" table
```

**`@JsonIgnore`** — Applied to all bidirectional JPA relationships to prevent infinite JSON recursion during serialization.

**`@Profile("!test")`** — Applied to `DataInitializer` to prevent demo data from being inserted during test runs.

---

## Frontend Architecture

### Route Structure

```
/                     → redirect → /login
/login                → LoginPage (role selection)
/login/:roleId        → RoleLoginPage (login form)

/student-dashboard    → StudentDashboard     [PATIENT]
/student/medical-file → StudentMedicalFile   [PATIENT]
/student/appointments → StudentAppointments  [PATIENT]
/student/profile      → StudentProfile       [PATIENT]

/medical-dashboard    → MedicalDashboard     [DOCTOR]
/medical/patient/:id  → MedicalPatientPage   [DOCTOR]

/admin-dashboard      → AdminDashboard       [ADMIN]
/admin/users          → UserManagement       [ADMIN]
/admin/logs           → ActivityLog          [ADMIN]

/analyses             → AnalysisPage         [any authenticated]
```

### Route Protection

```tsx
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to the correct dashboard for the user's actual role
  }
  return <>{children}</>;
};
```

### API Layer

All HTTP requests are centralized in `src/api/`:

```
src/api/
├── client.ts    → apiGet, apiPost, apiPut, apiDelete (fetch wrapper)
├── auth.ts      → loginRequest
├── doctors.ts   → getDoctors
└── analyses.ts  → getAnalysesByPatientId
```

`client.ts` handles:
- Base URL from `VITE_API_BASE_URL` env variable
- Common headers (`Accept`, `Content-Type`)
- Uniform error handling (throws `Error` on non-2xx)
- Defensive `headers?.get?.()` for test compatibility

---

## Data Model

### ERD

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    users    │       │   patients   │       │   doctors   │
│─────────────│       │──────────────│       │─────────────│
│ id (PK)     │◄──────│ id (FK)      │       │ id (FK)     │
│ first_name  │       │ personal_id  │       │ specializ.  │
│ last_name   │       │ address      │       │ department  │
│ email       │       │ faculty      │       └──────┬──────┘
│ role        │       └──────┬───────┘              │
└─────────────┘              │                      │
                             └──────────┬───────────┘
                                        ▼
                             ┌─────────────────┐
                             │  consultations  │
                             │─────────────────│
                             │ id (PK)         │
                             │ date            │
                             │ reason          │
                             │ status          │
                             │ diagnosis       │
                             │ notes           │
                             │ recommendations │
                             │ patient_id (FK) │
                             │ doctor_id (FK)  │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │    analyses     │
                             │─────────────────│
                             │ id (PK)         │
                             │ test_name       │
                             │ result          │
                             │ unit            │
                             │ normal_range    │
                             │ test_date       │
                             │ patient_id (FK) │
                             │ consultation_id │
                             └─────────────────┘
```

---

## Docker Setup

### Startup Order

```
PostgreSQL (db)
    │  healthy?
    ▼
Spring Boot (backend)    ← depends_on: db (service_healthy)
    │  healthy?
    ▼
Nginx + React (frontend) ← depends_on: backend (service_healthy)
```

### Health Checks

**PostgreSQL:**
```yaml
test: ["CMD-SHELL", "pg_isready -U postgres -d clinicadb"]
interval: 10s
retries: 5
```

**Spring Boot:**
```yaml
test: ["CMD-SHELL", "wget -qO- http://localhost:8080/actuator/health || exit 1"]
interval: 15s
start_period: 30s   # allow JVM startup time
retries: 6
```

### Nginx Proxy

```nginx
location /api/ {
    proxy_pass http://backend:8080/api/;
    # "backend" resolves via Docker internal DNS
}

location / {
    try_files $uri $uri/ /index.html;
    # SPA fallback — unknown routes handled by React Router
}
```
