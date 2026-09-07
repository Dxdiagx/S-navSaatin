# SinavSaatin Deploy v3.14-fixed4

## v3.14-fixed4 Değişiklikler
  - HATA DÜZELTMESİ: startScheduler() try-catch içine alındı (502 hatası önlemi)
  - HATA DÜZELTMESİ: uncaughtException + unhandledRejection handler eklendi
  - HATA DÜZELTMESİ: sw.js satır 56 eksik kapanma parantezi eklendi (SyntaxError düzeltildi)
  - Beklenmeyen hatalar artık sunucuyu çökermiyor, loglanıyor ve devam ediyor

## v3.2 Değişiklikler
  - Push 503 hatası giderildi (VAPID zorunlu değil)
  - VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY varsa gerçek push gönderilir
  - web-push bağımlılığı eklendi (npm install ile kurulur)
  - /yonetim admin paneli mobil responsive CSS eklendi
  - null gün sorunu (camelCase→snake_case dönüşümü) korundu

## Kurulum
  npm install && npm start

## Ortam Değişkenleri (Hostinger)
  DATABASE_URL      - Postgres
  ADMIN_TOKEN       - Admin şifresi
  SESSION_SECRET    - Oturum
  GEMINI_API_KEY    - Gemini AI
  PORT              - (opsiyonel)

## Push Bildirimleri için (opsiyonel)
  VAPID_PUBLIC_KEY  - vapid public key
  VAPID_PRIVATE_KEY - vapid private key  
  VAPID_MAILTO      - mailto:admin@sinavsaatin.com

  VAPID anahtarı oluşturmak için:
    node -e "const wp=require('web-push'); const k=wp.generateVAPIDKeys(); console.log(JSON.stringify(k,null,2));"
