-- ==============================================================================
-- 01_initial_schema_and_rls.sql
-- Md Ali Azgor Portfolio CMS: Core Database Schema, Concurrency Locks & RLS
-- Phase 1 Revision 3.8 — Hardened Security Specification
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & SCHEMA PRIVILEGE LOCKDOWN
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Explicitly revoke CREATE on public schema to prevent object injection
REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated;

-- Alter default privileges for any future objects created in schema public
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;

-- ------------------------------------------------------------------------------
-- 2. CUSTOM TYPES & ENUMS
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_bucket_type') THEN
    CREATE TYPE public.media_bucket_type AS ENUM ('portfolio-media', 'portfolio-private');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_access_type') THEN
    CREATE TYPE public.media_access_type AS ENUM ('public', 'private');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status_type') THEN
    CREATE TYPE public.content_status_type AS ENUM ('draft', 'published', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publishing_stage_type') THEN
    CREATE TYPE public.publishing_stage_type AS ENUM (
      'initiated', 'staging_validated', 'copying_assets', 
      'database_updating', 'cache_invalidating', 'completed', 'failed', 'rolled_back'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cleanup_job_status_type') THEN
    CREATE TYPE public.cleanup_job_status_type AS ENUM (
      'queued', 'processing', 'completed', 'failed', 'dead_letter'
    );
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. PROFILES TABLE & COLUMN-LEVEL SECURITY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  is_pending_deletion BOOLEAN NOT NULL DEFAULT false,
  deletion_scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_pending_deletion ON public.profiles(is_pending_deletion);

-- Helper: Non-recursive Admin Verification
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles
    WHERE id = auth.uid() 
      AND role = 'admin'
      AND is_pending_deletion = false
  );
$$;

-- Generic updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 4. MEDIA SCHEMA & SECURE ATTRIBUTE GUARDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  bucket public.media_bucket_type NOT NULL DEFAULT 'portfolio-private',
  access_level public.media_access_type NOT NULL DEFAULT 'private',
  folder TEXT NOT NULL CHECK (folder IN ('projects', 'artworks', 'experience', 'education', 'certifications', 'general', 'documents', 'private_settings')),
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  public_url TEXT,
  is_pending_deletion BOOLEAN NOT NULL DEFAULT false,
  deletion_requested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_media_bucket_access CHECK (
    (bucket = 'portfolio-media' AND access_level = 'public' AND public_url IS NOT NULL) OR
    (bucket = 'portfolio-private' AND access_level = 'private' AND public_url IS NULL)
  )
);
CREATE INDEX IF NOT EXISTS idx_media_bucket_access ON public.media(bucket, access_level);
CREATE INDEX IF NOT EXISTS idx_media_pending_deletion ON public.media(is_pending_deletion);
CREATE INDEX IF NOT EXISTS idx_media_storage_path ON public.media(storage_path);

DROP TRIGGER IF EXISTS trg_media_updated_at ON public.media;
CREATE TRIGGER trg_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Prevent modification of structural storage columns during UPDATE
CREATE OR REPLACE FUNCTION public.protect_media_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Service role and superuser can perform internal management
  IF (SELECT current_user) = 'postgres' OR (auth.jwt() ->> 'role') = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Authenticated users cannot alter core storage invariants
  IF NEW.id IS DISTINCT FROM OLD.id OR
     NEW.storage_path IS DISTINCT FROM OLD.storage_path OR
     NEW.bucket IS DISTINCT FROM OLD.bucket OR
     NEW.access_level IS DISTINCT FROM OLD.access_level OR
     NEW.size_bytes IS DISTINCT FROM OLD.size_bytes OR
     NEW.mime_type IS DISTINCT FROM OLD.mime_type OR
     NEW.public_url IS DISTINCT FROM OLD.public_url OR
     NEW.is_pending_deletion IS DISTINCT FROM OLD.is_pending_deletion THEN
    RAISE EXCEPTION 'Modification of protected media storage attributes is prohibited. Use authorized procedures.'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_media_columns ON public.media;
CREATE TRIGGER trg_protect_media_columns
  BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.protect_media_columns();

-- ------------------------------------------------------------------------------
-- 5. CONTENT ENTITY SCHEMAS & MEDIA REFERENCE INTEGRITY
-- ------------------------------------------------------------------------------

