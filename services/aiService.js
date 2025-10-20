// services/aiService.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.OPENAI_API_KEY;

// === بخش بررسی اولیه ===
if (!key || key.trim() === "") {
  console.error("❌ فایل .env پیدا شد ولی OPENAI_API_KEY داخلش نیست یا خالیه.");
} else {
  console.log("✅ OpenAI API Key یافت شد. (شروع اتصال)");
}

// در صورت وجود فیلتر، از baseURL پروکسی استفاده می‌کنیم
const openai = new OpenAI({
  apiKey: key,
  baseURL: "https://api.openai-proxy.com/v1", // در صورت باز بودن مستقیم، می‌تونی این خطو حذف کنی
});

export async function analyzeStudyGoal(goalText) {
  try {
    if (!goalText || goalText.trim() === "") {
      return {
        aiSummary: "متن هدف تحصیلی خالی است.",
        aiRecommendation: "لطفاً هدف خود را بنویسید تا تحلیل شود.",
      };
    }

    console.log("🧠 در حال ارسال درخواست به OpenAI ...");
    console.log("🎯 هدف کاربر:", goalText);

    const prompt = `
هدف تحصیلی کاربر:
"${goalText}"

لطفاً به زبان فارسی:
1. یک خلاصه‌ی حرفه‌ای از هدف کاربر بنویس.
2. یک توصیه‌ی تحصیلی کوتاه و دقیق بده.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
      temperature: 0.7,
    });

    const output = response.choices?.[0]?.message?.content?.trim() || "";
    console.log("✅ پاسخ دریافتی از OpenAI:", output);

    const lines = output.split(/\r?\n/).filter(Boolean);
    const aiSummary = lines[0] || "خلاصه‌ای در دسترس نیست.";
    const aiRecommendation = lines[1] || "توصیه‌ای یافت نشد.";

    return { aiSummary, aiRecommendation };
  } catch (error) {
    console.error("❌ خطا در ارتباط با OpenAI:", error.message);

    // حالت fallback شبیه‌سازی‌شده برای تجربه بدون قطع
    let fakeSummary = "کاربر علاقه‌مند به ادامه تحصیل و توسعه مهارت‌های علمی خود است.";
    let fakeRecommendation = "پیشنهاد می‌شود با تمرکز بر اهداف شخصی، مسیر تحصیلی خود را در گرایش مرتبط انتخاب کند.";

    // تحلیل ساده بر اساس کلمات کلیدی هدف
    const goal = goalText.toLowerCase();
    if (goal.includes("برق")) {
      fakeSummary = "کاربر به حوزه برق و فناوری‌های مرتبط علاقه‌مند است.";
      fakeRecommendation = "پیشنهاد می‌شود در گرایش‌های قدرت یا الکترونیک ادامه دهد.";
    } else if (goal.includes("کامپیوتر") || goal.includes("هوش مصنوعی")) {
      fakeSummary = "کاربر علاقه‌مند به علوم کامپیوتر و هوش مصنوعی است.";
      fakeRecommendation = "پیشنهاد می‌شود در زمینه هوش مصنوعی یا یادگیری ماشین متمرکز شود.";
    } else if (goal.includes("پزشکی")) {
      fakeSummary = "کاربر تمایل به ورود به شاخه‌های پزشکی دارد.";
      fakeRecommendation = "تمرکز بر بیولوژی و علوم سلامت توصیه می‌شود.";
    }

    console.warn("⚠️ Fallback فعال شد (پاسخ محلی تولید شد).");

    return {
      aiSummary: fakeSummary,
      aiRecommendation: fakeRecommendation,
    };
  }
}
