CREATE INDEX IF NOT EXISTS "Like_owner_recipe_idx"
  ON "Like" ("owner", "recipeId");
CREATE INDEX IF NOT EXISTS "Recipe_category_rating_idx"
  ON "Recipe" ("category", "rating");
CREATE INDEX IF NOT EXISTS "Recipe_difficulty_rating_idx"
  ON "Recipe" ("difficulty", "rating");
CREATE INDEX IF NOT EXISTS "Recipe_owner_rating_idx"
  ON "Recipe" ("owner", "rating");
CREATE INDEX IF NOT EXISTS "Message_createdAt_idx"
  ON "Message" ("createdAt");
CREATE INDEX IF NOT EXISTS "ShortLink_owner_idx"
  ON "ShortLink" ("owner");
CREATE INDEX IF NOT EXISTS "TodoStage_owner_order_idx"
  ON "TodoStage" ("owner", "order");
CREATE INDEX IF NOT EXISTS "Todo_owner_stage_order_idx"
  ON "Todo" ("owner", "stageId", "order");