-- Generic Trigger: Validate media reference existence, deletion lock, and privacy rules
CREATE OR REPLACE FUNCTION public.validate_media_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_col_name TEXT := TG_ARGV[0];
  v_rule TEXT := TG_ARGV[1];
  v_new_json JSONB;
  v_media_id_str TEXT;
  v_media_id UUID;
  v_media_record RECORD;
  v_entity_status TEXT;
BEGIN
  v_new_json := to_jsonb(NEW);
  v_media_id_str := v_new_json ->> v_col_name;

  -- If referenced column is null, reference is clear
  IF v_media_id_str IS NULL OR v_media_id_str = '' THEN
    RETURN NEW;
  END IF;

  v_media_id := v_media_id_str::UUID;

  -- Lock target media row FOR SHARE to serialize against concurrent deletions
  SELECT id, bucket, access_level, is_pending_deletion
  INTO v_media_record
  FROM public.media
  WHERE id = v_media_id
  FOR SHARE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Foreign key violation: media asset % does not exist.', v_media_id
      USING ERRCODE = '23503';
  END IF;

  IF v_media_record.is_pending_deletion THEN
    RAISE EXCEPTION 'Reference rejected: media asset % is scheduled for deletion.', v_media_id
      USING ERRCODE = '55P03';
  END IF;

  -- Evaluate rule based on entity status or privacy requirement
  IF v_rule = 'match_content_status' THEN
    v_entity_status := COALESCE(v_new_json ->> 'status', 'draft');
    IF v_entity_status = 'published' AND v_media_record.bucket <> 'portfolio-media' THEN
      RAISE EXCEPTION 'Security violation: published content cannot reference non-public media asset (Media ID: %).', v_media_id
        USING ERRCODE = '23514';
    END IF;
  ELSIF v_rule = 'require_public' THEN
    IF v_media_record.bucket <> 'portfolio-media' OR v_media_record.access_level <> 'public' THEN
      RAISE EXCEPTION 'Security violation: public portfolio entities must reference portfolio-media assets (Media ID: %).', v_media_id
        USING ERRCODE = '23514';
    END IF;
  ELSIF v_rule = 'require_private' THEN
    IF v_media_record.bucket <> 'portfolio-private' OR v_media_record.access_level <> 'private' THEN
      RAISE EXCEPTION 'Security violation: private entities must reference portfolio-private assets (Media ID: %).', v_media_id
        USING ERRCODE = '23514';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  number TEXT NOT NULL DEFAULT '01',
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  long_description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  tech JSONB NOT NULL DEFAULT '[]'::jsonb,
  year TEXT NOT NULL,
  cover_image_id UUID REFERENCES public.media(id) ON DELETE RESTRICT,
  cover_image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  accent TEXT DEFAULT '#C7B8FF',
  metrics TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status_type NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_projects_status_order ON public.projects(status, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

DROP TRIGGER IF EXISTS trg_projects_media_val ON public.projects;
CREATE TRIGGER trg_projects_media_val
  BEFORE INSERT OR UPDATE OF cover_image_id, status ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.validate_media_reference('cover_image_id', 'match_content_status');

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- PROJECT_MEDIA (Gallery)
CREATE TABLE IF NOT EXISTS public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES public.media(id) ON DELETE RESTRICT,
  display_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, media_id)
);
CREATE INDEX IF NOT EXISTS idx_project_media_proj ON public.project_media(project_id, display_order);

DROP TRIGGER IF EXISTS trg_project_media_val ON public.project_media;
CREATE TRIGGER trg_project_media_val
  BEFORE INSERT OR UPDATE OF media_id ON public.project_media
  FOR EACH ROW EXECUTE FUNCTION public.validate_media_reference('media_id', 'require_public');

-- ARTWORK CATEGORIES & ARTWORKS
CREATE TABLE IF NOT EXISTS public.artwork_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID NOT NULL REFERENCES public.artwork_categories(id) ON DELETE RESTRICT,
  primary_image_id UUID REFERENCES public.media(id) ON DELETE RESTRICT,
  primary_image_url TEXT,
  thumbnail_image_id UUID REFERENCES public.media(id) ON DELETE RESTRICT,
  thumbnail_image_url TEXT,
  year TEXT,
  project_context TEXT,
  aspect_ratio TEXT DEFAULT '1:1',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status_type NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_artworks_status_order ON public.artworks(status, display_order);

