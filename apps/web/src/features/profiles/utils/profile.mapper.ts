import type { AppUserRow } from "@/features/auth/api/users.server"
import type { userSocialLinks } from "@workspace/database"
import type {
  Profile,
  ProfileKind,
  ProfileSocialLink,
  ProfileStatusBadge,
} from "../types/profile.types"
import type { UserRole } from "@/features/auth/types/auth.types"
import { primaryCategoryDbToUi } from "@/features/events/utils/category.mapper"

type SocialLinkRow = typeof userSocialLinks.$inferSelect

const supportedSocialPlatforms = new Set<SocialLinkRow["platform"]>([
  "instagram",
  "facebook",
  "twitter",
  "youtube",
  "tiktok",
  "pinterest",
])

function formatMemberSince(value: AppUserRow["createdAt"]): string | undefined {
  if (!value) {
    return undefined
  }

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toLocaleDateString("es-AR", { month: "long", year: "numeric" })
}

function resolveUserCategories(
  category: AppUserRow["category"]
): Parameters<typeof primaryCategoryDbToUi>[0] {
  if (!category) {
    return null
  }

  if (Array.isArray(category)) {
    return category
  }

  return [category]
}

function roleToProfileKind(role: UserRole): ProfileKind {
  if (role === "organizador") {
    return "organizador"
  }

  if (role === "emprendedor") {
    return "emprendimiento"
  }

  return "usuario"
}

function categoryLabelForRole(role: UserRole): string {
  if (role === "organizador") {
    return "Organizador"
  }

  if (role === "emprendedor") {
    return "Emprendimiento"
  }

  return "Asistente"
}

function statusBadgeForUser(user: AppUserRow): ProfileStatusBadge | undefined {
  if (user.validatedAt) {
    return { label: "Organizador verificado", tone: "success" }
  }

  if (user.role === "organizador") {
    return { label: "Perfil activo", tone: "neutral" }
  }

  return { label: "Perfil activo", tone: "success" }
}

function splitDisplayName(displayName: string): { firstName: string; lastName: string } {
  const parts = displayName.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return { firstName: "", lastName: "" }
  }

  if (parts.length === 1) {
    return { firstName: parts[0]!, lastName: "" }
  }

  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(" "),
  }
}

function mapSocialLinks(links: Array<SocialLinkRow>): Array<ProfileSocialLink> {
  return links
    .filter((link) => supportedSocialPlatforms.has(link.platform))
    .map((link) => ({
      id: link.id,
      platform: link.platform,
      handle: link.handle ?? "",
    }))
}

export function mapUserToProfile(
  user: AppUserRow,
  socialLinks: Array<SocialLinkRow> = []
): Profile {
  const kind = roleToProfileKind(user.role as UserRole)
  const displayName = user.displayName ?? "Usuario"
  const nameParts = kind === "usuario" ? splitDisplayName(displayName) : { firstName: undefined, lastName: undefined }
  const description = user.description ?? ""
  const categoryLabel =
    primaryCategoryDbToUi(resolveUserCategories(user.category)) ||
    categoryLabelForRole(user.role as UserRole)

  return {
    id: user.id,
    kind,
    displayName,
    headline: user.headline?.trim() || description || displayName,
    location: user.location ?? "",
    categoryLabel,
    description,
    avatarUrl: user.avatarUrl ?? "",
    representativeImageUrl:
      user.representativeImageUrl ?? user.avatarUrl ?? "",
    socialLinks: mapSocialLinks(socialLinks),
    statusBadge: statusBadgeForUser(user),
    validationStatus: user.validatedAt ? "validated" : "not_validated",
    memberSince: formatMemberSince(user.createdAt),
    email: user.email,
    phone: user.phone ?? undefined,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    birthDate: user.birthDate ?? undefined,
    city: user.location ?? undefined,
  }
}

export function isAssistantOrganizerProfile(profile: Pick<Profile, "kind">): boolean {
  return profile.kind === "usuario"
}
