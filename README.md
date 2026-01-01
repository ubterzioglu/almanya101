# almanya101.de (Static HTML) + QA Form (Zoho Mail)

## Structure
- index.html
- style-shared.css
- qa/qa.html
- qa/qa.js
- api/qa-ask.js  (Vercel Serverless Function)

## Deploy (Vercel)
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

## Notes
- This version does NOT write to DB; it only sends emails to qa@almanya101.de.
- Later, you can add a DB table (QA1) and an admin panel to publish answers.
