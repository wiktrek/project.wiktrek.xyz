ALTER TABLE "ShortLink" ADD COLUMN IF NOT EXISTS "clickCount" integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "ShortLink" ADD COLUMN IF NOT EXISTS "lastClickedAt" timestamp with time zone;
