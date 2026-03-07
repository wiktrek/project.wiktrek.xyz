CREATE TABLE "Link" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"profileId" integer NOT NULL,
	"title" varchar(100) NOT NULL,
	"url" varchar(1000) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"icon" varchar(50),
	"clickCount" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "LinkProfile" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"userId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"displayName" varchar(100),
	"bio" varchar(500),
	"avatarUrl" varchar(500),
	"backgroundColor" varchar(20) DEFAULT '#ffffff',
	"textColor" varchar(20) DEFAULT '#000000',
	"buttonStyle" varchar(20) DEFAULT 'rounded',
	"isPublic" boolean DEFAULT true NOT NULL,
	CONSTRAINT "LinkProfile_userId_unique" UNIQUE("userId"),
	CONSTRAINT "LinkProfile_username_key" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "Like" DROP CONSTRAINT "Like_id_unique";--> statement-breakpoint
ALTER TABLE "Like" DROP CONSTRAINT "Like_id_key";--> statement-breakpoint
ALTER TABLE "Message" DROP CONSTRAINT "Message_id_unique";--> statement-breakpoint
ALTER TABLE "ShortLink" DROP CONSTRAINT "ShortLink_id_unique";--> statement-breakpoint
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_id_unique";--> statement-breakpoint
ALTER TABLE "Like" DROP CONSTRAINT "Like_id_pk";--> statement-breakpoint
ALTER TABLE "PollQuestion" DROP CONSTRAINT "PollQuestion_id_pk";--> statement-breakpoint
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_id_pk";--> statement-breakpoint
ALTER TABLE "ShortLink" DROP CONSTRAINT "ShortLink_id_pk";--> statement-breakpoint
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_id_pk";--> statement-breakpoint
ALTER TABLE "Like" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "Message" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "PollQuestion" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "Recipe" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "ShortLink" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "Vote" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "Link" ADD CONSTRAINT "Link_profileId_LinkProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."LinkProfile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "Link_profileId_idx" ON "Link" USING btree ("profileId");--> statement-breakpoint
CREATE INDEX "Link_profile_order_idx" ON "Link" USING btree ("profileId","order");--> statement-breakpoint
CREATE INDEX "PollQuestion_ownerEmail_idx" ON "PollQuestion" USING btree ("ownerEmail");--> statement-breakpoint
CREATE INDEX "Recipe_owner_idx" ON "Recipe" USING btree ("owner");