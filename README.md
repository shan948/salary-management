# ACME Organization: Global Employee Salary Management Platform

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Unit%20Tests-7%20Passed-success.svg)]()
[![Headcount Scale](https://img.shields.io/badge/Employee%20Scale-10%2C000%20Seeded-purple.svg)]()

An enterprise-grade, high-performance compensation intelligence and employee salary management system built for **ACME Organization's HR Manager and People Operations Leadership**.

---

## 🎯 Problem Statement & Product Framing

Currently, ACME org’s HR team manages compensation and salary records for **10,000 employees across 10 international countries** using disconnected, error-prone spreadsheets.

Spreadsheet limitations encountered:
1. **Lack of Single Source of Truth:** Manual exchange rate calculations and siloed country files create data drift.
2. **Slow Executive Answers:** Leadership cannot readily answer questions like *"How much do we pay by department?"*, *"Is there a gender pay gap?"*, or *"Which employees are under-band?"*.
3. **No Auditability:** Spreadsheets lack tamper-proof audit trails for salary revisions, promotions, and market adjustments.

**Our Solution:**  
A unified web application powered by **Java Spring Boot 3**, an **indexed Relational Database (H2)**, and a modern **React 18** interface, capable of sub-100ms querying across 10,000 employees, real-time aggregate analytics, pay equity audits, what-if scenario forecasting, and salary revision auditing.

---

## 🚀 Key Features

### 1. 📊 Executive Compensation Dashboard
- **Aggregate KPIs:** Total Annual Payroll, Base Pay vs. Variable/Bonus vs. Equity distribution, Median and Mean Base Pay.
- **Compa-Ratio Health:** Visual classification of employees into *Below Band (<80%)*, *In Band (80%-120%)*, and *Above Band (>120%)*.
- **Gender Pay Parity:** Real-time equity calculation across demographic cohorts and departmental breakdowns (EEOC/EU compliance).

### 2. 💡 Pay Intelligence Q&A Engine
Answers the HR Manager's core executive questions on demand:
- *"How much does ACME spend annually on total compensation and base salaries?"*
- *"Which departments have the highest and lowest compensation rates?"*
- *"What is our organization-wide gender pay parity gap?"*
- *"How many employees are currently paid outside their designated salary bands?"*
- *"What is our average Compa-Ratio and what does it tell us?"*
- *"How does ACME distribute headcount and compensation geographically?"*

### 3. 👥 10,000-Employee High-Performance Directory
- Server-side pagination, multi-column indexed sorting, and debounced full-text search.
- Multi-faceted filters: Department, Country, Seniority Level (L1–L7), Gender, and Compa-Ratio Band.
- Direct quick-actions: View Employee Detail Profile and Adjust Salary.

### 4. 📝 Compensation Adjustment & Audit Trail
- Modal for adjusting Base Salary, Variable Bonus %, and Annual Equity with real-time Compa-Ratio preview.
- Captures reason (*Merit, Promotion, Market Adjustment, Equity Correction*), authorization, notes, and timestamp.
- Immutable audit log tracking historical compensation progression.

### 5. 🧮 What-If Compensation Adjustment Simulator
- Interactive slider modeling percentage merit increases (+0.5% to +15.0%).
- Scope selection (Organization-wide vs. Department vs. Country).
- Live calculation of impacted headcount, current expenditure, projected expenditure, net financial budget delta ($), and per-employee average.

---

## 🏗️ Architecture & Technology Stack

- **Backend:** Java 21 LTS, Spring Boot 3.3.4, Spring Data JPA, Spring Web MVC, Hibernate ORM
- **Database:** H2 Relational Database (ANSI SQL, multi-column indexes, transactional batching)
- **Frontend:** React 18, Vite 5, Lucide React, Custom Glassmorphic Enterprise Design Tokens (Vanilla CSS)
- **Seeding:** High-performance seed engine generating 10,000 realistic international records in < 3 seconds

```
shan/
├── backend/                  # Java Spring Boot 3 application
│   ├── src/main/java/com/acme/salary/
│   │   ├── config/WebConfig.java
│   │   ├── controller/       # EmployeeController, AnalyticsController, SeedController
│   │   ├── dto/              # Strongly typed response and request DTOs
│   │   ├── model/            # Employee & SalaryAdjustmentLog entities
│   │   ├── repository/       # JpaRepository with aggregation queries
│   │   └── service/          # EmployeeService, AnalyticsService, SeedDataService
│   ├── src/main/resources/application.yml
│   └── src/test/java/com/acme/salary/ # Deterministic unit test suite
├── frontend/                 # React 18 application (Vite)
│   ├── src/
│   │   ├── components/       # Navbar, KPICards, VisualAnalytics, EmployeeTable, etc.
│   │   ├── services/api.js   # REST API client
│   │   ├── App.jsx           # Root layout and state coordinator
│   │   └── index.css         # Modern styling and design tokens
├── docs/                     # Architectural & Product Artifacts
│   ├── REQUIREMENTS.md       # One-page PRD with goals, personas, and non-goals
│   ├── ARCHITECTURE.md       # Mermaid architecture diagram & component design
│   ├── TRADE_OFFS.md         # Engineering decisions & trade-off rationale
│   ├── PERFORMANCE.md        # 10k employee scale & indexing strategy
│   └── AI_PROMPTS.md         # Intentional AI prompts & workflow log
├── start-app.bat             # One-click Windows startup script
├── start-app.ps1             # PowerShell startup script
└── README.md
```

---

## ⚡ Quick Start Instructions

### Prerequisites
- Java 21 JDK & Maven 3.9+ (configured in `C:\Users\User\tools` or system PATH)
- Node.js 20+ & npm

### Option 1: One-Click Launch (Windows)
Double-click `start-app.bat` or run:
```powershell
.\start-app.ps1
```

### Option 2: Run Backend & Frontend Separately

**1. Start the Java Spring Boot Backend:**
```powershell
cd backend
mvn spring-boot:run
```
*Backend runs on: `http://localhost:8080`*  
*H2 Console: `http://localhost:8080/h2-console`*

**2. Start the React Frontend:**
```powershell
cd frontend
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🧪 Running Unit Tests

Run fast, deterministic unit tests for both business logic and compensation analytics:
```powershell
cd backend
mvn test
```

**Test Coverage Highlights:**
- `EmployeeServiceTest`: Validates search filtering, salary adjustments, compa-ratio updates, and audit trail persistence.
- `AnalyticsServiceTest`: Validates aggregate KPI calculations, gender pay gap mathematical formulas, what-if scenario budgets, and executive Q&A responses.

---

## 📚 Deliverable Artifacts
- [Requirements Document (PRD)](docs/REQUIREMENTS.md)
- [Architecture & Data Model](docs/ARCHITECTURE.md)
- [Trade-Offs & Decisions](docs/TRADE_OFFS.md)
- [Performance & Scale Strategy](docs/PERFORMANCE.md)
- [AI Workflow & Prompts Log](docs/AI_PROMPTS.md)
