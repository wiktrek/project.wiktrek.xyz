ALTER TABLE "Todo" ADD COLUMN IF NOT EXISTS "priority" varchar(10) DEFAULT 'medium' NOT NULL;
