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

function mapSocialLinks(links: Array<SocialLinkRow>): Array<ProfileSocialLink> {
  return links.map((link) => ({
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
  const description = user.description ?? ""
  const categoryLabel =
    primaryCategoryDbToUi(user.category as Parameters<typeof primaryCategoryDbToUi>[0]) ||
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
    memberSince: user.createdAt
      ? user.createdAt.toLocaleDateString("es-AR", { month: "long", year: "numeric" })
      : undefined,
    email: user.email,
    phone: user.phone ?? undefined,
    birthDate: user.birthDate ?? undefined,
    city: user.location ?? undefined,
  }
}

export function isAssistantOrganizerProfile(profile: Pick<Profile, "kind">): boolean {
  return profile.kind === "usuario"
}
