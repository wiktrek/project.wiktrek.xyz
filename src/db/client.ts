import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
 import { pollQuestion, shortLink, vote, recipe} from './schema'
// create the connection
const connection = connect({
 url: process.env.DATABASE_URL,
});
export { pollQuestion, shortLink, vote, recipe}
export const db = drizzle(connection, { schema: {
  pollQuestion,
  shortLink,
  vote,
  recipe
},});