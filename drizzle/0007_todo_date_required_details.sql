ALTER TABLE "Todo" ADD COLUMN IF NOT EXISTS "stageId" integer;
--> statement-breakpoint
ALTER TABLE "Todo" ADD COLUMN IF NOT EXISTS "completedAt" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "Todo" ADD COLUMN IF NOT EXISTS "description" varchar(5000);
--> statement-breakpoint
ALTER TABLE "Todo" ADD COLUMN IF NOT EXISTS "date" timestamp with time zone DEFAULT now();
--> statement-breakpoint
ALTER TABLE "Todo" ALTER COLUMN "description" SET DEFAULT '';
--> statement-breakpoint
UPDATE "Todo" SET "description" = '' WHERE "description" IS NULL;
--> statement-breakpoint
UPDATE "Todo" SET "date" = COALESCE("createdAt", now()) WHERE "date" IS NULL;
--> statement-breakpoint
ALTER TABLE "Todo" ALTER COLUMN "description" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "Todo" ALTER COLUMN "date" SET NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Todo_owner_stage_idx" ON "Todo" USING btree ("owner","stageId");
