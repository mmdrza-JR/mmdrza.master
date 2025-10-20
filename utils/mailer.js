// ============================================================
// 💌 Mmdrza Ultra Mailer v10 — Resend API Edition
// ============================================================
// ✅ No phone number required
// ✅ 100% works on Railway (HTTPS only)
// ============================================================

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

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
    const res = await fetch("https://api.resend.com/emails", {
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
