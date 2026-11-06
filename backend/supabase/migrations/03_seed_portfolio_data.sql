-- ==============================================================================
-- 03_seed_portfolio_data.sql
-- Idempotent initial seed derived verbatim from data/portfolioData.js
-- Uses ON CONFLICT to prevent duplicate entries if re-run.
-- ==============================================================================

-- 1. ARTWORK CATEGORIES (Initial 5 curated categories for future Visual Archive)
INSERT INTO public.artwork_categories (name, slug, display_order)
VALUES
  ('Posters & Campaigns', 'posters-campaigns', 1),
  ('Brand Identity & Logos', 'brand-identity-logos', 2),
  ('Digital & Social Media', 'digital-social-media', 3),
  ('Editorial & Print Design', 'editorial-print-design', 4),
  ('Experimental Visuals', 'experimental-visuals', 5)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  display_order = EXCLUDED.display_order;

-- 2. PROJECTS (Initial 5 projects from portfolioData.js, seeded as published)
INSERT INTO public.projects (
  slug, number, title, category, tagline, description, long_description,
  features, tech, year, cover_image_url, live_url, github_url, accent, metrics,
  is_featured, display_order, status
)
VALUES
  (
    'iiuc-cover-generator',
    '01',
    'IIUC Cover Page Generator',
    'Product Design / Frontend Development',
    'Academic Document Automation Suite',
    'A specialized web application for generating academic document covers and related formats for International Islamic University Chittagong students.',
    'Engineered to remove formatting friction for thousands of university students. The application offers automated layout synthesis for assignment covers, laboratory reports, lab indexes, and group deliverables with pixel-perfect typography compliance and instant PDF export workflows.',
    '["Assignment cover generation with standard department schemas", "Lab report cover generation with course code synchronization", "Lab index table generator with dynamic experiment entries", "Group project cover generation with multi-member rosters", "Direct vector PDF export and instant print-ready document workflows"]'::jsonb,
    '["React", "Tailwind CSS", "jsPDF", "Canvas API", "Vercel"]'::jsonb,
    '2024',
    '/images/project-iiuc-cover.jpg',
    'https://github.com/aliazgorLab/iiuc-cover-generator',
    'https://github.com/aliazgorLab/iiuc-cover-generator',
    '#C7B8FF',
    '5,000+ generated documents',
    true,
    1,
    'published'
  ),
  (
    'osmentor-ai',
    '02',
    'OsMentor AI',
    'AI / Full-Stack Development',
    'Intelligent RAG Learning Platform',
    'An AI-assisted learning project exploring retrieval-augmented generation and educational support.',
    'Built to accelerate conceptual comprehension in technical computer science topics. OsMentor combines high-performance vector embeddings with an intuitive dual-pane workspace featuring an interactive node knowledge graph, code execution sandbox, and contextual streaming chat completions.',
    '["Retrieval-Augmented Generation (RAG) over structured course syllabi", "Interactive vector database retrieval node visualization", "Context-aware streaming code suggestions and debugging assistant", "Low-latency token generation via high-throughput Groq API integration", "ChromaDB local vector store with cosine similarity ranking"]'::jsonb,
    '["React", "Vite", "FastAPI", "LangChain", "ChromaDB", "Groq API"]'::jsonb,
    '2024',
    '/images/project-osmentor.jpg',
    'https://github.com/aliazgorLab/osmentor-ai',
    'https://github.com/aliazgorLab/osmentor-ai',
    '#9B82FF',
    'Sub-400ms vector retrieval',
    true,
    2,
    'published'
  ),
  (
    'protocolzero',
    '03',
    'ProtocolZero',
    'Full-Stack Development / Real-Time Systems',
    'Geospatial Incident Escalation Platform',
    'A reporting and escalation application built around structured reports and role-based workflows.',
    'A mission-critical incident tracking platform designed for emergency dispatch and enterprise escalation. Incorporates role-based access control, geospatial incident plotting, and persistent WebSocket channels for sub-50ms alert dispatching across security teams.',
    '["Real-time event dispatch via bidirectional Socket.IO pipelines", "Interactive geospatial coordinate tracking and incident clustering", "Hierarchical Role-Based Access Control (RBAC) with granular ACLs", "Telemetry dashboards tracking MTTR and escalation status", "Encrypted report dispatch with multi-tier audit trails"]'::jsonb,
    '["MERN Stack", "Socket.IO", "Leaflet/Mapbox", "JWT Auth", "Express"]'::jsonb,
    '2024',
    '/images/project-protocolzero.jpg',
    'https://github.com/aliazgorLab/protocolzero',
    'https://github.com/aliazgorLab/protocolzero',
    '#7AE7C7',
    'Real-time socket pipeline',
    true,
    3,
    'published'
  ),
  (
    'racdox-design',
    '04',
    'RACDOX UI/UX Work',
    'UI/UX Design / Professional Experience',
    'Enterprise Design System Architecture',
    'Selected interface design, high-fidelity wireframes, prototypes, and reusable design-system work from the RACDOX internship.',
    'An end-to-end design system engagement covering atomic component libraries, responsive viewports, accessibility color matrices, and interactive client prototypes. Focused on modular consistency, micro-animations, and fluid developer handoff.',
    '["Atomic design token architecture across light, dark, and high-contrast modes", "Interactive micro-interaction prototypes in Figma with variable logic", "Comprehensive responsive pattern library for desktop, tablet, and mobile", "Heuristic usability evaluations and developer handoff documentation"]'::jsonb,
    '["Figma", "Design Tokens", "Prototyping", "UX Research", "Design Systems"]'::jsonb,
    '2025',
    '/images/project-racdox.jpg',
    'https://github.com/aliazgorLab',
    'https://github.com/aliazgorLab',
    '#E2DAFF',
    'Complete multi-tier token library',
    true,
    4,
    'published'
  ),
  (
    'deadlock-ai',
    '05',
    'DeadlockAI',
    'Simulation / Software Engineering',
    'Concurrency & Lock Detection Suite',
    'A simulation suite with automated tests exploring deadlock-related behavior.',
    'An interactive computer systems simulation suite designed to model resource contention, circular wait conditions, and mutex deadlocks. Visualizes process-to-resource allocation graphs in real-time with automated cycle detection and mitigation strategies.',
    '["Resource Allocation Graph (RAG) visualizer with live cycle detection", "Automated test harness testing concurrency under synthetic stress", "Banker''s Algorithm safety state validation and avoidance simulation", "Exportable execution telemetry and thread contention metrics"]'::jsonb,
    '["Python", "Graph Algorithms", "Automated Testing", "Web Simulator"]'::jsonb,
    '2024',
    '/images/project-deadlock.jpg',
    'https://github.com/aliazgorLab/deadlock-ai',
    'https://github.com/aliazgorLab/deadlock-ai',
    '#FF8F94',
    'Automated cycle graph tests',
    true,
    5,
    'published'
  )
