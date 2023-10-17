import { mysqlTable, index, varchar, datetime, json,  uniqueIndex, int, tinyint, primaryKey } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const pollQuestion = mysqlTable("PollQuestion", {
	id:  int("id").autoincrement().primaryKey().notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
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

export const vote = mysqlTable("Vote", {
	id: int("id").autoincrement().primaryKey().notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	questionId: int("questionId").notNull(),
	voterToken: varchar("voterToken", { length: 255 }).notNull(),
	choice: int("choice").notNull(),
},
(table) => {
	return {
		voterTokenQuestionIdKey: uniqueIndex("Vote_voterToken_questionId_key").on(table.voterToken, table.questionId),
		voterTokenIdx: index("Vote_voterToken_idx").on(table.voterToken),
		questionIdIdx: index("Vote_questionId_idx").on(table.questionId),
	}
});

export const shortLink = mysqlTable("ShortLink", {
	id: int("id").autoincrement().primaryKey().notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	owner: varchar("owner", { length: 191 }).notNull(),
	url: varchar("url", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 191 }).notNull(),
},
(table) => {
	return {
		slugKey: uniqueIndex("ShortLink_slug_key").on(table.slug),
		slugIdx: index("ShortLink_slug_idx").on(table.slug),
	}
});
export const recipe = mysqlTable("Recipe", {
	id: int("id").autoincrement().notNull(),
	rating: int("rating").notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	description: varchar("description", { length: 255 }),
	ingredients: json("ingredients").notNull(),
	directions: json("directions").notNull(),
	owner: varchar("owner", { length: 255 }).notNull(),
},
	(table) => {
	return {
		idKey: uniqueIndex("Recipe_id_key").on(table.id),
		ownerIdx: index("Recipe_owner_idx").on(table.owner),
	}
})