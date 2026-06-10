const CONSUMER_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.com.ar",
  "outlook.com",
  "outlook.com.ar",
  "live.com",
  "live.com.ar",
  "msn.com",
  "yahoo.com",
  "yahoo.com.ar",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "mail.com",
  "gmx.com",
  "yandex.com",
  "tutanota.com",
  "rocketmail.com",
])

export function getEmailDomain(email: string): string | null {
  const normalized = email.trim().toLowerCase()
  const atIndex = normalized.lastIndexOf("@")

  if (atIndex <= 0 || atIndex === normalized.length - 1) {
    return null
  }

  return normalized.slice(atIndex + 1)
}

export function isConsumerEmailDomain(domain: string): boolean {
  return CONSUMER_EMAIL_DOMAINS.has(domain.trim().toLowerCase())
}

/** Correo corporativo de marca (no Gmail, Hotmail, etc.). */
export function canAutoValidateOrganizerByEmail(email: string): boolean {
  const domain = getEmailDomain(email)

  if (!domain) {
    return false
  }

  return !isConsumerEmailDomain(domain)
}
