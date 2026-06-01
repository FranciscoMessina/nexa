import "@tanstack/react-start/server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { getCookie } from "@tanstack/react-start/server"
import { isSupabaseConfigured } from "./config.server"

export type Database = Record<string, never>

const ACCESS_TOKEN_COOKIE = "nexa-sb-access-token"
const REFRESH_TOKEN_COOKIE = "nexa-sb-refresh-token"

function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.SUPABASE_URL?.trim() ?? ""
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim() ?? ""

  if (!url || !anonKey) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set on the server.")
  }

  return { url, anonKey }
}

export function createSupabaseServerClient(): SupabaseClient<Database> {
  const { url, anonKey } = getSupabaseEnv()
  return createClient<Database>(url, anonKey)
}

export async function createSupabaseServerClientWithSession(): Promise<SupabaseClient<Database>> {
  const client = createSupabaseServerClient()
  const accessToken = getCookie(ACCESS_TOKEN_COOKIE)
  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE)

  if (accessToken && refreshToken) {
    await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
  }

  return client
}

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured on the server.")
  }
}

export const supabaseSessionCookies = {
  access: ACCESS_TOKEN_COOKIE,
  refresh: REFRESH_TOKEN_COOKIE,
} as const
