import "dotenv/config"
import { createHash } from "node:crypto"
import { sql } from "drizzle-orm"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "../src/schema"
import {
  eventAttendees,
  eventEntrepreneurs,
  eventGalleryImages,
  events,
  userSocialLinks,
  users,
} from "../src/schema"
import {
  cleanupSeedAuthUsers,
  insertSeedAuthUsers,
  SEED_DEV_PASSWORD,
  type SeedAuthUserInput,
} from "./seed-auth"
import { seedEvents } from "./seed-events.source"
import { seedUsers } from "./seed-profiles.source"

const LOGIN_AUTH_USER_IDS: Record<string, string> = {
  "asistente@nexa.mock": "f1000001-0001-4000-8000-000000000001",
  "organizador@nexa.mock": "f1000002-0002-4000-8000-000000000002",
  "emprendedor@nexa.mock": "f1000003-0003-4000-8000-000000000003",
}

const SEED_KEY_BY_LOGIN_EMAIL: Record<string, string> = {
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

function resolveAuthUserId(seedKey: string): string {
  const loginEntry = Object.entries(SEED_KEY_BY_LOGIN_EMAIL).find(
    ([, profileSeedKey]) => profileSeedKey === seedKey
  )

  if (loginEntry) {
    return LOGIN_AUTH_USER_IDS[loginEntry[0]]
  }

  return uuidFromSeed(`auth:${seedKey}`)
}

function resolveUserId(seedKey: string): string {
  return uuidFromSeed(`user:${seedKey}`)
}

function resolveUserIdOrThrow(
  seedKey: string,
  seedKeyToUserId: Map<string, string>,
  context: string
): string {
  const userId = seedKeyToUserId.get(seedKey)

  if (!userId) {
    throw new Error(`${context}: usuario no encontrado para seedKey "${seedKey}"`)
  }

  return userId
}

function resolveSeedEmail(seedKey: string, email?: string | null): string {
  const loginEmail = Object.entries(SEED_KEY_BY_LOGIN_EMAIL).find(
    ([, profileSeedKey]) => profileSeedKey === seedKey
  )?.[0]

  if (loginEmail) {
    return loginEmail
  }

  if (email?.trim()) {
    return email.trim().toLowerCase()
  }

  return `${seedKey}@seed.nexa.mock`
}

function buildSeedAuthUsers(): Array<SeedAuthUserInput> {
  return seedUsers.map((seedUser) => {
    const authUserId = resolveAuthUserId(seedUser.seedKey)
    const loginEmail = Object.entries(SEED_KEY_BY_LOGIN_EMAIL).find(
      ([, profileSeedKey]) => profileSeedKey === seedUser.seedKey
    )?.[0]

    return {
      id: authUserId,
      email: resolveSeedEmail(seedUser.seedKey, seedUser.email),
      displayName: seedUser.displayName,
      role: seedUser.role,
      canSignIn: Boolean(loginEmail),
    }
  })
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

  const seedAuthUsers = buildSeedAuthUsers()
  const authUserIds = seedAuthUsers.map((authUser) => authUser.id)

  console.log("Sincronizando auth.users (requerido por FK)...")
  await cleanupSeedAuthUsers(sqlClient, authUserIds)
  await insertSeedAuthUsers(sqlClient, seedAuthUsers)

  const seedKeyToUserId = new Map<string, string>()

  console.log("Insertando usuarios...")
  for (const seedUser of seedUsers) {
    const userId = resolveUserId(seedUser.seedKey)
    seedKeyToUserId.set(seedUser.seedKey, userId)

    const createdAt = seedUser.createdAt ?? new Date()

    await db.insert(users).values({
      id: userId,
      authUserId: resolveAuthUserId(seedUser.seedKey),
      role: seedUser.role,
      displayName: seedUser.displayName,
      headline: seedUser.headline ?? null,
      location: seedUser.location ?? null,
      description: seedUser.description ?? null,
      avatarUrl: seedUser.avatarUrl ?? null,
      representativeImageUrl: seedUser.representativeImageUrl ?? null,
      category: seedUser.category ?? null,
      validatedAt: seedUser.validatedAt ?? null,
      email: resolveSeedEmail(seedUser.seedKey, seedUser.email),
      phone: seedUser.phone ?? null,
      birthDate: seedUser.birthDate ?? null,
      createdAt,
      updatedAt: createdAt,
    })

    if (seedUser.socialLinks.length > 0) {
      await db.insert(userSocialLinks).values(
        seedUser.socialLinks.map((link) => ({
          userId,
          platform: link.platform,
          handle: link.handle ?? null,
          url: link.url ?? null,
        }))
      )
    }
  }

  console.log("Insertando eventos...")
  for (const event of seedEvents) {
    const createdByUserId = resolveUserIdOrThrow(
      event.createdBySeedKey,
      seedKeyToUserId,
      `Evento "${event.title}"`
    )

    await db.insert(events).values({
      id: event.id,
      createdByUserId,
      title: event.title,
      summary: event.summary,
      location: event.location,
      startsAt: event.startsAt,
      endsAt: event.endsAt ?? null,
      category: event.category,
      description: event.description,
      priceAmount: event.priceAmount,
      priceCurrency: event.priceCurrency,
      priceLabel: event.priceLabel,
      favoritesCount: event.favoritesCount,
      registrationUrl: event.registrationUrl ?? null,
      requirements: event.requirements,
      latitude: event.latitude,
      longitude: event.longitude,
    })

    const uniqueGalleryUrls = [...new Set(event.galleryUrls.filter(Boolean))]

    if (uniqueGalleryUrls.length > 0) {
      await db.insert(eventGalleryImages).values(
        uniqueGalleryUrls.map((url) => ({
          eventId: event.id,
          url,
        }))
      )
    }

    const entrepreneurSeedKeys = event.entrepreneurSeedKeys ?? []

    if (entrepreneurSeedKeys.length > 0) {
      await db.insert(eventEntrepreneurs).values(
        entrepreneurSeedKeys.map((seedKey) => ({
          eventId: event.id,
          userId: resolveUserIdOrThrow(seedKey, seedKeyToUserId, `Evento "${event.title}"`),
        }))
      )
    }

    const attendeeSeedKeys = event.attendeeSeedKeys ?? []

    if (attendeeSeedKeys.length > 0) {
      await db.insert(eventAttendees).values(
        attendeeSeedKeys.map((seedKey) => ({
          eventId: event.id,
          userId: resolveUserIdOrThrow(seedKey, seedKeyToUserId, `Evento "${event.title}"`),
        }))
      )
    }
  }

  await sqlClient.end({ timeout: 5 })
  console.log("Seed completado.")
  console.log("")
  console.log("Login de demo (email + contraseña):")
  for (const [email, authUserId] of Object.entries(LOGIN_AUTH_USER_IDS)) {
    console.log(`- ${email} → ${authUserId} (password: ${SEED_DEV_PASSWORD})`)
  }
}

void main().catch((error) => {
  if (error && typeof error === "object" && "message" in error) {
    console.error(error.message)
  }

  if (error && typeof error === "object" && "detail" in error && error.detail) {
    console.error(String(error.detail))
  }

  console.error(error)
  process.exit(1)
})
