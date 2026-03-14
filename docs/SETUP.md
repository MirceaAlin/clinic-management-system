# Setup Guide

## Table of Contents

- [Docker (Recommended)](#docker-recommended)
- [Manual Local Setup](#manual-local-setup)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)

---

## Docker (Recommended)

### Requirements

| Software | Minimum Version | Download |
|---|---|---|
| Docker Desktop | 24.0 | [docker.com](https://www.docker.com/products/docker-desktop) |

Docker Desktop includes both Docker Engine and Docker Compose.

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/MirceaAlin/clinic-management-system.git
cd clinic-management-system

# 2. Create the environment config file
cp .env.example .env          # Linux / macOS
Copy-Item .env.example .env   # Windows PowerShell

# 3. (Optional) Edit .env to change the database password
# DB_PASSWORD=your_secure_password

# 4. Start all services
docker compose up --build

# Or in detached (background) mode:
docker compose up -d --build
```

### Verify

```bash
docker compose ps

# Expected output:
# clinica_db        running (healthy)
# clinica_backend   running (healthy)
# clinica_frontend  running
```

Access the app at: **http://localhost**

### Stop

```bash
docker compose down             # stop (keeps data)
docker compose down --volumes   # stop + delete PostgreSQL data
```

---

## Manual Local Setup

### Requirements

| Software | Version | Download |
|---|---|---|
| Java JDK | 21+ | [adoptium.net](https://adoptium.net) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| PostgreSQL | 16 | [postgresql.org](https://www.postgresql.org) |

### Backend

#### Option A: PostgreSQL via Docker (recommended)

```bash
docker run -d \
  --name clinica_db \
  -e POSTGRES_DB=clinicadb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=parola123 \
  -p 5432:5432 \
  postgres:16-alpine
```

#### Option B: Local PostgreSQL installation

```sql
CREATE DATABASE clinicadb;
CREATE USER postgres WITH PASSWORD 'parola123';
GRANT ALL PRIVILEGES ON DATABASE clinicadb TO postgres;
```

#### Start backend

```bash
cd backend

# Linux / macOS
./gradlew bootRun

# Windows
gradlew.bat bootRun
```

Spring Boot will automatically:
1. Connect to PostgreSQL
2. Create all tables (`ddl-auto=update`)
3. Seed demo data via `DataInitializer`

API available at: `http://localhost:8080/api`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI available at: `http://localhost:5173`

> Vite automatically proxies all `/api` requests to `http://localhost:8080`.
> Make sure the backend is running before accessing the UI.

---

## Advanced Configuration

### Change frontend port

In `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3000:80"  # accessible at http://localhost:3000
```

### Change backend port

```yaml
backend:
  ports:
    - "9090:8080"
```

Also update `nginx.conf`:
```nginx
location /api/ {
    proxy_pass http://backend:9090/api/;
}
```

### Connect to PostgreSQL with pgAdmin

```
Host:     localhost
Port:     5432
Database: clinicadb
Username: postgres
Password: (from your .env file)
```

---

## Troubleshooting

### `package-lock.json: not found`

The frontend Dockerfile uses `npm install` (not `npm ci`), so no lock file is needed. If you see this error, ensure you are using the correct `frontend/Dockerfile` from this repo.

### Backend fails to start — connection refused

```
Unable to acquire JDBC Connection
```

PostgreSQL is not running or credentials are wrong. Check:

```bash
docker compose ps          # verify db is healthy
docker compose logs db     # check db logs
docker compose down && docker compose up --build
```

### Frontend shows 502 Bad Gateway on /api

The backend is not healthy yet. Check:

```bash
docker compose logs backend
curl http://localhost:8080/actuator/health
```

Wait 30–60 seconds for the JVM to fully start.

### Port 80 already in use (Windows)

```
Error: bind: address already in use :::80
```

IIS or another web server is using port 80. Either stop IIS:
```powershell
Stop-Service W3SVC
```

Or change the frontend port in `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8090:80"
```

### Full reset

```bash
docker compose down --volumes --remove-orphans
docker builder prune -f
docker compose up --build
```
