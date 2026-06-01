declare namespace NodeJS {
  interface ProcessEnv {
    SUPABASE_URL?: string
    SUPABASE_ANON_KEY?: string
    SUPABASE_STORAGE_BUCKET?: string
    SUPABASE_STORAGE_BUCKET_PROFILES?: string
    SUPABASE_STORAGE_BUCKET_EVENTS?: string
    DATABASE_URL?: string
    DIRECT_URL?: string
  }
}
