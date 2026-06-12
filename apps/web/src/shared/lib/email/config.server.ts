import "@tanstack/react-start/server-only"

export type EmailProvider = "console" | "smtp"

export function getEmailProvider(): EmailProvider {
  const value = process.env.EMAIL_PROVIDER?.trim().toLowerCase()

  if (value === "smtp") {
    return "smtp"
  }

  return "console"
}

export function getEmailFromAddress(): string | null {
  const from = process.env.EMAIL_FROM?.trim()
  return from || null
}

export function getSmtpHost(): string {
  return process.env.SMTP_HOST?.trim() || "smtp.gmail.com"
}

export function getSmtpPort(): number {
  const port = Number(process.env.SMTP_PORT?.trim())

  if (Number.isFinite(port) && port > 0) {
    return port
  }

  return 587
}

export function getSmtpUser(): string | null {
  const user = process.env.SMTP_USER?.trim()
  return user || null
}

export function getSmtpPass(): string | null {
  const pass = process.env.SMTP_PASS?.trim()
  return pass || null
}

export function getAppBaseUrl(): string {
  const configured = process.env.APP_URL?.trim()

  if (configured) {
    return configured.replace(/\/$/, "")
  }

  return "http://localhost:3000"
}
