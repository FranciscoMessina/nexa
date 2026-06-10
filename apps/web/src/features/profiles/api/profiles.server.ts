import "@tanstack/react-start/server-only"
import { eq } from "drizzle-orm"
import { socialPlatformEnum, userSocialLinks, users } from "@workspace/database"
import { getDb } from "@/shared/lib/db/get-db"
import { ForbiddenError } from "@/shared/lib/auth/errors.server"
import { requireAppUser } from "@/shared/lib/auth/session.server"
import type { Profile, ProfileSocialLink } from "../types/profile.types"
import { mapUserToProfile } from "../utils/profile.mapper"
import {
  canAutoValidateOrganizerByEmail,
} from "../utils/profile-validation.utils"
import { categoryUiToDb } from "@/features/events/utils/category.mapper"
import type { UserRole } from "@/features/auth/types/auth.types"

async function loadSocialLinks(userId: string) {
  const database = getDb()
  return database
    .select()
    .from(userSocialLinks)
    .where(eq(userSocialLinks.userId, userId))
}

export async function getProfileById(profileId: string): Promise<Profile | null> {
  const database = getDb()
  const rows = await database.select().from(users).where(eq(users.id, profileId)).limit(1)
  const user = rows[0]

  if (!user) {
    return null
  }

  const links = await loadSocialLinks(user.id)
  return mapUserToProfile(user, links)
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const authUser = await requireAppUser()
  return getProfileById(authUser.id)
}

export async function getProfilesByIds(profileIds: Array<string>): Promise<Array<Profile>> {
  const profiles = await Promise.all(profileIds.map((id) => getProfileById(id)))
  return profiles.filter((profile): profile is Profile => profile !== null)
}

export type UpdateProfileInput = {
  id: string
  displayName: string
  headline: string
  location: string
  description: string
  avatarUrl: string
  representativeImageUrl: string
  email: string
  phone?: string
  birthDate?: string
  categoryLabel?: string
  socialLinks: Array<ProfileSocialLink>
}

export async function updateProfile(input: UpdateProfileInput): Promise<Profile> {
  const authUser = await requireAppUser()

  if (input.id !== authUser.id) {
    throw new ForbiddenError("Solo podés editar tu propio perfil.")
  }

  const database = getDb()
  const role = authUser.role as UserRole

  const profileUpdates: {
    displayName: string
    headline: string | null
    location: string | null
    description: string | null
    avatarUrl: string | null
    representativeImageUrl: string | null
    email: string
    phone: string | null
    birthDate: string | null
    category?: Array<ReturnType<typeof categoryUiToDb>>
  } = {
    displayName: input.displayName.trim(),
    headline: input.headline.trim() || null,
    location: input.location.trim() || null,
    description: input.description.trim() || null,
    avatarUrl: input.avatarUrl.trim() || null,
    representativeImageUrl: input.representativeImageUrl.trim() || null,
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    birthDate: input.birthDate?.trim() || null,
  }

  if (
    (role === "organizador" || role === "emprendedor") &&
    input.categoryLabel?.trim()
  ) {
    profileUpdates.category = [categoryUiToDb(input.categoryLabel)]
  }

  await database
    .update(users)
    .set(profileUpdates)
    .where(eq(users.id, authUser.id))

  await database.delete(userSocialLinks).where(eq(userSocialLinks.userId, authUser.id))

  const dbPlatforms = socialPlatformEnum.enumValues

  function isDbPlatform(platform: string): platform is (typeof dbPlatforms)[number] {
    return (dbPlatforms as ReadonlyArray<string>).includes(platform)
  }

  const socialRows = input.socialLinks.flatMap((link) => {
    if (!isDbPlatform(link.platform)) {
      return []
    }

    return [
      {
        userId: authUser.id,
        platform: link.platform,
        handle: link.platform === "website" ? null : link.handle.trim() || null,
        url: link.platform === "website" ? link.handle.trim() || null : null,
      },
    ]
  })

  if (socialRows.length > 0) {
    await database.insert(userSocialLinks).values(socialRows)
  }

  const profile = await getProfileById(authUser.id)

  if (!profile) {
    throw new Error("No se pudo cargar el perfil actualizado.")
  }

  return profile
}

export type RequestProfileValidationResult = {
  outcome: "validated" | "pending_review"
  message: string
  profile: Profile
}

export async function requestProfileValidation(): Promise<RequestProfileValidationResult> {
  const authUser = await requireAppUser()

  if (authUser.role !== "organizador") {
    throw new ForbiddenError("Solo los organizadores pueden solicitar validación.")
  }

  const database = getDb()
  const rows = await database.select().from(users).where(eq(users.id, authUser.id)).limit(1)
  const user = rows[0]

  if (!user) {
    throw new Error("No se encontró tu perfil.")
  }

  const existingProfile = await getProfileById(authUser.id)

  if (!existingProfile) {
    throw new Error("No se pudo cargar tu perfil.")
  }

  if (user.validatedAt) {
    return {
      outcome: "validated",
      message: "Tu perfil ya está verificado.",
      profile: existingProfile,
    }
  }

  if (canAutoValidateOrganizerByEmail(user.email)) {
    await database
      .update(users)
      .set({ validatedAt: new Date() })
      .where(eq(users.id, authUser.id))

    const profile = await getProfileById(authUser.id)

    if (!profile) {
      throw new Error("No se pudo cargar el perfil verificado.")
    }

    return {
      outcome: "validated",
      message: "Perfil verificado.",
      profile,
    }
  }

  return {
    outcome: "pending_review",
    message: "Solicitud enviada. El equipo de Nexa revisará tu perfil.",
    profile: existingProfile,
  }
}