DROP TRIGGER IF EXISTS trg_artworks_primary_media_val ON public.artworks;
CREATE TRIGGER trg_artworks_primary_media_val
  BEFORE INSERT OR UPDATE OF primary_image_id, status ON public.artworks
  FOR EACH ROW EXECUTE FUNCTION public.validate_media_reference('primary_image_id', 'match_content_status');

DROP TRIGGER IF EXISTS trg_artworks_thumb_media_val ON public.artworks;
CREATE TRIGGER trg_artworks_thumb_media_val
  BEFORE INSERT OR UPDATE OF thumbnail_image_id, status ON public.artworks
  FOR EACH ROW EXECUTE FUNCTION public.validate_media_reference('thumbnail_image_id', 'match_content_status');

DROP TRIGGER IF EXISTS trg_artworks_updated_at ON public.artworks;
CREATE TRIGGER trg_artworks_updated_at
  BEFORE UPDATE ON public.artworks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- EXPERIENCES, EDUCATION, SKILL_CATEGORIES, SKILLS, CERTIFICATIONS, ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug_id TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  employment_type TEXT DEFAULT 'Full-time',
  period TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  location TEXT,
  description TEXT,
  points JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  organization_logo_id UUID REFERENCES public.media(id) ON DELETE RESTRICT,
  organization_logo_url TEXT,
  note TEXT,
  is_current BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status_type NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_experiences_media_val ON public.experiences;
CREATE TRIGGER trg_experiences_media_val
  BEFORE INSERT OR UPDATE OF organization_logo_id, status ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.validate_media_reference('organization_logo_id', 'match_content_status');

DROP TRIGGER IF EXISTS trg_experiences_updated_at ON public.experiences;
CREATE TRIGGER trg_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  department TEXT,
  start_year INTEGER,
  end_year INTEGER,
  current_status TEXT,
  description TEXT,
  institution_logo_id UUID REFERENCES public.media(id) ON DELETE RESTRICT,
  institution_logo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status_type NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_education_media_val ON public.education;
CREATE TRIGGER trg_education_media_val
  BEFORE INSERT OR UPDATE OF institution_logo_id, status ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.validate_media_reference('institution_logo_id', 'match_content_status');

DROP TRIGGER IF EXISTS trg_education_updated_at ON public.education;
CREATE TRIGGER trg_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  index_label TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.skill_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  proficiency_label TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status_type NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_skills_updated_at ON public.skills;
CREATE TRIGGER trg_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_url TEXT,
  credential_id TEXT,
  certificate_image_id UUID REFERENCES public.media(id) ON DELETE RESTRICT,
  certificate_image_url TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status_type NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_certifications_media_val ON public.certifications;
CREATE TRIGGER trg_certifications_media_val
  BEFORE INSERT OR UPDATE OF certificate_image_id, status ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION public.validate_media_reference('certificate_image_id', 'match_content_status');

DROP TRIGGER IF EXISTS trg_certifications_updated_at ON public.certifications;
CREATE TRIGGER trg_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT,
  date DATE,
  description TEXT,
  url TEXT,
  badge_image_id UUID REFERENCES public.media(id) ON DELETE RESTRICT,
  badge_image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status_type NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_achievements_media_val ON public.achievements;
CREATE TRIGGER trg_achievements_media_val
  BEFORE INSERT OR UPDATE OF badge_image_id, status ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.validate_media_reference('badge_image_id', 'match_content_status');

DROP TRIGGER IF EXISTS trg_achievements_updated_at ON public.achievements;
CREATE TRIGGER trg_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- SITE SETTINGS & PRIVATE MEDIA
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  media_id UUID REFERENCES public.media(id) ON DELETE RESTRICT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.validate_site_setting_media()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_media_record RECORD;
BEGIN
  IF NEW.media_id IS NOT NULL THEN
    SELECT id, bucket, access_level, is_pending_deletion
    INTO v_media_record
    FROM public.media
    WHERE id = NEW.media_id
    FOR SHARE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Referenced media % not found.', NEW.media_id USING ERRCODE = '23503';
    END IF;

    IF v_media_record.is_pending_deletion THEN
      RAISE EXCEPTION 'Referenced media % is scheduled for deletion.', NEW.media_id USING ERRCODE = '55P03';
    END IF;

    -- Private settings must strictly reference portfolio-private
    IF (NOT NEW.is_public OR NEW.key IN ('resume_pdf', 'personal_cv', 'tax_identifier', 'contracts')) THEN
      IF v_media_record.bucket <> 'portfolio-private' OR v_media_record.access_level <> 'private' THEN
        RAISE EXCEPTION 'Private setting % must reference portfolio-private asset.', NEW.key
          USING ERRCODE = '23514';
      END IF;
    ELSE
      -- Public settings must reference portfolio-media
      IF v_media_record.bucket <> 'portfolio-media' OR v_media_record.access_level <> 'public' THEN
        RAISE EXCEPTION 'Public setting % must reference portfolio-media asset.', NEW.key
          USING ERRCODE = '23514';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_site_settings_media_val ON public.site_settings;
