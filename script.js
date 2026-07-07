/* ============================================================
   MOHIT SOLANKI · CREATIVE PORTFOLIO
   script.js — High-Retention Interactions & Animations
   ============================================================ */

"use strict";

// ── WEB3FORMS CONFIGURATION ───────────────────────────────────
// Replace "YOUR_ACCESS_KEY_HERE" with your Web3Forms access key
const WEB3FORMS_ACCESS_KEY = "20121088-1a90-456a-aadd-68e7110fa652";

document.addEventListener("DOMContentLoaded", () => {
  initHeroStagger();
  initScrollProgress();
  initScrollReveal();
  initNavbarScroll();
  initActiveNavHighlight();
  initScrollTop();
  initContactForm();
});

// ── HERO TEXT STAGGERED ENTRANCE ──────────────────────────────
function initHeroStagger() {
  const heroTitle = document.querySelector(".hero-title");
  const heroFades = document.querySelectorAll(".reveal-fade-up");

  if (heroTitle) {
    const letters = heroTitle.querySelectorAll(".letter");
    letters.forEach((letter, index) => {
      // Apply transition delay based on letter index (50ms intervals)
      letter.style.transitionDelay = `${index * 40}ms`;
    });

    // Activate staggered letters
    requestAnimationFrame(() => {
      heroTitle.classList.add("active");
    });
  }

  // Activate other hero elements shortly after
  setTimeout(() => {
    heroFades.forEach(el => el.classList.add("active"));
  }, 400);
}

// ── SCROLL PROGRESS BAR ───────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

// ── SCROLL REVEALS ENGINE & STAT COUNTERS ────────────────────
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute("data-target"));
    const suffix = el.getAttribute("data-suffix") || "";
    let count = 0;
    const duration = 1500; // 1.5 seconds duration
    const startTime = performance.now();

    const updateValue = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quadratic ease-out formula
      const ease = progress * (2 - progress);
      count = Math.floor(ease * target);
      el.textContent = count + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(updateValue);
  };

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // Add custom transition delay if specified
        if (el.hasAttribute("data-delay")) {
          el.style.transitionDelay = `${el.getAttribute("data-delay")}ms`;
        }

        el.classList.add("active");

        // 1. If it contains skill progress bars, animate their widths
        const progressFills = el.querySelectorAll(".skill-progress-fill");
        progressFills.forEach(fill => {
          const targetWidth = fill.getAttribute("data-width");
          fill.style.width = `${targetWidth}%`;
        });

        // 2. If it contains stats, trigger count-up numbers
        const stats = el.querySelectorAll(".stat-number");
        stats.forEach(stat => {
          if (!stat.classList.contains("counted")) {
            stat.classList.add("counted");
            countUp(stat);
          }
        });

        // Clean up observation once animated
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

// ── NAVBAR SCROLL BLUR CLASS ──────────────────────────────────
function initNavbarScroll() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }, { passive: true });
}

// ── ACTIVE NAVIGATION SECTION HIGHLIGHTER ─────────────────────
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section, header");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link:not(.nav-cta)");

  const highlightOptions = {
    root: null,
    rootMargin: "-25% 0px -65% 0px", // Trigger when section occupies the mid-viewport
    threshold: 0
  };

  const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute("id");

        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, highlightOptions);

  sections.forEach(section => highlightObserver.observe(section));
}

// ── SCROLL TO TOP COMPONENT ───────────────────────────────────
function initScrollTop() {
  const btn = document.getElementById("scrollTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// ── CONTACT FORM HANDLING & LOAD MICRO-INTERACTION ─────────────
function initContactForm() {
  const form = document.getElementById("portfolioContactForm");
  const btn = document.getElementById("formSubmitBtn");
  const toast = document.getElementById("toastNotification");

  if (!form || !btn) return;

  const btnText = btn.querySelector(".btn-text");
  const btnSpinner = btn.querySelector(".btn-spinner");
  const btnSuccess = btn.querySelector(".btn-success-state");

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Validate Access Key Configuration
    if (WEB3FORMS_ACCESS_KEY === "20121088-1a90-456a-aadd-68e7110fa652" || !WEB3FORMS_ACCESS_KEY.trim()) {
      showToast("⚠️ Web3Forms Access Key is not configured yet! Please update script.js.");
      return;
    }

    // 2. Enter Loading State
    btn.disabled = true;
    btnText.classList.add("d-none");
    btnSpinner.classList.remove("d-none");

    // Prepare Form Data for Web3Forms API
    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "New Portfolio Message");
    formData.append("from_name", "Mohit Solanki Portfolio");

    // Convert FormData to JSON
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Helper to reset button state on error
    const resetButtonState = () => {
      btnSpinner.classList.add("d-none");
      btnText.classList.remove("d-none");
      btn.disabled = false;
    };

    // 3. Post data to Web3Forms API
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: json
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 200 || result.success) {
          // 4. Transition into Success State
          btnSpinner.classList.add("d-none");
          btnSuccess.classList.remove("d-none");
          btn.style.background = "var(--accent)";

          showToast("🚀 Message dispatched successfully! Mohit will review soon.");
          form.reset();

          // 5. Reset Button States after 3 seconds
          setTimeout(() => {
            btnSuccess.classList.add("d-none");
            btnText.classList.remove("d-none");
            btn.disabled = false;
            btn.style.background = ""; // Restores CSS default gradient
          }, 3000);
        } else {
          // Handle Web3Forms specific API error
          console.error("Web3Forms Submission Error:", result);
          showToast(`❌ Send failed: ${result.message || "Please check your configuration."}`);
          resetButtonState();
        }
      })
      .catch((error) => {
        // Handle fetch network level error
        console.error("Web3Forms Network Error:", error);
        showToast("❌ Network error. Please verify your connection.");
        resetButtonState();
      });
  });
}