import type { SocialPlatform } from "@/features/profiles/types/profile.types"

export const socialPlatformOptions: Array<{ value: SocialPlatform; label: string }> = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "pinterest", label: "Pinterest" },
  { value: "website", label: "Página web" },
]
