import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { categoryEnum, socialPlatformEnum, userRoleEnum } from "./enums"

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authUserId: uuid("auth_user_id").notNull().unique(),
    role: userRoleEnum("role").notNull(),
    displayName: text("display_name"),
    location: text("location"),
    description: text("description"),
    avatarUrl: text("avatar_url"),
    representativeImageUrl: text("representative_image_url"),
    category: categoryEnum("category").array(),
    validatedAt: timestamp("validated_at", { withTimezone: true }),
    email: text("email"),
    phone: text("phone"),
    birthDate: date("birth_date"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("users_role_idx").on(table.role)]
)

export const userSocialLinks = pgTable("user_social_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  platform: socialPlatformEnum("platform").notNull(),
  handle: text("handle"),
  url: text("url"),
})

export const userGalleryImages = pgTable("user_gallery_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
})
