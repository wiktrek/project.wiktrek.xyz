-- Move JSON array columns into relational child tables, then drop them.
-- Run this before `db:push`, otherwise push drops the columns without
-- copying their data.
BEGIN;

CREATE TABLE IF NOT EXISTS "PollOption" (
  "id" serial PRIMARY KEY NOT NULL,
  "questionId" integer NOT NULL CONSTRAINT "PollOption_questionId_PollQuestion_id_fk" REFERENCES "PollQuestion"("id") ON DELETE CASCADE,
  "position" integer NOT NULL,
  "text" varchar(200) NOT NULL,
  CONSTRAINT "PollOption_questionId_position_key" UNIQUE ("questionId", "position")
);

CREATE TABLE IF NOT EXISTS "VoteAnswer" (
  "voteId" integer NOT NULL CONSTRAINT "VoteAnswer_voteId_Vote_id_fk" REFERENCES "Vote"("id") ON DELETE CASCADE,
  "optionId" integer NOT NULL CONSTRAINT "VoteAnswer_optionId_PollOption_id_fk" REFERENCES "PollOption"("id") ON DELETE CASCADE,
  "rank" integer NOT NULL,
  CONSTRAINT "VoteAnswer_pkey" PRIMARY KEY ("voteId", "rank")
);
CREATE INDEX IF NOT EXISTS "VoteAnswer_optionId_idx" ON "VoteAnswer" ("optionId");

CREATE TABLE IF NOT EXISTS "RecipeIngredient" (
  "id" serial PRIMARY KEY NOT NULL,
  "recipeId" integer NOT NULL CONSTRAINT "RecipeIngredient_recipeId_Recipe_id_fk" REFERENCES "Recipe"("id") ON DELETE CASCADE,
  "position" integer NOT NULL,
  "ingredient" varchar(128) NOT NULL,
  "amount" double precision NOT NULL,
  "amountType" varchar(32) NOT NULL,
  CONSTRAINT "RecipeIngredient_recipeId_position_key" UNIQUE ("recipeId", "position")
);

CREATE TABLE IF NOT EXISTS "RecipeInstruction" (
  "id" serial PRIMARY KEY NOT NULL,
  "recipeId" integer NOT NULL CONSTRAINT "RecipeInstruction_recipeId_Recipe_id_fk" REFERENCES "Recipe"("id") ON DELETE CASCADE,
  "position" integer NOT NULL,
  "name" varchar(128) NOT NULL,
  "step" varchar(512) NOT NULL,
  CONSTRAINT "RecipeInstruction_recipeId_position_key" UNIQUE ("recipeId", "position")
);

CREATE TABLE IF NOT EXISTS "RecipeDietaryTag" (
  "recipeId" integer NOT NULL CONSTRAINT "RecipeDietaryTag_recipeId_Recipe_id_fk" REFERENCES "Recipe"("id") ON DELETE CASCADE,
  "tag" varchar(32) NOT NULL,
  CONSTRAINT "RecipeDietaryTag_pkey" PRIMARY KEY ("recipeId", "tag")
);
CREATE INDEX IF NOT EXISTS "RecipeDietaryTag_tag_idx" ON "RecipeDietaryTag" ("tag");

CREATE TABLE IF NOT EXISTS "TodoTag" (
  "todoId" integer NOT NULL CONSTRAINT "TodoTag_todoId_Todo_id_fk" REFERENCES "Todo"("id") ON DELETE CASCADE,
  "tag" varchar(50) NOT NULL,
  CONSTRAINT "TodoTag_pkey" PRIMARY KEY ("todoId", "tag")
);

-- Copy data. WITH ORDINALITY keeps the original array order (1-based).
INSERT INTO "PollOption" ("questionId", "position", "text")
SELECT q."id", e.n - 1, e.v->>'text'
FROM "PollQuestion" q, json_array_elements(q."options") WITH ORDINALITY AS e(v, n);

-- Votes from before multi-answer polls have an empty array; use "choice".
INSERT INTO "VoteAnswer" ("voteId", "optionId", "rank")
SELECT v."id", o."id", a.rank
FROM "Vote" v
CROSS JOIN LATERAL (
  SELECT (e.v #>> '{}')::integer AS position, e.n - 1 AS rank
  FROM json_array_elements(v."answers") WITH ORDINALITY AS e(v, n)
  UNION ALL
  SELECT v."choice", 0 WHERE json_array_length(v."answers") = 0
) a
JOIN "PollOption" o ON o."questionId" = v."questionId" AND o."position" = a.position;

INSERT INTO "RecipeIngredient" ("recipeId", "position", "ingredient", "amount", "amountType")
SELECT r."id", e.n - 1, e.v->>'ingredient', (e.v->>'amount')::double precision, e.v->>'amountType'
FROM "Recipe" r, json_array_elements(r."ingredients") WITH ORDINALITY AS e(v, n);

INSERT INTO "RecipeInstruction" ("recipeId", "position", "name", "step")
SELECT r."id", e.n - 1, e.v->>'name', e.v->>'step'
FROM "Recipe" r, json_array_elements(r."instructions") WITH ORDINALITY AS e(v, n);

INSERT INTO "RecipeDietaryTag" ("recipeId", "tag")
SELECT DISTINCT r."id", e.v
FROM "Recipe" r, json_array_elements_text(r."dietaryTags") AS e(v);

INSERT INTO "TodoTag" ("todoId", "tag")
SELECT DISTINCT t."id", e.v
FROM "Todo" t, json_array_elements_text(t."tags") AS e(v);

ALTER TABLE "PollQuestion" DROP COLUMN "options";
ALTER TABLE "Vote" DROP COLUMN "answers";
ALTER TABLE "Recipe" DROP COLUMN "ingredients";
ALTER TABLE "Recipe" DROP COLUMN "instructions";
ALTER TABLE "Recipe" DROP COLUMN "dietaryTags";
ALTER TABLE "Todo" DROP COLUMN "tags";

COMMIT;
