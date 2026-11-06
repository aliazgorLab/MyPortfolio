# Personal Portfolio & Admin Dashboard — Frontend

Modern, high-performance portfolio website and administrative CMS frontend for **Md Ali Azgor**, built with Next.js 16 App Router, React 19, Tailwind CSS, Lucide icons, and GSAP/Lenis smooth animations.

---

## Directory Structure

```
frontend/
├── app/                           # Next.js 16 App Router routes
│   ├── page.js                    # Public portfolio landing page
│   ├── layout.js                  # Root layout with fonts & metadata
│   ├── globals.css                # Global styles & Tailwind utilities
│   ├── work/[slug]/               # Dynamic project case study pages
│   ├── admin/                     # Admin Dashboard CMS routes
│   │   ├── page.js                # Dashboard overview & statistics
│   │   ├── login/                 # Administrator login
│   │   ├── projects/              # Projects management
│   │   ├── artworks/              # Artwork management
│   │   ├── experiences/           # Experience management
│   │   ├── education/             # Education management
│   │   ├── skills/                # Skills management
│   │   ├── certifications/        # Certifications management
│   │   ├── achievements/          # Achievements management
│   │   ├── media/                 # Storage & media asset manager
│   │   └── settings/              # Website settings & CV management
│   └── api/                       # App Router Route Handlers
│       ├── admin/health/          # Health check endpoint
│       ├── media/cleanup-worker/  # Background media cleanup worker
│       └── publishing/            # Atomic publication endpoints
├── components/                    # UI Components
│   ├── layout/                    # Navbar, Preloader, Header
│   ├── sections/                  # Portfolio sections (Hero, SelectedWork, About, etc.)
│   └── ui/                        # Buttons, Modals, Marquee, Inputs
├── data/
│   └── portfolioData.js           # Static fallback portfolio content
├── lib/
│   ├── actions/                   # Next.js Server Actions (CMS mutations)
│   ├── validations/               # Zod input validation schemas
│   ├── services/                  # Data fetching layer with fallback support
│   ├── supabase/                  # SSR and browser Supabase clients
│   ├── gsap.js                    # Animation helpers
│   └── utils.js                   # Class name merging & utility functions
├── public/                        # Static assets (images, icons)
├── package.json                   # Frontend dependencies & build scripts
├── next.config.mjs                # Next.js configuration
├── tailwind.config.js             # Tailwind CSS design system configuration
└── middleware.js                  # Supabase session & route protection middleware
```

---

## Running the Frontend

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file based on `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the portfolio.  
Access `/admin` for the Content Management System.

### 4. Build for Production
```bash
npm run build
```

