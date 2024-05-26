/** @type { import("drizzle-kit").Config } */
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
}; 