# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2025-11-15

### Added
- Role-based authentication with 3 roles: `PATIENT`, `DOCTOR`, `ADMIN`
- Student dashboard with medical file, appointments, and profile
- Medical staff dashboard with patient list and live search
- Per-patient detail page: analyses, consultations, personal data, add-new forms
- Admin dashboard with user management and activity log
- Lab analysis page with evolution charts (Recharts), category filter, sort/delete
- Full REST API: `auth`, `patients`, `doctors`, `analyses`, `consultations`, `users`
- Docker Compose setup: PostgreSQL 16 + Spring Boot + React/Nginx
- `DataInitializer` with demo data (3 patients, 2 doctors, consultations, analyses)
- `ProtectedRoute` component enforcing role-based navigation
- Nginx proxy `/api/*` → Spring Boot (no CORS issues in production)
- GitHub Actions CI: backend tests (JUnit), frontend tests (Vitest), Docker build
- Full test suites: JUnit 5 + MockMvc (backend), Vitest + Testing Library (frontend)
- Issue templates: Bug Report, Feature Request
- Pull Request template with checklist
- Docs: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`
- Architecture docs: `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/SETUP.md`

### Technical Details
- Spring Boot 3.5.7 + Java 21, Gradle 8.x
- React 18 + TypeScript 5.6 + Vite 5
- PostgreSQL 16 with JPA/Hibernate (JOINED table inheritance for `User`)
- H2 in-memory database for backend tests
- Multi-stage Docker builds (compile stage + minimal runtime image)
- `@Profile("!test")` on `DataInitializer` to prevent test data conflicts

---

## [Unreleased]

### Planned
- Password hashing with BCrypt
- JWT token-based authentication
- Pagination for patient and analysis lists
- Export medical file as PDF
- Admin analytics dashboard with charts
- Email notifications for upcoming appointments
- Bean Validation (`@Valid`) on all API request bodies
