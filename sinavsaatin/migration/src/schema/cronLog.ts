import { pgTable, bigserial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cronLog = pgTable("cron_log", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  jobName: varchar("job_name", { length: 128 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("running"),
  message: text("message"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  finishedAt: timestamp("finished_at"),
});

export const insertCronLogSchema = createInsertSchema(cronLog).omit({ id: true, startedAt: true });
export type CronLog = typeof cronLog.$inferSelect;
export type InsertCronLog = z.infer<typeof insertCronLogSchema>;