CREATE TRIGGER trg_site_settings_media_val
  BEFORE INSERT OR UPDATE OF media_id, is_public, key ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.validate_site_setting_media();

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 6. PUBLISHING JOURNAL & CLEANUP QUEUE SCHEMAS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.publishing_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publish_token UUID NOT NULL UNIQUE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'artwork', 'experience', 'education', 'certifications', 'achievements', 'site_settings')),
  entity_id UUID NOT NULL,
  stage public.publishing_stage_type NOT NULL DEFAULT 'initiated',
  staged_media_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_media_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  error_details JSONB,
  lease_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_publishing_journal_token ON public.publishing_journal(publish_token);
CREATE INDEX IF NOT EXISTS idx_publishing_journal_stage ON public.publishing_journal(stage);

CREATE TABLE IF NOT EXISTS public.media_cleanup_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID,
  storage_path TEXT NOT NULL,
  bucket TEXT NOT NULL,
  status public.cleanup_job_status_type NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  worker_token UUID,
  lease_expires_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_cleanup_queue_status_lease ON public.media_cleanup_queue(status, lease_expires_at);

-- ------------------------------------------------------------------------------
-- 7. CONCURRENCY-SAFE LIFECYCLE, DELETION & WORKER RPCS
-- ------------------------------------------------------------------------------

