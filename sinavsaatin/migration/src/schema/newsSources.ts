import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const newsSources = pgTable("news_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  feedUrl: varchar("feed_url", { length: 500 }).notNull(),
  baseUrl: varchar("base_url", { length: 200 }).notNull().default(""),
  category: varchar("category", { length: 50 }).notNull().default("haber"),
  aktif: boolean("aktif").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type NewsSource = typeof newsSources.$inferSelect;
export type InsertNewsSource = typeof newsSources.$inferInsert;
