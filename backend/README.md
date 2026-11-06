# Portfolio CMS — Backend Service & Database Layer

This directory contains the database schema, security migrations, Supabase storage policies, and backend services for the Md Ali Azgor Personal Portfolio CMS.

---

## Directory Structure

```
backend/
├── package.json                   # Backend Node dependencies & scripts
├── .env.example                   # Backend environment template
├── scripts/
│   ├── seed.js                    # Database seed execution helper
│   └── test-security.js           # Security test runner
├── src/
│   ├── server.js                  # Express REST API entrypoint
│   ├── routes/                    # REST endpoints (projects, artworks, stats, etc.)
│   ├── services/                  # Database data access services
│   ├── supabase/                  # Supabase admin and client factories
│   └── validations/               # Reusable Zod validation schemas
└── supabase/
    └── migrations/
        ├── 00_down.sql            # Teardown script in reverse-dependency order
        ├── 01_initial_schema_and_rls.sql  # Revision 3.8 hardened schema & RLS
        ├── 02_storage_setup.sql   # Dual bucket configuration & storage policies
        ├── 03_seed_portfolio_data.sql     # Initial portfolio content seed
        └── 04_security_test_suite.sql     # 20-assertion SQL test suite
```

---

## Database Architecture Highlights (Revision 3.8)

1. **Role Protection & Column Security:**
   - Client callers cannot update `profiles.role` or `is_pending_deletion` directly.
   - Column-level `REVOKE UPDATE` is enforced on sensitive columns.
   - Initial bootstrap is handled exclusively via `bootstrap_first_admin()` protected with PostgreSQL transaction-level advisory locks.

2. **Storage Separation:**
   - `portfolio-media`: Publicly readable bucket for published images and artworks.
   - `portfolio-private`: Restricted bucket for drafts, private documents, and CV/resumes.
   - Authenticated users cannot mutate or delete objects directly; all changes go through server workflows.

3. **Concurrency-Safe Media Cleanup:**
   - Media references are validated using transactional row locks (`FOR SHARE`).
   - Cleanup worker uses individual job tokens, bounded leases, and dead-letter queue reapers.

---

## Running the Backend

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your Supabase project credentials.

### 3. Start the API Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Run Security Checks
```bash
npm run test:security
```

