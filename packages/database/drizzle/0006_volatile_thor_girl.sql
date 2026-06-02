UPDATE "users" SET "email" = "id"::text || '@legacy.nexa.local' WHERE "email" IS NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;