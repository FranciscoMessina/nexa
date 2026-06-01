import { relations } from "drizzle-orm"

import {
  eventAttendees,
  eventEntrepreneurs,
  eventFavorites,
  eventGalleryImages,
  events,
} from "./events"
import { userGalleryImages, userSocialLinks, users } from "./users"

export const usersRelations = relations(users, ({ many }) => ({
  socialLinks: many(userSocialLinks),
  galleryImages: many(userGalleryImages),
  createdEvents: many(events),
  eventEntrepreneurships: many(eventEntrepreneurs),
  eventAttendances: many(eventAttendees),
  eventFavorites: many(eventFavorites),
}))

export const userSocialLinksRelations = relations(userSocialLinks, ({ one }) => ({
  user: one(users, {
    fields: [userSocialLinks.userId],
    references: [users.id],
  }),
}))

export const userGalleryImagesRelations = relations(
  userGalleryImages,
  ({ one }) => ({
    user: one(users, {
      fields: [userGalleryImages.userId],
      references: [users.id],
    }),
  })
)

export const eventsRelations = relations(events, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [events.createdByUserId],
    references: [users.id],
  }),
  galleryImages: many(eventGalleryImages),
  entrepreneurs: many(eventEntrepreneurs),
  attendees: many(eventAttendees),
  favorites: many(eventFavorites),
}))

export const eventGalleryImagesRelations = relations(
  eventGalleryImages,
  ({ one }) => ({
    event: one(events, {
      fields: [eventGalleryImages.eventId],
      references: [events.id],
    }),
  })
)

export const eventEntrepreneursRelations = relations(
  eventEntrepreneurs,
  ({ one }) => ({
    event: one(events, {
      fields: [eventEntrepreneurs.eventId],
      references: [events.id],
    }),
    user: one(users, {
      fields: [eventEntrepreneurs.userId],
      references: [users.id],
    }),
  })
)

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventAttendees.userId],
    references: [users.id],
  }),
}))

export const eventFavoritesRelations = relations(eventFavorites, ({ one }) => ({
  event: one(events, {
    fields: [eventFavorites.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventFavorites.userId],
    references: [users.id],
  }),
}))
