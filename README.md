# Md Ali Azgor — Personal Portfolio & CMS

This repository contains the full personal portfolio and Content Management System (CMS) for **Md Ali Azgor**, organized into two dedicated folders: `frontend` and `backend`.

---

## Project Structure

```
My Portfolio/
├── frontend/                      # Next.js 16 App Router client & admin frontend
│   ├── app/                       # Routes (Public portfolio, dynamic case studies, admin dashboard)
│   ├── components/                # UI design system, section components, animations
│   ├── data/                      # Fallback static portfolio data
│   ├── lib/                       # Actions, validations, Supabase clients, utilities
│   ├── public/                    # Static image & vector assets
│   ├── package.json               # Frontend dependencies & build scripts
│   ├── next.config.mjs            # Next.js configuration
│   ├── tailwind.config.js         # Tailwind CSS styling configuration
│   └── README.md                  # Detailed frontend documentation
│
├── backend/                       # Database migrations, Supabase policies & REST API
│   ├── src/                       # Express server, REST endpoints, services & validations
│   ├── supabase/                  # Supabase PostgreSQL schema, RLS policies, storage & test suite
│   │   └── migrations/            # Versioned SQL migrations (00 to 04)
│   ├── scripts/                   # Security test runner & database seeding scripts
│   ├── package.json               # Backend dependencies & scripts
│   ├── .env.example               # Backend environment variables template
│   └── README.md                  # Detailed backend documentation
│
├── package.json                   # Root monorepo workspace orchestrator
├── .gitignore                     # Repository-wide ignore rules
└── README.md                      # Workspace architecture documentation
```

---

## Quick Start

### 1. Frontend Development (Portfolio & Admin Dashboard)

To start the Next.js development server:

```bash
# From workspace root:
npm run dev:frontend

# Or directly in the frontend directory:
cd frontend
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public portfolio.  
Visit [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

### 2. Backend Development (API Server & Supabase)

To start the standalone backend API server:

```bash
# From workspace root:
npm run dev:backend

# Or directly in the backend directory:
cd backend
npm run dev
```

The backend server runs on [http://localhost:5000](http://localhost:5000).

### 3. Build & Test

- **Build Frontend for Production:**
  ```bash
  npm run build:frontend
  ```
- **Run Backend Security Verification:**
  ```bash
  npm run test:security
  ```

---

## Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS, GSAP, Lenis, Lucide React, Zod.
- **Backend:** Node.js, Express, Supabase (PostgreSQL 15+, Auth, Storage), Row Level Security (RLS).
