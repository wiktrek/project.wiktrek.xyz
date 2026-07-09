import {
  pgTableCreator,
  integer,
  index,
  unique,
  serial,
  varchar,
  timestamp,
  json,
  boolean,
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
    options: json("options").notNull(),
    ownerEmail: varchar("ownerEmail", { length: 255 }).notNull(),
    end: boolean("end").notNull(),
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
    ingredients: json("ingredients").notNull(),
    owner: varchar("owner", { length: 255 }).notNull(),
    instructions: json("instructions").notNull(),
  },
  (table) => {
    return {
      ownerIdx: index("Recipe_owner_idx").on(table.owner),
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
  },
  (table) => {
    return {
      slugIdx: index("ShortLink_slug_idx").on(table.slug),
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
    questionId: integer("questionId").notNull(),
    voterToken: varchar("voterToken", { length: 255 }).notNull(),
    choice: integer("choice").notNull(),
  },
  (table) => {
    return {
      questionIdIdx: index("Vote_questionId_idx").on(table.questionId),
      voterTokenIdx: index("Vote_voterToken_idx").on(table.voterToken),
      voteVoterTokenQuestionIdKey: unique("Vote_voterToken_questionId_key").on(
        table.voterToken,
        table.questionId,
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
      MessageIdx: index("Message_idx").on(table.id),
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
    })
      .notNull()
      .default(sql`now()`),
    status: varchar("status", { length: 20 }).notNull().default("todo"),
    stageId: integer("stageId"),
    completedAt: timestamp("completedAt", {
      mode: "date",
      withTimezone: true,
    }),
    tags: json("tags").$type<string[]>().notNull().default([]),
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

export const linkProfileRelations = relations(linkProfile, ({ many }) => ({
  links: many(link),
}));

export const linkRelations = relations(link, ({ one }) => ({
  profile: one(linkProfile, {
    fields: [link.profileId],
    references: [linkProfile.id],
  }),
}));
