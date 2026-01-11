// Loads navbar/footer into pages and wires basic behavior.
// Works when served by your Python backend on Render (recommended).

async function loadPartial(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  el.innerHTML = await res.text();
}

function wireMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("nav__links--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

async function loadFooterLinksFromProfile() {
  // Optional: If backend is running, we auto-fill footer links from /api/profile.
  // If backend is not running, footer still renders fine.
  try {
    const res = await fetch("/api/profile", { cache: "no-cache" });
    if (!res.ok) return;
    const data = await res.json();

    const linkedin = data?.links?.linkedin || "#";
    const github = data?.links?.github || "#";
    const email = data?.links?.email || "#";

    const a1 = document.getElementById("footerLinkedIn");
    const a2 = document.getElementById("footerGitHub");
    const a3 = document.getElementById("footerEmail");

    if (a1) a1.href = linkedin;
    if (a2) a2.href = github;
    if (a3) a3.href = email;
  } catch {
    // ignore
  }
}

function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

function setActiveNavLink() {
  const path = (location.pathname || "").toLowerCase();

  // Map URL -> data-nav key
  const map = [
    { key: "summary", match: "/pages/summary.html" },
    { key: "about", match: "/pages/about.html" },
    { key: "projects", match: "/pages/projects.html" },
    { key: "experience", match: "/pages/experience.html" },
    { key: "skills", match: "/pages/skills.html" },
    { key: "certifications", match: "/pages/certifications.html" },
    { key: "achievements", match: "/pages/achievements.html" },
    { key: "contact", match: "/pages/contact.html" },
  ];

  // Home page
  if (path.endsWith("/") || path.endsWith("/index.html")) {
    document.querySelectorAll("[data-nav]").forEach(a => a.classList.remove("is-active"));
    return;
  }

  const found = map.find(m => path.endsWith(m.match));
  if (!found) return;

  document.querySelectorAll("[data-nav]").forEach(a => {
    a.classList.toggle("is-active", a.dataset.nav === found.key);
  });
}


export async function initLayout() {
  // IMPORTANT: paths differ for index.html vs pages/*.html
  const isHome = location.pathname.endsWith("/") || location.pathname.endsWith("/index.html");
  const base = isHome ? "./partials" : "../partials";

  await loadPartial("#siteNav", `${base}/navbar.html`);
  await loadPartial("#siteFooter", `${base}/footer.html`);

  setActiveNavLink();
  wireMobileNav();
  setYear();
  await loadFooterLinksFromProfile();

  // Always start home page from top (ignore hash on refresh)
if (location.pathname.endsWith("/") || location.pathname.endsWith("/index.html")) {
  window.history.replaceState(null, "", location.pathname);
  window.scrollTo({ hero: 0, behavior: "instant" });
}

}
