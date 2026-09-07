import { pgTable, bigserial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  endpoint: varchar("endpoint", { length: 1000 }).notNull().unique(),
  p256dh: varchar("p256dh", { length: 500 }).notNull(),
  auth: varchar("auth", { length: 500 }).notNull(),
  aktif: boolean("aktif").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
