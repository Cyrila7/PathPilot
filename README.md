# PathPilot

AI-powered career readiness platform for college students.

## What it does
Takes a student's DegreeWorks academic audit, GPA, career goal, and skills and generates a brutally honest, personalized 5-section career plan. No sugarcoating. Ever.

## Tech Stack
- Java + Spring Boot (REST API)
- PostgreSQL on Railway
- React + Vite on Vercel
- Claude AI via Anthropic API
- JWT Authentication (Spring Security)

## Features
- Register/login with JWT auth
- Paste DegreeWorks academic audit
- Grade level aware (Freshman → Senior urgency)
- AI generates: Assessment, Priorities, Skills, Timeline, Course Recommendations

## Endpoints
- POST /auth/register
- POST /auth/login
- POST /students
- GET /students/{id}
- POST /students/{id}/ai-plan

## Live
https://path-pilot-rho.vercel.app

## Built by
Cyril — NYC College of Technology, Computer Systems
