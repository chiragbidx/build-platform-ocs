import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schemaTables from "./schema";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for database connections.");
}

export const pool = new Pool({
  connectionString,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
});

// Corrected: Pass { schema: schemaTables } so tables are registered properly for drizzle query helpers
export const db = drizzle(pool, { schema: schemaTables });