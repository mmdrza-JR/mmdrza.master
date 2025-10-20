import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const suggestGoal = async (req, res) => {
  try {
    const { goalText } = req.body;
    const prompt = `کاربر می‌خواهد هدف تحصیلی‌اش را شرح دهد: "${goalText}". 
بر اساس این متن، یک نسخه حرفه‌ای‌تر و دقیق‌تر از هدف او برای رزومه یا فرم مشاوره بنویس.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const suggestion = completion.choices[0].message.content;
    res.json({ success: true, suggestion });
  } catch (err) {
    console.error("AI Suggest Error:", err);
    res.status(500).json({ success: false, error: "AI error" });
  }
};
