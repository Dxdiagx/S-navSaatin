import { pgTable, bigserial, varchar, boolean, timestamp, date, unique, index } from "drizzle-orm/pg-core";
  import { createInsertSchema, createSelectSchema } from "drizzle-zod";
  import { z } from "zod/v4";

  export const sinavTakvimi = pgTable("sinav_takvimi", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    sinavAdi: varchar("sinav_adi", { length: 255 }).notNull(),
    sinavTarihi: date("sinav_tarihi"),
    basvuruBaslangic: date("basvuru_baslangic"),
    basvuruBitis: date("basvuru_bitis"),
    gecBasvuruTarihi: date("gec_basvuru_tarihi"),
    sonucTarihi: date("sonuc_tarihi"),
    kaynakUrl: varchar("kaynak_url", { length: 500 }).notNull().default(""),
    aktif: boolean("aktif").notNull().default(true),
    manuelKilitli: boolean("manuel_kilitli").notNull().default(false),
    uniqueHash: varchar("unique_hash", { length: 64 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }, (t) => [
    unique().on(t.sinavAdi, t.sinavTarihi),
    index("sinav_takvimi_aktif_idx").on(t.aktif),
    index("sinav_takvimi_sinav_tarihi_idx").on(t.sinavTarihi),
  ]);

  export const insertSinavTakvimiSchema = createInsertSchema(sinavTakvimi).omit({ id: true, createdAt: true, updatedAt: true });
  export const selectSinavTakvimiSchema = createSelectSchema(sinavTakvimi);
  export type SinavTakvimi = typeof sinavTakvimi.$inferSelect;
  export type InsertSinavTakvimi = z.infer<typeof insertSinavTakvimiSchema>;
  