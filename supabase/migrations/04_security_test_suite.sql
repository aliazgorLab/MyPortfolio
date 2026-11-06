-- ==============================================================================
-- 04_security_test_suite.sql
-- Md Ali Azgor Portfolio CMS: Phase 1 Revision 3.8 Security Verification Suite
-- Run via: psql -f 04_security_test_suite.sql (Clean transactional execution)
-- ==============================================================================

BEGIN;

DO $$
BEGIN
  RAISE NOTICE '=============================================================';
  RAISE NOTICE '>>> STARTING PHASE 1 REVISION 3.8 SECURITY VERIFICATION SUITE';
  RAISE NOTICE '=============================================================';
END $$;

-- ------------------------------------------------------------------------------
-- 1. SETUP AUTH FIXTURES & CONTEXT
-- ------------------------------------------------------------------------------
CREATE TEMPORARY TABLE test_vars (
  admin_id UUID DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT gen_random_uuid(),
  user2_id UUID DEFAULT gen_random_uuid(),
  pub_media_id UUID DEFAULT gen_random_uuid(),
  priv_media_id UUID DEFAULT gen_random_uuid()
);

INSERT INTO test_vars DEFAULT VALUES;

-- Insert valid auth.users records
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
  created_at, updated_at
)
SELECT 
  admin_id, '00000000-0000-00-00-0000-000000000000', 'authenticated', 'authenticated', 
  'admin@test.local', crypt('password123', gen_salt('bf')), NOW(), 
  '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Test Admin"}'::jsonb, 
  NOW(), NOW()
FROM test_vars;

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
  created_at, updated_at
)
SELECT 
  user_id, '00000000-0000-00-00-0000-000000000000', 'authenticated', 'authenticated', 
  'user@test.local', crypt('password123', gen_salt('bf')), NOW(), 
  '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Test User"}'::jsonb, 
  NOW(), NOW()
FROM test_vars;

-- Insert test media fixtures
INSERT INTO public.media (id, file_name, storage_path, bucket, access_level, folder, mime_type, size_bytes, public_url)
SELECT 
  pub_media_id, 'public-img.webp', 'projects/public-img.webp', 'portfolio-media', 'public', 'projects', 'image/webp', 10240, 'https://cdn.test/public-img.webp'
FROM test_vars;

INSERT INTO public.media (id, file_name, storage_path, bucket, access_level, folder, mime_type, size_bytes, public_url)
SELECT 
  priv_media_id, 'private-doc.pdf', 'documents/private-doc.pdf', 'portfolio-private', 'private', 'documents', 'application/pdf', 51200, NULL
FROM test_vars;

-- ------------------------------------------------------------------------------
-- TEST 1: Profile Column-Level Privilege Lockdown (Role Tampering Prevention)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT user_id INTO v_user_id FROM test_vars;
  
  -- Simulate authenticated user role
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  -- 1A: Permitted column update
  UPDATE public.profiles SET full_name = 'Updated Name' WHERE id = v_user_id;

  -- 1B: Forbidden column update (role)
  BEGIN
    UPDATE public.profiles SET role = 'admin' WHERE id = v_user_id;
    RAISE EXCEPTION 'TEST 1 FAILED: Authenticated user was able to update role column!';
  EXCEPTION WHEN SQLSTATE '42501' THEN
    RAISE NOTICE '>>> [PASS] Test 1: Direct role modification rejected by column privileges (SQLSTATE 42501).';
  END;

  RESET ROLE;
END $$;

-- ------------------------------------------------------------------------------
-- TEST 2: First-Admin Bootstrap Serialization & Service-Role Restriction
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_user_id UUID;
  v_admin_id UUID;
