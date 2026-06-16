import { z } from "zod"

const userRoleSchema = z.enum(["emprendedor", "organizador", "asistente"])

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional(),
})

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  displayName: z.string().min(1),
  role: userRoleSchema,
  remember: z.boolean().optional(),
})