ON CONFLICT (slug) DO UPDATE SET
  number = EXCLUDED.number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  year = EXCLUDED.year,
  cover_image_url = EXCLUDED.cover_image_url,
  live_url = EXCLUDED.live_url,
  github_url = EXCLUDED.github_url,
  accent = EXCLUDED.accent,
  metrics = EXCLUDED.metrics,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 3. EXPERIENCES
INSERT INTO public.experiences (
  slug_id, role, company, employment_type, period, is_current, location, description, points, display_order, status
)
VALUES
  (
    'iiuc-cc-ags',
    'Assistant General Secretary',
    'IIUC Computer Club',
    'Executive Leadership',
    '2026 — PRESENT',
    true,
    'Chittagong, BD',
    'Co-leading executive club governance, strategic initiatives, and technical event ecosystems.',
    '["Spearheading club administration, cross-department coordination, and strategic tech initiatives.", "Co-directing flagship tech festivals, national hackathons, and competitive programming summits.", "Mentoring executive student teams and fostering university-wide developer culture."]'::jsonb,
    1,
    'published'
  ),
  (
    'zcc-cto',
    'CTO (Chief Technical Officer)',
    'Zahid''s Chem Clinic',
    'Executive Leadership',
    '2025 — PRESENT',
    true,
    'Chittagong, BD',
    'Leading technical architecture, software systems, and digital engineering initiatives.',
    '["Directing platform architecture, technical strategy, and development workflows across digital products.", "Leading engineering of modern educational web applications and student platform infrastructure.", "Overseeing systems performance, technical operations, and the bridge between interface design and robust code."]'::jsonb,
    2,
    'published'
  ),
  (
    'racdox',
    'UI/UX Designer Intern',
    'RACDOX',
    'Internship',
    'JAN 2025 — JUN 2025',
    false,
    'Remote / Hybrid',
    'Delivering design systems, interactive prototypes, and UX iteration.',
    '["Worked on high-fidelity wireframes and interactive prototypes in rapid design cycles.", "Contributed to enterprise design systems, establishing modular typography scales and tokenized color sets.", "Participated in UX iteration, usability testing, and cross-functional design review sessions."]'::jsonb,
    3,
    'published'
  ),
  (
    'iiuc-cc',
    'Creative & Design Secretary',
    'IIUC Computer Club',
    'Leadership',
    'OCT 2024 — 2025',
    false,
    'Chittagong, BD',
    'Leading creative direction, visual identity, and event branding.',
    '["Contributed to visual identity, promotional campaigns, and stage design for major tech festivals.", "Supported creative deliverables, social graphics, and digital media workflows.", "Collaborated with executive leaders to organize student workshops and technical outreach."]'::jsonb,
    4,
    'published'
  ),
  (
    'zcc',
    'Graphic Designer & Digital Platform Specialist',
    'Zahid''s Chem Clinic / ZCC Foundation',
    'Contract / Specialist',
    '2023 — 2024',
    false,
    'Chittagong, BD',
    'Graphic design, brand collateral, and web platform maintenance.',
    '["Spearheaded graphic design and visual communication across academic modules.", "Managed website updates, platform usability, and digital resource publication.", "Produced educational assets and high-impact digital promotional collateral."]'::jsonb,
    5,
    'published'
  )
