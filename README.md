# Voice Flow 🎙️

A premium Court Reporting Workflow management application built with a modern fullstack monorepo architecture.

## 🏗 Architecture

This project is a monorepo managed by **Turborepo** and **pnpm**, organized into the following structure:

-   `apps/client`: React + Vite frontend using Atomic Design and CSS Modules.
-   `apps/server`: Node.js + Express backend with Drizzle ORM.
-   `packages/types`: Shared TypeScript definitions.
-   `packages/tsconfig`: Shared TypeScript configurations.

## 🚀 Getting Started

### Prerequisites

-   **Node.js**: >= 18.0.0
-   **pnpm**: >= 8.0.0
-   **Docker**: For running the PostgreSQL database.

### 1. Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### 2. Environment Setup

Create a `.env` file in `apps/server/`:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/voice_flow_db
```

### 3. Database Setup

Start the database container:

```bash
docker-compose up -d postgres
```

Push the database schema and seed initial data (Reporters and Editors):

```bash
# Push schema
pnpm --filter server db:push

# Seed data
pnpm --filter server db:seed
```

### 4. Running the Project

Start the development server for both frontend and backend:

```bash
pnpm dev
```

The application will be available at:
-   **Frontend**: [http://localhost:5173](http://localhost:5173)
-   **Backend**: [http://localhost:3001](http://localhost:3001)

## 🛠 Tech Stack

-   **Frontend**: React, Vite, TanStack Query, CSS Modules.
-   **Backend**: Node.js, Express, Drizzle ORM, PostgreSQL.
-   **Monorepo**: Turborepo, pnpm workspaces.

## 📖 Key Features

-   **Job Lifecycle Management**: Track jobs from `NEW` -> `ASSIGNED` -> `TRANSCRIBED` -> `REVIEWED` -> `COMPLETED`.

-   **Availability Tracking**: Automatic toggling of Reporter availability based on assignments.
-   **Location-Based Matching**: Intelligent sorting of Reporters based on physical job locations.
-   **Real-time Pagination**: URL-synced table pagination for large datasets.
