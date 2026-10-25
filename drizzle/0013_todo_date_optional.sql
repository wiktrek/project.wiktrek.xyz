ALTER TABLE "Todo" ALTER COLUMN "date" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "Todo" ALTER COLUMN "date" DROP DEFAULT;
--> statement-breakpoint
UPDATE "Todo"
SET "date" = NULL
WHERE "date" IS NOT NULL
  AND "createdAt" IS NOT NULL
  AND ABS(EXTRACT(EPOCH FROM ("date" - "createdAt"))) < 5;