ON CONFLICT (slug_id) DO UPDATE SET
  role = EXCLUDED.role,
  company = EXCLUDED.company,
  employment_type = EXCLUDED.employment_type,
  period = EXCLUDED.period,
  is_current = EXCLUDED.is_current,
  location = EXCLUDED.location,
  description = EXCLUDED.description,
  points = EXCLUDED.points,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 4. EDUCATION
INSERT INTO public.education (
  institution, degree, department, start_year, end_year, current_status, description, display_order, status
)
VALUES (
  'International Islamic University Chittagong (IIUC)',
  'B.Sc. in Computer Science and Engineering',
  'Department of Computer Science & Engineering',
  2022,
  2026,
  'Class of 2026 · Active',
  'Academic focus spanning computer architecture, algorithms, interface engineering, and software systems.',
  1,
  'published'
)
ON CONFLICT DO NOTHING;

-- 5. SKILL CATEGORIES & SKILLS
-- Category 1: DESIGN
INSERT INTO public.skill_categories (id, name, index_label, display_order)
VALUES ('11111111-1111-1111-1111-111111111111', 'DESIGN', '01', 1)
ON CONFLICT (name) DO UPDATE SET index_label = EXCLUDED.index_label, display_order = EXCLUDED.display_order;

INSERT INTO public.skills (category_id, name, display_order, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'UI/UX Design', 1, 'published'),
  ('11111111-1111-1111-1111-111111111111', 'Wireframing & Prototyping', 2, 'published'),
  ('11111111-1111-1111-1111-111111111111', 'Design Systems', 3, 'published'),
  ('11111111-1111-1111-1111-111111111111', 'Figma', 4, 'published'),
  ('11111111-1111-1111-1111-111111111111', 'Visual Communication', 5, 'published'),
  ('11111111-1111-1111-1111-111111111111', 'Information Architecture', 6, 'published')
ON CONFLICT DO NOTHING;

-- Category 2: FRONTEND
INSERT INTO public.skill_categories (id, name, index_label, display_order)
VALUES ('22222222-2222-2222-2222-222222222222', 'FRONTEND', '02', 2)
ON CONFLICT (name) DO UPDATE SET index_label = EXCLUDED.index_label, display_order = EXCLUDED.display_order;

INSERT INTO public.skills (category_id, name, display_order, status)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'React', 1, 'published'),
  ('22222222-2222-2222-2222-222222222222', 'Next.js', 2, 'published'),
  ('22222222-2222-2222-2222-222222222222', 'JavaScript (ES6+)', 3, 'published'),
  ('22222222-2222-2222-2222-222222222222', 'HTML5 & Modern CSS', 4, 'published'),
  ('22222222-2222-2222-2222-222222222222', 'Tailwind CSS', 5, 'published'),
  ('22222222-2222-2222-2222-222222222222', 'GSAP & Micro-Interactions', 6, 'published')
ON CONFLICT DO NOTHING;

-- Category 3: BACKEND & SYSTEMS
INSERT INTO public.skill_categories (id, name, index_label, display_order)
VALUES ('33333333-3333-3333-3333-333333333333', 'BACKEND & SYSTEMS', '03', 3)
ON CONFLICT (name) DO UPDATE SET index_label = EXCLUDED.index_label, display_order = EXCLUDED.display_order;

