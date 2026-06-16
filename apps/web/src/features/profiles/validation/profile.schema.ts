import { z } from "zod"

export const socialPlatformSchema = z.enum([
  "instagram",
  "facebook",
  "twitter",
  "youtube",
  "tiktok",
  "pinterest",
  "website",
])

export const updateProfileInputSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  headline: z.string(),
  location: z.string(),
  description: z.string(),
  avatarUrl: z.string(),
  representativeImageUrl: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  categoryLabel: z.string().optional(),
  socialLinks: z.array(
    z.object({
      id: z.string(),
      platform: socialPlatformSchema,
      handle: z.string(),
    })
  ),
})
