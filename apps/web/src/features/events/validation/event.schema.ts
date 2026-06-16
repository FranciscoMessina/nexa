import { z } from "zod"

const eventKindSchema = z.enum(["verified", "community"])

const eventLabelSchema = z.object({
  type: eventKindSchema,
  text: z.string(),
})

const eventOrganizerSchema = z.object({
  profileId: z.string().min(1),
  name: z.string(),
  avatarUrl: z.string(),
  verified: z.boolean(),
  contactEmail: z.string().email(),
})

const eventPriceSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  label: z.string(),
})

const eventParticipatingVentureSchema = z.object({
  profileId: z.string().min(1),
})

const eventCoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})

export const createEventInputSchema = z.object({
  organizer: eventOrganizerSchema,
  label: eventLabelSchema,
  title: z.string().min(1),
  summary: z.string(),
  location: z.string(),
  date: z.coerce.date(),
  category: z.string().min(1),
  image: z.object({
    src: z.string(),
  }),
  description: z.string(),
  price: eventPriceSchema.optional(),
  gallery: z.array(z.string()),
  registrationUrl: z
    .union([z.string().url(), z.literal("")])
    .optional(),
  participatingVentures: z.array(eventParticipatingVentureSchema).optional(),
  attendeeProfileIds: z.array(z.string().min(1)).optional(),
  requirements: z.string(),
  coordinates: eventCoordinatesSchema.optional(),
})
