import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

import { events } from "./events"
import { users } from "./users"

export const recommendationChannelEnum = pgEnum("recommendation_channel", ["email"])

export const recommendationDeliveryStatusEnum = pgEnum("recommendation_delivery_status", [
  "pending",
  "sent",
  "failed",
])

export const eventRecommendationDeliveries = pgTable(
  "event_recommendation_deliveries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    channel: recommendationChannelEnum("channel").notNull(),
    status: recommendationDeliveryStatusEnum("status").notNull().default("pending"),
    recommendationReason: text("recommendation_reason").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("event_recommendation_deliveries_user_event_channel_uidx").on(
      table.userId,
      table.eventId,
      table.channel
    ),
    index("event_recommendation_deliveries_user_id_idx").on(table.userId),
    index("event_recommendation_deliveries_status_idx").on(table.status),
  ]
)
