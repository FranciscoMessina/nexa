import { pgEnum } from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", [
  "asistente",
  "organizador",
  "emprendedor",
])

export const categoryEnum = pgEnum("category", [
  "ropa",
  "feria_de_emprendedores",
  "arte_y_cultura",
  "cine_y_entretenimiento",
  "deportes",
  "gastronomia",
  "musica",
  "talleres_y_cursos",
])

export const socialPlatformEnum = pgEnum("social_platform", [
  "instagram",
  "facebook",
  "twitter",
  "youtube",
  "tiktok",
  "pinterest",
])

export const participationRequestStatusEnum = pgEnum("participation_request_status", [
  "pending",
  "approved",
  "rejected",
])
