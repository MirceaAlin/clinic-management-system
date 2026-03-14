# Contributing to clinic-management-system

Thank you for your interest in contributing! Here's how to get started.

## 🐛 Reporting Bugs

Open an issue using the **Bug Report** template and include:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Java version, Node version, OS, Docker version)

## 💡 Suggesting Features

Open an issue using the **Feature Request** template. Describe the use case and why it would benefit the project.

## 🔧 Development Workflow

1. Fork the repo and clone locally
2. Create a branch: `git checkout -b feat/your-feature` or `fix/your-bug`
3. Make your changes
4. Test backend: `cd backend && ./gradlew test`
5. Test frontend: `cd frontend && npm test && npm run build`
6. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` — new feature
   - `fix:` — bug fix
   - `docs:` — documentation only
   - `refactor:` — code restructuring without behavior change
   - `test:` — adding or updating tests
   - `chore:` — build/config changes
7. Push and open a Pull Request against `main`

## 📐 Code Style

**Java (Backend)**
- Follow standard Spring Boot conventions
- Use `@Service`, `@Repository`, `@RestController` appropriately
- Always use DTOs in controller responses — never expose JPA entities directly
- Add `@JsonIgnore` on bidirectional relationships to prevent infinite recursion

**TypeScript (Frontend)**
- Strict typing — avoid `any` unless absolutely necessary
- All API calls go through `src/api/` — never use raw `fetch` in components
- Components use `React.FC<Props>` with explicit prop interfaces

**CSS**
- Keep styles scoped to their respective module files in `src/styles/`
- Follow the existing glassmorphism design language

## ✅ PR Checklist

- [ ] Code compiles and runs without errors
- [ ] All existing tests pass: `./gradlew test` and `npm test`
- [ ] New functionality has corresponding tests
- [ ] No breaking changes to existing API endpoints
- [ ] New endpoints are documented in the README
- [ ] Sensitive data (passwords, tokens) is not committed
- [ ] Docker build still works: `docker compose up --build`
