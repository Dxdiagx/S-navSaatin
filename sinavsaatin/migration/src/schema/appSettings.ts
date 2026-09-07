import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const appSettings = pgTable("app_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AppSetting = typeof appSettings.$inferSelect;

export const DEFAULT_SETTINGS: Record<string, string> = {
  auto_scan_enabled: "true",
  scan_interval_hours: "6",
  interval_haberler: "6",
  interval_sinav_takvimi: "168",
  interval_personel: "24",
  interval_atamalar: "168",
  max_news: "50",
  max_sinav: "50",
  max_personel: "50",
  max_atama: "50",
  scan_osym: "true",
  scan_meb: "true",
  scan_yok: "true",
  gemini_api_key_haberler: "",
  gemini_api_key_jobs: "",
};
