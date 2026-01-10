import { getProfile, getSummary, getProjects, getExperience, getSkills, getCertifications, getAchievements, getVolunteer} from "./api.js";

// ---------- HOME PAGE SUMMARY ----------
async function loadHomeSummary() {
  const headlineEl = document.getElementById("summaryHeadline");
  const pointsEl = document.getElementById("summaryPoints");
  if (!headlineEl || !pointsEl) return;

  try {
    const data = await getSummary();
    headlineEl.textContent = data.headline || "";
    pointsEl.innerHTML = "";
    (data.points || []).forEach(point => {
      const li = document.createElement("li");
      li.textContent = point;
      pointsEl.appendChild(li);
    });
  } catch {
    headlineEl.textContent = "Unable to load summary right now.";
    pointsEl.innerHTML = "";
  }
}

// ---------- PROJECTS PAGE ----------
function makeLink(label, href) {
  if (!href) return "";
  return `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
}

async function loadProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  const filterWrap = document.getElementById("projectFilters");
  let activeFilter = filterWrap ? "all" : "all"; // ✅ if no buttons, show all

  function applyFilter() {
  const cards = grid.querySelectorAll("[data-category]");
  cards.forEach(card => {
    const cat = (card.getAttribute("data-category") || "").toLowerCase();
    const show = (activeFilter === "all") || (cat === activeFilter);
    card.style.display = show ? "" : "none";
  });
}


  function wireFilters() {
    if (!filterWrap) return;

    // Set default button active (Data Science)
    filterWrap.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.filter === activeFilter);

      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.filter;

        filterWrap.querySelectorAll(".filter-btn").forEach(b =>
          b.classList.toggle("is-active", b.dataset.filter === activeFilter)
        );

        applyFilter();
      });
    });
  }

  try {
    const items = await getProjects();

    grid.innerHTML = items.map(p => `
      <article class="card project-card" data-category="${p.category || ""}">
        <h3>${p.name || ""}</h3>
        <p class="project-stack">${p.stack || ""}</p>
        <p class="muted">${p.summary || ""}</p>
        <div class="project-links">
          ${makeLink("Demo", p?.links?.demo)}
          ${makeLink("Code", p?.links?.code)}
          ${makeLink("Case Study", p?.links?.caseStudy)}
        </div>
      </article>
    `).join("");

    wireFilters();
    applyFilter(); // ✅ apply default filter after render
  } catch {
    grid.innerHTML = `<div class="card">Unable to load projects right now.</div>`;
  }
}


// ---------- EXPERIENCE PAGE ----------
function esc(s) {
  return String(s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function loadExperience() {
  const list = document.getElementById("experienceList");
  if (!list) return;

  try {
    const items = await getExperience();
    list.innerHTML = items.map(x => `
      <article class="timeline-item">
        <div class="timeline-dot"></div>
        <div>
          <div class="timeline-title">
            <h3>${esc(x.role)}</h3>
            <span class="muted">•</span>
            <span class="muted">${esc(x.company)}</span>
          </div>
          <div class="timeline-meta">
            ${esc(x.location)} • ${esc(x.start)} – ${esc(x.end)}
          </div>
          <ul>
            ${(x.highlights || []).map(h => `<li>${esc(h)}</li>`).join("")}
          </ul>
        </div>
      </article>
    `).join("");
  } catch {
    list.innerHTML = `<div class="card">Unable to load experience right now.</div>`;
  }
}

async function loadSkills() {
  const wrap = document.getElementById("skillsWrap");
  if (!wrap) return;

  try {
    const data = await getSkills();
    const cats = data.categories || [];

    wrap.innerHTML = cats.map(c => `
      <section class="card skill-group">
        <h2>${c.name || ""}</h2>
        <div class="chips">
          ${(c.items || []).map(item => `<span class="chip">${item}</span>`).join("")}
        </div>
      </section>
    `).join("");
  } catch {
    wrap.innerHTML = `<div class="card">Unable to load skills right now.</div>`;
  }
}

async function loadCertifications() {
  const list = document.getElementById("certList");
  if (!list) return;

  try {
    const items = await getCertifications();
    list.innerHTML = items.map(c => `
      <article class="card cert-item">
        <div class="cert-title">
          <h3>${c.name || ""}</h3>
          ${c.date ? `<span class="badge">${c.date}</span>` : ""}
        </div>
        <div class="muted">${c.issuer || ""}</div>
        <div class="cert-link">
          ${c.credentialUrl ? `<a href="${c.credentialUrl}" target="_blank" rel="noopener">View Credential</a>` : `<span class="muted">Credential link: (add later)</span>`}
        </div>
      </article>
    `).join("");
  } catch {
    list.innerHTML = `<div class="card">Unable to load certifications right now.</div>`;
  }
}

async function loadAbout() {
  const headlineEl = document.getElementById("aboutHeadline");
  const paragraphsEl = document.getElementById("aboutParagraphs");
  const focusEl = document.getElementById("aboutFocus");
  const eduEl = document.getElementById("aboutEducation");
  console.log("About page detected:", !!document.getElementById("aboutHeadline"));

  // Not on About page
  if (!headlineEl || !paragraphsEl || !focusEl || !eduEl) return;

  try {
    const profile = await getProfile();
    const about = profile.about || {};

    headlineEl.textContent = about.headline || "";

    // paragraphs
    const paras = about.paragraphs || [];
    paragraphsEl.innerHTML = paras.map(t => `<p>${t}</p>`).join("");

    // focus chips
    const focus = about.focusAreas || [];
    focusEl.innerHTML = focus.map(x => `<span class="chip">${x}</span>`).join("");

    // education
    const edu = about.education || [];
    eduEl.innerHTML = edu.length
      ? edu.map(e => `
          <div style="margin-bottom:10px;">
            <div><strong>${e.degree || ""}</strong></div>
            <div class="muted">${e.school || ""}${e.note ? " • " + e.note : ""}</div>
          </div>
        `).join("")
      : `<div class="muted">Add education details in profile.json</div>`;

    // quick links
    const a1 = document.getElementById("aboutLinkedIn");
    const a2 = document.getElementById("aboutGitHub");
    const a3 = document.getElementById("aboutEmail");
    if (a1) a1.href = profile?.links?.linkedin || "#";
    if (a2) a2.href = profile?.links?.github || "#";
    if (a3) a3.href = profile?.links?.email || "#";
  } catch {
    headlineEl.textContent = "Unable to load About content right now.";
    paragraphsEl.innerHTML = "";
    focusEl.innerHTML = "";
    eduEl.innerHTML = "";
  }
}

async function loadAchievements() {
  const list = document.getElementById("achievementsList");
  if (!list) return;

  try {
    const items = await getAchievements();
    list.innerHTML = items.map(a => `
      <article class="timeline-item">
        <div class="timeline-dot"></div>
        <div>
          <div class="timeline-title">
            <h3>${esc(a.title)}</h3>
            ${a.issuer ? `<span class="muted">• ${esc(a.issuer)}</span>` : ""}
          </div>
          ${a.date ? `<div class="timeline-meta">${esc(a.date)}</div>` : ""}
          <ul>
            ${(a.details || []).map(d => `<li>${esc(d)}</li>`).join("")}
          </ul>
        </div>
      </article>
    `).join("");
  } catch {
    list.innerHTML = `<div class="card">Unable to load achievements right now.</div>`;
  }
}


async function loadVolunteer() {
  const list = document.getElementById("volunteerList");
  if (!list) return;

  try {
    const items = await getVolunteer();
    list.innerHTML = items.map(v => `
      <article class="timeline-item">
        <div class="timeline-dot"></div>
        <div>
          <div class="timeline-title">
            <h3>${esc(v.role)}</h3>
            <span class="muted">•</span>
            <span class="muted">${esc(v.organization)}</span>
          </div>
          <div class="timeline-meta">
            ${esc(v.location)} • ${esc(v.duration)}
          </div>
          <ul>
            ${(v.details || []).map(d => `<li>${esc(d)}</li>`).join("")}
          </ul>
        </div>
      </article>
    `).join("");
  } catch {
    list.innerHTML = `<div class="card">Unable to load volunteer work right now.</div>`;
  }
}




// Run page logic safely
loadHomeSummary();
loadProjects();
loadExperience();
loadSkills();
loadCertifications();
loadAbout();
loadAchievements();
loadVolunteer();


