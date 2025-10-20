// controllers/bookingController.js
import Booking from "../models/Booking.js";
import { analyzeStudyGoal } from "../services/aiService.js";
import { sendBookingEmail } from "../utils/mailer.js";

export const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      facultyInterest,
      studyLevel,
      goalText,
      preferredDates,
    } = req.body;

    console.log("📩 New booking received from:", name, email);

    // فراخوانی هوش مصنوعی
    const aiResult = await analyzeStudyGoal(goalText || "");
    console.log("✅ AI Result:", aiResult);

    // ذخیره در دیتابیس
    const newBooking = new Booking({
      name,
      email,
      phone,
      facultyInterest,
      studyLevel,
      goalText,
      aiSummary: aiResult.aiSummary,
      aiRecommendation: aiResult.aiRecommendation,
      preferredDates,
    });

    await newBooking.save();

    // ارسال ایمیل
    try {
      await sendBookingEmail(newBooking, process.env.TARGET_EMAIL);
      console.log("📤 Email sent to", process.env.TARGET_EMAIL);
    } catch (emailErr) {
      console.error("⚠️ Email send failed:", emailErr.message);
    }

    // پاسخ نهایی به فرانت
    res.json({
      success: true,
      booking: {
        id: newBooking._id,
        name,
        email,
        aiSummary: aiResult.aiSummary,
        aiRecommendation: aiResult.aiRecommendation,
      },
    });
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ error: "خطای سرور در پردازش درخواست." });
  }
};