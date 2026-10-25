import {
  pgTableCreator,
  integer,
  index,
  unique,
  serial,
  varchar,
  timestamp,
  boolean,
  doublePrecision,
  primaryKey,
  pgTable,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

export const like = pgTable(
  "Like",
  {
    id: serial("id").primaryKey(),
    owner: varchar("owner", { length: 255 }).notNull(),
    recipeId: integer("recipeId").notNull(),
    up: boolean("up").notNull(),
  },
  (table) => {
    return {
      ownerIdx: index("Like_owner_idx").on(table.owner),
      ownerRecipeIdx: index("Like_owner_recipe_idx").on(
        table.owner,
        table.recipeId,
      ),
    };
  },
);

export const pollQuestion = pgTable(
  "PollQuestion",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`now()`),
    endsAt: timestamp("endsAt", { mode: "date", withTimezone: true }),
    question: varchar("question", { length: 5000 }).notNull(),
    questionType: varchar("questionType", { length: 20 })
      .notNull()
      .default("single"),
    ownerEmail: varchar("ownerEmail", { length: 255 }).notNull(),
    end: boolean("end").notNull(),
    viewCount: integer("viewCount").notNull().default(0),
  },
  (table) => {
    return {
      ownerEmailIdx: index("PollQuestion_ownerEmail_idx").on(table.ownerEmail),
    };
  },
);

export const recipe = pgTable(
  "Recipe",
  {
    id: serial("id").primaryKey(),
    rating: integer("rating").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    imageUrl: varchar("imageUrl", { length: 2048 }),
    prepTimeMinutes: integer("prepTimeMinutes").notNull().default(0),
    cookTimeMinutes: integer("cookTimeMinutes").notNull().default(0),
    servings: integer("servings").notNull().default(1),
    difficulty: varchar("difficulty", { length: 32 }).notNull().default("Easy"),
    cuisine: varchar("cuisine", { length: 64 }).notNull().default(""),
    category: varchar("category", { length: 64 }).notNull().default(""),
    owner: varchar("owner", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      ownerIdx: index("Recipe_owner_idx").on(table.owner),
      categoryRatingIdx: index("Recipe_category_rating_idx").on(
        table.category,
        table.rating,
      ),
      difficultyRatingIdx: index("Recipe_difficulty_rating_idx").on(
        table.difficulty,
        table.rating,
      ),
      ownerRatingIdx: index("Recipe_owner_rating_idx").on(
        table.owner,
        table.rating,
      ),
    };
  },
);

export const shortLink = pgTable(
  "ShortLink",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`now()`),
    owner: varchar("owner", { length: 191 }).notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull(),
    clickCount: integer("clickCount").notNull().default(0),
    lastClickedAt: timestamp("lastClickedAt", {
      mode: "date",
      withTimezone: true,
    }),
  },
  (table) => {
    return {
      slugIdx: index("ShortLink_slug_idx").on(table.slug),
      ownerIdx: index("ShortLink_owner_idx").on(table.owner),
      shortLinkSlugKey: unique("ShortLink_slug_key").on(table.slug),
    };
  },
);

export const vote = pgTable(
  "Vote",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`now()`),
    questionId: integer("questionId")
      .notNull()
      .references(() => pollQuestion.id, { onDelete: "cascade" }),
    voterToken: varchar("voterToken", { length: 255 }).notNull(),
    choice: integer("choice").notNull(),
  },
  (table) => {
    return {
      questionIdIdx: index("Vote_questionId_idx").on(table.questionId),
      voterTokenIdx: index("Vote_voterToken_idx").on(table.voterToken),
      // Columns in table order; drizzle-kit reads them that way, and a
      // different order makes every push drop and re-add the constraint.
      voteVoterTokenQuestionIdKey: unique("Vote_voterToken_questionId_key").on(
        table.questionId,
        table.voterToken,
      ),
    };
  },
);
export const message = pgTable(
  "Message",
  {
    id: serial("id").primaryKey(),
    author: varchar("author", { length: 16 }).notNull(),
    text: varchar("text", { length: 128 }).notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`now()`),
  },
  (table) => {
    return {
      createdAtIdx: index("Message_createdAt_idx").on(table.createdAt),
    };
  },
);

