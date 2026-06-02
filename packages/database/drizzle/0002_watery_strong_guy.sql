ALTER TABLE "user_social_links" ALTER COLUMN "platform" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."social_platform";--> statement-breakpoint
CREATE TYPE "public"."social_platform" AS ENUM('instagram', 'facebook', 'twitter', 'youtube', 'tiktok', 'pinterest');--> statement-breakpoint
ALTER TABLE "user_social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."social_platform" USING "platform"::"public"."social_platform";