import "@tanstack/react-start/server-only"
import {
  getEmailFromAddress,
  getEmailProvider,
  getResendApiKey,
  type EmailProvider,
} from "./config.server"

export type SendEmailInput = {
  to: string
  subject: string
  html: string
  text: string
}

export type SendEmailResult = {
  provider: EmailProvider
  messageId: string | null
}

async function sendWithResend(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = getResendApiKey()

  if (!apiKey) {
    throw new Error("RESEND_API_KEY no está configurada para EMAIL_PROVIDER=resend.")
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getEmailFromAddress(),
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Resend respondió ${response.status}: ${body}`)
  }

  const payload = (await response.json()) as { id?: string }

  return {
    provider: "resend",
    messageId: payload.id ?? null,
  }
}

async function sendWithConsole(input: SendEmailInput): Promise<SendEmailResult> {
  console.log("\n--- Nexa email (modo consola) ---")
  console.log(`Para: ${input.to}`)
  console.log(`Asunto: ${input.subject}`)
  console.log(input.text)
  console.log("--- Fin del email ---\n")

  return {
    provider: "console",
    messageId: `console-${Date.now()}`,
  }
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const provider = getEmailProvider()

  if (provider === "resend") {
    return sendWithResend(input)
  }

  return sendWithConsole(input)
}
