// ============================================================
// 💌 Mmdrza Ultra Mailer v9 — Brevo (Sendinblue) API Edition
// ============================================================
// ✅ 100% Compatible with Railway
// ✅ No SMTP ports → works behind firewalls
// ✅ Safe sender parsing (no match errors)
// ✅ RTL Persian HTML template optimized
// ============================================================

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

// 🧠 Helper: Parse sender safely
function parseSender(senderString) {
  // Default fallback if not provided in Railway
  const defaultSender = "Mmdrza Advisor <mohamadrezazedbaz10@gmail.com>";
  const value = senderString || defaultSender;

  const match = value.match(/<(.+)>/);
  const email = match ? match[1] : value;
  const name = value.split(" <")[0] || "Mmdrza Advisor";

  return { email, name };
}

// ============================================================
// ✉️ ارسال ایمیل تأیید ثبت‌نام
// ============================================================
export async function sendVerificationEmail(toEmail, code) {
  const sender = parseSender(process.env.BREVO_SENDER);

  const htmlContent = `
  <div style="font-family:Tahoma,sans-serif;direction:rtl;background:#f1f5f9;padding:20px;text-align:center">
    <div style="background:#fff;border-radius:12px;padding:30px;max-width:520px;margin:auto;box-shadow:0 0 25px rgba(0,0,0,0.08)">
      <img src="https://cdn-icons-png.flaticon.com/512/542/542689.png" width="70" alt="Mail" style="margin-bottom:15px">
      <h2 style="color:#2563eb;">تأیید ایمیل شما</h2>
      <p style="font-size:15px;color:#475569;">کد ورود شما به سامانه:</p>
      <h1 style="font-size:36px;letter-spacing:5px;color:#1e3a8a;margin:20px 0;">${code}</h1>
      <p style="font-size:13px;color:#64748b;">این کد تا ۵ دقیقه آینده معتبر است.</p>
      <hr style="margin:25px 0;border:none;border-top:1px solid #e2e8f0;">
      <p style="font-size:12px;color:#94a3b8;">سامانه مشاوره تحصیلی هوشمند Mmdrza 🤖</p>
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
        sender,
        to: [{ email: toEmail }],
        subject: "🔐 کد تأیید ورود شما",
        htmlContent,
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

// ============================================================
// 📘 ارسال ایمیل رزرو مشاوره
// ============================================================
export async function sendBookingEmail(booking, toEmail) {
  const sender = parseSender(process.env.BREVO_SENDER);

  const htmlContent = `
  <div style="font-family:Tahoma,sans-serif;direction:rtl;background:#f6f8fb;padding:20px">
    <div style="background:#fff;border-radius:10px;padding:20px;max-width:600px;margin:auto;box-shadow:0 0 20px rgba(0,0,0,0.08)">
      <h2 style="color:#2563eb;margin-bottom:10px;">رزرو جدید مشاوره تحصیلی</h2>
      <p><strong>👤 نام:</strong> ${booking.name}</p>
      <p><strong>📧 ایمیل:</strong> ${booking.email}</p>
      <p><strong>🎯 هدف:</strong> ${booking.goalText}</p>
      <hr style="margin:15px 0;border:none;border-top:1px solid #e2e8f0;">
      <h4 style="color:#2563eb">✨ خلاصه تحلیل AI:</h4>
      <p>${booking.aiSummary}</p>
      <h4 style="color:#2563eb">🧠 توصیه هوشمند:</h4>
      <p>${booking.aiRecommendation}</p>
      <hr style="margin:25px 0;border:none;border-top:1px solid #e2e8f0;">
      <p style="font-size:12px;color:#94a3b8;text-align:center;">سامانه مشاوره تحصیلی Mmdrza 🤖</p>
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
        sender,
        to: [{ email: toEmail }],
        subject: `📘 رزرو جدید از ${booking.name}`,
        htmlContent,
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
