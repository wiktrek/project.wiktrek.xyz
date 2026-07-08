CREATE TABLE "TodoSettings" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner" varchar(255) NOT NULL,
	"doneRetention" varchar(10) DEFAULT 'never' NOT NULL,
	CONSTRAINT "TodoSettings_owner_key" UNIQUE("owner")
);
--> statement-breakpoint
CREATE TABLE "TodoStage" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"owner" varchar(255) NOT NULL,
	"name" varchar(100) NOT NULL,
	"color" varchar(20) DEFAULT 'gray' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"isDone" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Todo" ADD COLUMN "stageId" integer;--> statement-breakpoint
ALTER TABLE "Todo" ADD COLUMN "completedAt" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "TodoStage_owner_idx" ON "TodoStage" USING btree ("owner");--> statement-breakpoint
CREATE INDEX "Todo_owner_stage_idx" ON "Todo" USING btree ("owner","stageId");