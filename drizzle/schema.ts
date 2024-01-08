import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, primaryKey, unique, int, varchar, datetime, json, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const like = mysqlTable("Like", {
	id: int("id").autoincrement().notNull(),
	owner: varchar("owner", { length: 255 }).notNull(),
	recipeId: int("recipeId").notNull(),
	up: tinyint("up").notNull(),
},
(table) => {
	return {
		ownerIdx: index("Like_owner_idx").on(table.owner),
		likeId: primaryKey(table.id),
		likeIdKey: unique("Like_id_key").on(table.id),
	}
});

export const pollQuestion = mysqlTable("PollQuestion", {
	id: int("id").autoincrement().notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`now(3)`).notNull(),
	endsAt: datetime("endsAt", { mode: 'string', fsp: 3 }),
	question: varchar("question", { length: 5000 }).notNull(),
	options: json("options").notNull(),
	ownerEmail: varchar("ownerEmail", { length: 255 }).notNull(),
	end: tinyint("end").notNull(),
},
(table) => {
	return {
		ownerEmailIdx: index("PollQuestion_ownerEmail_idx").on(table.ownerEmail),
		pollQuestionId: primaryKey(table.id),
	}
});

export const recipe = mysqlTable("Recipe", {
	id: int("id").autoincrement().notNull(),
	rating: int("rating").notNull(),
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

export const shortLink = mysqlTable("ShortLink", {
	id: int("id").autoincrement().notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`now(3)`).notNull(),
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

export const vote = mysqlTable("Vote", {
	id: int("id").autoincrement().notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`now(3)`).notNull(),
	questionId: int("questionId").notNull(),
	voterToken: varchar("voterToken", { length: 255 }).notNull(),
	choice: int("choice").notNull(),
},
(table) => {
	return {
		questionIdIdx: index("Vote_questionId_idx").on(table.questionId),
		voterTokenIdx: index("Vote_voterToken_idx").on(table.voterToken),
		voteId: primaryKey(table.id),
		voteVoterTokenQuestionIdKey: unique("Vote_voterToken_questionId_key").on(table.voterToken, table.questionId),
	}
});