# almanya101.de (Static HTML) + QA Form (Zoho Mail)

## Structure
- index.html
- style-shared.css
- qa/qa.html
- qa/qa.js
- api/qa-ask.js  (Vercel Serverless Function)
- maas/ (Brüt→net maaş hesaplayıcı; düz HTML/CSS/JS)
  - maas/index.html, maas/report.html
  - maas/js/maas.js, maas/js/report.js
  - maas/css/maas.css, maas/css/report.css
- api/net-salary.js (maas için hesaplama + kayıt)
- api/reports-get.js (maas raporlarını oku)
- lib/supabase.js (yalnızca sunucu tarafı kullanım için Supabase istemcisi)

## Deploy (Vercel) Neler oluyor?
1) Push this repo to GitHub
2) Import into Vercel (New Project)
3) Add Environment Variables (Project Settings -> Environment Variables)

### Required env vars
- ZOHO_SMTP_HOST
  - Examples: smtp.zoho.eu (EU), smtp.zoho.com (US)
- ZOHO_SMTP_PORT
  - 465 (SSL) recommended, or 587 (STARTTLS)
- ZOHO_SMTP_USER
  - qa@almanya101.de
- ZOHO_SMTP_PASS
  - Zoho App Password
- MAIL_TO
  - qa@almanya101.de
- MAIL_FROM_NAME (optional)
  - almanya101 QA

## Local run
```bash
npm i
npx vercel dev
```

Open:
- http://localhost:3000/
- http://localhost:3000/qa/qa.html



## Türkçe Özet
- Proje yapısı: statik ana sayfa (`index.html`), ortak stil dosyası (`style-shared.css`), Soru-Cevap sayfası (`qa/qa.html` + `qa/qa.js`) ve Vercel sunucusuz fonksiyonu (`api/qa-ask.js`).
- Vercel’e dağıtırken Zoho SMTP bilgilerini ve alıcı e-posta adresini ortam değişkenleriyle tanımlamayı unutmayın.
- Yerelde çalıştırmak için `npm i` ardından `npx vercel dev` komutlarını kullanın; form yalnızca e-posta gönderir, veritabanına yazmaz.
