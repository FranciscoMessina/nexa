export type ProfileKind = "usuario" | "organizador" | "emprendimiento"

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "twitter"
  | "youtube"
  | "tiktok"
  | "pinterest"
  | "linkedin"

export type ProfileSocialLink = {
  id: string
  platform: SocialPlatform
  handle: string
}

export type ProfileStatusBadge = {
  label: string
  tone: "success" | "warning" | "neutral"
}

export type Profile = {
  id: string
  kind: ProfileKind
  displayName: string
  headline: string
  location: string
  categoryLabel: string
  description: string
  avatarUrl: string
  representativeImageUrl: string
  socialLinks: Array<ProfileSocialLink>
  statusBadge?: ProfileStatusBadge
  validationStatus?: "validated" | "not_validated"
  memberSince?: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  birthDate?: string
  city?: string
}
