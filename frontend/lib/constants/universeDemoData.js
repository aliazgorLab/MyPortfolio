/**
 * High-quality development demo data for the Creative Universe.
 * Clearly flagged with `is_demo: true` and isolated from production data.
 * Used for interactive exhibition prototyping until custom client work is uploaded via CMS.
 */

export const DEMO_GRAPHIC_DESIGN_WORKS = [
  {
    id: "demo-gd-01",
    slug: "aura-monogram-brandmark",
    world_slug: "graphic-design",
    category_slug: "logo-design",
    category_name: "Logo Design",
    title: "Aura Studio — Geometric Monogram System",
    short_description: "A precision-crafted geometric monogram and typographic brandmark for an architectural lighting design studio.",
    long_description: "Constructed upon a strict 8-point isometric grid, the Aura mark explores the tension between structural geometry and spatial diffusion. The logo family includes horizontal, stacked, and circular responsive lockups engineered for digital interfaces and architectural signage.",
    client: "Aura Spatial Lighting",
    year: "2024",
    cover_image_url: "/images/project-protocolzero.jpg",
    aspect_ratio: "1:1",
    tags: ["Monogram", "Isometric Grid", "Vector Craft", "Brandmark"],
    display_order: 1,
    is_featured: true,
    is_demo: true,
    video_provider: "none",
    external_links: [{ label: "Vector Specs", url: "https://github.com/aliazgorLab" }],
    gallery: [
      { url: "/images/project-protocolzero.jpg", caption: "Primary Monogram Lockup on Dark Architectural Carbon" },
      { url: "/images/project-deadlock.jpg", caption: "Grid Construction and Geometric Alignment Curves" },
      { url: "/images/project-racdox.jpg", caption: "Embossed Stationery & Foil-Stamped Paper System" }
    ]
  },
  {
    id: "demo-gd-02",
    slug: "kromatik-esports-insignia",
    world_slug: "graphic-design",
    category_slug: "logo-design",
    category_name: "Logo Design",
    title: "Kromatik — Competitive Esports Insignia",
    short_description: "Aggressive, high-impact vector mascot insignia engineered for digital broadcasts, streaming overlays, and apparel.",
    long_description: "Developed for a regional competitive gaming organization. Combines dynamic angular motion lines with high-contrast dual-tone shading to ensure legibility across twitch avatar sizes (32px) and stage banners (4 meters).",
    client: "Kromatik Gaming Club",
    year: "2024",
    cover_image_url: "/images/project-deadlock.jpg",
    aspect_ratio: "1:1",
    tags: ["Esports Emblem", "Vector Mascot", "Broadcast Graphics", "Apparel"],
    display_order: 2,
    is_featured: false,
    is_demo: true,
    video_provider: "none",
    external_links: [],
    gallery: [
      { url: "/images/project-deadlock.jpg", caption: "Primary High-Contrast Mascot Insignia" },
      { url: "/images/project-osmentor.jpg", caption: "Broadcast Overlay & Lower-Third Placement" }
    ]
  },
  {
    id: "demo-gd-03",
    slug: "vanguard-brand-identity",
    world_slug: "graphic-design",
    category_slug: "brand-identity",
    category_name: "Brand Identity",
    title: "Vanguard Systems — Corporate Identity & Standards",
    short_description: "Comprehensive corporate identity system, typography hierarchy, and corporate stationery standards for an engineering laboratory.",
    long_description: "A complete visual identity program comprising custom wordmark design, corporate color system (obsidian, industrial orange, and aluminum), business stationery, envelope systems, employee badge guidelines, and a 42-page brand standards manual.",
    client: "Vanguard Industrial Labs",
    year: "2023",
    cover_image_url: "/images/project-racdox.jpg",
    aspect_ratio: "16:9",
    tags: ["Brand Identity", "Design System", "Stationery", "Corporate Guidelines"],
    display_order: 3,
    is_featured: true,
    is_demo: true,
    video_provider: "none",
    external_links: [],
    gallery: [
      { url: "/images/project-racdox.jpg", caption: "Identity Overview: Business Cards & Letterhead" },
      { url: "/images/project-protocolzero.jpg", caption: "Color Matrix and Typography Hierarchy" },
      { url: "/images/project-iiuc-cover.jpg", caption: "Corporate Envelopes and Documentation Folio" }
    ]
  },
  {
    id: "demo-gd-04",
    slug: "bauhaus-spatial-poster",
    world_slug: "graphic-design",
    category_slug: "poster-design",
    category_name: "Poster Design",
    title: "Bauhaus & Constructivism — Spatial Architecture Poster",
    short_description: "Experimental typographic poster exploring asymmetrical balance, diagonal grids, and mechanical minimalism.",
    long_description: "Created as an homage to the Dessau Bauhaus and early Russian Constructivism. Features bold typographic hierarchies using grotesque typefaces, stark black/orange duotone contrasts, and layered architectural wireframes.",
    client: "Chittagong Design Pavilion",
    year: "2024",
    cover_image_url: "/images/about-sculpture.jpg",
    aspect_ratio: "3:4",
    tags: ["Typographic Poster", "Bauhaus", "Editorial", "Print Art"],
    display_order: 4,
    is_featured: true,
    is_demo: true,
    video_provider: "none",
    external_links: [],
    gallery: [
      { url: "/images/about-sculpture.jpg", caption: "Silkscreen Exhibition Print (A1 594x841mm)" },
      { url: "/images/project-protocolzero.jpg", caption: "Typographic Detail and Asymmetric Grid Breakdown" }
    ]
  },
  {
    id: "demo-gd-05",
    slug: "cybernetics-exhibition-series",
    world_slug: "graphic-design",
    category_slug: "poster-design",
    category_name: "Poster Design",
    title: "Cybernetics 2030 — Speculative Future Series",
    short_description: "A series of 3 screen-printed exhibition posters exploring algorithmic intelligence and cybernetic interfaces.",
    long_description: "Exhibited at the International Islamic University Chittagong creative showcase. Combines mathematical fractal curves, circuit-inspired line art, and high-density technical typography.",
    client: "IIUC Creative Exhibition",
    year: "2023",
    cover_image_url: "/images/hero-visor.jpg",
    aspect_ratio: "3:4",
    tags: ["Poster Series", "Speculative", "Screen Print", "Dark Aesthetic"],
    display_order: 5,
    is_featured: false,
    is_demo: true,
    video_provider: "none",
    external_links: [],
    gallery: [
      { url: "/images/hero-visor.jpg", caption: "Part 1: The Neural Loom Screenprint" },
      { url: "/images/project-deadlock.jpg", caption: "Part 2: Cybernetic Telemetry Framework" }
    ]
  },
  {
    id: "demo-gd-06",
    slug: "apex-saas-banner-suite",
    world_slug: "graphic-design",
    category_slug: "banner-design",
    category_name: "Banner Design",
    title: "Apex Cloud — Multi-Platform Launch Banner Suite",
    short_description: "Omnichannel launch banners designed for web heroes, display advertising, Twitter headers, and LinkedIn company pages.",
    long_description: "A cohesive digital ad campaign suite for a cloud developer tools startup. Designed across 12 standard IAB display ratios and social hero dimensions, prioritizing clear value proposition copy, isometric product mockups, and vibrant call-to-action framing.",
    client: "Apex Cloud Computing",
    year: "2024",
    cover_image_url: "/images/project-iiuc-cover.jpg",
    aspect_ratio: "16:9",
    tags: ["Web Banner", "Social Media Hero", "IAB Display Ads", "Digital Campaign"],
    display_order: 6,
    is_featured: true,
    is_demo: true,
    video_provider: "none",
    external_links: [],
    gallery: [
      { url: "/images/project-iiuc-cover.jpg", caption: "1920x1080px Web Hero Header" },
      { url: "/images/project-osmentor.jpg", caption: "Twitter & LinkedIn Omnichannel Header System" }
    ]
  },
  {
    id: "demo-gd-07",
    slug: "paypulse-social-editorial",
    world_slug: "graphic-design",
    category_slug: "social-media-design",
    category_name: "Social Media Design",
    title: "PayPulse — Fintech Educational Carousel Kit",
    short_description: "Swipeable 10-slide Instagram carousel series and story templates explaining decentralized finance and secure payments.",
    long_description: "Created to boost educational engagement for a modern fintech company. The design system features modular 1:1 slide grids, data infographics, intuitive typographic hierarchy, and custom vector icons.",
    client: "PayPulse Financial",
    year: "2024",
    cover_image_url: "/images/project-osmentor.jpg",
    aspect_ratio: "1:1",
    tags: ["Social Carousel", "Infographic", "Instagram Kit", "Fintech"],
    display_order: 7,
    is_featured: false,
    is_demo: true,
    video_provider: "none",
    external_links: [],
    gallery: [
      { url: "/images/project-osmentor.jpg", caption: "Slide 01: The Cover Hook & Typography" },
      { url: "/images/project-racdox.jpg", caption: "Slide 04: Data Flow Breakdown Infographic" }
    ]
  },
  {
    id: "demo-gd-08",
    slug: "iiuc-techfest-brochure",
    world_slug: "graphic-design",
    category_slug: "brochure-print-design",
    category_name: "Brochure & Print Design",
    title: "IIUC CSE TechFest — Official Tri-Fold Program Guide",
    short_description: "Print-ready tri-fold brochure, event pass badges, and schedule collateral for the university annual technology symposium.",
    long_description: "Engineered for high-volume commercial offset printing with 300 DPI CMYK color separation and spot-gloss varnish mapping. Features a clear 3-panel unfolding schedule, speaker profiles, and sponsor brand grid.",
    client: "Department of CSE, IIUC",
    year: "2023",
    cover_image_url: "/images/project-iiuc-cover.jpg",
    aspect_ratio: "4:3",
    tags: ["Tri-Fold Brochure", "Print Production", "CMYK", "Event Collateral"],
    display_order: 8,
    is_featured: true,
    is_demo: true,
    video_provider: "none",
    external_links: [],
    gallery: [
      { url: "/images/project-iiuc-cover.jpg", caption: "Tri-Fold Exterior Cover & Flap Unfold" },
      { url: "/images/project-protocolzero.jpg", caption: "Interior Schedule Grid & Speaker Profiles" }
    ]
  }
];

