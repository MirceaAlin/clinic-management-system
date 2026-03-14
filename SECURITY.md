# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public GitHub issue.

Report it privately via [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/creating-a-repository-security-advisory).

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

We will acknowledge within 48 hours and aim to release a fix within 14 days.

## Current Security Notes

This project is designed for **academic / demo purposes**. The following known limitations exist in the current version:

| Limitation | Status |
|---|---|
| Passwords stored in plaintext | ⚠️ Known — use BCrypt in production |
| No JWT token authentication | ⚠️ Known — session via localStorage |
| No rate limiting on auth endpoints | ⚠️ Known |
| No input validation (`@Valid`) | ⚠️ Known |

**Do not use this version in production with real patient data.**

## Deployment Security Checklist

Before deploying to any public environment:

- [ ] Replace all default credentials set by `DataInitializer`
- [ ] Hash passwords using **BCrypt** (`spring-security-crypto`)
- [ ] Implement **JWT authentication** and protect all non-public endpoints
- [ ] Use environment variables for all secrets — never hardcode passwords
- [ ] Configure **HTTPS** — never run plain HTTP in production
- [ ] Restrict CORS in `CorsConfig.java` to your actual domain(s)
- [ ] Set `spring.jpa.show-sql=false` in production
- [ ] Do not expose port `5432` (PostgreSQL) publicly
- [ ] Run `./gradlew dependencyUpdates` and `npm audit` regularly
- [ ] Enable Spring Boot Actuator security for production health endpoints
