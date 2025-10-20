'use strict';

const registerBox = document.getElementById("registerBox");
const regName = document.getElementById("regName");
const regPhone = document.getElementById("regPhone");
const registerBtn = document.getElementById("registerBtn");
const verifyBtn = document.getElementById("verifyBtn");
const resendCode = document.getElementById("resendCode");
const statusMsg = document.getElementById("statusMsg");
const stepRegister = document.getElementById("stepRegister");
const stepVerify = document.getElementById("stepVerify");

function showStatus(msg, type = "info") {
  statusMsg.textContent = msg;
  statusMsg.className = `mt-3 text-${type} small animate__animated animate__fadeIn`;
}

registerBtn.addEventListener("click", async () => {
  const name = regName.value.trim();
  const phone = regPhone.value.trim();

  if (!name || !phone) return showStatus("لطفاً نام و شماره خود را وارد کنید.", "warning");

  showStatus("در حال ارسال کد تأیید...");
  registerBtn.disabled = true;

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    const data = await res.json();

    if (data.success) {
      showStatus("کد تأیید ارسال شد ✅", "success");
      stepRegister.classList.add("hidden");
      stepVerify.classList.remove("hidden");
    } else {
      showStatus(data.error || "خطایی رخ داد", "danger");
    }
  } catch (err) {
    showStatus("❌ خطا در ارتباط با سرور", "danger");
  } finally {
    registerBtn.disabled = false;
  }
});

verifyBtn.addEventListener("click", async () => {
  const code = document.getElementById("verifyCode").value.trim();
  const phone = regPhone.value.trim();
  if (!code) return showStatus("کد تأیید را وارد کنید", "warning");

  showStatus("در حال بررسی کد...");
  verifyBtn.disabled = true;

  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();

    if (data.success) {
      showStatus("ورود موفق ✅ در حال هدایت...", "success");
      setTimeout(() => window.location.href = "/advisor.html", 1000);
    } else {
      showStatus(data.error || "کد اشتباه است", "danger");
    }
  } catch (err) {
    showStatus("❌ خطا در تأیید کد", "danger");
  } finally {
    verifyBtn.disabled = false;
  }
});

resendCode.addEventListener("click", (e) => {
  e.preventDefault();
  registerBtn.click();
});