export const DEMO_UIUX_DESIGN_WORKS = [
  {
    id: "demo-ui-01",
    slug: "iiuc-cover-generator-ui",
    world_slug: "ui-ux-design",
    category_slug: "website-ui-design",
    category_name: "Website UI Design",
    title: "IIUC Cover Page Generator — Interface Suite",
    short_description: "A frictionless document automation interface engineered for university students with instant live preview.",
    long_description: "Focused on human-computer interaction and zero-learning-curve document generation. Features a split-pane live canvas preview, dynamic form synchronization, and one-click PDF export.",
    client: "IIUC Student Community",
    year: "2024",
    cover_image_url: "/images/project-iiuc-cover.jpg",
    aspect_ratio: "16:9",
    tags: ["UI Design", "HCI", "Design Systems", "Web App UI"],
    display_order: 1,
    is_featured: true,
    is_demo: false,
    case_study_slug: "iiuc-cover-generator",
    external_links: [
      { label: "Case Study", url: "/work/iiuc-cover-generator" },
      { label: "GitHub", url: "https://github.com/aliazgorLab/iiuc-cover-generator" }
    ],
    gallery: [
      { url: "/images/project-iiuc-cover.jpg", caption: "Live Document Split-Pane Interface" }
    ]
  },
  {
    id: "demo-ui-02",
    slug: "finflow-mobile-banking",
    world_slug: "ui-ux-design",
    category_slug: "mobile-app-ui-design",
    category_name: "Mobile App UI Design",
    title: "FinFlow — Minimalist Mobile Banking UI",
    short_description: "An elegant, accessible iOS and Android financial interface emphasizing biometric security and micro-interactions.",
    long_description: "Designed with 100% WCAG AA color contrast compliance, tactile haptic feedback cues, and gesture-driven card switching. Includes complete component kits and Figma auto-layout tokens.",
    client: "FinFlow Mobile",
    year: "2024",
    cover_image_url: "/images/project-racdox.jpg",
    aspect_ratio: "9:16",
    tags: ["Mobile UI", "iOS / Android", "Figma Auto-Layout", "Fintech"],
    display_order: 2,
    is_featured: true,
    is_demo: true,
    external_links: [],
    gallery: [
      { url: "/images/project-racdox.jpg", caption: "Account Dashboard & Spend Analytics" },
      { url: "/images/project-protocolzero.jpg", caption: "Instant P2P Transfer & Biometric Confirmation" }
    ]
  },
  {
    id: "demo-ui-03",
    slug: "telemetry-analytics-dashboard",
    world_slug: "ui-ux-design",
    category_slug: "dashboard-design",
    category_name: "Dashboard Design",
    title: "Vigil — Distributed Cluster Observability Dashboard",
    short_description: "A high-density observability dashboard for site reliability engineers with real-time log streaming and heatmaps.",
    long_description: "Combines dark mode data visualization, customizable widget grids, low cognitive overhead telemetry, and keyboard-first shortcut navigation.",
    client: "Vigil Cloud Systems",
    year: "2023",
    cover_image_url: "/images/project-deadlock.jpg",
    aspect_ratio: "16:9",
    tags: ["Dashboard", "Data Visualization", "Information Architecture", "SRE"],
    display_order: 3,
    is_featured: true,
    is_demo: true,
    external_links: [],
    gallery: [
      { url: "/images/project-deadlock.jpg", caption: "Global Cluster Health & Latency Heatmaps" }
    ]
  }
];

