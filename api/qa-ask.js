/**
 * Vercel Serverless Function (Node.js)
 * POST /api/qa-ask
 *
 * Env vars (Vercel -> Project -> Settings -> Environment Variables):
 * - ZOHO_SMTP_HOST=smtp.zoho.eu (veya smtp.zoho.com / bölgen neyse)
 * - ZOHO_SMTP_PORT=465 (SSL) veya 587 (STARTTLS)
 * - ZOHO_SMTP_USER=qa@almanya101.de
 * - ZOHO_SMTP_PASS=Zoho App Password
 * - MAIL_TO=qa@almanya101.de
 * - MAIL_FROM_NAME=almanya101 QA (opsiyonel)
 */

const nodemailer = require("nodemailer");

const MIN_LEN = 10;
const MAX_LEN = 1500;

function isEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const questionRaw = typeof body.question === "string" ? body.question : "";
    const question = questionRaw.trim();

    const emailRaw = typeof body.email === "string" ? body.email : "";
    const email = emailRaw.trim();

    const nameRaw = typeof body.name === "string" ? body.name : "";
    const name = nameRaw.trim();

    if (question.length < MIN_LEN) {
      res.statusCode = 400;
      return res.json({ error: `Soru en az ${MIN_LEN} karakter olmalı.` });
    }
    if (question.length > MAX_LEN) {
      res.statusCode = 400;
      return res.json({ error: `Soru en fazla ${MAX_LEN} karakter olmalı.` });
    }
    if (email && !isEmail(email)) {
      res.statusCode = 400;
      return res.json({ error: "E-posta formatı geçersiz." });
    }

    const host = process.env.ZOHO_SMTP_HOST || "smtp.zoho.eu";
    const port = Number(process.env.ZOHO_SMTP_PORT || "465");
    const user = process.env.ZOHO_SMTP_USER;
    const pass = process.env.ZOHO_SMTP_PASS;
    const to = process.env.MAIL_TO || user;
    const fromName = process.env.MAIL_FROM_NAME || "almanya101 QA";

    if (!user || !pass || !to) {
      res.statusCode = 500;
      return res.json({ error: "Mail ayarları eksik (env vars)." });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 => SSL
      auth: { user, pass }
    });

    const now = new Date();
    const ts = now.toISOString();

    const subject = `Yeni Soru (almanya101) - ${ts}`;

    const lines = [
      "Yeni soru geldi:",
      "",
      `Tarih: ${ts}`,
      name ? `İsim: ${name}` : "İsim: (yok)",
      email ? `E-posta: ${email}` : "E-posta: (yok)",
      "",
      "Soru:",
      question,
      "",
      "—",
      "almanya101.de"
    ];

    const mail = {
      from: `${fromName} <${user}>`,
      to,
      subject,
      text: lines.join("\n"),
      replyTo: email || undefined
    };

    await transporter.sendMail(mail);

    res.statusCode = 200;
    return res.json({ ok: true });
  } catch (e) {
    res.statusCode = 500;
    return res.json({ error: "Mail gönderilemedi. Lütfen tekrar deneyin." });
  }
};