-- First Admin Bootstrap: Protected by Transactional Advisory Lock
CREATE OR REPLACE FUNCTION public.bootstrap_initial_admin(p_target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_target_email TEXT;
  v_existing_admins INT;
  v_is_pending_deletion BOOLEAN;
BEGIN
  -- 1. Strictly enforce service_role caller
  IF (SELECT current_user) <> 'postgres' AND (auth.jwt() ->> 'role') IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'Access denied: bootstrap_initial_admin is restricted to service_role invocation only.'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Transaction-level advisory lock serializes concurrent bootstrap calls
  PERFORM pg_advisory_xact_lock(hashtext('cms_admin_bootstrap_lock'));

  -- 3. Verify that zero active admins exist
  SELECT COUNT(*) INTO v_existing_admins
  FROM public.profiles
  WHERE role = 'admin' AND is_pending_deletion = false;

  IF v_existing_admins > 0 THEN
    RAISE EXCEPTION 'Bootstrap rejected: an active administrator already exists.'
      USING ERRCODE = '42501';
  END IF;

  -- 4. Verify target exists in auth.users
  SELECT email INTO v_target_email
  FROM auth.users
  WHERE id = p_target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Target user % does not exist in auth.users.' USING ERRCODE = 'P0002';
  END IF;

  -- 5. Reject if account is marked pending deletion
  SELECT is_pending_deletion INTO v_is_pending_deletion
  FROM public.profiles
  WHERE id = p_target_user_id;

  IF v_is_pending_deletion = true THEN
    RAISE EXCEPTION 'Bootstrap rejected: target user is scheduled for deletion.'
      USING ERRCODE = '22000';
  END IF;

  -- 6. Upsert profile as administrator
  INSERT INTO public.profiles (id, email, role, is_pending_deletion)
  VALUES (p_target_user_id, v_target_email, 'admin', false)
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    is_pending_deletion = false,
    updated_at = NOW();

  RETURN jsonb_build_object(
    'status', 'success',
    'message', 'Initial administrator provisioned successfully.',
    'user_id', p_target_user_id,
    'email', v_target_email
  );
END;
$$;

-- Prepare Account Deletion: Serialized against sole admin deletion
CREATE OR REPLACE FUNCTION public.prepare_account_deletion(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller_id UUID := auth.uid();
  v_is_caller_admin BOOLEAN;
  v_admin_count INT;
BEGIN
  v_is_caller_admin := public.is_admin();

  IF v_caller_id <> p_user_id AND NOT v_is_caller_admin THEN
    RAISE EXCEPTION 'Access denied.' USING ERRCODE = '42501';
  END IF;

  -- Advisory lock serializes concurrent admin deletions
  PERFORM pg_advisory_xact_lock(hashtext('cms_admin_lifecycle_lock'));

  -- Lock target profile
  PERFORM 1 FROM public.profiles WHERE id = p_user_id FOR UPDATE;

  -- Prevent eliminating the last remaining admin
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'admin') THEN
    SELECT COUNT(*) INTO v_admin_count FROM public.profiles WHERE role = 'admin' AND is_pending_deletion = false;
    IF v_admin_count <= 1 THEN
      RAISE EXCEPTION 'Operation aborted: cannot schedule deletion of the sole active administrator.'
        USING ERRCODE = '22000';
    END IF;
  END IF;

  UPDATE public.profiles
  SET is_pending_deletion = true,
      deletion_scheduled_at = NOW()
  WHERE id = p_user_id;

  RETURN TRUE;
END;
$$;

-- Abort Account Deletion
CREATE OR REPLACE FUNCTION public.abort_account_deletion(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrative privileges required.' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('cms_admin_lifecycle_lock'));

  UPDATE public.profiles
  SET is_pending_deletion = false,
      deletion_scheduled_at = NULL
  WHERE id = p_user_id;

  RETURN TRUE;
END;
$$;

-- Administrative Deletion Request: Locks media row, audits all references, queues job
CREATE OR REPLACE FUNCTION public.request_media_deletion(p_media_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_media RECORD;
  v_ref_count INT := 0;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrative privileges required.' USING ERRCODE = '42501';
  END IF;

  -- Exclusively lock the media row
  SELECT id, storage_path, bucket, is_pending_deletion
  INTO v_media
  FROM public.media
  WHERE id = p_media_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Media asset % not found.' USING ERRCODE = 'P0002';
  END IF;

  IF v_media.is_pending_deletion THEN
    RETURN TRUE;
  END IF;

  -- Audit all 9 media references across all content tables
  SELECT COUNT(*) INTO v_ref_count FROM (
    SELECT id FROM public.projects WHERE cover_image_id = p_media_id
    UNION ALL
    SELECT id FROM public.project_media WHERE media_id = p_media_id
    UNION ALL
    SELECT id FROM public.artworks WHERE primary_image_id = p_media_id OR thumbnail_image_id = p_media_id
    UNION ALL
    SELECT id FROM public.experiences WHERE organization_logo_id = p_media_id
    UNION ALL
    SELECT id FROM public.education WHERE institution_logo_id = p_media_id
    UNION ALL
    SELECT id FROM public.certifications WHERE certificate_image_id = p_media_id
    UNION ALL
    SELECT id FROM public.achievements WHERE badge_image_id = p_media_id
    UNION ALL
    SELECT id FROM public.site_settings WHERE media_id = p_media_id
  ) refs;

  IF v_ref_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete media asset %: it is actively referenced by % entity/entities.', p_media_id, v_ref_count
      USING ERRCODE = '23001';
  END IF;

  -- Mark pending deletion
  UPDATE public.media
  SET is_pending_deletion = true,
      deletion_requested_at = NOW()
  WHERE id = p_media_id;

  -- Insert cleanup queue task
  INSERT INTO public.media_cleanup_queue (media_id, storage_path, bucket, status)
  VALUES (p_media_id, v_media.storage_path, v_media.bucket::TEXT, 'queued');

  RETURN TRUE;
END;
$$;

-- Worker Claim Function: Clamped bounds, individual UUID per job, FOR UPDATE SKIP LOCKED
CREATE OR REPLACE FUNCTION public.claim_cleanup_jobs(
  p_batch_size INT DEFAULT 10,
  p_lease_seconds INT DEFAULT 60
)
RETURNS TABLE (
  job_id UUID,
  media_id UUID,
  storage_path TEXT,
  bucket TEXT,
  worker_token UUID,
  lease_expires_at TIMESTAMPTZ,
  attempts INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clamped_batch INT;
  v_clamped_lease INT;
BEGIN
  IF (SELECT current_user) <> 'postgres' AND (auth.jwt() ->> 'role') IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: only service_role workers may claim cleanup jobs.' USING ERRCODE = '42501';
  END IF;

  -- Clamp inputs
  v_clamped_batch := LEAST(GREATEST(p_batch_size, 1), 50);
  v_clamped_lease := LEAST(GREATEST(p_lease_seconds, 10), 300);

  RETURN QUERY
  WITH claimable AS (
    SELECT q.id
    FROM public.media_cleanup_queue q
    WHERE q.status = 'queued'
       OR (q.status = 'processing' AND q.lease_expires_at <= NOW() AND q.attempts < q.max_attempts)
    ORDER BY q.created_at ASC
    LIMIT v_clamped_batch
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.media_cleanup_queue target
  SET status = 'processing',
      worker_token = gen_random_uuid(),
      lease_expires_at = NOW() + (v_clamped_lease || ' seconds')::interval,
      attempts = target.attempts + 1
  FROM claimable
  WHERE target.id = claimable.id
  RETURNING target.id, target.media_id, target.storage_path, target.bucket, target.worker_token, target.lease_expires_at, target.attempts;
END;
$$;

-- Worker Finalize Function: Atomic validation of token, active lease, and processing status
CREATE OR REPLACE FUNCTION public.finalize_cleanup_job(
  p_job_id UUID,
  p_worker_token UUID,
  p_success BOOLEAN,
  p_error_message TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_media_id UUID;
  v_attempts INT;
  v_max_attempts INT;
BEGIN
  IF (SELECT current_user) <> 'postgres' AND (auth.jwt() ->> 'role') IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: only service_role workers may finalize cleanup jobs.' USING ERRCODE = '42501';
  END IF;

  -- Verify active lease, correct token, and processing status under row lock
  SELECT media_id, attempts, max_attempts
  INTO v_media_id, v_attempts, v_max_attempts
  FROM public.media_cleanup_queue
  WHERE id = p_job_id
    AND worker_token = p_worker_token
    AND status = 'processing'
    AND lease_expires_at > NOW()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Finalization rejected: invalid token, job not processing, or lease expired (Job ID: %).', p_job_id
      USING ERRCODE = '55P03';
  END IF;

  IF p_success THEN
    UPDATE public.media_cleanup_queue
    SET status = 'completed',
        completed_at = NOW(),
        worker_token = NULL,
        lease_expires_at = NULL,
        last_error = NULL
    WHERE id = p_job_id;

    -- Delete media row safely after storage verification
    IF v_media_id IS NOT NULL THEN
      DELETE FROM public.media WHERE id = v_media_id;
    END IF;
  ELSE
    UPDATE public.media_cleanup_queue
    SET status = CASE WHEN v_attempts >= v_max_attempts THEN 'dead_letter'::public.cleanup_job_status_type ELSE 'queued'::public.cleanup_job_status_type END,
        worker_token = NULL,
        lease_expires_at = NULL,
        last_error = p_error_message
    WHERE id = p_job_id;
  END IF;

  RETURN TRUE;
END;
$$;

-- Reaper Function: Re-queues retryable jobs and routes exhausted jobs to dead_letter
CREATE OR REPLACE FUNCTION public.reap_expired_cleanup_jobs()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_reaped_count INT := 0;
BEGIN
  -- 1. Dead-letter exhausted jobs
  WITH dead_jobs AS (
    SELECT id
    FROM public.media_cleanup_queue
    WHERE status = 'processing'
      AND lease_expires_at <= NOW()
      AND attempts >= max_attempts
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.media_cleanup_queue q
  SET status = 'dead_letter',
      worker_token = NULL,
      lease_expires_at = NULL,
      last_error = COALESCE(last_error, 'Lease expired after exhausting max attempts.')
  FROM dead_jobs
  WHERE q.id = dead_jobs.id;

  -- 2. Reset retryable expired jobs
  WITH retry_jobs AS (
    SELECT id
    FROM public.media_cleanup_queue
    WHERE status = 'processing'
      AND lease_expires_at <= NOW()
      AND attempts < max_attempts
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.media_cleanup_queue q
  SET status = 'queued',
      worker_token = NULL,
      lease_expires_at = NULL
  FROM retry_jobs
  WHERE q.id = retry_jobs.id;

  GET DIAGNOSTICS v_reaped_count = ROW_COUNT;
  RETURN v_reaped_count;
END;
$$;

-- Profile Provisioning Trigger (Safe ON CONFLICT DO NOTHING)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url, is_pending_deletion)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user',
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishing_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_cleanup_queue ENABLE ROW LEVEL SECURITY;

-- Explicitly drop known CMS policies
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "media_select" ON public.media;
DROP POLICY IF EXISTS "media_update_admin" ON public.media;
DROP POLICY IF EXISTS "media_delete_admin" ON public.media;
DROP POLICY IF EXISTS "projects_select" ON public.projects;
DROP POLICY IF EXISTS "projects_admin_all" ON public.projects;
DROP POLICY IF EXISTS "project_media_select" ON public.project_media;
DROP POLICY IF EXISTS "project_media_admin_all" ON public.project_media;
DROP POLICY IF EXISTS "artwork_categories_select" ON public.artwork_categories;
DROP POLICY IF EXISTS "artwork_categories_admin" ON public.artwork_categories;
DROP POLICY IF EXISTS "artworks_select" ON public.artworks;
DROP POLICY IF EXISTS "artworks_admin" ON public.artworks;
DROP POLICY IF EXISTS "experiences_select" ON public.experiences;
DROP POLICY IF EXISTS "experiences_admin" ON public.experiences;
DROP POLICY IF EXISTS "education_select" ON public.education;
DROP POLICY IF EXISTS "education_admin" ON public.education;
DROP POLICY IF EXISTS "skill_categories_select" ON public.skill_categories;
DROP POLICY IF EXISTS "skill_categories_admin" ON public.skill_categories;
DROP POLICY IF EXISTS "skills_select" ON public.skills;
DROP POLICY IF EXISTS "skills_admin" ON public.skills;
DROP POLICY IF EXISTS "certifications_select" ON public.certifications;
DROP POLICY IF EXISTS "certifications_admin" ON public.certifications;
DROP POLICY IF EXISTS "achievements_select" ON public.achievements;
DROP POLICY IF EXISTS "achievements_admin" ON public.achievements;
DROP POLICY IF EXISTS "site_settings_select" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin" ON public.site_settings;
DROP POLICY IF EXISTS "publishing_journal_admin" ON public.publishing_journal;
DROP POLICY IF EXISTS "cleanup_queue_admin" ON public.media_cleanup_queue;

-- Profiles: Read own or admin; update self
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Media: Public reads public; admin reads all; update metadata admin only; NO DIRECT DELETE
CREATE POLICY "media_select" ON public.media
  FOR SELECT TO anon, authenticated
  USING (
    (access_level = 'public' AND NOT is_pending_deletion) OR
    public.is_admin()
  );

CREATE POLICY "media_update_admin" ON public.media
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Projects
CREATE POLICY "projects_select" ON public.projects
  FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "projects_admin_all" ON public.projects
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Project Media
CREATE POLICY "project_media_select" ON public.project_media
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.status = 'published' OR public.is_admin()))
  );

CREATE POLICY "project_media_admin_all" ON public.project_media
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Artworks & Categories
CREATE POLICY "artwork_categories_select" ON public.artwork_categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "artwork_categories_admin" ON public.artwork_categories
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "artworks_select" ON public.artworks
  FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.is_admin());
CREATE POLICY "artworks_admin" ON public.artworks
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Experiences, Education, Skills, Certifications, Achievements
CREATE POLICY "experiences_select" ON public.experiences
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "experiences_admin" ON public.experiences
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "education_select" ON public.education
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "education_admin" ON public.education
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "skill_categories_select" ON public.skill_categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "skill_categories_admin" ON public.skill_categories
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "skills_select" ON public.skills
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "skills_admin" ON public.skills
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "certifications_select" ON public.certifications
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "certifications_admin" ON public.certifications
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "achievements_select" ON public.achievements
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "achievements_admin" ON public.achievements
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Site Settings
CREATE POLICY "site_settings_select" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (is_public = true OR public.is_admin());
CREATE POLICY "site_settings_admin" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Publishing Journal & Cleanup Queue (Admin read-only)
CREATE POLICY "publishing_journal_admin" ON public.publishing_journal
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "cleanup_queue_admin" ON public.media_cleanup_queue
  FOR SELECT TO authenticated USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. PRIVILEGE AUDIT & RESTRICTIVE GRANTS
-- ------------------------------------------------------------------------------

-- Step 1: Bulk revoke from PUBLIC, anon, and authenticated
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM PUBLIC, anon, authenticated;

-- Step 2: Explicitly revoke TRUNCATE, REFERENCES, TRIGGER
REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;

-- Step 3: Grant USAGE on public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Step 4: Anon table grants (Strictly SELECT under RLS)
GRANT SELECT ON TABLE 
  public.projects,
  public.project_media,
  public.artwork_categories,
  public.artworks,
  public.experiences,
  public.education,
  public.skill_categories,
  public.skills,
  public.certifications,
  public.achievements,
  public.media,
  public.site_settings
TO anon;

-- Step 5: Authenticated table grants
GRANT SELECT ON TABLE 
  public.profiles,
  public.projects,
  public.project_media,
  public.artwork_categories,
  public.artworks,
  public.experiences,
  public.education,
  public.skill_categories,
  public.skills,
  public.certifications,
  public.achievements,
  public.media,
  public.site_settings,
  public.publishing_journal,
  public.media_cleanup_queue
TO authenticated;

-- PROFILES COLUMN PRIVILEGES: Authenticated users can ONLY modify full_name and avatar_url
GRANT UPDATE (full_name, avatar_url) ON TABLE public.profiles TO authenticated;

-- CONTENT TABLES MUTATIONS (Admin-governed via RLS)
GRANT INSERT, UPDATE, DELETE ON TABLE 
  public.projects,
  public.project_media,
  public.artwork_categories,
  public.artworks,
  public.experiences,
  public.education,
  public.skill_categories,
  public.skills,
  public.certifications,
  public.achievements,
  public.site_settings
TO authenticated;

-- MEDIA PERMISSIONS: Only UPDATE (for alt_text) is granted. INSERT and DELETE are strictly REVOKED.
GRANT UPDATE (alt_text) ON TABLE public.media TO authenticated;

-- Step 6: Function Execution Whitelist
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.request_media_deletion(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.prepare_account_deletion(UUID) TO authenticated;

-- Step 7: Service Role Grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ------------------------------------------------------------------------------
-- 10. EXHAUSTIVE PRIVILEGE AUDIT VIEW
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_privilege_audit AS
-- Check unauthorized schema CREATE privileges
SELECT 
  'SCHEMA' AS object_type,
  n.nspname AS object_name,
  r.rolname AS grantee,
  p.perm AS privilege_type
FROM pg_namespace n
CROSS JOIN pg_roles r
CROSS JOIN LATERAL (
  SELECT 'CREATE' AS perm WHERE has_schema_privilege(r.oid, n.oid, 'CREATE')
) p
WHERE n.nspname = 'public'
  AND r.rolname IN ('anon', 'authenticated', 'public')

UNION ALL

-- Check unauthorized table privileges
SELECT 
  'TABLE' AS object_type,
  table_name AS object_name,
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'PUBLIC')
  AND (
    privilege_type IN ('TRUNCATE', 'REFERENCES', 'TRIGGER') OR
    (table_name = 'media' AND privilege_type IN ('INSERT', 'DELETE')) OR
    (table_name = 'profiles' AND privilege_type IN ('INSERT', 'DELETE')) OR
    (table_name = 'publishing_journal' AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE')) OR
    (table_name = 'media_cleanup_queue' AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE'))
  )

UNION ALL

-- Check unauthorized column UPDATE privileges on profiles
SELECT 
  'COLUMN' AS object_type,
  table_name || '.' || column_name AS object_name,
  grantee,
  privilege_type
FROM information_schema.column_privileges
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND grantee IN ('anon', 'authenticated', 'PUBLIC')
  AND privilege_type = 'UPDATE'
  AND column_name NOT IN ('full_name', 'avatar_url')

UNION ALL

-- Check unauthorized routine execution privileges
SELECT 
  'ROUTINE' AS object_type,
  routine_name AS object_name,
  grantee,
  privilege_type
FROM information_schema.routine_privileges
WHERE routine_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'PUBLIC')
  AND routine_name IN (
    'bootstrap_initial_admin',
    'claim_cleanup_jobs',
    'finalize_cleanup_job',
    'reap_expired_cleanup_jobs',
    'abort_account_deletion'
  );

COMMIT;
