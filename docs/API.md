# API Reference

**Base URL:** `http://localhost:8080/api`

**Content-Type:** `application/json`

---

## Authentication

### POST `/auth/login`

Authenticate a user and return their profile.

**Request body:**
```json
{
  "email": "doctor@studmed.ro",
  "password": "doctor123"
}
```

**Response 200:**
```json
{
  "id": 2,
  "firstName": "Maria",
  "lastName": "Popa",
  "email": "doctor@studmed.ro",
  "role": "DOCTOR"
}
```

**Errors:**
- `400 Bad Request` — missing email or password
- `401 Unauthorized` — wrong credentials

---

### POST `/auth/register`

Register a new patient account.

**Request body:**
```json
{
  "firstName": "Ion",
  "lastName": "Popescu",
  "email": "ion@studmed.ro",
  "password": "pass123"
}
```

**Response 200:** same format as login response

**Errors:**
- `400 Bad Request` — email already registered or missing fields

---

## Patients

### GET `/patients`

Returns all patients.

**Response 200:**
```json
[
  {
    "id": 3,
    "firstName": "Ana",
    "lastName": "Ionescu",
    "email": "patient@studmed.ro",
    "personalIdNumber": "2001050110001",
    "address": "Str. Mihai Eminescu 5, Cluj-Napoca",
    "universityFaculty": "Faculty of Computer Science"
  }
]
```

---

### GET `/patients/{id}`

Returns a single patient by ID.

**Response 200:** PatientDTO object

**Errors:** `404 Not Found`

---

### PUT `/patients/{id}`

Update a patient's data. All fields optional.

**Request body:**
```json
{
  "firstName": "Ana-Maria",
  "lastName": "Ionescu",
  "email": "ana@studmed.ro",
  "address": "New Street 10",
  "personalIdNumber": "2001050110001",
  "universityFaculty": "Faculty of Law"
}
```

**Response 200:** updated PatientDTO

**Errors:** `404 Not Found`

---

## Doctors

### GET `/doctors`

Returns all doctors.

**Response 200:**
```json
[
  {
    "id": 1,
    "firstName": "Maria",
    "lastName": "Popa",
    "specialization": "General Medicine",
    "department": "Outpatient"
  }
]
```

---

### GET `/doctors/{id}`

**Response 200:** DoctorDTO — `404 Not Found` if missing

---

### GET `/doctors/{doctorId}/patients`

Returns all patients who have had a consultation with this doctor.

**Response 200:** array of PatientDTO

---

## Analyses

### GET `/analyses`

Returns all lab analyses.

**Response 200:**
```json
[
  {
    "id": 1,
    "testName": "Blood Glucose",
    "result": "98",
    "unit": "mg/dL",
    "normalRange": "70-110",
    "testDate": "2025-10-15",
    "patientId": 3
  }
]
```

---

### GET `/analyses/{id}`

**Response 200:** analysis object — `404 Not Found` if missing

---

### GET `/analyses/patient/{patientId}`

Returns all analyses for a specific patient.

**Response 200:** array of analysis objects

---

### POST `/analyses`

Add a new lab analysis for a patient.

**Required fields:** `testName`, `testDate`, `patientId`

**Request body:**
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

**Response 200:** saved analysis object

**Errors:**
- `400 Bad Request` — required fields missing or invalid `patientId`

---

### DELETE `/analyses/{id}`

Delete an analysis.

**Response 204:** No Content — `404 Not Found` if missing

---

## Consultations

### GET `/consultations`

Returns all consultations.

**Response 200:**
```json
[
  {
    "id": 1,
    "doctorId": 1,
    "patientId": 3,
    "date": "2025-10-15",
    "reason": "Routine check-up",
    "status": "Finalizata",
    "notes": "No major issues"
  }
]
```

---

### GET `/consultations/patient/{patientId}`

Returns full consultation history for a patient (with diagnosis, notes, recommendations).

**Response 200:**
```json
[
  {
    "id": 1,
    "date": "2025-10-15",
    "reason": "Routine check-up",
    "diagnosis": "Mild anemia",
    "notes": "Slightly low hemoglobin values.",
    "recommendations": "Iron supplement 30mg/day for 3 months.",
    "status": "Finalizata",
    "doctorName": "Maria Popa"
  }
]
```

---

### GET `/consultations/doctor/{doctorId}`

Returns all consultations for a specific doctor.

**Response 200:** array of ConsultationDTO

---

### POST `/consultations`

Create a new appointment/consultation.

**Required fields:** `doctorId`, `patientId`, `date`

**Request body:**
```json
{
  "doctorId": 1,
  "patientId": 3,
  "date": "2025-12-10",
  "reason": "Follow-up check"
}
```

**Response 200:** ConsultationDTO with `status: "Programata"`

**Errors:**
- `400 Bad Request` — doctor or patient not found

---

### PUT `/consultations/{id}`

Update consultation details. All fields optional.

**Request body:**
```json
{
  "diagnosis": "Mild anemia",
  "notes": "Slightly low Hgb values.",
  "recommendations": "Iron supplement.",
  "status": "Finalizata"
}
```

**Response 200:** updated ConsultationDTO

---

### PUT `/consultations/{id}/finish`

Shortcut to mark a consultation as finished.

**Response 200:** ConsultationDTO with `status: "Finalizata"`

---

### DELETE `/consultations/{id}`

**Response 204:** No Content — `404 Not Found` if missing

---

## Users *(Admin only)*

### GET `/users`

Returns all users in the system.

**Response 200:**
```json
[
  {
    "id": 1,
    "firstName": "Admin",
    "lastName": "STUDMED",
    "email": "admin@studmed.ro",
    "role": "ADMIN",
    "image": "/default-avatar.png"
  }
]
```

> **Note:** The `password` field is always omitted from responses (`@JsonIgnore`).

---

### PUT `/users/{id}`

Update `firstName`, `lastName`, or `email`.

**Response 200:** updated User object — `404 Not Found` if missing

---

### DELETE `/users/{id}`

**Response 204:** No Content — `404 Not Found` if missing

---

## Health Check

### GET `/actuator/health`

Used by Docker healthcheck to verify service is up.

**Response 200:**
```json
{ "status": "UP" }
```

---

## HTTP Status Codes

| Code | Meaning |
|---|---|
| `200 OK` | Success with response body |
| `204 No Content` | Success without response body (DELETE) |
| `400 Bad Request` | Invalid or missing data |
| `401 Unauthorized` | Wrong credentials |
| `404 Not Found` | Resource does not exist |
| `500 Internal Server Error` | Unexpected server error |