BEGIN
  SELECT user_id, admin_id INTO v_user_id, v_admin_id FROM test_vars;

  -- 2A: Authenticated user cannot call bootstrap
  SET LOCAL ROLE authenticated;
  BEGIN
    PERFORM public.bootstrap_initial_admin(v_user_id);
    RAISE EXCEPTION 'TEST 2A FAILED: Authenticated user could invoke bootstrap_initial_admin!';
  EXCEPTION WHEN SQLSTATE '42501' THEN
    RAISE NOTICE '>>> [PASS] Test 2A: Authenticated bootstrap invocation rejected (SQLSTATE 42501).';
  END;
  RESET ROLE;

  -- 2B: Valid bootstrap via service_role
  PERFORM set_config('request.jwt.claim.role', 'service_role', true);
  PERFORM public.bootstrap_initial_admin(v_admin_id);

  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'TEST 2B FAILED: Admin profile not created during valid bootstrap!';
  END IF;
  RAISE NOTICE '>>> [PASS] Test 2B: Initial admin successfully provisioned by service_role.';

  -- 2C: Second bootstrap attempt must be rejected (1 admin already exists)
  BEGIN
    PERFORM public.bootstrap_initial_admin(v_user_id);
    RAISE EXCEPTION 'TEST 2C FAILED: Second bootstrap call succeeded when admin already exists!';
  EXCEPTION WHEN SQLSTATE '42501' THEN
    RAISE NOTICE '>>> [PASS] Test 2C: Secondary bootstrap rejected when admin exists (SQLSTATE 42501).';
  END;
END $$;

-- ------------------------------------------------------------------------------
-- TEST 3: Media Validation Trigger on Content Tables
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_pub_id UUID;
  v_priv_id UUID;
  v_fake_id UUID := gen_random_uuid();
  v_cat_id UUID := gen_random_uuid();
BEGIN
  SELECT pub_media_id, priv_media_id INTO v_pub_id, v_priv_id FROM test_vars;

  -- Create category fixture
  INSERT INTO public.artwork_categories (id, name, slug) VALUES (v_cat_id, 'Digital Art', 'digital-art');

  -- 3A: Missing media reference (Foreign key violation)
  BEGIN
    INSERT INTO public.projects (slug, title, category, year, cover_image_id, status)
    VALUES ('p-missing', 'P Missing', 'Web', '2026', v_fake_id, 'draft');
    RAISE EXCEPTION 'TEST 3A FAILED: Missing media ID accepted!';
  EXCEPTION WHEN SQLSTATE '23503' THEN
    RAISE NOTICE '>>> [PASS] Test 3A: Missing media reference rejected (SQLSTATE 23503).';
  END;

  -- 3B: Published content referencing private draft asset
  BEGIN
    INSERT INTO public.projects (slug, title, category, year, cover_image_id, status)
    VALUES ('p-leak', 'P Leak', 'Web', '2026', v_priv_id, 'published');
    RAISE EXCEPTION 'TEST 3B FAILED: Published project linked private media!';
  EXCEPTION WHEN SQLSTATE '23514' THEN
    RAISE NOTICE '>>> [PASS] Test 3B: Published project linking private media rejected (SQLSTATE 23514).';
  END;

  -- 3C: Draft content referencing private asset (Permitted during drafting)
  INSERT INTO public.projects (slug, title, category, year, cover_image_id, status)
  VALUES ('p-draft', 'P Draft', 'Web', '2026', v_priv_id, 'draft');
  RAISE NOTICE '>>> [PASS] Test 3C: Draft project referencing private draft media permitted.';

  -- 3D: Transitioning draft to published while referencing private asset must fail
  BEGIN
    UPDATE public.projects SET status = 'published' WHERE slug = 'p-draft';
    RAISE EXCEPTION 'TEST 3D FAILED: Project transitioned to published while referencing private media!';
  EXCEPTION WHEN SQLSTATE '23514' THEN
    RAISE NOTICE '>>> [PASS] Test 3D: Publishing project with private media rejected (SQLSTATE 23514).';
  END;

  -- 3E: Private site setting referencing public media
  BEGIN
    INSERT INTO public.site_settings (key, value, is_public, media_id)
    VALUES ('resume_pdf', '{"url":"test"}'::jsonb, false, v_pub_id);
    RAISE EXCEPTION 'TEST 3E FAILED: Private setting accepted public media!';
  EXCEPTION WHEN SQLSTATE '23514' THEN
    RAISE NOTICE '>>> [PASS] Test 3E: Private setting linking public media rejected (SQLSTATE 23514).';
  END;
END $$;

-- ------------------------------------------------------------------------------
-- TEST 4: Direct Media Insertion & Deletion Privilege Lockdown
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_admin_id UUID;
  v_pub_id UUID;