export const linkProfile = pgTable(
  "LinkProfile",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`now()`),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`now()`),
    userId: varchar("userId", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 50 }).notNull(),
    displayName: varchar("displayName", { length: 100 }),
    bio: varchar("bio", { length: 500 }),
    avatarUrl: varchar("avatarUrl", { length: 500 }),
    backgroundColor: varchar("backgroundColor", { length: 20 }).default(
      "#ffffff",
    ),
    textColor: varchar("textColor", { length: 20 }).default("#000000"),
    buttonStyle: varchar("buttonStyle", { length: 20 }).default("rounded"),
    isPublic: boolean("isPublic").notNull().default(true),
    slug: varchar("slug", { length: 50 }),
  },
  (table) => {
    return {
      usernameKey: unique("LinkProfile_username_key").on(table.username),
      slugKey: unique("LinkProfile_slug_key").on(table.slug),
    };
  },
);

export const link = pgTable(
  "Link",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`now()`),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`now()`),
    profileId: integer("profileId")
      .notNull()
      .references(() => linkProfile.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 100 }).notNull(),
    url: varchar("url", { length: 1000 }).notNull(),
    order: integer("order").notNull().default(0),
    isActive: boolean("isActive").notNull().default(true),
    icon: varchar("icon", { length: 50 }),
    clickCount: integer("clickCount").notNull().default(0),
  },
  (table) => {
    return {
      profileIdIdx: index("Link_profileId_idx").on(table.profileId),
      profileOrderIdx: index("Link_profile_order_idx").on(
        table.profileId,
        table.order,
      ),
    };
  },
);

export const todo = pgTable(
  "Todo",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`now()`),
    owner: varchar("owner", { length: 255 }).notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    description: varchar("description", { length: 5000 }).notNull().default(""),
    date: timestamp("date", {
      mode: "date",
      withTimezone: true,
    }),
    status: varchar("status", { length: 20 }).notNull().default("todo"),
    priority: varchar("priority", { length: 10 }).notNull().default("medium"),
    stageId: integer("stageId"),
    completedAt: timestamp("completedAt", {
      mode: "date",
      withTimezone: true,
    }),
    order: integer("order").notNull().default(0),
  },
  (table) => {
    return {
      ownerIdx: index("Todo_owner_idx").on(table.owner),
      ownerStatusIdx: index("Todo_owner_status_idx").on(
        table.owner,
        table.status,
      ),
      ownerStageIdx: index("Todo_owner_stage_idx").on(
        table.owner,
        table.stageId,
      ),
      ownerStageOrderIdx: index("Todo_owner_stage_order_idx").on(
        table.owner,
        table.stageId,
        table.order,
      ),
    };
  },
);

export const todoStage = pgTable(
  "TodoStage",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`now()`),
    owner: varchar("owner", { length: 255 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    color: varchar("color", { length: 20 }).notNull().default("gray"),
    order: integer("order").notNull().default(0),
    isDone: boolean("isDone").notNull().default(false),
  },
  (table) => {
    return {
      ownerIdx: index("TodoStage_owner_idx").on(table.owner),
      ownerOrderIdx: index("TodoStage_owner_order_idx").on(
        table.owner,
        table.order,
      ),
    };
  },
);

export const todoSettings = pgTable(
  "TodoSettings",
  {
    id: serial("id").primaryKey(),
    owner: varchar("owner", { length: 255 }).notNull(),
    doneRetention: varchar("doneRetention", { length: 10 })
      .notNull()
      .default("never"),
  },
  (table) => {
    return {
      ownerKey: unique("TodoSettings_owner_key").on(table.owner),
    };
  },
);

export const pollOption = pgTable(
  "PollOption",
  {
    id: serial("id").primaryKey(),
    questionId: integer("questionId")
      .notNull()
      .references(() => pollQuestion.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    text: varchar("text", { length: 200 }).notNull(),
  },
  (table) => {
    return {
      questionPositionKey: unique("PollOption_questionId_position_key").on(
        table.questionId,
        table.position,
      ),
    };
  },
);

// One row per selected option; rank keeps the order for ranking polls.
export const voteAnswer = pgTable(
  "VoteAnswer",
  {
    voteId: integer("voteId")
      .notNull()
      .references(() => vote.id, { onDelete: "cascade" }),
    optionId: integer("optionId")
      .notNull()
      .references(() => pollOption.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: "VoteAnswer_pkey",
        columns: [table.voteId, table.rank],
      }),
      optionIdx: index("VoteAnswer_optionId_idx").on(table.optionId),
    };
  },
);

