"use strict";

/**
 * main.js
 * - Footer year
 * - Typewriter intro + skip-on-pointerdown
 * - Reveal socials + sections
 * - Horizontal wheel scroll for the project rail
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     Footer year
     --------------------------- */
  const yearEl = document.getElementById("y");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------
     Mark as ready (prevents first-load flashing)
     --------------------------- */
  document.documentElement.classList.add("is-ready");

  /* ---------------------------
     Typewriter config
     --------------------------- */
  const yourText = "Kris";
  const nameText = "Pearcey";
  const headlineText = "Front-End Development & Design";

  let skipAnimations = false;
  let introDone = false;

  const yourEl = document.getElementById("type-your");
  const nameEl = document.getElementById("type-name");
  const headlineEl = document.getElementById("type-headline");
  const socialsEl = document.querySelector(".socials");
  const revealEls = document.querySelectorAll(".reveal-with-socials");

  const sleep = (ms) =>
    skipAnimations ? Promise.resolve() : new Promise((r) => setTimeout(r, ms));

  function appendCharSpan(el, ch) {
    const s = document.createElement("span");
    s.className = "char";

    if (ch === " ") {
      s.classList.add("char--space");
      s.textContent = " "; // real space (allows wrapping)
    } else {
      s.textContent = ch;
    }

    el.appendChild(s);
  }

  function renderAsCharSpans(el, text) {
    if (!el) return;
    el.textContent = "";
    for (const ch of text) appendCharSpan(el, ch);
  }

  function typeText(el, text, baseSpeed = 18) {
    return new Promise((resolve) => {
      if (!el) return resolve();

      // If already skipped, render instantly (with identical spacing)
      if (skipAnimations) {
        renderAsCharSpans(el, text);
        return resolve();
      }

      el.classList.add("typing");

      let i = 0;
      let wordLen = 0;

      function delayForChar(ch) {
        let delay = baseSpeed + Math.random() * 14;

        const wordMod = Math.max(-6, Math.min(6, 3 - wordLen * 0.35));
        delay += wordMod;

        if (ch === " ") delay += 40 + Math.random() * 30;

        if (ch === ",") delay += 220;
        if (ch === ";") delay += 260;
        if (ch === ":") delay += 240;

        if (ch === ".") delay += 420;
        if (ch === "!") delay += 420;
        if (ch === "?") delay += 460;

        if (ch === "—" || ch === "-") delay += 60;
        if (ch === "\n") delay += 260;

        return Math.max(8, delay);
      }

      function tick() {
        // If user clicked skip mid-typing, finish instantly (with identical spacing)
        if (skipAnimations) {
          el.classList.remove("typing");
          renderAsCharSpans(el, text);
          return resolve();
        }

        if (i >= text.length) {
          el.classList.remove("typing");
          return resolve();
        }

        const ch = text.charAt(i++);
        appendCharSpan(el, ch);

        if (ch === " " || ch === "\n" || /[.,!?;:—-]/.test(ch)) wordLen = 0;
        else wordLen++;

        setTimeout(tick, delayForChar(ch));
      }

      tick();
    });
  }

  function showEverythingFinal() {
    renderAsCharSpans(yourEl, yourText);
    renderAsCharSpans(nameEl, nameText);

    // Keep headline consistent with your original final behavior:
    // when skipped/finished, it becomes plain text (not per-letter spans).
    if (headlineEl) headlineEl.textContent = headlineText;

    if (socialsEl) socialsEl.classList.add("show");
    revealEls.forEach((el) => el.classList.add("show"));
  }

  async function startTyping() {
    // If user already clicked, just render final state and bail
    if (skipAnimations) {
      showEverythingFinal();
      introDone = true;
      return;
    }

    // Reset
    if (yourEl) yourEl.textContent = "";
    if (nameEl) nameEl.textContent = "";
    if (headlineEl) headlineEl.textContent = "";

    introDone = false;

    if (socialsEl) socialsEl.classList.remove("show");
    revealEls.forEach((el) => el.classList.remove("show"));

    await typeText(yourEl, yourText, 60);
    await sleep(200);

    await typeText(nameEl, nameText, 60);
    await sleep(320);

    // HEADLINE + SOCIALS + SECTIONS all start together
    if (socialsEl) socialsEl.classList.add("show");
    revealEls.forEach((el) => el.classList.add("show"));

    if (headlineEl) headlineEl.textContent = "";
    await typeText(headlineEl, headlineText, 20);
    await sleep(200);

    // Ensure final state if skip happened at the end
    if (skipAnimations) {
      showEverythingFinal();
      introDone = true;
      return;
    }

    introDone = true;
  }

  // Skip handler (one-time)
  window.addEventListener(
    "pointerdown",
    () => {
      if (introDone) return;
      skipAnimations = true;
      showEverythingFinal();
      introDone = true;
    },
    { once: true }
  );

  // Start typewriter
  startTyping();

  /* ---------------------------
     Project rail wheel scrolling
     --------------------------- */
  const rail = document.querySelector(".rail");
  if (!rail) return;

  // Tune these (same as your original)
  const GAP = 26;                    // your .rail gap
  const THRESHOLD = 70;              // lower = more sensitive, higher = less
  const MAX_STEPS_PER_GESTURE = 6;   // cap to avoid flying too far
  const COOLDOWN_MS = 220;           // blocks rapid re-triggers

  let accum = 0;
  let locked = false;
  let cooldownTimer = null;

  function getStepSize() {
    const firstCard = rail.querySelector(".card");
    const cardW = firstCard ? firstCard.getBoundingClientRect().width : 280;
    return cardW + GAP;
  }

  rail.addEventListener(
    "wheel",
    (e) => {
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      if (maxScrollLeft <= 0) return;

      if (e.shiftKey) return;

      // Only hijack when pointer is over the rail (or its children)
      if (!e.target.closest(".rail")) return;

      e.preventDefault();

      // Use the dominant axis (trackpads can provide deltaX too)
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      // If currently animating, keep accumulating but don't fire yet
      accum += delta;

      // Start/reset cooldown so a gesture can "build up"
      if (cooldownTimer) clearTimeout(cooldownTimer);
      cooldownTimer = setTimeout(() => {
        accum = 0;
      }, 300);

      if (locked) return;

      const abs = Math.abs(accum);
      if (abs < THRESHOLD) return;

      const dir = accum > 0 ? 1 : -1;

      // Convert accumulated delta into steps/cards
      let steps = Math.floor(abs / THRESHOLD);
      steps = Math.max(1, Math.min(MAX_STEPS_PER_GESTURE, steps));

      // Consume what we used (leave remainder so continuous scrolling feels natural)
      accum = (abs - steps * THRESHOLD) * dir;

      locked = true;

      rail.scrollBy({
        left: dir * steps * getStepSize(),
        behavior: "smooth",
      });

      setTimeout(() => {
        locked = false;
      }, COOLDOWN_MS);
    },
    { passive: false }
  );
});
