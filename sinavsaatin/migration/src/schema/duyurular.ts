import { pgTable, bigserial, varchar, text, boolean, timestamp, date, index } from "drizzle-orm/pg-core";

export const duyurular = pgTable(
  "duyurular",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    baslik: varchar("baslik", { length: 255 }).notNull(),
    icerik: text("icerik").notNull().default(""),
    onem: varchar("onem", { length: 20 }).notNull().default("normal"),
    bitisTarihi: date("bitis_tarihi"),
    kaynakUrl: varchar("kaynak_url", { length: 500 }).notNull().default(""),
    aktif: boolean("aktif").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("duyurular_aktif_idx").on(t.aktif),
    index("duyurular_bitis_tarihi_idx").on(t.bitisTarihi),
  ],
);
