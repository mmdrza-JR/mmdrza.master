// ============================================================
// 💌 Mmdrza Ultra Mailer v8 — Gmail App Password Edition (Final)
// ============================================================
// ✅ Works perfectly on Railway
// ✅ Uses Gmail App Password (2FA Enabled)
// ✅ Includes automatic retry + cleaner logs
// ✅ Handles Persian text safely
// ============================================================

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ============================================================
// ⚙️ ساخت اتصال SMTP به Gmail
// ============================================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // Gmail روی پورت 587 از STARTTLS استفاده می‌کند
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // جلوگیری از خطای SSL در Railway
  },
});

// ============================================================
// 🔍 تست اتصال هنگام راه‌اندازی سرور
// ============================================================
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP Connection Failed:", err.message);
  } else {
    console.log("✅ Gmail SMTP Ready — Mailer Online!");
  }
});

// ============================================================
// ✉️ ارسال ایمیل تأیید ثبت‌نام
// ============================================================
export async function sendVerificationEmail(toEmail, code) {
  const html = `
  <div style="font-family:Tahoma,sans-serif;direction:rtl;background:#f1f5f9;padding:20px;text-align:center">
    <div style="background:#fff;border-radius:12px;padding:30px;max-width:520px;margin:auto;box-shadow:0 0 25px rgba(0,0,0,0.08)">
      <img src="https://cdn-icons-png.flaticon.com/512/542/542689.png" width="70" alt="Mail" style="margin-bottom:15px">
      <h2 style="color:#2563eb;">تأیید ایمیل شما</h2>
      <p style="font-size:15px;color:#475569;">کد ورود شما به سامانه:</p>
      <h1 style="font-size:36px;letter-spacing:5px;color:#1e3a8a;margin:20px 0;">${code}</h1>
      <p style="font-size:13px;color:#64748b;">این کد تا ۵ دقیقه آینده معتبر است.</p>
      <hr style="margin:25px 0;border:none;border-top:1px solid #e2e8f0;">
      <p style="font-size:12px;color:#94a3b8;">سامانه مشاوره تحصیلی Mmdrza 🤖</p>
    </div>
  </div>`;

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Mmdrza Advisor" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "🔐 کد تأیید ورود شما",
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${toEmail} (${info.messageId})`);
    return true;
  } catch (err) {
    console.error("❌ Error sending verification email:", err.message);
    console.log("📡 Retrying in 3 seconds...");

    // تلاش مجدد خودکار (در صورت خطاهای موقتی)
    await new Promise((r) => setTimeout(r, 3000));
    try {
      const retryInfo = await transporter.sendMail(mailOptions);
      console.log(`✅ Retry success: email sent to ${toEmail} (${retryInfo.messageId})`);
      return true;
    } catch (retryErr) {
      console.error("❌ Retry failed:", retryErr.message);
      return false;
    }
  }
}

// ============================================================
// 📘 ارسال ایمیل اطلاع‌رسانی رزرو (اختیاری)
// ============================================================
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
      <p style="font-size:12px;color:#94a3b8;text-align:center;">سامانه مشاوره تحصیلی Mmdrza 🤖</p>
    </div>
  </div>`;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Mmdrza Advisor" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `📘 رزرو جدید از ${booking.name}`,
      html,
    });

    console.log(`✅ Booking email sent to ${toEmail} (${info.messageId})`);
    return true;
  } catch (err) {
    console.error("❌ Error sending booking email:", err.message);
    return false;
  }
}
