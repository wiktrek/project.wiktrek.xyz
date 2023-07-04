/** @type { import("drizzle-kit").Config } */
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
}; 