-- ==============================================================================
-- 05_creative_universe_schema.sql
-- Md Ali Azgor Portfolio CMS: Creative Universe Backend Foundation
-- Non-destructive forward migration supporting:
--   1. Creative Worlds (Graphic Design, UI/UX, Web Dev, Video & Motion)
--   2. Dynamic Categories assigned to Worlds
--   3. Video Embeds & Aspect Ratio Controls
--   4. Multi-Image Gallery Affordances
--   5. Demo Content Isolation & Safe Purge Support
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. CREATIVE WORLDS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creative_worlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  accent_color TEXT DEFAULT '#F46A45',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creative_worlds_order ON public.creative_worlds(display_order);
CREATE INDEX IF NOT EXISTS idx_creative_worlds_slug ON public.creative_worlds(slug);

DROP TRIGGER IF EXISTS trg_creative_worlds_updated_at ON public.creative_worlds;
CREATE TRIGGER trg_creative_worlds_updated_at
  BEFORE UPDATE ON public.creative_worlds
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 2. CREATIVE CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creative_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES public.creative_worlds(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creative_categories_world ON public.creative_categories(world_id, display_order);
CREATE INDEX IF NOT EXISTS idx_creative_categories_slug ON public.creative_categories(slug);

DROP TRIGGER IF EXISTS trg_creative_categories_updated_at ON public.creative_categories;
CREATE TRIGGER trg_creative_categories_updated_at
  BEFORE UPDATE ON public.creative_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 3. NON-DESTRUCTIVE EXTENSION OF PROJECTS (WORK ITEMS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS world_id UUID REFERENCES public.creative_worlds(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS world_slug TEXT CHECK (world_slug IN ('graphic-design', 'ui-ux-design', 'web-development', 'video-motion') OR world_slug IS NULL),
  ADD COLUMN IF NOT EXISTS creative_category_id UUID REFERENCES public.creative_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS client TEXT,
  ADD COLUMN IF NOT EXISTS prototype_url TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS video_provider TEXT DEFAULT 'none' CHECK (video_provider IN ('youtube', 'vimeo', 'direct', 'none') OR video_provider IS NULL),
  ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT '16:9' CHECK (aspect_ratio IN ('16:9', '9:16', '1:1', '4:5', '21:9', '4:3')),
  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_projects_world ON public.projects(world_slug, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_creative_category ON public.projects(creative_category_id);
CREATE INDEX IF NOT EXISTS idx_projects_is_demo ON public.projects(is_demo);

-- ------------------------------------------------------------------------------
-- 4. NON-DESTRUCTIVE EXTENSION OF PROJECT_MEDIA (GALLERY BRIDGE)
-- ------------------------------------------------------------------------------
ALTER TABLE public.project_media
  ADD COLUMN IF NOT EXISTS alt_text TEXT,
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.creative_worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "creative_worlds_select" ON public.creative_worlds;
CREATE POLICY "creative_worlds_select" ON public.creative_worlds
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "creative_worlds_admin_all" ON public.creative_worlds;
CREATE POLICY "creative_worlds_admin_all" ON public.creative_worlds
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "creative_categories_select" ON public.creative_categories;
CREATE POLICY "creative_categories_select" ON public.creative_categories
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "creative_categories_admin_all" ON public.creative_categories;
CREATE POLICY "creative_categories_admin_all" ON public.creative_categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Step 6: Grant table permissions under RLS
GRANT SELECT ON TABLE public.creative_worlds TO anon, authenticated;
GRANT SELECT ON TABLE public.creative_categories TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE public.creative_worlds TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.creative_categories TO authenticated;

GRANT ALL ON TABLE public.creative_worlds TO service_role;
GRANT ALL ON TABLE public.creative_categories TO service_role;

-- ------------------------------------------------------------------------------
-- 6. CANONICAL SEED: 4 CREATIVE WORLDS (IDEMPOTENT)
-- ------------------------------------------------------------------------------
INSERT INTO public.creative_worlds (slug, title, subtitle, description, accent_color, display_order, is_active)
VALUES
  (
    'graphic-design',
    'Graphic Design',
    'Brand Identity, Visual Communications & Editorial',
    'Exploration of logo design, brand identities, posters, banners, and print publication craft.',
    '#F46A45',
    1,
    true
  ),
  (
    'ui-ux-design',
    'UI/UX Design',
    'Digital Interfaces, Prototypes & Design Systems',
    'User-centered interfaces, accessible design token architectures, mobile applications, and high-fidelity Figma prototypes.',
    '#FF8662',
    2,
    true
  ),
  (
    'web-development',
    'Web Development',
    'Interactive Applications, Full-Stack Architecture & Tools',
    'Engineering fast, scalable web software with Next.js, React, Node.js, and intelligent API integrations.',
    '#E65A32',
    3,
    true
  ),
  (
    'video-motion',
    'Video & Motion',
    'Motion Graphics, Visual Sequences & Showreels',
    'Dynamic motion typography, promotional video edits, social media reels, and visual storytelling.',
    '#9B3825',
    4,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  accent_color = EXCLUDED.accent_color,
  display_order = EXCLUDED.display_order;

-- ------------------------------------------------------------------------------
-- 7. CANONICAL SEED: CORE CATEGORIES UNDER EACH WORLD (IDEMPOTENT)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_world_graphic UUID;
  v_world_uiux UUID;
  v_world_web UUID;
  v_world_video UUID;
BEGIN
  SELECT id INTO v_world_graphic FROM public.creative_worlds WHERE slug = 'graphic-design';
  SELECT id INTO v_world_uiux FROM public.creative_worlds WHERE slug = 'ui-ux-design';
  SELECT id INTO v_world_web FROM public.creative_worlds WHERE slug = 'web-development';
  SELECT id INTO v_world_video FROM public.creative_worlds WHERE slug = 'video-motion';

  -- Categories for World 01: Graphic Design
  INSERT INTO public.creative_categories (world_id, name, slug, description, display_order, is_active)
  VALUES
    (v_world_graphic, 'Logo Design', 'logo-design', 'Marks, logotypes, brand symbols, and monogram identities.', 1, true),
    (v_world_graphic, 'Brand Identity', 'brand-identity', 'Complete brand systems, stationery, guidelines, and corporate programs.', 2, true),
    (v_world_graphic, 'Poster Design', 'poster-design', 'Event posters, typographic campaign prints, and conceptual art.', 3, true),
    (v_world_graphic, 'Banner Design', 'banner-design', 'Digital ad banners, website hero visuals, and social media banners.', 4, true),
    (v_world_graphic, 'Social Media Design', 'social-media-design', 'Instagram posts, carousels, stories, and social campaign assets.', 5, true),
    (v_world_graphic, 'Brochure & Print Design', 'brochure-print-design', 'Leaflets, flyers, brochures, packaging, and editorial publications.', 6, true)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

  -- Categories for World 02: UI/UX Design
  INSERT INTO public.creative_categories (world_id, name, slug, description, display_order, is_active)
  VALUES
    (v_world_uiux, 'Website UI Design', 'website-ui-design', 'Responsive landing pages, marketing websites, and portal interfaces.', 1, true),
    (v_world_uiux, 'Mobile App UI Design', 'mobile-app-ui-design', 'iOS and Android application interfaces, micro-interactions, and flows.', 2, true),
    (v_world_uiux, 'Dashboard Design', 'dashboard-design', 'Complex enterprise dashboards, analytics consoles, and SaaS tools.', 3, true),
    (v_world_uiux, 'Design Systems', 'design-systems', 'Multi-tier design tokens, component specifications, and style guides.', 4, true),
    (v_world_uiux, 'Wireframes & Prototypes', 'wireframes-prototypes', 'Low/high-fidelity wireframes and clickable interactive prototypes.', 5, true),
    (v_world_uiux, 'UX Case Studies', 'ux-case-studies', 'In-depth problem-solution narratives with user research and metrics.', 6, true)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

  -- Categories for World 03: Web Development
  INSERT INTO public.creative_categories (world_id, name, slug, description, display_order, is_active)
  VALUES
    (v_world_web, 'Web Applications', 'web-applications', 'Full-featured web apps with persistent backends and reactive state.', 1, true),
    (v_world_web, 'Full-Stack Projects', 'full-stack-projects', 'End-to-end architectures combining databases, APIs, and client apps.', 2, true),
    (v_world_web, 'Frontend Development', 'frontend-development', 'High-performance Next.js, React, and CSS architecture.', 3, true),
    (v_world_web, 'Tools & Utilities', 'tools-utilities', 'Productivity tools, generators, and developer automation suites.', 4, true),
    (v_world_web, 'Interactive Websites', 'interactive-websites', 'Motion-driven web experiences, 3D Canvas, and kinetic interactions.', 5, true)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

  -- Categories for World 04: Video & Motion
  INSERT INTO public.creative_categories (world_id, name, slug, description, display_order, is_active)
  VALUES
    (v_world_video, 'Promotional Videos', 'promotional-videos', 'Product launch videos, brand promos, and commercial teasers.', 1, true),
    (v_world_video, 'Motion Graphics', 'motion-graphics', 'Kinetic typography, animated logos, title cards, and 2D/3D motion.', 2, true),
    (v_world_video, 'Video Editing', 'video-editing', 'Narrative cuts, cinematic color grading, sound design, and pacing.', 3, true),
    (v_world_video, 'Social Media Reels', 'social-media-reels', 'High-impact vertical reels (9:16), shorts, and teaser loops.', 4, true),
    (v_world_video, 'Event Videos', 'event-videos', 'Event recaps, aftermovies, coverage, and highlight reels.', 5, true),
    (v_world_video, 'Showreels & Montages', 'showreels-montages', 'Portfolio showreels, cinematic sizzle reels, and multi-project montages.', 6, true)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

  -- Map existing 5 projects cleanly to their respective worlds and categories
  UPDATE public.projects
  SET 
    world_id = v_world_web,
    world_slug = 'web-development',
    creative_category_id = (SELECT id FROM public.creative_categories WHERE slug = 'tools-utilities')
  WHERE slug = 'iiuc-cover-generator' AND world_slug IS NULL;

  UPDATE public.projects
  SET 
    world_id = v_world_web,
    world_slug = 'web-development',
    creative_category_id = (SELECT id FROM public.creative_categories WHERE slug = 'full-stack-projects')
  WHERE slug = 'osmentor-ai' AND world_slug IS NULL;

  UPDATE public.projects
  SET 
    world_id = v_world_web,
    world_slug = 'web-development',
    creative_category_id = (SELECT id FROM public.creative_categories WHERE slug = 'full-stack-projects')
  WHERE slug = 'protocolzero' AND world_slug IS NULL;

  UPDATE public.projects
  SET 
    world_id = v_world_uiux,
    world_slug = 'ui-ux-design',
    creative_category_id = (SELECT id FROM public.creative_categories WHERE slug = 'design-systems')
  WHERE slug = 'racdox-design' AND world_slug IS NULL;

  UPDATE public.projects
  SET 
    world_id = v_world_web,
    world_slug = 'web-development',
    creative_category_id = (SELECT id FROM public.creative_categories WHERE slug = 'tools-utilities')
  WHERE slug = 'deadlock-ai' AND world_slug IS NULL;

END $$;

COMMIT;

