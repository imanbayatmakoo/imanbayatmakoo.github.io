/* ============================================================
   Portfolio renderer.
   Content lives in cv.json — this file only turns it into DOM.
   You should rarely need to touch this file.
   ============================================================ */

/** Escape user data before inserting into HTML. */
function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* ---------- Section renderers ---------- */

function renderHero(cv) {
  const b = cv.basics;
  const tags = (b.skillTags || [])
    .map((t) => `<span class="chip">${esc(t)}</span>`)
    .join("");
  const summary = (b.summary || []).map((p) => `<p>${esc(p)}</p>`).join("");
  const photo = b.photo
    ? `<img class="hero-photo" src="${esc(b.photo)}" alt="Portrait of ${esc(b.name)}"
         onerror="this.style.display='none'">`
    : "";

  document.getElementById("hero").innerHTML = `
    <div class="hero-grid">
      <div>
        <p class="hero-kicker">// portfolio &amp; resume</p>
        <h1 class="hero-headline">
          ${esc(b.name)}<br>
          <span class="co">${esc(b.headline)}${b.company ? " · " + esc(b.company) : ""}</span>
        </h1>
        <p class="hero-tagline">${esc(b.tagline)}</p>
        <div class="hero-summary">${summary}</div>
        <div class="tag-row">${tags}</div>
        <div class="cta-row">
          <a class="btn primary" href="#resume">View resume</a>
          <a class="btn" href="#projects">See my work</a>
          ${b.resumePdf ? `<a class="btn" href="${esc(b.resumePdf)}" download>Download PDF</a>` : ""}
        </div>
      </div>
      ${photo}
    </div>`;
}

function renderMetricsLadder(metrics) {
  if (!metrics || metrics.length === 0) return "";
  const rows = metrics
    .map((m) => {
      const dir = m.direction === "down" ? "down" : "up";
      const arrow = dir === "down" ? "▼" : "▲";
      return `
        <div class="ladder-row">
          <span class="ladder-label">${esc(m.label)}</span>
          <span class="ladder-move">${esc(m.before)} → ${esc(m.after)}</span>
          <span class="ladder-delta ${dir}">${arrow}</span>
        </div>`;
    })
    .join("");
  return `<div class="ladder"><div class="ladder-title">Key metrics</div>${rows}</div>`;
}

function renderResume(cv) {
  const roles = (cv.experience || [])
    .map(
      (r) => `
      <article class="role">
        <div class="role-when">
          <div class="role-company">${esc(r.company)}</div>
          ${esc(r.start)} – ${esc(r.end)}<br>${esc(r.location || "")}
        </div>
        <div>
          <h3>${esc(r.title)}</h3>
          <ul>${(r.bullets || []).map((li) => `<li>${esc(li)}</li>`).join("")}</ul>
          ${renderMetricsLadder(r.metrics)}
        </div>
      </article>`
    )
    .join("");

  const edu = (cv.education || [])
    .map(
      (e) =>
        `<li>${esc(e.degree)}<span class="sub">${esc(e.school)} · ${esc(e.years)}</span></li>`
    )
    .join("");

  const certs = (cv.certifications || [])
    .map(
      (c) =>
        `<li>${esc(c.name)}<span class="sub">${esc(c.issuer)} · ${esc(c.date)}</span></li>`
    )
    .join("");

  const tools = (cv.tools || []).map((t) => `<li>${esc(t)}</li>`).join("");

  const langs = (cv.languages || [])
    .map((l) => `<li>${esc(l.name)}<span class="sub">${esc(l.level)}</span></li>`)
    .join("");

  document.getElementById("resume").innerHTML = `
    <p class="eyebrow">01 / Resume</p>
    <h2>Professional experience</h2>
    ${roles}
    <div class="cred-grid">
      <div><h3>Education</h3><ul>${edu}</ul></div>
      ${certs ? `<div><h3>Certifications</h3><ul>${certs}</ul></div>` : ""}
      <div><h3>Tools</h3><ul>${tools}</ul></div>
      <div><h3>Languages</h3><ul>${langs}</ul></div>
    </div>`;
}

function renderProjects(cv) {
  const { groups = [], items = [] } = cv.projects || {};
  const el = document.getElementById("projects");

  const card = (p) => `
    <div class="proj-card" data-group="${esc(p.group)}">
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.blurb)}</p>
      <div class="tag-row">${(p.tags || [])
        .map((t) => `<span class="chip">${esc(t)}</span>`)
        .join("")}</div>
    </div>`;

  el.innerHTML = `
    <p class="eyebrow">02 / Projects</p>
    <h2>Selected work</h2>
    <div class="proj-tabs">
      <button class="proj-tab active" data-group="All">All</button>
      ${groups
        .map((g) => `<button class="proj-tab" data-group="${esc(g)}">${esc(g)}</button>`)
        .join("")}
    </div>
    <div class="proj-grid">${items.map(card).join("")}</div>`;

  el.querySelectorAll(".proj-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      el.querySelectorAll(".proj-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const g = tab.dataset.group;
      el.querySelectorAll(".proj-card").forEach((c) => {
        c.style.display = g === "All" || c.dataset.group === g ? "" : "none";
      });
    });
  });
}

function renderContact(cv) {
  const c = cv.basics.contact || {};
  const link = (href, label) =>
    href ? `<a class="btn" href="${esc(href)}">${esc(label)}</a>` : "";

  document.getElementById("contact").innerHTML = `
    <p class="eyebrow">03 / Contact</p>
    <h2>Get in touch</h2>
    <p>${esc(cv.basics.availability || "")}</p>
    <div class="contact-links">
      ${link(c.email ? "mailto:" + c.email : "", c.email)}
      ${link(c.linkedin, "LinkedIn")}
      ${link(c.github, "GitHub")}
      ${link(c.telegram, "Telegram")}
    </div>`;
}

/* ---------- Chrome: nav, theme, print, footer ---------- */

function renderChrome(cv) {
  document.title = cv.meta?.siteTitle || cv.basics.name;
  document.getElementById("nav-brand").textContent = cv.basics.name;
  document.getElementById("footer-line").textContent =
    `${cv.basics.name} · rendered from cv.json · last visited ${new Date().toLocaleDateString()}`;

  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  document.getElementById("theme-toggle").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", root.dataset.theme);
  });

  document.getElementById("print-btn").addEventListener("click", () => window.print());
}

/* ---------- Scrollspy: keep URL hash + nav highlight in sync ---------- */

function initScrollspy() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        // Rewrite the hash without adding history entries or re-scrolling.
        history.replaceState(null, "", "#" + id);
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + id)
        );
      });
    },
    // Section counts as "current" when it crosses the upper-middle of the viewport.
    { rootMargin: "-30% 0px -60% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---------- Boot ---------- */

async function boot() {
  try {
    const res = await fetch("cv.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`cv.json returned ${res.status}`);
    const cv = await res.json();
    renderChrome(cv);
    renderHero(cv);
    renderResume(cv);
    renderProjects(cv);
    renderContact(cv);
    initScrollspy();
  } catch (err) {
    document.getElementById("app").innerHTML =
      `<section class="section"><h2>Couldn't load cv.json</h2>
       <p>${esc(err.message)}. If you opened index.html directly from disk,
       serve the folder instead: <code>python3 -m http.server</code>
       then open <code>http://localhost:8000</code>.</p></section>`;
  }
}

boot();
