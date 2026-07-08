CREATE TABLE "Todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"owner" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"status" varchar(20) DEFAULT 'todo' NOT NULL,
	"tags" json DEFAULT '[]'::json NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX "Todo_owner_idx" ON "Todo" USING btree ("owner");--> statement-breakpoint
CREATE INDEX "Todo_owner_status_idx" ON "Todo" USING btree ("owner","status");