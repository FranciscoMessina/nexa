import "dotenv/config"
import { createHash } from "node:crypto"
import { sql } from "drizzle-orm"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "../src/schema"
import {
  eventEntrepreneurs,
  eventGalleryImages,
  events,
  userSocialLinks,
  users,
} from "../src/schema"
import { categoryEnum, socialPlatformEnum } from "../src/schema/enums"
import { seedEvents } from "./seed-events.source"
import { mockProfileRecords } from "./seed-profiles.source"

const CATEGORY_UI_TO_DB: Record<string, string> = {
  Música: "musica",
  Gastronomía: "gastronomia",
  "Arte y Cultura": "arte_y_cultura",
  Deportes: "deportes",
  "Ferias de Emprendedores": "feria_de_emprendedores",
  "Talleres y Cursos": "talleres_y_cursos",
  "Cine y Entretenimiento": "cine_y_entretenimiento",
  Ropa: "ropa",
}

const ROLE_BY_KIND: Record<string, "asistente" | "organizador" | "emprendedor"> = {
  usuario: "asistente",
  organizador: "organizador",
  emprendimiento: "emprendedor",
}

const LOGIN_AUTH_USER_IDS: Record<string, string> = {
  "asistente@nexa.mock": "f1000001-0001-4000-8000-000000000001",
  "organizador@nexa.mock": "f1000002-0002-4000-8000-000000000002",
  "emprendedor@nexa.mock": "f1000003-0003-4000-8000-000000000003",
}

const PROFILE_ID_BY_LOGIN_EMAIL: Record<string, string> = {
  "asistente@nexa.mock": "profile-maria-lopez",
  "organizador@nexa.mock": "profile-antares-bar",
  "emprendedor@nexa.mock": "profile-crudo",
}

function uuidFromSeed(key: string): string {
  const digest = createHash("sha256").update(`nexa-seed:${key}`).digest("hex")
  return [
    digest.slice(0, 8),
    digest.slice(8, 12),
    `4${digest.slice(13, 16)}`,
    digest.slice(16, 20),
    digest.slice(20, 32),
  ].join("-")
}

function resolveAuthUserId(profileId: string): string {
  const loginEntry = Object.entries(PROFILE_ID_BY_LOGIN_EMAIL).find(
    ([, legacyId]) => legacyId === profileId
  )

  if (loginEntry) {
    return LOGIN_AUTH_USER_IDS[loginEntry[0]]
  }

  return uuidFromSeed(`auth:${profileId}`)
}

function resolveUserId(profileId: string): string {
  return uuidFromSeed(`user:${profileId}`)
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()

  if (!connectionString) {
    throw new Error("Definí DIRECT_URL o DATABASE_URL para ejecutar el seed.")
  }

  const sqlClient = postgres(connectionString, { prepare: false, max: 1 })
  const db = drizzle(sqlClient, { schema })

  console.log("Limpiando tablas de demo...")
  await db.execute(sql`TRUNCATE TABLE event_favorites, event_attendees, event_entrepreneurs, event_gallery_images, events, user_gallery_images, user_social_links, users RESTART IDENTITY CASCADE`)

  const profileIdToUserId = new Map<string, string>()

  console.log("Insertando usuarios...")
  for (const profile of mockProfileRecords) {
    const userId = resolveUserId(profile.id)
    profileIdToUserId.set(profile.id, userId)

    await db.insert(users).values({
      id: userId,
      authUserId: resolveAuthUserId(profile.id),
      role: ROLE_BY_KIND[profile.kind] ?? "asistente",
      displayName: profile.displayName,
      location: profile.location,
      description: profile.description,
      avatarUrl: profile.avatarUrl,
      representativeImageUrl: profile.representativeImageUrl,
      email: profile.email ?? null,
      phone: profile.phone ?? null,
      birthDate: profile.birthDate ?? null,
      validatedAt: profile.validationStatus === "validated" ? new Date() : null,
    })

    const validSocialLinks = profile.socialLinks.filter((link) =>
      socialPlatformEnum.enumValues.includes(
        link.platform as (typeof socialPlatformEnum.enumValues)[number]
      )
    )

    if (validSocialLinks.length > 0) {
      await db.insert(userSocialLinks).values(
        validSocialLinks.map((link) => ({
          userId,
          platform: link.platform as (typeof socialPlatformEnum.enumValues)[number],
          handle: link.handle,
        }))
      )
    }
  }

  console.log("Insertando eventos...")
  for (const event of seedEvents) {
    const createdByUserId = profileIdToUserId.get(event.organizer.profileId)

    if (!createdByUserId) {
      throw new Error(`Organizador sin usuario: ${event.organizer.profileId}`)
    }

    const category = CATEGORY_UI_TO_DB[event.category]

    if (!category) {
      throw new Error(`Categoría desconocida: ${event.category}`)
    }

    await db.insert(events).values({
      id: event.id,
      createdByUserId,
      title: event.title,
      summary: event.summary,
      location: event.location,
      startsAt: event.date,
      category: [category as (typeof categoryEnum.enumValues)[number]],
      description: event.description,
      priceAmount: String(event.price.amount),
      priceCurrency: event.price.currency,
      priceLabel: event.price.label,
      favoritesCount: event.savedCount,
      registrationUrl: event.registrationUrl ?? null,
      requirements: event.requirements,
      latitude: event.coordinates.lat,
      longitude: event.coordinates.lng,
    })

    const galleryUrls = [event.image.src, ...event.gallery].filter(Boolean)
    const uniqueUrls = [...new Set(galleryUrls)]

    if (uniqueUrls.length > 0) {
      await db.insert(eventGalleryImages).values(
        uniqueUrls.map((url) => ({
          eventId: event.id,
          url,
        }))
      )
    }

    const ventureIds = event.participatingVentures?.map((venture) => venture.profileId) ?? []

    if (ventureIds.length > 0) {
      await db.insert(eventEntrepreneurs).values(
        ventureIds.map((profileId) => {
          const userId = profileIdToUserId.get(profileId)
          if (!userId) {
            throw new Error(`Emprendedor sin usuario: ${profileId}`)
          }
          return { eventId: event.id, userId }
        })
      )
    }
  }

  await sqlClient.end({ timeout: 5 })
  console.log("Seed completado.")
  console.log("")
  console.log("Creá en Supabase Auth estos usuarios (id = auth_user_id) con metadata role + displayName:")
  for (const [email, authUserId] of Object.entries(LOGIN_AUTH_USER_IDS)) {
    console.log(`- ${email} → ${authUserId}`)
  }
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