INSERT INTO public.skills (category_id, name, display_order, status)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Node.js / Express', 1, 'published'),
  ('33333333-3333-3333-3333-333333333333', 'REST APIs', 2, 'published'),
  ('33333333-3333-3333-3333-333333333333', 'PostgreSQL', 3, 'published'),
  ('33333333-3333-3333-3333-333333333333', 'MongoDB', 4, 'published'),
  ('33333333-3333-3333-3333-333333333333', 'Git & GitHub', 5, 'published'),
  ('33333333-3333-3333-3333-333333333333', 'Testing & Debugging', 6, 'published')
ON CONFLICT DO NOTHING;

-- Category 4: AI & EXPERIMENTATION
INSERT INTO public.skill_categories (id, name, index_label, display_order)
VALUES ('44444444-4444-4444-4444-444444444444', 'AI & EXPERIMENTATION', '04', 4)
ON CONFLICT (name) DO UPDATE SET index_label = EXCLUDED.index_label, display_order = EXCLUDED.display_order;

INSERT INTO public.skills (category_id, name, display_order, status)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'Retrieval-Augmented Generation (RAG)', 1, 'published'),
  ('44444444-4444-4444-4444-444444444444', 'LLM API Integration', 2, 'published'),
  ('44444444-4444-4444-4444-444444444444', 'Python / FastAPI', 3, 'published'),
  ('44444444-4444-4444-4444-444444444444', 'Vector Embeddings', 4, 'published'),
  ('44444444-4444-4444-4444-444444444444', 'AI-Assisted Workflows', 5, 'published')
ON CONFLICT DO NOTHING;

-- Category 5: EXPLORING
INSERT INTO public.skill_categories (id, name, index_label, display_order)
VALUES ('55555555-5555-5555-5555-555555555555', 'EXPLORING', '05', 5)
ON CONFLICT (name) DO UPDATE SET index_label = EXCLUDED.index_label, display_order = EXCLUDED.display_order;

INSERT INTO public.skills (category_id, name, display_order, status)
VALUES
  ('55555555-5555-5555-5555-555555555555', 'Cloud Infrastructure', 1, 'published'),
  ('55555555-5555-5555-5555-555555555555', 'Deployment Automation', 2, 'published'),
  ('55555555-5555-5555-5555-555555555555', 'Advanced Interaction Design', 3, 'published'),
  ('55555555-5555-5555-5555-555555555555', 'Creative WebGL / Shaders', 4, 'published')
ON CONFLICT DO NOTHING;

-- 6. SITE SETTINGS (Personal profile, location, and social channels)
INSERT INTO public.site_settings (key, value, description, is_public)
VALUES
  ('personal_info', '{
    "name": "Md Ali Azgor",
    "title": "UI/UX DESIGNER · CREATIVE DEVELOPER · SOFTWARE ENGINEERING STUDENT",
    "bio": "I''m Md Ali Azgor — a CSE student at International Islamic University Chittagong and creative developer exploring the intersection of digital design, frontend engineering, and intelligent software. I enjoy turning ideas into considered interfaces and working software.",
    "location": "CHITTAGONG, BANGLADESH",
    "coordinates": "22.3569° N, 91.7832° E",
    "status": "OPEN FOR COLLABORATION & INTERNSHIPS",
    "email": "ali.azgor.0810@gmail.com",
    "linkedin": "https://linkedin.com/in/ali-azgor",
    "github": "https://github.com/aliazgorLab"
  }'::jsonb, 'Main personal identity and verified contact channels', true),
  ('principles', '[
    {
      "number": "01",
      "title": "INTENTION",
      "subtitle": "Every interface choice should have a reason.",
      "detail": "No superfluous decoration. Every typographic scale, padding token, and visual hierarchy choice exists to serve user comprehension and emotional resonance."
    },
    {
      "number": "02",
      "title": "CLARITY",
      "subtitle": "Visual quality must improve usability, not compete with it.",
      "detail": "Atmosphere and cinematic contrast must never sacrifice readability, accessibility, or core interaction speed. Form elevates function."
    },
    {
      "number": "03",
      "title": "CRAFT",
      "subtitle": "The small details matter: spacing, timing, transitions, responsiveness, and performance.",
      "detail": "From 120fps motion choreography and sub-millisecond layout shifts to clean semantic markup and fluid viewport adaptations, true polish lives in the nuances."
    }
  ]'::jsonb, 'Guiding design principles', true)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  is_public = EXCLUDED.is_public,
  updated_at = NOW();