BEGIN
  SELECT admin_id, pub_media_id INTO v_admin_id, v_pub_id FROM test_vars;

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_admin_id::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  -- 4A: Direct INSERT to public.media must fail
  BEGIN
    INSERT INTO public.media (file_name, storage_path, bucket, access_level, folder, mime_type, size_bytes)
    VALUES ('hack.jpg', 'projects/hack.jpg', 'portfolio-media', 'public', 'projects', 'image/jpeg', 100);
    RAISE EXCEPTION 'TEST 4A FAILED: Direct INSERT to public.media succeeded!';
  EXCEPTION WHEN SQLSTATE '42501' THEN
    RAISE NOTICE '>>> [PASS] Test 4A: Direct INSERT on public.media rejected (SQLSTATE 42501).';
  END;

  -- 4B: Direct DELETE on public.media must fail
  BEGIN
    DELETE FROM public.media WHERE id = v_pub_id;
    RAISE EXCEPTION 'TEST 4B FAILED: Direct DELETE on public.media succeeded!';
  EXCEPTION WHEN SQLSTATE '42501' THEN
    RAISE NOTICE '>>> [PASS] Test 4B: Direct DELETE on public.media rejected (SQLSTATE 42501).';
  END;

  RESET ROLE;
END $$;

-- ------------------------------------------------------------------------------
-- TEST 5: Sole Administrator Deletion Protection
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  SELECT admin_id INTO v_admin_id FROM test_vars;

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_admin_id::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  -- Attempt to schedule deletion of the sole active admin
  BEGIN
    PERFORM public.prepare_account_deletion(v_admin_id);
    RAISE EXCEPTION 'TEST 5 FAILED: Allowed scheduling deletion of sole administrator!';
  EXCEPTION WHEN SQLSTATE '22000' THEN
    RAISE NOTICE '>>> [PASS] Test 5: Sole admin deletion rejected (SQLSTATE 22000).';
  END;

  RESET ROLE;
END $$;

-- ------------------------------------------------------------------------------
-- TEST 6: Cleanup Queue Claim, Unique Tokens & Stale Worker Finalization
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_job RECORD;
  v_stale_token UUID := gen_random_uuid();
BEGIN
  PERFORM set_config('request.jwt.claim.role', 'service_role', true);

  -- Queue a cleanup job fixture
  INSERT INTO public.media_cleanup_queue (storage_path, bucket, status)
  VALUES ('projects/stale.webp', 'portfolio-media', 'queued');

  -- Claim job
  SELECT * INTO v_job FROM public.claim_cleanup_jobs(1, 10);

  IF v_job.job_id IS NULL THEN
    RAISE EXCEPTION 'TEST 6 FAILED: Failed to claim cleanup job!';
  END IF;

  -- 6A: Finalize with stale/mismatched token
  BEGIN
    PERFORM public.finalize_cleanup_job(v_job.job_id, v_stale_token, true);
    RAISE EXCEPTION 'TEST 6A FAILED: Finalization accepted stale/invalid token!';
  EXCEPTION WHEN SQLSTATE '55P03' THEN
    RAISE NOTICE '>>> [PASS] Test 6A: Finalization with invalid worker token rejected (SQLSTATE 55P03).';
  END;

  -- 6B: Valid finalization with matching token
  PERFORM public.finalize_cleanup_job(v_job.job_id, v_job.worker_token, true);
  RAISE NOTICE '>>> [PASS] Test 6B: Valid cleanup finalization succeeded.';
END $$;

-- ------------------------------------------------------------------------------
-- TEST 7: Exhaustive Privilege Audit Verification
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_violation RECORD;
  v_violation_count INT := 0;
BEGIN
  FOR v_violation IN SELECT * FROM public.v_privilege_audit LOOP
    v_violation_count := v_violation_count + 1;
    RAISE WARNING 'Privilege Violation Found: Type=%, Object=%, Grantee=%, Priv=%',
      v_violation.object_type, v_violation.object_name, v_violation.grantee, v_violation.privilege_type;
  END LOOP;

  IF v_violation_count > 0 THEN
    RAISE EXCEPTION 'TEST 7 FAILED: Privilege audit identified % unauthorized grants!', v_violation_count;
  END IF;

  RAISE NOTICE '>>> [PASS] Test 7: Exhaustive privilege audit clean (0 violations).';
END $$;

DO $$
BEGIN
  RAISE NOTICE '=============================================================';
  RAISE NOTICE '>>> ALL PHASE 1 REVISION 3.8 TESTS PASSED PERFECTLY';
  RAISE NOTICE '=============================================================';
END $$;

ROLLBACK;

