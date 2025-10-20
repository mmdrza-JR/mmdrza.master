// ============================================================
// ✨ Typed.js Initialization
// (Moved out of HTML to avoid CSP inline script errors)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  new Typed("#typedText", {
    strings: [
      "فرم مشاوره تحصیلی هوشمند 🎓",
      "Mmdrza AI Study Advisor 🌐",
      "برنامه‌ریزی تحصیلی با هوش مصنوعی 🤖"
    ],
    typeSpeed: 55,
    backSpeed: 35,
    backDelay: 1200,
    loop: true,
    showCursor: true,
    cursorChar: "▋",
  });
});
