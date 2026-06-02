ALTER TABLE "users" ADD COLUMN "headline" text;--> statement-breakpoint
UPDATE "users" SET "headline" = "description" WHERE "headline" IS NULL AND "description" IS NOT NULL;
