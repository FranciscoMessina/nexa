declare namespace NodeJS {
  interface ProcessEnv {
    SUPABASE_URL?: string
    SUPABASE_ANON_KEY?: string
    SUPABASE_STORAGE_BUCKET?: string
    SUPABASE_STORAGE_BUCKET_PROFILES?: string
    SUPABASE_STORAGE_BUCKET_EVENTS?: string
    DATABASE_URL?: string
    DIRECT_URL?: string
    APP_URL?: string
    EMAIL_PROVIDER?: string
    EMAIL_FROM?: string
    RESEND_API_KEY?: string
    RECOMMENDATION_EMAIL_CRON_SECRET?: string
  }
}
