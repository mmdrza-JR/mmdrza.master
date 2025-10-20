// ============================================================
// ⚡ Mmdrza Ultra Animation Engine v5 — Final Stable Edition
// Zero conflict with Animate.css + form.js transitions
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const formBox = document.querySelector(".glass-box");
  if (!formBox) return;

  // جلوگیری از باگ کلیک / focus در انیمیشن
  formBox.style.transformStyle = "preserve-3d";
  formBox.style.willChange = "transform";

  // ساخت لایه Glow فقط برای افکت نور (نه چرخش)
  const glowLayer = document.createElement("div");
  glowLayer.classList.add("glow-layer");
  formBox.appendChild(glowLayer);

  // ----- استایل‌ها -----
  const neonStyle = document.createElement("style");
  neonStyle.innerHTML = `
  .glass-box {
    background: rgba(10, 20, 30, 0.85);
    border: 1px solid rgba(0, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 200, 255, 0.1);
    border-radius: 18px;
    backdrop-filter: blur(15px);
    position: relative;
    overflow: hidden;
  }
  .glow-layer {
    pointer-events: none;
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(0,200,255,0.15) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.25s ease, transform 0.2s ease;
    z-index: 0;
  }
  .glass-box.active-glow .glow-layer {
    opacity: 1;
  }
  button.btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(0, 200, 255, 0.5);
  }
  input, textarea, select {
    transition: all 0.3s ease-in-out;
    border-radius: 8px;
  }
  input:focus, textarea:focus, select:focus {
    box-shadow: 0 0 14px rgba(0, 200, 255, 0.7);
    border-color: rgba(0, 200, 255, 0.9);
  }
  `;
  document.head.appendChild(neonStyle);

  // ----- افکت نور هنگام حرکت موس -----
  formBox.addEventListener("mousemove", (e) => {
    const rect = formBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowLayer.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,200,255,0.25), transparent 60%)`;
    formBox.classList.add("active-glow");
  });

  formBox.addEventListener("mouseleave", () => {
    formBox.classList.remove("active-glow");
  });

  // ----- افکت تپش نئون هنگام تایپ -----
  document.querySelectorAll("input, textarea").forEach((el) => {
    el.addEventListener("input", () => {
      el.animate(
        [
          { boxShadow: "0 0 0 rgba(0,200,255,0)" },
          { boxShadow: "0 0 25px rgba(0,200,255,0.6)" },
          { boxShadow: "0 0 0 rgba(0,200,255,0)" },
        ],
        { duration: 600, easing: "ease-in-out" }
      );
    });
  });

  // ----- افکت روشن‌شدن جعبه نتیجه AI -----
  const observer = new MutationObserver(() => {
    const aiBox = document.getElementById("aiResultBox");
    if (aiBox && !aiBox.classList.contains("ai-glow")) {
      aiBox.classList.add("ai-glow");
      aiBox.style.transition = "box-shadow 0.6s ease";
      aiBox.style.boxShadow = "0 0 40px rgba(0,255,200,0.75)";
      setTimeout(() => {
        aiBox.style.boxShadow = "0 0 10px rgba(0,255,200,0.3)";
        aiBox.classList.remove("ai-glow");
      }, 2000);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
