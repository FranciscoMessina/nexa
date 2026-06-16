import { z } from "zod"

export const uploadImageSchema = z.object({
  fileBase64: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  kind: z.enum(["avatar", "representative", "event-gallery"]),
  ownerId: z.string().min(1),
})
