import "@tanstack/react-start/server-only"
import nodemailer from "nodemailer"
import {
  getEmailFromAddress,
  getEmailProvider,
  getSmtpHost,
  getSmtpPass,
  getSmtpPort,
  getSmtpUser,
} from "./config.server"
import type { EmailProvider } from "./config.server"

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

let smtpTransporter: nodemailer.Transporter | null = null

function getSmtpTransporter(): nodemailer.Transporter {
  if (smtpTransporter) {
    return smtpTransporter
  }

  const user = getSmtpUser()
  const pass = getSmtpPass()

  if (!user || !pass) {
    throw new Error(
      "SMTP_USER y SMTP_PASS deben estar configuradas para EMAIL_PROVIDER=smtp.",
    )
  }

  const port = getSmtpPort()

  smtpTransporter = nodemailer.createTransport({
    host: getSmtpHost(),
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  return smtpTransporter
}

async function sendWithSmtp(input: SendEmailInput): Promise<SendEmailResult> {
  const from = getEmailFromAddress()

  if (!from) {
    throw new Error("EMAIL_FROM debe estar configurada para EMAIL_PROVIDER=smtp.")
  }

  const transporter = getSmtpTransporter()
  const info = await transporter.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  })

  return {
    provider: "smtp",
    messageId: info.messageId ?? null,
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

  if (provider === "smtp") {
    return sendWithSmtp(input)
  }

  return sendWithConsole(input)
}
