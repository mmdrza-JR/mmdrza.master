// ============================================================
// 🌌 Mmdrza Study Advisor — Ultra Server.js v2
// AI • Secure • Modular • Production-Ready
// ============================================================

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";

// === Import Routes ===
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

// ============================================================
// 🧠 Core Setup
// ============================================================
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// بعد از const app = express();
app.set("trust proxy", 1);

// ============================================================
// 🧱 Middlewares — Security, Speed, and Structure
// ============================================================

// 🔐 Helmet + Custom CSP (for Tailwind, FontAwesome, OpenAI)
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'", "https:", "data:"],
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
          "https://cdn.jsdelivr.net",
          "https://kit.fontawesome.com"
        ],
   "style-src": [
  "'self'",
  "'unsafe-inline'",
  "https://cdn.jsdelivr.net",
  "https://fonts.googleapis.com",
  "https://cdnjs.cloudflare.com"
],
"font-src": [
  "'self'",
  "https://fonts.gstatic.com",
  "https://cdn.jsdelivr.net",
  "https://cdnjs.cloudflare.com",
  "data:"
],

        "connect-src": [
          "'self'",
          "https://api.openai.com",
  "https://api.openai-proxy.com",
  "https://cdn.jsdelivr.net"
],
      },
    },
  })
);

// 🧾 HTTP Logging (with color-coded output)
app.use(
  morgan(function (tokens, req, res) {
    return [
      "📡",
      tokens.method(req, res),
      tokens.url(req, res),
      "-",
      tokens.status(req, res),
      "|",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

// 🧩 Parsers & Compression
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// 🌍 CORS (open for dev, restrict later for prod)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🚦 Rate Limiter (anti-flood)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, error: "⏳ درخواست بیش از حد. لطفاً بعداً تلاش کنید." },
  })
);

// ============================================================
// 🧠 Session (User Login Persistence)
// ============================================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mmdrzaUltraSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
cookie: {
  httpOnly: true,
  maxAge: 1000 * 60 * 60, // 1h
  secure: process.env.NODE_ENV === "production", // فقط در production
  sameSite: "lax",
},

  })
);

// ============================================================
// 📂 Static Frontend
// ============================================================
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use(express.static(path.join(__dirname, "public")));

// Default Route (landing page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});



// 🧩 API Routes
// ============================================================
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/ai", aiRoutes);
// === Frontend Pages Routing ===
app.get("/verify", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "verify.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/advisor", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "advisor.html"));
});

// ============================================================
// ⚠️ Error Handling (404 & 500)
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "🔍 مسیر مورد نظر یافت نشد.",
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Internal Server Error:", err);
  res.status(500).json({
    success: false,
    message: "💥 خطای داخلی سرور.",
    error: err.message,
  });
});

// ============================================================
// 🚀 MongoDB Connection & Server Launch
// ============================================================
// ============================================================
// 🚀 MongoDB Connection & Server Launch (Fixed for Railway)
// ============================================================

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    // ادامه می‌دیم حتی اگر MongoDB بالا نیومد، تا Railway timeout نشه
  }

  app.listen(PORT, () => {
    console.log(`
🚀 Server running on port: ${PORT}
🧠 AI Advisor Ready ✅
📦 Environment: ${process.env.NODE_ENV || "development"}
    `);
  });
};

startServer();

// ============================================================
// 💡 Notes:
// - برای Production: کوکی secure و domain ست کن.
// - می‌تونی PM2 یا Docker برای اجرای مداوم استفاده کنی.
// ============================================================
