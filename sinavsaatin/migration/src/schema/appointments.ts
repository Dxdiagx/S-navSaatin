import { pgTable, bigserial, varchar, integer, text, boolean, timestamp, date, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const appointments = pgTable("appointments", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  institution: varchar("institution", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  status: varchar("status", { length: 64 }).notNull().default("unknown"),
  statusReason: text("status_reason"),
  quota: integer("quota"),
  applicationStart: date("application_start"),
  applicationEnd: date("application_end"),
  resultDate: date("result_date"),
  details: text("details"),
  aiSummary: text("ai_summary"),
  personCount: integer("person_count"),
  requirements: text("requirements"),
  positions: text("positions"),
  sourceUrl: varchar("source_url", { length: 500 }).notNull().default(""),
  kategori: varchar("kategori", { length: 64 }).notNull().default("GENEL"),
  aktif: boolean("aktif").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("appointments_aktif_idx").on(t.aktif),
  index("appointments_application_end_idx").on(t.applicationEnd),
  index("appointments_status_idx").on(t.status),
]);

export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true, updatedAt: true });
export const selectAppointmentSchema = createSelectSchema(appointments);
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
