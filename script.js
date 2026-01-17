/* ==========================================
   Detect mobile devices (UI behavior only)
========================================== */
const isMobile = window.matchMedia("(max-width: 768px)").matches;

/* ==========================================
   Decode Text Effect (Hero Code)
========================================== */
const decodeChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]<>?/";

let decodeRunning = false;

function decodeText(element, finalText, speed = 30) {
  if (!element || decodeRunning) return;
  decodeRunning = true;

  let iteration = 0;
  element.textContent = "";
  element.classList.add("decode-cursor");

  const interval = setInterval(() => {
    element.textContent = finalText
      .split("")
      .map((char, index) => {
        if (char === "\n") return "\n";
        if (index < iteration) return finalText[index];
        return decodeChars[Math.floor(Math.random() * decodeChars.length)];
      })
      .join("");

    if (iteration >= finalText.length) {
      clearInterval(interval);
      element.textContent = finalText;
      element.classList.remove("decode-cursor");
      decodeRunning = false;
    }

    iteration++;
  }, speed);
}

/* ==========================================
   Hero Flip + Decode Control
========================================== */
let heroPlayed = false;

function playHeroAnimation() {
  if (heroPlayed) return;

  const card = document.querySelector(".hero-code");
  const codeEl = document.getElementById("hero-decode");
  if (!card || !codeEl) return;

  console.log("✅ Hero animation starting");
  heroPlayed = true;

  // Trigger flip at 1800ms
  setTimeout(() => {
    console.log("✅ Adding .is-flipped class");
    card.classList.add("is-flipped");

    // Start decoding 700ms after flip completes
    setTimeout(() => {
      console.log("✅ Starting decode");
      decodeText(
        codeEl,
        `AI Dev Agent - Developer Productivity Loop

[1] Ingest repository and test results
[2] Analyse failures and logs
[3] Build relevant code context
[4] Generate candidate fixes
[5] Rank and explain solutions
[6] Apply changes in isolated branch
[7] Re-run tests
[8] Produce reports and suggestions
`,
        28,
      );
    }, 700);
  }, 1800);
}

function resetHeroAnimation() {
  const card = document.querySelector(".hero-code");
  const codeEl = document.getElementById("hero-decode");
  if (!card || !codeEl) return;

  heroPlayed = false;
  decodeRunning = false;
  card.classList.remove("is-flipped");
  codeEl.textContent = "";
}

/* ==========================================
   Main App Init
========================================== */
function initApp() {
  /* Mobile Menu */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("active");
      });
    });
  }

  /* Dynamic Year */
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Project Card Hover (desktop only) */
  if (!isMobile) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px) scale(1.02)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
      });
    });
  }

  /* Smooth Scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    });
  });

  /* Navbar + Hero Logic */
  const navbar = document.querySelector(".navbar");

  if (!navbar || isMobile) {
    playHeroAnimation();
    return;
  }

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      navbar.style.transform = "translateY(0)";
      navbar.style.boxShadow = "none";

      if (heroPlayed) {
        resetHeroAnimation();
        setTimeout(playHeroAnimation, 300);
      }

      lastScroll = currentScroll;
      return;
    }

    if (currentScroll > lastScroll) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
      navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
    }

    lastScroll = currentScroll;
  });

  /* Initial Hero Trigger */
  playHeroAnimation();
}

/* DOM Ready */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