export const DEMO_WEB_DEV_WORKS = [
  {
    id: "demo-wd-01",
    slug: "osmentor-ai-dev",
    world_slug: "web-development",
    category_slug: "web-applications",
    category_name: "Web Applications",
    title: "OsMentor AI — RAG Learning Engine",
    short_description: "Intelligent RAG educational web platform built with React, FastAPI, ChromaDB, and Groq streaming completions.",
    long_description: "Engineered for sub-400ms vector retrieval and real-time streaming LLM feedback. Features dual-pane interactive knowledge graphs and integrated code execution sandboxes.",
    client: "AI Research Project",
    year: "2024",
    cover_image_url: "/images/project-osmentor.jpg",
    aspect_ratio: "16:9",
    tags: ["React", "FastAPI", "RAG", "LangChain", "ChromaDB", "Groq"],
    display_order: 1,
    is_featured: true,
    is_demo: false,
    case_study_slug: "osmentor-ai",
    external_links: [
      { label: "Case Study", url: "/work/osmentor-ai" },
      { label: "GitHub", url: "https://github.com/aliazgorLab/osmentor-ai" }
    ],
    gallery: [
      { url: "/images/project-osmentor.jpg", caption: "Interactive Node Knowledge Graph Workspace" }
    ]
  },
  {
    id: "demo-wd-02",
    slug: "protocolzero-dev",
    world_slug: "web-development",
    category_slug: "full-stack-projects",
    category_name: "Full-Stack Projects",
    title: "ProtocolZero — Cryptographic Handshake Engine",
    short_description: "Zero-knowledge handshake protocol simulator with visual cryptographic packet tracing and state verification.",
    long_description: "Developed in Next.js and TypeScript. Implements interactive visual proof graphs, simulated network latency, and end-to-end deterministic verification suites.",
    client: "Security Lab",
    year: "2024",
    cover_image_url: "/images/project-protocolzero.jpg",
    aspect_ratio: "16:9",
    tags: ["Next.js", "TypeScript", "Cryptography", "State Machine"],
    display_order: 2,
    is_featured: true,
    is_demo: false,
    case_study_slug: "protocolzero",
    external_links: [
      { label: "Case Study", url: "/work/protocolzero" },
      { label: "GitHub", url: "https://github.com/aliazgorLab/protocolzero" }
    ],
    gallery: [
      { url: "/images/project-protocolzero.jpg", caption: "Packet Tracing & Handshake State Inspector" }
    ]
  },
  {
    id: "demo-wd-03",
    slug: "synthetix-canvas-dev",
    world_slug: "web-development",
    category_slug: "interactive-websites",
    category_name: "Interactive Websites",
    title: "Synthetix — Real-Time Shader Canvas System",
    short_description: "High-performance creative web canvas rendering algorithmic geometry, wave harmonics, and audio spectrum reactives.",
    long_description: "Built using raw WebGL shaders and Canvas 2D optimizations. Capable of maintaining 60 FPS on low-power mobile GPUs through custom offscreen rendering threads.",
    client: "Creative Experiment",
    year: "2024",
    cover_image_url: "/images/hero-visor.jpg",
    aspect_ratio: "16:9",
    tags: ["Canvas API", "WebGL", "60 FPS", "Creative Code"],
    display_order: 3,
    is_featured: true,
    is_demo: true,
    external_links: [],
    gallery: [
      { url: "/images/hero-visor.jpg", caption: "Harmonic Wave Distortion Viewport" }
    ]
  }
];

