ALTER TABLE "LinkProfile" ADD COLUMN "slug" varchar(50);--> statement-breakpoint
ALTER TABLE "LinkProfile" ADD CONSTRAINT "LinkProfile_slug_key" UNIQUE("slug");