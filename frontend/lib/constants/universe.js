// Static fallback data when Supabase is offline or not yet migrated
export const FALLBACK_WORLDS = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    slug: "graphic-design",
    title: "Graphic Design",
    subtitle: "Brand Identity, Visual Communications & Editorial",
    description: "Exploration of logo design, brand identities, posters, banners, and print publication craft.",
    accent_color: "#F46A45",
    display_order: 1,
    is_active: true,
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    subtitle: "Digital Interfaces, Prototypes & Design Systems",
    description: "User-centered interfaces, accessible design token architectures, mobile applications, and high-fidelity Figma prototypes.",
    accent_color: "#FF8662",
    display_order: 2,
    is_active: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    slug: "web-development",
    title: "Web Development",
    subtitle: "Interactive Applications, Full-Stack Architecture & Tools",
    description: "Engineering fast, scalable web software with Next.js, React, Node.js, and intelligent API integrations.",
    accent_color: "#E65A32",
    display_order: 3,
    is_active: true,
  },
  {
    id: "40000000-0000-4000-8000-000000000004",
    slug: "video-motion",
    title: "Video & Motion",
    subtitle: "Motion Graphics, Visual Sequences & Showreels",
    description: "Dynamic motion typography, promotional video edits, social media reels, and visual storytelling.",
    accent_color: "#9B3825",
    display_order: 4,
    is_active: true,
  },
];

export const FALLBACK_CATEGORIES = [
  // Graphic Design
  { id: "10000000-0001-4000-8000-000000000001", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Logo Design", slug: "logo-design", display_order: 1, is_active: true },
  { id: "10000000-0001-4000-8000-000000000002", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Brand Identity", slug: "brand-identity", display_order: 2, is_active: true },
  { id: "10000000-0001-4000-8000-000000000003", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Poster Design", slug: "poster-design", display_order: 3, is_active: true },
  { id: "10000000-0001-4000-8000-000000000004", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Banner Design", slug: "banner-design", display_order: 4, is_active: true },
  { id: "10000000-0001-4000-8000-000000000005", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Social Media Design", slug: "social-media-design", display_order: 5, is_active: true },
  { id: "10000000-0001-4000-8000-000000000006", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Brochure & Print Design", slug: "brochure-print-design", display_order: 6, is_active: true },

  // UI/UX Design
  { id: "20000000-0002-4000-8000-000000000001", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "Website UI Design", slug: "website-ui-design", display_order: 1, is_active: true },
  { id: "20000000-0002-4000-8000-000000000002", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "Mobile App UI Design", slug: "mobile-app-ui-design", display_order: 2, is_active: true },
  { id: "20000000-0002-4000-8000-000000000003", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "Dashboard Design", slug: "dashboard-design", display_order: 3, is_active: true },
  { id: "20000000-0002-4000-8000-000000000004", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "Design Systems", slug: "design-systems", display_order: 4, is_active: true },
  { id: "20000000-0002-4000-8000-000000000005", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "Wireframes & Prototypes", slug: "wireframes-prototypes", display_order: 5, is_active: true },
  { id: "20000000-0002-4000-8000-000000000006", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "UX Case Studies", slug: "ux-case-studies", display_order: 6, is_active: true },

  // Web Development
  { id: "30000000-0003-4000-8000-000000000001", world_id: "30000000-0000-4000-8000-000000000003", world_slug: "web-development", name: "Web Applications", slug: "web-applications", display_order: 1, is_active: true },
  { id: "30000000-0003-4000-8000-000000000002", world_id: "30000000-0000-4000-8000-000000000003", world_slug: "web-development", name: "Full-Stack Projects", slug: "full-stack-projects", display_order: 2, is_active: true },
  { id: "30000000-0003-4000-8000-000000000003", world_id: "30000000-0000-4000-8000-000000000003", world_slug: "web-development", name: "Frontend Development", slug: "frontend-development", display_order: 3, is_active: true },
  { id: "30000000-0003-4000-8000-000000000004", world_id: "30000000-0000-4000-8000-000000000003", world_slug: "web-development", name: "Tools & Utilities", slug: "tools-utilities", display_order: 4, is_active: true },
  { id: "30000000-0003-4000-8000-000000000005", world_id: "30000000-0000-4000-8000-000000000003", world_slug: "web-development", name: "Interactive Websites", slug: "interactive-websites", display_order: 5, is_active: true },

  // Video & Motion
  { id: "40000000-0004-4000-8000-000000000001", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Promotional Videos", slug: "promotional-videos", display_order: 1, is_active: true },
  { id: "40000000-0004-4000-8000-000000000002", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Motion Graphics", slug: "motion-graphics", display_order: 2, is_active: true },
  { id: "40000000-0004-4000-8000-000000000003", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Video Editing", slug: "video-editing", display_order: 3, is_active: true },
  { id: "40000000-0004-4000-8000-000000000004", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Social Media Reels", slug: "social-media-reels", display_order: 4, is_active: true },
  { id: "40000000-0004-4000-8000-000000000005", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Event Videos", slug: "event-videos", display_order: 5, is_active: true },
  { id: "40000000-0004-4000-8000-000000000006", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Showreels & Montages", slug: "showreels-montages", display_order: 6, is_active: true },
];