export const DEMO_VIDEO_MOTION_WORKS = [
  {
    id: "demo-vm-01",
    slug: "kinetic-typography-showreel",
    world_slug: "video-motion",
    category_slug: "showreels-montages",
    category_name: "Showreels & Montages",
    title: "Kinetic Typography & Motion Showreel 2024",
    short_description: "A fast-paced showcase of motion typography, dynamic transitions, audio synchronizations, and brand idents.",
    long_description: "Compiled across commercial projects, tech announcements, and creative experiments. Explores rhythm, percussive editing, kinetic text physics, and glitch aesthetics.",
    client: "Personal Showcase",
    year: "2024",
    cover_image_url: "/images/project-deadlock.jpg",
    aspect_ratio: "16:9",
    tags: ["Motion Graphics", "Kinetic Typography", "After Effects", "Sound Sync"],
    display_order: 1,
    is_featured: true,
    is_demo: true,
    video_provider: "youtube",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    external_links: [{ label: "Watch on YouTube", url: "https://www.youtube.com" }],
    gallery: [
      { url: "/images/project-deadlock.jpg", caption: "Title Frame: Kinetic Rhythm & Sound Sync" }
    ]
  },
  {
    id: "demo-vm-02",
    slug: "cyberpunk-esports-teaser",
    world_slug: "video-motion",
    category_slug: "promotional-videos",
    category_name: "Promotional Videos",
    title: "Championship 2024 — Cinematic Event Teaser",
    short_description: "45-second high-adrenaline promotional trailer with 3D logo resolves, speed ramping, and orchestral sound design.",
    long_description: "Produced for tournament opening ceremonies. Features layered video grading in DaVinci Resolve, dynamic match cut pacing, and custom motion vector sound design.",
    client: "Regional Gaming Series",
    year: "2024",
    cover_image_url: "/images/project-racdox.jpg",
    aspect_ratio: "16:9",
    tags: ["Promo Trailer", "DaVinci Resolve", "Color Grading", "Sound Design"],
    display_order: 2,
    is_featured: true,
    is_demo: true,
    video_provider: "vimeo",
    video_url: "https://vimeo.com/76979871",
    external_links: [],
    gallery: [
      { url: "/images/project-racdox.jpg", caption: "Color Grading Comparison & Cinematic Aspect" }
    ]
  },
  {
    id: "demo-vm-03",
    slug: "social-media-motion-reels",
    world_slug: "video-motion",
    category_slug: "social-media-reels",
    category_name: "Social Media Reels",
    title: "Velocity — 9:16 Vertical Motion Reels Series",
    short_description: "High-retention 9:16 vertical motion edits optimized for Instagram Reels, YouTube Shorts, and TikTok.",
    long_description: "Designed for modern algorithmic video platforms. Features punchy typography, sound-effect-driven cuts, and 3-second hook loops.",
    client: "Media Agency",
    year: "2024",
    cover_image_url: "/images/hero-visor.jpg",
    aspect_ratio: "9:16",
    tags: ["9:16 Vertical", "Reels", "Shorts", "Fast Cuts"],
    display_order: 3,
    is_featured: false,
    is_demo: true,
    video_provider: "none",
    external_links: [],
    gallery: [
      { url: "/images/hero-visor.jpg", caption: "Vertical Video Safe-Area Layouts" }
    ]
  }
];

export const ALL_DEMO_WORKS = [
  ...DEMO_GRAPHIC_DESIGN_WORKS,
  ...DEMO_UIUX_DESIGN_WORKS,
  ...DEMO_WEB_DEV_WORKS,
  ...DEMO_VIDEO_MOTION_WORKS
];
