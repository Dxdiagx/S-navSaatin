# SinavSaatin v3.29 — Değişiklik Raporu

## Genel Bakış
Bu sürüm, scraper kalitesini köklü biçimde iyileştiren, AI extraction'ı güçlendiren
ve veritabanına yeni alanlar ekleyen kapsamlı bir güncellemedir.

---

## Değiştirilen Dosyalar

### dist/index.mjs (ana uygulama bundle'ı)

### migration/src/schema/jobAnnouncements.ts
### migration/src/schema/appointments.ts
### migration/migrations/0001_add_ai_fields.sql (YENİ)

---

## Yeni Özellikler

### 1. Gelişmiş HTML Extraction Pipeline
- `_extractMainContent(html)` — yeni fonksiyon: `<article>`, `<main>`, `.content`, `.icerik`
  gibi ana içerik alanlarını önce dener; menü/header/footer/nav/aside kaldırılır
- `_removeBlocks(html)` — script/style/noscript/header/footer/nav/aside/menu/form bloklarını
  HTML'den temizler; içerik kaybını önler
- `_decodeEntities(str)` — HTML entity'leri (nbsp, amp, lt, gt, quot) doğru çözer
- `stripHtml` güncellemesi: önce ana içerik alanı dener, kısa gelirse blok temizleme + tam strip

### 2. Fallback Extraction Sistemi
- Yeni kural: `textLength < 1000` VE `htmlLength > 3000` ise agresif extraction çalışır
- Agresif mod: meta description, og:title, table cell değerleri, tam stripped HTML arasından
  en uzunu seçer
- Log: `[EXTRACT] fallback improved: N → M chars`

### 3. Link Extraction
- `_extractLinksFromHtml(html, baseUrl)` — tüm bağlantıları çıkarır, rel URL'leri absolute'a çevirir

### 4. Regex Tabanlı Tarih Çıkarma
- `_extractDatesWithRegex(text)` — 3 tarih alanı için Türkçe kalıpları tarar:
  - `applicationStart`: "başvuru başlangıç", "başvuru tarihi", "müracaat başlangıç"
  - `applicationEnd`: "son başvuru", "başvuru bitiş", "son müracaat"
  - `resultDate`: "sonuç tarihi", "atama tarihi", "yerleştirme sonuçları"
- DD.MM.YYYY, DD/MM/YYYY, YYYY-MM-DD ve Türkçe ay adı formatlarını destekler
- AI tarih bulamazsa regex devreye girer (ve `[DATES] regex-fallback` logu üretir)

### 5. Kişi Sayısı Çıkarma
- `_extractPersonCountFromText(text)` — şu kalıpları yakalar:
  "569 memur", "120 personel", "35 işçi", "17 uzman yardımcısı",
  "500 sözleşmeli personel", "kontenjan: 300", "150 kişilik kadro"
- AI bulamazsa regex devreye girer
- Log: `[PERSON_COUNT] regex: N`

### 6. Gemini Schema Güncellemesi
Her ilan/atama için artık şu yeni alanlar isteniyor:
- `ai_summary` — minimum 500 maksimum 1500 karakter, tek cümlelik özet yasak
- `person_count` — kişi sayısı (quota ile aynı ama açık field)
- `requirements` — başvuru şartları listesi (string[])
- `positions` — kadro/pozisyon listesi (string[])

### 7. Gelişmiş Prompt'lar (prompt_personel & prompt_atamalar)
- Her iki prompt da köklü olarak yeniden yazıldı
- Tarih çıkarma talimatları netleştirildi
- Kişi sayısı çıkarma talimatları eklendi
- `ai_summary` için minimum/maksimum karakter kısıtı eklendi
- `source_url` için "detay sayfası URL'i, genel site değil" uyarısı eklendi

### 8. sourceUrl Öncelik Mantığı
Artık şu sırayla: detailUrl > source.feedUrl
- Detay URL'i geçerliyse (http ile başlıyor, feedUrl'den farklı, ?page= veya # içermiyor) kullanılır
- Log: `[DETAIL_URL]` detay URL bulunduğunda

### 9. Appointment Scraper İyileştirmesi
- Artık `_fetchJobText` pipeline kullanıyor (daha önce sadece ham fetch + stripHtml vardı)
- textLength < 500 ve htmlLength > 2000 ise uyarı logu üretir
- Tarih regex fallback appointment scraper'da da çalışır

### 10. Yeni Log Etiketleri
- `[FETCH]` — URL, status, contentType, htmlLength
- `[EXTRACT]` — type, method, textLength, strippedLength
- `[DETAIL_URL]` — kurum | pozisyon | URL
- `[DATES]` — AI veya regex bulunan tarihler
- `[PERSON_COUNT]` — bulunan kişi sayısı ve kaynağı
- `[SUMMARY]` — AI özeti uzunluğu

---

## Veritabanı Migration

### migration/migrations/0001_add_ai_fields.sql

Çalıştırma komutu:
```bash
psql $DATABASE_URL -f migration/migrations/0001_add_ai_fields.sql
```

Eklenen kolonlar:

**job_announcements tablosu:**
- `ai_summary TEXT` — AI tarafından üretilen 500-1500 karakter özet
- `person_count INTEGER` — alınacak kişi sayısı
- `requirements TEXT` — JSON array, başvuru şartları
- `positions TEXT` — JSON array, kadro/pozisyon listesi

**appointments tablosu:**
- `ai_summary TEXT` — AI tarafından üretilen 500-1500 karakter özet
- `person_count INTEGER` — kontenjan sayısı
- `requirements TEXT` — JSON array, başvuru şartları
- `positions TEXT` — JSON array, branş/kadro listesi

---

## Düzeltilen Hatalar

1. **htmlLength yüksek ama textLength düşük** → agresif fallback extraction devreye girer
2. **Başvuru tarihleri bulunamıyor** → regex fallback eklendi
3. **Kişi sayısı bulunamıyor** → regex fallback eklendi
4. **AI özetleri çok kısa** → min 500 / max 1500 karakter zorunluluğu eklendi
5. **Detay linkleri kayboluyor** → source_url öncelik mantığı düzeltildi
6. **Orijinal Kaynak ana sayfaya gidiyor** → detailUrl önce kontrol ediliyor
7. **Appointment scraper zayıf fetch** → artık tam _fetchJobText pipeline kullanıyor
8. **nav/header içeriği karışıyor** → blok temizleme eklendi

---

## Build & Test Durumu

- ✅ dist/index.mjs syntax check: PASSED (node --check)
- ✅ Tüm 16 patch başarıyla uygulandı
- ✅ Migration SQL oluşturuldu
- ✅ TypeScript schema dosyaları güncellendi
