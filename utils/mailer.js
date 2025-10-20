// ============================================================
// 💌 Mmdrza Ultra Mailer v10 — Resend API Edition (Final)
// ============================================================
// ✅ 100% Works on Railway
// ✅ Supports verification + booking emails
// ============================================================

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const RESEND_URL = "https://api.resend.com/emails";

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
      <p style="font-size:12px;color:#94a3b8;">سامانه مشاوره تحصیلی هوشمند Mmdrza 🤖</p>
    </div>
  </div>`;

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mmdrza Advisor <onboarding@resend.dev>",
        to: [toEmail],
        subject: "🔐 کد تأیید ورود شما",
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend API error: ${err}`);
    }

    console.log(`✅ Verification email sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error("❌ Error sending verification email:", err.message);
    return false;
  }
}

// 📘 ارسال ایمیل رزرو مشاوره
export async function sendBookingEmail(booking, toEmail) {
  const html = `
  <div style="font-family:Tahoma,sans-serif;direction:rtl;background:#f6f8fb;padding:20px">
    <div style="background:#fff;border-radius:10px;padding:25px;max-width:600px;margin:auto;box-shadow:0 0 20px rgba(0,0,0,0.08)">
      <h2 style="color:#2563eb;margin-bottom:15px;">رزرو جدید مشاوره تحصیلی</h2>
      <p><strong>👤 نام:</strong> ${booking.name}</p>
      <p><strong>📧 ایمیل:</strong> ${booking.email}</p>
      <p><strong>🎯 هدف تحصیلی:</strong> ${booking.goalText}</p>
      <hr style="margin:20px 0;border:none;border-top:1px solid #e2e8f0;">
      <h4 style="color:#2563eb;">✨ خلاصه تحلیل AI:</h4>
      <p>${booking.aiSummary}</p>
      <h4 style="color:#2563eb;">🧠 توصیه هوشمند:</h4>
      <p>${booking.aiRecommendation}</p>
      <hr style="margin:25px 0;border:none;border-top:1px solid #e2e8f0;">
      <p style="font-size:12px;color:#94a3b8;text-align:center;">سامانه مشاوره تحصیلی هوشمند Mmdrza 🤖</p>
    </div>
  </div>`;

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mmdrza Advisor <onboarding@resend.dev>",
        to: [toEmail],
        subject: `📘 رزرو جدید از ${booking.name}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend API error: ${err}`);
    }

    console.log(`✅ Booking email sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error("❌ Error sending booking email:", err.message);
    return false;
  }
}
