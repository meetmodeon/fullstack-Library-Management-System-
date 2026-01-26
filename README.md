# 📚 LBM — Library Management System

A full-stack Library Management System built with Angular (frontend) and Spring Boot (backend). This README documents how to run the project locally, build for production, and run with Docker.

Overview
- Frontend: Angular (TypeScript, SCSS)
- Backend: Spring Boot (Java 17, Maven)
- Database: MySQL
- Containerization: Docker (frontend + backend Dockerfiles present)
- API base (frontend points here): http://localhost:8080/api/v1
- API docs (Swagger): http://localhost:8080/swagger-ui.html

Table of Contents
- Project layout
- Prerequisites
- Environment variables
- Run locally (backend & frontend)
- Build & run with Docker
- API highlights
- Database / migrations
- Testing
- Contributing
- License & contact

Project layout (what I found)
- root/ — Maven Spring Boot application (pom.xml, src/)
- lib_ui/ — Angular frontend (environment.ts, docs, dist output path used by Docker)
- docker/frontend/Dockerfile — builds Angular and serves via nginx
- docker/backend/Dockerfile — builds Spring Boot jar and runs it
- README and documentation in `lib_ui/documentation/` (generated Compodoc)

Prerequisites
- Java 17 JDK
- Maven 3.x
- Node.js (recommended 18+)
- npm
- Angular CLI (optional for global `ng` command) — or use npx
- MySQL server (or use Docker)
- Docker & Docker Compose (if you want to run containers)

Environment variables
Backend (example .env or environment to provide to container/host)
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/lbm
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_mysql_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev

Note: adjust keys to match your `application.properties`/`application.yml` if they use different property names.

Frontend (lib_ui/src/environments/environment.ts)
- apiUrl: http://localhost:8080/api/v1 (this file already points to the backend)
If you prefer env file for build-time:
- VITE_API_URL or REACT_APP_API_URL equivalents are not required here; Angular uses `environment.ts` for dev and `environment.prod.ts` for production.

Run locally (recommended for development)

1) Start MySQL
- Start a local MySQL server and create database `lbm`:
  - CREATE DATABASE lbm;
  - Grant user privileges or use root for dev

2) Backend (from repo root)
- Install & run:
  - mvn clean package
  - mvn spring-boot:run
  or
  - mvn clean package -DskipTests
  - java -jar target/LMS-*.jar
- Backend will be available at: http://localhost:8080
- Swagger UI (if enabled): http://localhost:8080/swagger-ui.html
- API base: http://localhost:8080/api/v1

3) Frontend (lib_ui/)
- cd lib_ui
- npm install
- ng serve
- Open: http://localhost:4200
Notes:
- `lib_ui/src/environments/environment.ts` sets `apiUrl: "http://localhost:8080/api/v1"` by default.
- To build production bundle: npm run build — the Dockerfile expects build output at `dist/lib_ui/browser`.

Build & run with Docker (quick)
- There are Dockerfiles for both services:
  - docker/frontend/Dockerfile
  - docker/backend/Dockerfile

Using docker-compose (if a compose file is present or you add one)
- Example:
  docker-compose up --build -d
- After containers are up:
  - Frontend: http://localhost:4200 (nginx)
  - Backend API: http://localhost:8080/api/v1

Notes on Dockerfiles found
- Frontend Dockerfile builds Angular and copies `dist/lib_ui/browser` into nginx html.
- Backend Dockerfile uses Maven build stage and runs the produced jar with Java 17.

API highlights
- Base path: /api/v1
- Example endpoints (confirm from controllers):
  - Auth: POST /api/v1/auth/login, /api/v1/auth/register (if implemented)
  - Books: GET /api/v1/books, POST /api/v1/books (admin)
  - Borrow/Return: /api/v1/borrow, /api/v1/return
- Check Swagger for the exact list of endpoints: http://localhost:8080/swagger-ui.html

Database & migrations
- The project appears to use Spring JPA and will auto-create/update schema if configured (e.g., `spring.jpa.hibernate.ddl-auto=update`).
- For production, prefer managed migrations with Flyway or Liquibase.

Testing
- Backend:
  - mvn test
- Frontend:
  - cd lib_ui
  - npm test (if tests exist)

Docs & generated frontend docs
- `lib_ui/documentation/` contains generated Compodoc HTML documentation for the Angular app.

Common troubleshooting
- If frontend cannot reach backend, ensure CORS is enabled in Spring Boot or both are accessed through the same origin or a reverse proxy.
- If Docker build fails for frontend, confirm the Angular build command produces the expected `dist/lib_ui/browser` output path.
- If Spring Boot cannot connect to MySQL, confirm `SPRING_DATASOURCE_URL` and credentials.

Contribution
- Fork → branch → PR
- Add tests for new features
- Keep code style consistent with project conventions

License & contact
- Add your LICENSE file if you have a preferred license (MIT, Apache-2.0, etc.)
- Maintainer: meetmodeon — https://github.com/meetmodeon

---

If you want, I can:
- Add a ready-to-use docker-compose.yml that wires backend, frontend, and a MySQL service.
- Generate a CONTRIBUTING.md and a GitHub Actions workflow to run Maven and npm tests on PRs.
- Extract exact Spring Boot property names from the code and list the exact environment keys to set.

Would you like me to create a docker-compose.yml for this repo next?
