import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pollQuestion, shortLink, vote, recipe, like} from './schema'
// create the connection
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const sql = neon(process.env.DATABASE_URL!);
export { pollQuestion, shortLink, vote, recipe,like}
export const db = drizzle(sql, { schema: {
  pollQuestion,
  shortLink,
  vote,
  recipe, 
  like
},});