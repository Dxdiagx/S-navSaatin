import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const rawUrl = process.env.DATABASE_URL;
const cleanUrl = rawUrl
  .replace(/[?&]sslmode=[^&]*/gi, "")
  .replace(/[?&]ssl=[^&]*/gi, "")
  .replace(/\?&/, "?")
  .replace(/[?&]$/, "");

const sslConfig =
  process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false;

export const pool = new Pool({
  connectionString: cleanUrl,
  ssl: sslConfig,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
