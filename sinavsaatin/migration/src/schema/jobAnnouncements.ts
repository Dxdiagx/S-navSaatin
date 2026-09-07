import { pgTable, bigserial, varchar, integer, text, boolean, timestamp, date, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobAnnouncements = pgTable("job_announcements", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  institution: varchar("institution", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  quota: integer("quota"),
  applicationEnd: date("application_end"),
  sourceUrl: varchar("source_url", { length: 500 }).notNull().default(""),
  details: text("details"),
  aiSummary: text("ai_summary"),
  personCount: integer("person_count"),
  requirements: text("requirements"),
  positions: text("positions"),
  category: varchar("category", { length: 64 }).notNull().default("Memur"),
  status: varchar("status", { length: 32 }).notNull().default("unknown"),
  statusReason: text("status_reason"),
  aktif: boolean("aktif").notNull().default(true),
  archived: boolean("archived").notNull().default(false),
  applicationStart: date("application_start"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("job_announcements_aktif_idx").on(t.aktif),
  index("job_announcements_archived_idx").on(t.archived),
  index("job_announcements_application_end_idx").on(t.applicationEnd),
  index("job_announcements_status_idx").on(t.status),
]);

export const insertJobAnnouncementSchema = createInsertSchema(jobAnnouncements).omit({ id: true, createdAt: true, updatedAt: true });
export const selectJobAnnouncementSchema = createSelectSchema(jobAnnouncements);
export type JobAnnouncement = typeof jobAnnouncements.$inferSelect;
export type InsertJobAnnouncement = z.infer<typeof insertJobAnnouncementSchema>;
