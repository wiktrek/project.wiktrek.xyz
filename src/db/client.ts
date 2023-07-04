import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
 import { pollQuestion, shortLink, vote} from './schema'
// create the connection
const connection = connect({
 url: process.env.DATABASE_URL,
});
export { pollQuestion, shortLink, vote}
export const db = drizzle(connection, { schema: {
  pollQuestion,
  shortLink,
  vote,
},});