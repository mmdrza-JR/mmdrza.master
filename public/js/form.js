'use strict';
/* ============================================================
🎓 Mmdrza Smart Study Advisor — form.js v4 (Final Ultra)
Optimized UX • Smooth Animations • AI Connected
============================================================ */

let currentStep = 1;
const totalSteps = 3;

const steps = document.querySelectorAll('.form-step');
const progressBar = document.getElementById('progressBar');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const formBox = document.getElementById('advisorForm');

// ========================= Utility UI Blocks =========================
let aiBox = document.getElementById('aiResultBox');
if (!aiBox) {
  aiBox = document.createElement('div');
  aiBox.id = 'aiResultBox';
  aiBox.className = 'glass-box mt-4 p-4 text-center animate__animated d-none';
  aiBox.innerHTML = `
    <h5 class="text-info mb-3 fw-bold"><i class="fa-solid fa-brain me-2"></i> نتیجه تحلیل هوش مصنوعی 🤖</h5>
    <div id="aiSummary" class="text-light mb-2"></div>
    <div id="aiRecommend" class="text-sky-400 fw-bold"></div>
  `;
  formBox.appendChild(aiBox);
}

let spinnerContainer = document.getElementById('loadingSpinner');
if (!spinnerContainer) {
  spinnerContainer = document.createElement('div');
  spinnerContainer.id = 'loadingSpinner';
  spinnerContainer.className = 'text-center mt-4 animate__animated d-none';
  spinnerContainer.innerHTML = `
    <div class="spinner-border text-info" style="width:2.6rem;height:2.6rem;" role="status"></div>
    <p class="mt-3 text-info fw-semibold">در حال ارسال و تحلیل توسط هوش مصنوعی...</p>
  `;
  formBox.appendChild(spinnerContainer);
}

// ========================= Animation Helper =========================
function animateOnce(el, animationName, keep = false) {
  if (!el) return;
  el.classList.remove('animate__animated');
  el.offsetWidth; // reflow
  el.classList.add('animate__animated', animationName);
  const cleanup = () => {
    if (!keep) el.classList.remove('animate__animated', animationName);
    el.removeEventListener('animationend', cleanup);
  };
  el.addEventListener('animationend', cleanup);
}

// ========================= Step Transition =========================
/* 🎬 Ultra Smooth Step Transition */
/* 🎬 Ultra Smooth Step Transition */
function showStep(step) {
  steps.forEach((el, i) => {
    const isCurrent = i + 1 === step;

    if (isCurrent) {
      el.classList.remove('d-none');
      el.style.opacity = 0;
      el.style.filter = 'blur(10px) brightness(0.8)';
      el.style.transform = 'translateY(30px) scale(0.98)';

      // ورود نرم
      setTimeout(() => {
        el.animate(
          [
            { opacity: 0, filter: 'blur(10px) brightness(0.8)', transform: 'translateY(30px) scale(0.98)' },
            { opacity: 1, filter: 'blur(0) brightness(1)', transform: 'translateY(0) scale(1)' }
          ],
          { duration: 700, easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)' }
        );
        el.style.opacity = 1;
        el.style.filter = 'none';
        el.style.transform = 'none';
      }, 50);
    } else if (!el.classList.contains('d-none')) {
      // خروج نرم
      const anim = el.animate(
        [
          { opacity: 1, filter: 'blur(0)', transform: 'translateY(0) scale(1)' },
          { opacity: 0, filter: 'blur(8px) brightness(0.8)', transform: 'translateY(-25px) scale(0.95)' }
        ],
        { duration: 500, easing: 'ease-in' }
      );
      anim.onfinish = () => el.classList.add('d-none');
    }
  });

  // ✅ progress bar update + glow feedback
  progressBar.style.width = `${(step / totalSteps) * 100}%`;
  progressBar.classList.add('glow-outline');
  setTimeout(() => progressBar.classList.remove('glow-outline'), 800);

  prevBtn.classList.toggle('d-none', step === 1);
  nextBtn.textContent = step === totalSteps ? 'ارسال نهایی' : 'مرحله بعد';
  nextBtn.classList.toggle('btn-neon', step === totalSteps);
}


