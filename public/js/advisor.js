'use strict';

const nameField = document.getElementById("name");
const phoneField = document.getElementById("phone");
const goalField = document.getElementById("goal");
const aiSuggestBtn = document.getElementById("aiSuggestBtn");
const aiSuggestionBox = document.getElementById("aiSuggestionBox");
const submitBtn = document.getElementById("submitBtn");

// بررسی Session کاربر
async function loadUser() {
  const res = await fetch("/api/auth/session");
  const data = await res.json();
  if (data.loggedIn && data.user) {
    nameField.value = data.user.name;
    phoneField.value = data.user.phone;
  } else {
    alert("ابتدا وارد شوید!");
    window.location.href = "/register.html";
  }
}

// پیشنهاد هوشمند هدف با AI
aiSuggestBtn.addEventListener("click", async () => {
  const text = goalField.value.trim();
  if (!text) return alert("ابتدا کمی درباره هدفت بنویس!");

  aiSuggestionBox.classList.remove("d-none");
  aiSuggestionBox.innerHTML = "🤖 در حال تحلیل هدف شما...";
  
  try {
    const res = await fetch("/api/ai/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalText: text }),
    });
    const data = await res.json();
    aiSuggestionBox.innerHTML = `
      <div class="animate__animated animate__fadeInUp">
        <strong>پیشنهاد AI:</strong><br>${data.suggestion || "پیشنهادی موجود نیست"}
      </div>`;
  } catch (err) {
    aiSuggestionBox.textContent = "❌ خطا در ارتباط با سرور";
  }
});

// ارسال فرم نهایی
submitBtn.addEventListener("click", async () => {
  const payload = {
    name: nameField.value,
    phone: phoneField.value,
    goalText: goalField.value,
  };

  const res = await fetch("/api/booking/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (data.success) {
    alert("✅ درخواست شما ثبت شد!");
    window.location.href = "/success.html";
  } else {
    alert("❌ خطا در ثبت درخواست.");
  }
});

loadUser();
