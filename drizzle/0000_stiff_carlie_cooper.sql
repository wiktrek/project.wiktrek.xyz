CREATE TABLE IF NOT EXISTS "Like" (
	"id" serial NOT NULL,
	"owner" varchar(255) NOT NULL,
	"recipeId" integer NOT NULL,
	"up" boolean NOT NULL,
	CONSTRAINT "Like_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "Like_id_unique" UNIQUE("id"),
	CONSTRAINT "Like_id_key" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Message" (
	"id" serial NOT NULL,
	"author" varchar(16) NOT NULL,
	"text" varchar(128) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "Message_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PollQuestion" (
	"id" serial NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"endsAt" timestamp with time zone,
	"question" varchar(5000) NOT NULL,
	"options" json NOT NULL,
	"ownerEmail" varchar(255) NOT NULL,
	"end" boolean NOT NULL,
	CONSTRAINT "PollQuestion_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Recipe" (
	"id" serial NOT NULL,
	"rating" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"ingredients" json NOT NULL,
	"owner" varchar(255) NOT NULL,
	"instructions" json NOT NULL,
	CONSTRAINT "Recipe_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ShortLink" (
	"id" serial NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"owner" varchar(191) NOT NULL,
	"url" varchar(255) NOT NULL,
	"slug" varchar(191) NOT NULL,
	CONSTRAINT "ShortLink_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "ShortLink_id_unique" UNIQUE("id"),
	CONSTRAINT "ShortLink_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Vote" (
	"id" serial NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"questionId" integer NOT NULL,
	"voterToken" varchar(255) NOT NULL,
	"choice" integer NOT NULL,
	CONSTRAINT "Vote_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "Vote_id_unique" UNIQUE("id"),
	CONSTRAINT "Vote_voterToken_questionId_key" UNIQUE("voterToken","questionId")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Like_owner_idx" ON "Like" USING btree ("owner");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Message_idx" ON "Message" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ShortLink_slug_idx" ON "ShortLink" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Vote_questionId_idx" ON "Vote" USING btree ("questionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Vote_voterToken_idx" ON "Vote" USING btree ("voterToken");