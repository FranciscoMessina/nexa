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
    SMTP_HOST?: string
    SMTP_PORT?: string
    SMTP_USER?: string
    SMTP_PASS?: string
    RECOMMENDATION_EMAIL_CRON_SECRET?: string
  }
}
