# TableTech Lite

VPS istemeyen, sadeleştirilmiş QR sipariş sistemi.

## İçinde ne var?
- Müşteri QR menüsü
- Mutfak paneli
- Kasa paneli
- Owner paneli
- Vercel deploy ayarı
- Supabase SQL şeması

## Stack
- React + Vite
- Supabase
- Vercel

## Kurulum
1. `supabase_schema.sql` dosyasını Supabase SQL Editor içinde çalıştır.
2. `seed.sql` dosyasını çalıştır.
3. `.env.example` dosyasını `.env` olarak kopyala.
4. Supabase URL ve anon key ekle.
5. `npm install`
6. `npm run dev`

## Local linkler
- `/menu/demo-restoran/1`
- `/kitchen/demo-restoran`
- `/cashier/demo-restoran`
- `/owner/demo-restoran`

## Vercel deploy
- Projeyi GitHub'a yükle
- Vercel'de import et
- Environment Variables kısmına şu ikisini ekle:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Deploy et

## Notlar
- İlk sürümde online ödeme kapalıdır.
- Bu sürümde panel güvenliği basit tutuldu. Satış öncesi canlı kullanımda auth eklemen iyi olur.
- Sipariş yenilemesi polling ile yapılır.
