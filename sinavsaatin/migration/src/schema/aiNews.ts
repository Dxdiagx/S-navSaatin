import { pgTable, bigserial, varchar, text, boolean, timestamp, json, integer, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aiNews = pgTable("ai_news", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 64 }).notNull().default("GENEL"),
  source: varchar("source", { length: 64 }).notNull().default(""),
  sourceUrl: varchar("source_url", { length: 500 }).notNull().default(""),
  content: text("content").notNull().default(""),
  summary: text("summary").notNull().default(""),
  seoTitle: varchar("seo_title", { length: 255 }).notNull().default(""),
  seoDescription: varchar("seo_description", { length: 255 }).notNull().default(""),
  tags: json("tags").$type<string[]>(),
  aktif: boolean("aktif").notNull().default(true),
  confidenceScore: integer("confidence_score").notNull().default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("ai_news_aktif_idx").on(t.aktif),
  index("ai_news_published_at_idx").on(t.publishedAt),
  index("ai_news_category_idx").on(t.category),
]);

export const insertAiNewsSchema = createInsertSchema(aiNews).omit({ id: true, createdAt: true, updatedAt: true });
export const selectAiNewsSchema = createSelectSchema(aiNews);
export type AiNews = typeof aiNews.$inferSelect;
export type InsertAiNews = z.infer<typeof insertAiNewsSchema>;
