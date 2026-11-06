-- ==============================================================================
-- 02_storage_setup.sql
-- Supabase Storage: Buckets Configuration & Hardened Access Policies
-- Phase 1 Revision 3.8
-- ==============================================================================

-- 1. Create or update portfolio buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'portfolio-media',
    'portfolio-media',
    true,
    5242880, -- 5MB limit for public CDN media
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
  ),
  (
    'portfolio-private',
    'portfolio-private',
    false,
    10485760, -- 10MB limit for drafts & private docs
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Drop existing policies targeting ONLY portfolio buckets (Preserve unrelated buckets)
DROP POLICY IF EXISTS "storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_upload" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_delete" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_select" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_insert" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_update" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_delete" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_private_select" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_private_insert" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_private_update" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_private_delete" ON storage.objects;

-- 3. Scoped Policies for portfolio-media
-- Anyone can view published assets via CDN
CREATE POLICY "portfolio_media_select" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio-media');

-- Admin can upload into designated public folders
CREATE POLICY "portfolio_media_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio-media'
    AND public.is_admin()
    AND (storage.foldername(name))[1] IN ('projects', 'artworks', 'experience', 'education', 'certifications', 'general')
  );

-- Admin can update metadata in public bucket
CREATE POLICY "portfolio_media_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

-- Note: Direct DELETE is intentionally omitted for authenticated clients.
-- Storage file deletions are performed exclusively by the backend cleanup queue under service_role.

-- 4. Scoped Policies for portfolio-private (Admin & Service Role Only)
CREATE POLICY "portfolio_private_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'portfolio-private' AND public.is_admin());

CREATE POLICY "portfolio_private_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio-private'
    AND public.is_admin()
    AND (storage.foldername(name))[1] IN ('drafts', 'documents', 'private_settings')
  );

CREATE POLICY "portfolio_private_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-private' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio-private' AND public.is_admin());

-- Note: Direct DELETE is intentionally omitted for authenticated clients.
