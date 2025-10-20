// ============================================================
// 💌 Mmdrza Ultra Mailer v8 — Brevo (Sendinblue) API Version
// ============================================================
// ✅ 100% Compatible with Railway
// ✅ No SMTP, No Domain Verify Needed
// ============================================================

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

// ✉️ ارسال ایمیل تأیید ثبت‌نام
export async function sendVerificationEmail(toEmail, code) {
  const html = `
  <div style="font-family:Tahoma,sans-serif;direction:rtl;background:#f1f5f9;padding:20px;text-align:center">
    <div style="background:#fff;border-radius:12px;padding:30px;max-width:520px;margin:auto;box-shadow:0 0 25px rgba(0,0,0,0.08)">
      <h2 style="color:#2563eb;">تأیید ایمیل شما</h2>
      <p>کد ورود شما:</p>
      <h1 style="font-size:32px;color:#1e3a8a;letter-spacing:5px;">${code}</h1>
      <p>این کد تا ۵ دقیقه آینده معتبر است.</p>
      <hr/>
      <p style="font-size:12px;color:#94a3b8;">سامانه مشاوره تحصیلی Mmdrza 🤖</p>
    </div>
  </div>`;

  try {
    const res = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_SENDER.match(/<(.+)>/)[1], name: process.env.BREVO_SENDER.split(" <")[0] },
        to: [{ email: toEmail }],
        subject: "🔐 کد تأیید ورود شما",
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Brevo API error: ${errText}`);
    }

    console.log(`✅ Verification email sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error("❌ Error sending verification email:", err.message);
    return false;
  }
}

// 📘 ارسال ایمیل رزرو مشاوره (اختیاری)
export async function sendBookingEmail(booking, toEmail) {
  const html = `
  <div style="font-family:Tahoma,sans-serif;direction:rtl;background:#f6f8fb;padding:20px">
    <div style="background:#fff;border-radius:10px;padding:20px;max-width:600px;margin:auto;box-shadow:0 0 20px rgba(0,0,0,0.08)">
      <h2 style="color:#2563eb">رزرو جدید مشاوره تحصیلی</h2>
      <p><strong>👤 نام:</strong> ${booking.name}</p>
      <p><strong>📧 ایمیل:</strong> ${booking.email}</p>
      <p><strong>🎯 هدف:</strong> ${booking.goalText}</p>
      <hr/>
      <p>${booking.aiSummary}</p>
      <p>${booking.aiRecommendation}</p>
    </div>
  </div>`;

  try {
    const res = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_SENDER.match(/<(.+)>/)[1], name: process.env.BREVO_SENDER.split(" <")[0] },
        to: [{ email: toEmail }],
        subject: `📘 رزرو جدید از ${booking.name}`,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Brevo API error: ${errText}`);
    }

    console.log(`✅ Booking email sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error("❌ Error sending booking email:", err.message);
    return false;
  }
}
