CREATE TYPE "public"."participation_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TYPE "public"."social_platform" ADD VALUE IF NOT EXISTS 'website';--> statement-breakpoint
CREATE TABLE "event_participation_requests" (
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "participation_request_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	CONSTRAINT "event_participation_requests_event_id_user_id_pk" PRIMARY KEY("event_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "event_participation_requests" ADD CONSTRAINT "event_participation_requests_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participation_requests" ADD CONSTRAINT "event_participation_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;