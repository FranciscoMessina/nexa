CREATE TYPE "public"."recommendation_channel" AS ENUM('email');--> statement-breakpoint
CREATE TYPE "public"."recommendation_delivery_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TABLE "event_recommendation_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"channel" "recommendation_channel" NOT NULL,
	"status" "recommendation_delivery_status" DEFAULT 'pending' NOT NULL,
	"recommendation_reason" text NOT NULL,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "accepts_email_communications" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "event_recommendation_deliveries" ADD CONSTRAINT "event_recommendation_deliveries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_recommendation_deliveries" ADD CONSTRAINT "event_recommendation_deliveries_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "event_recommendation_deliveries_user_event_channel_uidx" ON "event_recommendation_deliveries" USING btree ("user_id","event_id","channel");--> statement-breakpoint
CREATE INDEX "event_recommendation_deliveries_user_id_idx" ON "event_recommendation_deliveries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "event_recommendation_deliveries_status_idx" ON "event_recommendation_deliveries" USING btree ("status");