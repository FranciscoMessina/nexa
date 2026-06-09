import "@tanstack/react-start/server-only"

export type EmailProvider = "console" | "resend"

export function getEmailProvider(): EmailProvider {
  const value = process.env.EMAIL_PROVIDER?.trim().toLowerCase()

  if (value === "resend") {
    return "resend"
  }

  return "console"
}

export function getEmailFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || "Nexa <onboarding@resend.dev>"
}

export function getResendApiKey(): string | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  return apiKey || null
}

export function getAppBaseUrl(): string {
  const configured = process.env.APP_URL?.trim()

  if (configured) {
    return configured.replace(/\/$/, "")
  }

  return "http://localhost:3000"
}