// ========================= Typing Animation =========================
async function typeText(elId, text, speed = 28) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = '';
  if (!text) return;
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await new Promise((r) => setTimeout(r, speed));
  }
}

// ========================= Utilities =========================
function setButtonsDisabled(val) {
  nextBtn.disabled = val;
  prevBtn.disabled = val;
}

function resetFormAfterDelay() {
  setTimeout(() => {
    currentStep = 1;
    showStep(currentStep);
    document.querySelectorAll('#advisorForm input, #advisorForm textarea').forEach((i) => (i.value = ''));
  }, 8000);
}

// ========================= Main Submit Logic =========================
nextBtn.addEventListener('click', async () => {
  if (nextBtn.disabled) return;

  // Move between steps
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
    return;
  }

  // Final submit payload
  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    studyLevel: document.getElementById('level').value,
    facultyInterest: document.getElementById('faculty').value.trim(),
    goalText: document.getElementById('goal').value.trim(),
    preferredDates: [document.getElementById('date').value || new Date().toISOString()],
  };

  if (!payload.name || !payload.email || !payload.goalText) {
    animateOnce(formBox, 'animate__shakeX', true);
    alert('⚠️ لطفاً فیلدهای ضروری را پر کنید.');
    return;
  }

  // UI Loading state
  aiBox.classList.add('d-none');
  spinnerContainer.classList.remove('d-none');
  animateOnce(spinnerContainer, 'animate__fadeIn');
  setButtonsDisabled(true);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const res = await fetch('/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    spinnerContainer.classList.add('d-none');
    aiBox.classList.remove('d-none');
    animateOnce(aiBox, 'animate__fadeInUp');

    if (data.success && data.booking) {
      await typeText('aiSummary', data.booking.aiSummary || 'تحلیلی موجود نیست.');
      await new Promise((r) => setTimeout(r, 400));
      await typeText('aiRecommend', data.booking.aiRecommendation || '');
      animateOnce(aiBox, 'animate__pulse', true);
    } else {
      document.getElementById('aiSummary').textContent = '❌ تحلیل هوش مصنوعی در دسترس نیست.';
      document.getElementById('aiRecommend').textContent = '';
    }
  } catch (err) {
    console.error('❌ Submit error:', err);
    spinnerContainer.classList.add('d-none');
    aiBox.classList.remove('d-none');
    animateOnce(aiBox, 'animate__fadeInUp');
    document.getElementById('aiSummary').textContent = '❌ خطا در ارتباط با سرور یا پاسخ نامعتبر.';
    document.getElementById('aiRecommend').textContent = 'لطفاً بعداً تلاش کنید.';
  } finally {
    setButtonsDisabled(false);
    resetFormAfterDelay();
  }
});

prevBtn.addEventListener('click', () => {
  if (prevBtn.disabled) return;
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
});
// ============================================================
// 🧠 Pre-fill Locked User Data (from session or localStorage)
// ============================================================
(async function loadUserData() {
  try {
    const res = await fetch('/api/auth/session');
    const data = await res.json();

    let nameField = document.getElementById('name');
    let emailField = document.getElementById('email');

    if (data.loggedIn && data.user) {
      // ✅ داده از session گرفته شد
      const { name, email } = data.user;
      nameField.value = name;
      emailField.value = email;
    } else {
      // 🌀 اگر session خالی بود، از localStorage بخون
      const localName = localStorage.getItem('pendingName') || '';
      const localEmail = localStorage.getItem('pendingEmail') || '';
      nameField.value = localName;
      emailField.value = localEmail;
    }

    // 🔒 قفل کردن فیلدها
    nameField.readOnly = true;
    emailField.readOnly = true;
    nameField.classList.add('opacity-75', 'cursor-not-allowed');
    emailField.classList.add('opacity-75', 'cursor-not-allowed');
  } catch (err) {
    console.warn('⚠️ loadUserData error:', err);
  }
})();


// ========================= Init =========================
showStep(currentStep);
console.log('✨ Form.js (v4 Ultra) initialized successfully');
