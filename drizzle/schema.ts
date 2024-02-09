import { pgTable, pgSchema, integer, index, primaryKey, unique, serial, varchar, timestamp, json, boolean} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const like = pgTable("Like", {
	id: serial("id").unique().notNull(),
	owner: varchar("owner", { length: 255 }).notNull(),
	recipeId: integer("recipeId").notNull(),
	up: boolean("up").notNull(),
},
(table) => {
	return {
		ownerIdx: index("Like_owner_idx").on(table.owner),
		likeId: primaryKey(table.id),
		likeIdKey: unique("Like_id_key").on(table.id),
	}
});

export const pollQuestion = pgTable("PollQuestion", {
	id: serial("id").unique().notNull(),
	createdAt: timestamp("createdAt", { mode: "string", withTimezone: true }).defaultNow(),
	endsAt: timestamp("endsAt", { mode: "string", withTimezone: true }),
	question: varchar("question", { length: 5000 }).notNull(),
	options: json("options").notNull(),
	ownerEmail: varchar("ownerEmail", { length: 255 }).notNull(),
	end: boolean("end").notNull(),
},
(table) => {
	return {
		ownerEmailIdx: index("PollQuestion_ownerEmail_idx").on(table.ownerEmail),
		pollQuestionId: primaryKey(table.id),
	}
});

export const recipe = pgTable("Recipe", {
	id: serial("id").unique().notNull(),
	rating: integer("rating").notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	description: varchar("description", { length: 255 }),
	ingredients: json("ingredients").notNull(),
	owner: varchar("owner", { length: 255 }).notNull(),
	directions: json("directions").notNull(),
},
(table) => {
	return {
		ownerIdx: index("Recipe_owner_idx").on(table.owner),
		recipeId: primaryKey(table.id),
		recipeIdKey: unique("Recipe_id_key").on(table.id),
	}
});

export const shortLink = pgTable("ShortLink", {
	id: serial("id").unique().notNull(),
	createdAt: timestamp("createdAt", {mode: "string", withTimezone: true }).defaultNow(),
	owner: varchar("owner", { length: 191 }).notNull(),
	url: varchar("url", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 191 }).notNull(),
},
(table) => {
	return {
		slugIdx: index("ShortLink_slug_idx").on(table.slug),
		shortLinkId: primaryKey(table.id),
		shortLinkSlugKey: unique("ShortLink_slug_key").on(table.slug),
	}
});

export const vote = pgTable("Vote", {
	id: serial("id").unique().notNull(),
	createdAt: timestamp("createdAt", {mode: "string", withTimezone: true }).defaultNow(),
	questionId: integer("questionId").notNull(),
	voterToken: varchar("voterToken", { length: 255 }).notNull(),
	choice: integer("choice").notNull(),
},
(table) => {
	return {
		questionIdIdx: index("Vote_questionId_idx").on(table.questionId),
		voterTokenIdx: index("Vote_voterToken_idx").on(table.voterToken),
		voteId: primaryKey(table.id),
		voteVoterTokenQuestionIdKey: unique("Vote_voterToken_questionId_key").on(table.voterToken, table.questionId),
	}
});