export const recipeIngredient = pgTable(
  "RecipeIngredient",
  {
    id: serial("id").primaryKey(),
    recipeId: integer("recipeId")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    ingredient: varchar("ingredient", { length: 128 }).notNull(),
    amount: doublePrecision("amount").notNull(),
    amountType: varchar("amountType", { length: 32 }).notNull(),
  },
  (table) => {
    return {
      recipePositionKey: unique("RecipeIngredient_recipeId_position_key").on(
        table.recipeId,
        table.position,
      ),
    };
  },
);

export const recipeInstruction = pgTable(
  "RecipeInstruction",
  {
    id: serial("id").primaryKey(),
    recipeId: integer("recipeId")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    name: varchar("name", { length: 128 }).notNull(),
    step: varchar("step", { length: 512 }).notNull(),
  },
  (table) => {
    return {
      recipePositionKey: unique("RecipeInstruction_recipeId_position_key").on(
        table.recipeId,
        table.position,
      ),
    };
  },
);

export const recipeDietaryTag = pgTable(
  "RecipeDietaryTag",
  {
    recipeId: integer("recipeId")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    tag: varchar("tag", { length: 32 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: "RecipeDietaryTag_pkey",
        columns: [table.recipeId, table.tag],
      }),
      tagIdx: index("RecipeDietaryTag_tag_idx").on(table.tag),
    };
  },
);

export const todoTag = pgTable(
  "TodoTag",
  {
    todoId: integer("todoId")
      .notNull()
      .references(() => todo.id, { onDelete: "cascade" }),
    tag: varchar("tag", { length: 50 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: "TodoTag_pkey",
        columns: [table.todoId, table.tag],
      }),
    };
  },
);

export const pollQuestionRelations = relations(pollQuestion, ({ many }) => ({
  options: many(pollOption),
}));

export const pollOptionRelations = relations(pollOption, ({ one }) => ({
  question: one(pollQuestion, {
    fields: [pollOption.questionId],
    references: [pollQuestion.id],
  }),
}));

export const voteRelations = relations(vote, ({ many }) => ({
  answers: many(voteAnswer),
}));

export const voteAnswerRelations = relations(voteAnswer, ({ one }) => ({
  vote: one(vote, { fields: [voteAnswer.voteId], references: [vote.id] }),
  option: one(pollOption, {
    fields: [voteAnswer.optionId],
    references: [pollOption.id],
  }),
}));

export const recipeRelations = relations(recipe, ({ many }) => ({
  ingredients: many(recipeIngredient),
  instructions: many(recipeInstruction),
  dietaryTags: many(recipeDietaryTag),
}));

export const recipeIngredientRelations = relations(
  recipeIngredient,
  ({ one }) => ({
    recipe: one(recipe, {
      fields: [recipeIngredient.recipeId],
      references: [recipe.id],
    }),
  }),
);

export const recipeInstructionRelations = relations(
  recipeInstruction,
  ({ one }) => ({
    recipe: one(recipe, {
      fields: [recipeInstruction.recipeId],
      references: [recipe.id],
    }),
  }),
);

export const recipeDietaryTagRelations = relations(
  recipeDietaryTag,
  ({ one }) => ({
    recipe: one(recipe, {
      fields: [recipeDietaryTag.recipeId],
      references: [recipe.id],
    }),
  }),
);

export const todoRelations = relations(todo, ({ many }) => ({
  tags: many(todoTag),
}));

export const todoTagRelations = relations(todoTag, ({ one }) => ({
  todo: one(todo, { fields: [todoTag.todoId], references: [todo.id] }),
}));

export const linkProfileRelations = relations(linkProfile, ({ many }) => ({
  links: many(link),
}));

export const linkRelations = relations(link, ({ one }) => ({
  profile: one(linkProfile, {
    fields: [link.profileId],
    references: [linkProfile.id],
  }),
}));
