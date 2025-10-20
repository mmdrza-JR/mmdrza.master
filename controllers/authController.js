// ============================================================
// 🔐 Mmdrza Ultra Auth Controller v7 — Final Super Pro Edition
// ============================================================

import User from "../models/User.js";
import crypto from "crypto";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/mailer.js";
dotenv.config();

// ============================================================
// 🧠 Utilities
// ============================================================

// 🔢 ساخت کد تصادفی ۶ رقمی
const generateCode = () => crypto.randomInt(100000, 999999);

// ⏰ زمان انقضا (۵ دقیقه)
const codeExpiresAt = () => new Date(Date.now() + 5 * 60 * 1000);

// 📋 لاگ هوشمند
function logActivity(action, detail) {
  console.log(
    `🧩 [${new Date().toLocaleTimeString("fa-IR")}] ${action}:`,
    detail || ""
  );
}

// ============================================================
// 🧩 مرحله ۱: ثبت‌نام / ارسال کد تأیید
// ============================================================
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        error: "نام و یکی از فیلدهای ایمیل یا تلفن ضروری است.",
      });
    }

    const code = generateCode();
    const expiresAt = codeExpiresAt();

    // بررسی وجود کاربر قبلی
    let user = await User.findOne({ $or: [{ email }, { phone }] });

    if (user) {
      // جلوگیری از ارسال اسپم
      if (user.codeExpiresAt && new Date() < user.codeExpiresAt) {
        const remaining = Math.ceil(
          (user.codeExpiresAt - new Date()) / 1000 / 60
        );
        return res.status(429).json({
          success: false,
          error: `⏳ لطفاً تا ${remaining} دقیقه دیگر برای دریافت کد جدید صبر کنید.`,
        });
      }

      // به‌روزرسانی کاربر قدیمی
      user.name = name || user.name;
      user.verifyCode = code;
      user.codeExpiresAt = expiresAt;
      user.isVerified = false;
      await user.save();
    } else {
      // ایجاد کاربر جدید
      user = await User.create({
        name,
        email,
        phone,
        verifyCode: code,
        codeExpiresAt: expiresAt,
      });
    }

    // ✉️ ارسال ایمیل تأیید
    if (email) {
      await sendVerificationEmail(email, code);
      logActivity("📨 Verification Email Sent", email);
    } else {
      logActivity("📱 SMS Verification (Simulated)", phone);
    }

    res.json({
      success: true,
      message: `کد تأیید به ${email ? "ایمیل" : "شماره تلفن"} شما ارسال شد ✅`,
      expiresAt,
    });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({
      success: false,
      error: "خطا در ارسال کد تأیید. لطفاً دوباره تلاش کنید.",
    });
  }
};

// ============================================================
// 🔍 مرحله ۲: تأیید کد
// ============================================================
export const verifyCode = async (req, res) => {
  try {
    const { email, phone, code } = req.body;
    logActivity("📩 VERIFY REQUEST", { email, phone, code });

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    logActivity("🔎 FOUND USER", user?.email || user?.phone || "❌ Not Found");

    if (!user)
      return res.status(404).json({
        success: false,
        error: "کاربر یافت نشد.",
      });

    // بررسی وجود کد
    if (!user.verifyCode || !user.codeExpiresAt) {
      return res.status(400).json({
        success: false,
        error: "کد تأیید ارسال نشده است.",
      });
    }

    // بررسی انقضا
    if (new Date() > user.codeExpiresAt) {
      return res.status(400).json({
        success: false,
        error: "⏰ کد تأیید منقضی شده است.",
      });
    }

    // بررسی صحت کد
    if (String(user.verifyCode) !== String(code)) {
      return res.status(400).json({
        success: false,
        error: "❌ کد وارد شده اشتباه است.",
      });
    }

    // ✅ تأیید موفق
    user.isVerified = true;
    user.verifyCode = null;
    user.codeExpiresAt = null;
    await user.save();

  req.session.user = {
  id: user._id,
  name: user.name,
  email: user.email,
};


    logActivity("✅ USER VERIFIED", req.session.user);

    res.json({
      success: true,
      message: "ورود با موفقیت انجام شد ✅",
      user: req.session.user,
    });
  } catch (err) {
    console.error("❌ Verify error:", err.message);
    res.status(500).json({
      success: false,
      error: "خطا در تأیید کد. لطفاً مجدداً تلاش کنید.",
    });
  }
};

// ============================================================
// 🧠 مرحله ۳: دریافت کاربر فعال از سشن
// ============================================================
export const getSessionUser = async (req, res) => {
  try {
    if (req.session.user) {
      return res.json({
        success: true,
        loggedIn: true,
        user: req.session.user,
      });
    } else {
      return res.json({ success: true, loggedIn: false });
    }
  } catch (err) {
    console.error("❌ Session error:", err.message);
    res.status(500).json({ success: false, error: "خطا در بررسی نشست کاربر." });
  }
};

// ============================================================
// 🚪 مرحله ۴: خروج کاربر
// ============================================================
export const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Logout error:", err);
        return res
          .status(500)
          .json({ success: false, error: "خطا در خروج از حساب کاربری." });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true, message: "با موفقیت خارج شدید 👋" });
    });
  } catch (err) {
    console.error("❌ Logout exception:", err.message);
    res
      .status(500)
      .json({ success: false, error: "مشکلی در خروج از سیستم وجود دارد." });
  }
};
