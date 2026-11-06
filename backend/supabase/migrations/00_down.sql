-- ==============================================================================
-- 00_down.sql
-- Clean rollback script: Drops all custom portfolio CMS tables, functions,
-- types, and policies in reverse dependency order.
-- Never modifies core auth schema.
-- ==============================================================================

-- 1. Drop Triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Drop Views
DROP VIEW IF EXISTS public.v_privilege_audit;
DROP VIEW IF EXISTS public.v_unused_media;

-- 3. Drop Storage Policies
DROP POLICY IF EXISTS "portfolio_media_select" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_insert" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_update" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_delete" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_private_select" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_private_insert" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_private_update" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_private_delete" ON storage.objects;

-- 4. Drop Content Tables in reverse dependency order
DROP TABLE IF EXISTS public.media_cleanup_queue CASCADE;
DROP TABLE IF EXISTS public.publishing_journal CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.certifications CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.skill_categories CASCADE;
DROP TABLE IF EXISTS public.education CASCADE;
DROP TABLE IF EXISTS public.experiences CASCADE;
DROP TABLE IF EXISTS public.artworks CASCADE;
DROP TABLE IF EXISTS public.artwork_categories CASCADE;
DROP TABLE IF EXISTS public.project_media CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.media CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 5. Drop Functions
DROP FUNCTION IF EXISTS public.bootstrap_initial_admin(UUID);
DROP FUNCTION IF EXISTS public.prepare_account_deletion(UUID);
DROP FUNCTION IF EXISTS public.abort_account_deletion(UUID);
DROP FUNCTION IF EXISTS public.request_media_deletion(UUID);
DROP FUNCTION IF EXISTS public.claim_cleanup_jobs(INT, INT);
DROP FUNCTION IF EXISTS public.finalize_cleanup_job(UUID, UUID, BOOLEAN, TEXT);
DROP FUNCTION IF EXISTS public.reap_expired_cleanup_jobs();
DROP FUNCTION IF EXISTS public.validate_media_reference();
DROP FUNCTION IF EXISTS public.validate_site_setting_media();
DROP FUNCTION IF EXISTS public.protect_media_columns();
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.is_admin();

-- 6. Drop Custom Types
DROP TYPE IF EXISTS public.cleanup_job_status_type;
DROP TYPE IF EXISTS public.publishing_stage_type;
DROP TYPE IF EXISTS public.content_status_type;
DROP TYPE IF EXISTS public.media_access_type;
DROP TYPE IF EXISTS public.media_bucket_type;
