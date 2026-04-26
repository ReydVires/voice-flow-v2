# Voice Flow — Court Reporting Workflow Manager 🎙️⚖️

A fullstack app for managing court reporting jobs — handling assignment, transcription, review, payments, and reporter availability in one place.

---

## 📸 Sample Outputs / Screenshots

### Dashboard Overview

Job creation form and active jobs table.

![Dashboard Overview](docs/screenshots/01-dashboard.png)

### Active Jobs Table

Shows status, assigned staff, location, and payment breakdown for each job.

![Job Table](docs/screenshots/02-job-table.png)

### Reporter Assignment Modal

Lists available reporters. For physical jobs, same-city reporters appear first.

![Assign Reporter Modal](docs/screenshots/03-assign-reporter-modal.png)

---

## 🏗 Architecture

Monorepo using [Turborepo](https://turbo.build/) + [pnpm](https://pnpm.io/):

```
voice-flow/
├── apps/
│   ├── client/          # React + Vite frontend (Atomic Design, CSS Modules)
│   └── server/          # Node.js + Express backend (Drizzle ORM, PostgreSQL)
├── packages/
│   ├── types/           # Shared TypeScript type definitions
│   └── tsconfig/        # Shared TypeScript configurations
├── docker-compose.yml   # Docker services (PostgreSQL)
├── turbo.json           # Turborepo pipeline config
└── package.json         # Root workspace scripts
```

### Frontend (`apps/client`)

- **React 18** + **Vite**
- **Atomic Design** components (Atoms → Molecules → Organisms)
- **TanStack Query** for data fetching & caching
- **CSS Modules** with dark theme and glassmorphism

### Backend (`apps/server`)

- **Express.js** REST API
- **Drizzle ORM** + PostgreSQL
- Relational queries with eager-loaded reporter/editor data
- Graceful shutdown (SIGINT/SIGTERM)

### Shared Packages (`packages/`)

- **`@mern/types`** — Shared interfaces (`Job`, `User`, `ApiResponse`, `JobPayments`)
- **`@mern/tsconfig`** — Shared TS configs

---

## 📖 Key Features

| Feature | Description |
|---|---|
| **Job Lifecycle Management** | Track jobs through `NEW` → `ASSIGNED` → `TRANSCRIBED` → `REVIEWED` → `COMPLETED` |
| **Auto Payment Calculation** | Reporter: Rp 2,000/min × duration; Editor: Rp 100,000 flat fee per job |
| **Availability Tracking** | Reporter availability auto-toggles on assignment and job completion |
| **Location-Based Matching** | For physical jobs, reporters in the same city are sorted first in the assignment modal |
| **Simulated Transcription** | After editor assignment, jobs auto-advance from `TRANSCRIBED` → `REVIEWED` (2s delay) |
| **URL-Synced Pagination** | Table pagination state persists in the URL for shareable, bookmarkable views |
| **Glassmorphism UI** | Modern dark theme with blur effects, gradient accents, and smooth transitions |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| **Node.js** | >= 18.0.0 |
| **pnpm** | >= 8.0.0 |
| **PostgreSQL** | >= 14 (via Docker or local install) |
| **Docker** *(optional)* | For running PostgreSQL in a container |

### 1. Clone & Install

```bash
git clone https://github.com/ReydVires/voice-flow-v2
cd voice-flow
pnpm install
```

### 2. Environment Setup

Copy the example env file and adjust if needed:

```bash
cp apps/server/.env.example apps/server/.env
```

Default values in `.env`:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/voice_flow_db
```

### 3. Database Setup

**Option A — Using Docker (recommended):**

```bash
docker-compose up -d postgres
```

**Option B — Using local PostgreSQL:**

Create the database manually:

```sql
CREATE DATABASE voice_flow_db;
```

Then, push the schema and seed initial data:

```bash
pnpm setup:db
```

This runs `drizzle-kit push` (schema migration) followed by `tsx src/seed.ts` (seeds 3 Reporters in Jakarta/Bandung/Surabaya and 2 Editors).

### 4. Run the Application

```bash
pnpm dev
```

Starts both frontend and backend via Turborepo:

| Service | URL |
|---|---|
| **Frontend** (Vite) | [http://localhost:5173](http://localhost:5173) |
| **Backend** (Express) | [http://localhost:3001](http://localhost:3001) |

### 5. Verify It Works

```bash
# Health check
curl http://localhost:3001/api/health

# List all jobs
curl http://localhost:3001/api/jobs

# List available reporters
curl http://localhost:3001/api/reporters
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/jobs` | Create a new job |
| `GET` | `/api/jobs` | List all jobs (with reporter/editor/payments) |
| `GET` | `/api/jobs/:id` | Get job details by ID |
| `PATCH` | `/api/jobs/:id/assign-reporter` | Assign a reporter to a job |
| `PATCH` | `/api/jobs/:id/assign-editor` | Assign an editor (triggers transcription flow) |
| `PATCH` | `/api/jobs/:id/complete` | Mark job as completed (releases reporter) |
| `GET` | `/api/reporters?jobId=<id>` | List available reporters (sorted by location match) |
| `GET` | `/api/editors` | List available editors |

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TanStack Query, CSS Modules |
| **Backend** | Node.js, Express, Drizzle ORM, PostgreSQL |
| **Shared** | TypeScript (strict), shared type definitions |
| **Monorepo** | Turborepo, pnpm workspaces |
| **Database** | PostgreSQL 16, Docker Compose |

---

## 📁 Database Schema

```
┌─────────────────────┐       ┌─────────────────────┐
│       users          │       │        jobs          │
├─────────────────────┤       ├─────────────────────┤
│ id (UUID, PK)       │◄──┐   │ id (UUID, PK)       │
│ email (unique)      │   ├───│ reporterId (FK)      │
│ username (unique)   │   └───│ editorId (FK)        │
│ password            │       │ caseName             │
│ role (REPORTER/     │       │ duration (minutes)   │
│       EDITOR/ADMIN) │       │ locationType         │
│ location            │       │ locationName         │
│ availability (bool) │       │ status (enum)        │
│ createdAt           │       │ createdAt            │
│ updatedAt           │       │ updatedAt            │
└─────────────────────┘       └─────────────────────┘
```

**Job Status Flow:**

```
NEW → ASSIGNED → TRANSCRIBED → REVIEWED → COMPLETED
      (reporter)   (editor)     (auto)     (manual)
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start frontend + backend in development mode |
| `pnpm build` | Build all packages for production |
| `pnpm setup:db` | Push DB schema + seed initial data |
| `pnpm lint` | Run linting across all packages |
| `pnpm test` | Run tests across all packages |
| `pnpm clean` | Clean build artifacts |

---

voice-flow@2026
