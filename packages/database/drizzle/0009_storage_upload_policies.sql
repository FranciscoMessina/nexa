-- Supabase Storage policies for nexa-uploads (must match SUPABASE_STORAGE_BUCKET).
-- Paths: profiles/{auth.uid()}/... and events/{auth.uid()}/...

DROP POLICY IF EXISTS "nexa_public_read_uploads" ON storage.objects;
CREATE POLICY "nexa_public_read_uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'nexa-uploads');

DROP POLICY IF EXISTS "nexa_authenticated_upload_profiles" ON storage.objects;
CREATE POLICY "nexa_authenticated_upload_profiles"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'nexa-uploads'
  AND (storage.foldername(name))[1] = 'profiles'
  AND (storage.foldername(name))[2] = (SELECT auth.uid()::text)
);

DROP POLICY IF EXISTS "nexa_authenticated_update_profiles" ON storage.objects;
CREATE POLICY "nexa_authenticated_update_profiles"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'nexa-uploads'
  AND (storage.foldername(name))[1] = 'profiles'
  AND (storage.foldername(name))[2] = (SELECT auth.uid()::text)
)
WITH CHECK (
  bucket_id = 'nexa-uploads'
  AND (storage.foldername(name))[1] = 'profiles'
  AND (storage.foldername(name))[2] = (SELECT auth.uid()::text)
);

DROP POLICY IF EXISTS "nexa_authenticated_upload_events" ON storage.objects;
CREATE POLICY "nexa_authenticated_upload_events"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'nexa-uploads'
  AND (storage.foldername(name))[1] = 'events'
  AND (storage.foldername(name))[2] = (SELECT auth.uid()::text)
);

DROP POLICY IF EXISTS "nexa_authenticated_update_events" ON storage.objects;
CREATE POLICY "nexa_authenticated_update_events"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'nexa-uploads'
  AND (storage.foldername(name))[1] = 'events'
  AND (storage.foldername(name))[2] = (SELECT auth.uid()::text)
)
WITH CHECK (
  bucket_id = 'nexa-uploads'
  AND (storage.foldername(name))[1] = 'events'
  AND (storage.foldername(name))[2] = (SELECT auth.uid()::text)
);
