const themeButton = document.getElementById("dark-mode-icon");
const menuButton = document.getElementById("burger-menu");
const navigation = document.getElementById("primary-navigation");
const languageLinks = document.querySelectorAll(".language-link");
const themeColor = document.querySelector('meta[name="theme-color"]');
const urlTheme = new URLSearchParams(window.location.search).get("theme");
const desktopQuery = window.matchMedia("(min-width: 961px)");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let savedTheme = null;
try { savedTheme = localStorage.getItem("portfolio-theme"); } catch { /* Storage is optional. */ }

function updateLanguageLinks(theme) {
  languageLinks.forEach((link) => {
    const destination = new URL(link.getAttribute("href"), window.location.href);
    destination.searchParams.set("theme", theme);
    destination.hash = window.location.hash;
    link.href = `${destination.pathname}${destination.search}${destination.hash}`;
  });
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  themeButton?.setAttribute("aria-pressed", String(isDark));
  themeButton?.setAttribute("aria-label", isDark ? themeButton.dataset.lightLabel : themeButton.dataset.darkLabel);
  themeColor?.setAttribute("content", isDark ? "#101724" : "#f5f7fb");
  updateLanguageLinks(theme);
}

const initialTheme = ["light", "dark"].includes(urlTheme)
  ? urlTheme : ["light", "dark"].includes(savedTheme)
    ? savedTheme : systemTheme.matches ? "dark" : "light";
applyTheme(initialTheme);

themeButton?.addEventListener("click", () => {
  const theme = document.body.classList.contains("dark-theme") ? "light" : "dark";
  applyTheme(theme);
  const currentUrl = new URL(window.location.href);
  if (currentUrl.searchParams.has("theme")) {
    currentUrl.searchParams.set("theme", theme);
    window.history.replaceState(null, "", currentUrl);
  }
  try { localStorage.setItem("portfolio-theme", theme); } catch { /* Storage is optional. */ }
});
languageLinks.forEach((link) => link.addEventListener("click", () => {
  updateLanguageLinks(document.body.classList.contains("dark-theme") ? "dark" : "light");
}));

function closeMenu() {
  navigation?.classList.remove("show");
  menuButton?.setAttribute("aria-expanded", "false");
}
menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") !== "true";
  navigation?.classList.toggle("show", expanded);
  menuButton.setAttribute("aria-expanded", String(expanded));
});
document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => { if (!event.target.closest(".site-nav")) closeMenu(); });
desktopQuery.addEventListener("change", (event) => { if (event.matches) closeMenu(); });

// Preview is mounted outside cards so it cannot be clipped by their layout or motion.
const preview = document.getElementById("certification-preview");
const previewTitle = document.getElementById("preview-title");
const previewMedia = preview?.querySelector(".preview-media");
const previewLink = preview?.querySelector(".preview-link");
const previewClose = preview?.querySelector(".preview-close");
const previewFrames = new Map();
let activeTrigger = null;
let openTimer;
let closeTimer;
let suppressFocus = false;

function positionPreview(trigger) {
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(410, document.documentElement.clientWidth - 32);
  preview.style.width = `${width}px`;
  const height = preview.getBoundingClientRect().height;
  const viewportWidth = document.documentElement.clientWidth;
  const minTop = Math.min(96, Math.max(16, window.innerHeight - height - 16));
  let left;
  let top;
  if (rect.right + width + 12 <= viewportWidth - 16) {
    left = rect.right + 12;
    top = rect.top + (rect.height - height) / 2;
  } else if (rect.left - width - 12 >= 16) {
    left = rect.left - width - 12;
    top = rect.top + (rect.height - height) / 2;
  } else {
    left = Math.max(16, Math.min(rect.left, viewportWidth - width - 16));
    top = rect.bottom + 10;
    if (top + height > window.innerHeight - 16) {
      top = rect.top - height - 10 >= minTop
        ? rect.top - height - 10 : (window.innerHeight - height) / 2;
    }
  }
  top = Math.max(minTop, Math.min(top, window.innerHeight - height - 16));
  preview.style.left = `${left}px`;
  preview.style.top = `${top}px`;
}

function openPreview(trigger) {
  if (!preview || !previewMedia || !previewLink) return;
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  activeTrigger?.setAttribute("aria-expanded", "false");
  activeTrigger = trigger;
  previewTitle.textContent = trigger.dataset.certTitle;
  previewLink.href = trigger.dataset.postUrl;
  let frame = previewFrames.get(trigger.dataset.embedUrl);
  if (!frame) {
    frame = document.createElement("iframe");
    frame.src = trigger.dataset.embedUrl;
    frame.title = `${trigger.dataset.certTitle} — LinkedIn`;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    previewFrames.set(trigger.dataset.embedUrl, frame);
  }
  if (previewMedia.firstElementChild !== frame) previewMedia.replaceChildren(frame);
  preview.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  positionPreview(trigger);
}

function closePreview(returnFocus = false) {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  const previous = activeTrigger;
  activeTrigger?.setAttribute("aria-expanded", "false");
  activeTrigger = null;
  if (preview) preview.hidden = true;
  if (returnFocus && previous) {
    suppressFocus = true;
    previous.focus({ preventScroll: true });
    queueMicrotask(() => { suppressFocus = false; });
  }
}

function scheduleClose() {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    if (!preview?.contains(document.activeElement) && document.activeElement !== activeTrigger) closePreview();
  }, 220);
}

document.querySelectorAll(".certification-trigger").forEach((trigger) => {
  trigger.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch") return;
    clearTimeout(closeTimer);
    openTimer = setTimeout(() => openPreview(trigger), 150);
  });
  trigger.addEventListener("pointerleave", scheduleClose);
  trigger.addEventListener("focus", () => { if (!suppressFocus) openPreview(trigger); });
  trigger.addEventListener("blur", scheduleClose);
  trigger.addEventListener("click", () => openPreview(trigger));
});
preview?.addEventListener("pointerenter", () => { clearTimeout(closeTimer); });
preview?.addEventListener("pointerleave", scheduleClose);
preview?.addEventListener("focusout", scheduleClose);
previewClose?.addEventListener("click", () => closePreview(true));
document.addEventListener("click", (event) => {
  if (!event.target.closest(".certification-trigger") && !preview?.contains(event.target)) closePreview();
});
window.addEventListener("resize", () => closePreview());
window.addEventListener("scroll", () => {
  if (!activeTrigger) return;
  const rect = activeTrigger.getBoundingClientRect();
  if (rect.bottom < 84 || rect.top > window.innerHeight) closePreview();
  else positionPreview(activeTrigger);
}, { passive: true });
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (activeTrigger) closePreview(true);
  if (menuButton?.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});

// Reveal content once as it enters the viewport; keep it visible without JS or motion.
const revealItems = document.querySelectorAll(
  ".content-section__title, .about-copy p, .experience-card, .skill-card, .certification-card, .academy-badge, .education-card, .content-section__subtitle, .contact-heading, .footer-content, .footer-note"
);
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("is-pending");
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => {
    item.classList.add("reveal", "is-pending");
    observer.observe(item);
  });
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      observer.disconnect();
      revealItems.forEach((item) => item.classList.remove("is-pending"));
    }
  });
}
const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
