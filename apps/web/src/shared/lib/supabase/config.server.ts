import "@tanstack/react-start/server-only"

export function isSupabaseConfigured(): boolean {
  const url = process.env.SUPABASE_URL?.trim() ?? ""
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim() ?? ""
  return url.length > 0 && anonKey.length > 0
}

const defaultBucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() ?? ""

const profilesBucket =
  process.env.SUPABASE_STORAGE_BUCKET_PROFILES?.trim() || defaultBucket

const eventsBucket =
  process.env.SUPABASE_STORAGE_BUCKET_EVENTS?.trim() || defaultBucket

export function getStorageBucketForProfiles(): string {
  return profilesBucket
}

export function getStorageBucketForEvents(): string {
  return eventsBucket
}
