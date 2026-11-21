/*
  app.js - the "brain" of the site.

  It connects the data (data.js), saving (storage.js) and HTML building (render.js):
    1. Navigation between views (the URL hash, e.g. #research, decides the view)
    2. Search and filters
    3. Bookmark buttons
    4. Dashboard numbers and "Recently added"
*/

const VIEW_NAMES = ["dashboard", "organisations", "research", "policy", "events", "bookmarks", "about", "search"];

// Which URL parameter controls which form field. This makes filtered views shareable:
// e.g. index.html#research?topic=Compute%20governance
const VIEW_CONTROLS = {
  organisations: { q: "org-search", area: "org-category" },
  research: { q: "pub-search", topic: "pub-topic", verification: "pub-verification", sort: "pub-sort" },
  policy: { q: "pol-search", region: "pol-region" },
  events: { q: "evt-search" },
};

let policyLayout = "table"; // "table" or "timeline"
let currentView = "dashboard";
let searchQuery = "";

// Shortcut for document.getElementById
function $(id) {
  return document.getElementById(id);
}

// Today's date as "YYYY-MM-DD" using the visitor's own clock.
function todayIso() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function upcomingEvents() {
  const today = todayIso();
  return events.filter((e) => (e.endDate || e.startDate) >= today);
}

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function fillSelect(select, firstLabel, values) {
  select.innerHTML =
    '<option value="">' + esc(firstLabel) + "</option>" +
    values.map((v) => '<option value="' + esc(v.value) + '">' + esc(v.label) + "</option>").join("");
}

function matchesText(text, query) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

function countText(shown, total, noun) {
  return "Showing " + shown + " of " + total + " " + noun;
}

// ---------- Navigation ----------

function showView(name, params) {
  if (!VIEW_NAMES.includes(name)) name = "dashboard";
  currentView = name;
  applyParams(name, params || new URLSearchParams());
  VIEW_NAMES.forEach((v) => {
    $("view-" + v).hidden = v !== name;
  });
  document.querySelectorAll(".nav-link").forEach((link) => {
    const active = link.dataset.view === name;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  closeMenu();
  if (name === "bookmarks") renderBookmarks();
  if (name === "dashboard") renderDashboard();
  if (name === "search") {
    searchQuery = (params && params.get("q")) || "";
    $("global-search").value = searchQuery;
    renderSearch();
  }
  window.scrollTo(0, 0);
}

// "#research?topic=X" -> { view: "research", params: URLSearchParams }
function parseHash() {
  const raw = window.location.hash.replace("#", "") || "dashboard";
  const parts = raw.split("?");
  return { view: parts[0], params: new URLSearchParams(parts[1] || "") };
}

// Put the URL values into the form fields (ignoring values that are not valid options).
function applyParams(view, params) {
  const controls = VIEW_CONTROLS[view];
  if (!controls) return;
  Object.keys(controls).forEach((key) => {
    const el = $(controls[key]);
    const wanted = params.get(key) || "";
    el.value = wanted;
    if (el.value !== wanted) el.value = ""; // not a real option: fall back to default
  });
  if (view === "research" && !$("pub-sort").value) $("pub-sort").value = "newest";
  if (view === "policy") setPolicyLayout(params.get("layout") === "timeline" ? "timeline" : "table", false);
  refreshAll();
}

// Write the current filters into the URL (without adding browser history entries).
function syncHash() {
  const controls = VIEW_CONTROLS[currentView];
  if (!controls) return;
  const params = new URLSearchParams();
  Object.keys(controls).forEach((key) => {
    const value = $(controls[key]).value;
    if (value && !(key === "sort" && value === "newest")) params.set(key, value);
  });
  if (currentView === "policy" && policyLayout === "timeline") params.set("layout", "timeline");
  const text = params.toString();
  history.replaceState(null, "", "#" + currentView + (text ? "?" + text : ""));
}

function openMenu() {
  document.body.classList.add("menu-open");
  $("menu-toggle").setAttribute("aria-expanded", "true");
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  $("menu-toggle").setAttribute("aria-expanded", "false");
}

// ---------- Theme (light / dark) ----------

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", e.clientX - r.left + "px");
    hero.style.setProperty("--my", e.clientY - r.top + "px");
  });
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.textContent = theme === "dark" ? "\u2600 Light mode" : "\u263E Dark mode";
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  });
}

function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("aigrh.theme", next);
  } catch (error) {
    /* storage blocked: the choice just lasts until the page closes */
  }
}

// Numbers on the dashboard count up once. The final text is already in the HTML,
// so nothing breaks if animation is off or reduced.
function animateCounts() {
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / 600, 1);
      el.textContent = Math.round(target * t);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ---------- Dashboard ----------

function renderDashboard() {
  const stats = [
    { label: "Organisations", value: organisations.length, view: "organisations" },
    { label: "Research resources", value: publications.length, view: "research" },
    { label: "Policy updates", value: policyUpdates.length, view: "policy" },
    { label: "Upcoming events", value: upcomingEvents().length, view: "events" },
  ];
  $("topic-chips").innerHTML =
    '<span class="chip-label">Browse research by topic:</span>' +
    uniqueSorted(publications.map((p) => p.topic))
      .map((t) => '<a class="chip" href="#research?topic=' + encodeURIComponent(t) + '">' + esc(t) + "</a>")
      .join("");
  $("stats").innerHTML = stats
    .map(
      (s) =>
        '<a class="stat" href="#' + s.view + '"><span class="stat-value" data-count="' + s.value + '">' + s.value +
        '</span><span class="stat-label">' + esc(s.label) + "</span></a>"
    )
    .join("");

  animateCounts();
  buildConstellation();

  // Recently added: every item from every list, newest dateAdded first.
  const all = [];
  organisations.forEach((item) => all.push({ type: "organisation", item: item }));
  publications.forEach((item) => all.push({ type: "publication", item: item }));
  policyUpdates.forEach((item) => all.push({ type: "policy", item: item }));
  events.forEach((item) => all.push({ type: "event", item: item }));
  all.sort((a, b) => (a.item.dateAdded < b.item.dateAdded ? 1 : a.item.dateAdded > b.item.dateAdded ? -1 : 0));
  $("recent-list").innerHTML = all.slice(0, 6).map(renderRecentRow).join("");

  // Verification summary: counts per level across all entries.
  const counts = {};
  all.forEach((e) => {
    counts[e.item.verification.level] = (counts[e.item.verification.level] || 0) + 1;
  });
  $("verification-summary").innerHTML =
    '<ul class="plain">' +
    Object.keys(VERIFICATION_LEVELS)
      .map((key) => {
        return (
          "<li>" + verificationBadge({ level: key }) + " <strong>" + (counts[key] || 0) + "</strong> " +
          ((counts[key] || 0) === 1 ? "entry" : "entries") + "</li>"
        );
      })
      .join("") +
    "</ul>";

  // Opportunity (the fellowship): not an event, so it has its own panel.
  const deadline = new Date(opportunity.deadlineIso);
  const open = new Date() <= deadline;
  $("opportunity").innerHTML =
    '<div class="card-top"><span class="tag">Opportunity</span>' + verificationBadge(opportunity.verification) + "</div>" +
    "<h2>" + esc(opportunity.name) + "</h2>" +
    '<dl class="meta">' +
    "<div><dt>Application deadline</dt><dd>" + esc(opportunity.deadlineText) +
    (open ? "" : ' <strong>(deadline has passed)</strong>') + "</dd></div>" +
    "<div><dt>Programme</dt><dd>" + esc(opportunity.programme) + "</dd></div>" +
    "</dl>" +
    '<div class="card-actions">' + sourceLink(opportunity.sourceUrl, "Official announcement") + "</div>";
}

// ---------- Organisations ----------

function renderOrganisations() {
  const query = $("org-search").value;
  const category = $("org-category").value;
  const list = organisations.filter(
    (o) => (!category || o.area === category) && matchesText(o.name + " " + o.description + " " + o.area, query)
  );
  $("org-count").textContent = countText(list.length, organisations.length, "organisations");
  $("org-list").innerHTML = list.length
    ? list.map(renderOrganisationCard).join("")
    : renderEmptyState("No organisations match", "Try a different search or reset the filters.");
}

// ---------- Research ----------

function renderPublications() {
  const query = $("pub-search").value;
  const topic = $("pub-topic").value;
  const level = $("pub-verification").value;
  const sort = $("pub-sort").value;

  const list = publications.filter(
    (p) =>
      (!topic || p.topic === topic) &&
      (!level || p.verification.level === level) &&
      matchesText(p.title + " " + p.author + " " + p.summary + " " + p.topic, query)
  );

  list.sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    // "2026-07" and "2026-02-03" compare fine as text because they start with year-month.
    const result = a.publicationDate.localeCompare(b.publicationDate);
    return sort === "oldest" ? result : -result;
  });

  $("pub-count").textContent = countText(list.length, publications.length, "resources");
  $("pub-list").innerHTML = list.length
    ? list.map(renderPublicationCard).join("")
    : renderEmptyState("No research matches", "Try a different search or reset the filters.");
}

// ---------- Policy ----------

function renderPolicy() {
  const query = $("pol-search").value;
  const region = $("pol-region").value;
  const list = policyUpdates
    .filter((p) => (!region || p.region === region) && matchesText(p.title + " " + p.explanation + " " + p.region, query))
    .sort((a, b) => b.developmentDate.localeCompare(a.developmentDate));

  $("pol-count").textContent = countText(list.length, policyUpdates.length, "policy updates");
  $("pol-list").innerHTML = list.map(renderPolicyRow).join("");
  const asTimeline = policyLayout === "timeline";
  $("pol-timeline").innerHTML = list.slice().reverse().map(renderTimelineItem).join(""); // oldest first
  $("pol-timeline").hidden = !asTimeline || list.length === 0;
  $("pol-table").parentElement.hidden = asTimeline || list.length === 0;
  $("pol-empty").innerHTML = list.length ? "" : renderEmptyState("No policy updates match", "Try a different search or reset the filters.");
}

// ---------- Events ----------

function renderEvents() {
  const query = $("evt-search").value;
  const upcoming = upcomingEvents();
  const list = upcoming
    .filter((e) => matchesText(e.name + " " + e.organiser + " " + e.location, query))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  $("evt-count").textContent = countText(list.length, upcoming.length, "upcoming events");
  $("evt-list").innerHTML = list.map(renderEventCard).join("");
  if (upcoming.length === 0) {
    $("evt-empty").innerHTML = renderEmptyState(
      "No upcoming events with a verified date",
      "No upcoming event could be confirmed with an exact date from an official source. Nothing has been guessed."
    );
  } else if (list.length === 0) {
    $("evt-empty").innerHTML = renderEmptyState("No events match", "Try a different search.");
  } else {
    $("evt-empty").innerHTML = "";
  }
}

// ---------- Bookmarks ----------

function renderBookmarks() {
  const saved = loadBookmarks();
  $("bookmark-count").textContent = saved.length;
  $("storage-warning").hidden = isStorageAvailable();

  // Look up each saved item; skip anything that no longer exists in the data.
  const found = saved
    .map((b) => ({ type: b.type, item: findItem(b.type, b.id) }))
    .filter((entry) => entry.item);

  $("bm-tools").hidden = found.length === 0;
  if (found.length === 0) {
    $("bm-list").innerHTML = renderEmptyState(
      "No bookmarks yet",
      "Use the Bookmark button on any organisation, research item, policy update or event to save it here."
    );
    return;
  }
  $("bm-list").innerHTML = '<div class="cards">' + found.map((e) => renderBookmarkedItem(e.type, e.item)).join("") + "</div>";
}

// Plain-text version of the bookmarks, with source links and verification labels.
function bookmarksAsText() {
  const lines = ["AI Governance Resource Hub - my bookmarks", ""];
  loadBookmarks().forEach((b) => {
    const item = findItem(b.type, b.id);
    if (!item) return;
    let date = "";
    if (item.publicationDate) date = "Publication date: " + formatDate(item.publicationDate);
    else if (item.developmentDate) date = "Development date: " + formatDate(item.developmentDate);
    else if (item.startDate) date = "Date: " + formatDateRange(item.startDate, item.endDate);
    lines.push("[" + TYPE_LABELS[b.type] + "] " + itemTitle(b.type, item));
    if (date) lines.push(date);
    lines.push("Verification: " + VERIFICATION_LEVELS[item.verification.level].label);
    lines.push("Source: " + item.sourceUrl, "");
  });
  return lines.join("\n");
}

function setBookmarkStatus(text) {
  $("bm-status").textContent = text;
}

function setupBookmarkTools() {
  $("bm-download").addEventListener("click", () => {
    const blob = new Blob([bookmarksAsText()], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ai-governance-bookmarks.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    setBookmarkStatus("Downloaded.");
  });
  $("bm-copy").addEventListener("click", () => {
    const text = bookmarksAsText();
    const done = () => setBookmarkStatus("Copied to clipboard.");
    const fail = () => setBookmarkStatus("Copy was blocked by the browser. Use Download instead.");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail);
    else fail();
  });
  $("bm-print").addEventListener("click", () => window.print());
  $("bm-clear").addEventListener("click", () => {
    if (window.confirm("Remove all bookmarks?")) {
      saveBookmarks([]);
      refreshAll();
      setBookmarkStatus("");
    }
  });
}

// Shows "Built by ..." only if you filled in PROJECT_INFO in data.js
function renderProjectAuthor() {
  const p = PROJECT_INFO;
  let html = "";
  if (p.authorName) html += "Built by <strong>" + esc(p.authorName) + "</strong>. ";
  if (p.authorLinkUrl) html += sourceLink(p.authorLinkUrl, p.authorLinkLabel || "Profile") + " ";
  if (p.repoUrl) html += sourceLink(p.repoUrl, "Source code") ;
  $("project-author").innerHTML = html;
  $("project-author").hidden = !html;
}

function setPolicyLayout(layout, render) {
  policyLayout = layout;
  $("pol-layout-table").setAttribute("aria-pressed", String(layout === "table"));
  $("pol-layout-timeline").setAttribute("aria-pressed", String(layout === "timeline"));
  if (render) {
    renderPolicy();
    syncHash();
  }
}

// ---------- Global search ----------

function renderSearch() {
  const q = searchQuery.trim();
  const groups = [
    ["Organisations", "organisation", organisations, (o) => o.name + " " + o.description + " " + o.area],
    ["Research", "publication", publications, (p) => p.title + " " + p.author + " " + p.summary + " " + p.topic],
    ["Policy updates", "policy", policyUpdates, (p) => p.title + " " + p.explanation + " " + p.region],
    ["Events", "event", events.filter((e) => upcomingEvents().includes(e)), (e) => e.name + " " + e.organiser + " " + e.location],
  ];
  if (!q) {
    $("search-summary").textContent = "Type something in the search box to search every section.";
    $("search-results").innerHTML = "";
    return;
  }
  let total = 0;
  let html = "";
  groups.forEach((g) => {
    const hits = g[2].filter((item) => matchesText(g[3](item), q));
    total += hits.length;
    if (hits.length) {
      html += '<div class="search-group"><h2>' + esc(g[0]) + " (" + hits.length + ')</h2><div class="cards">' +
        hits.map((item) => renderBookmarkedItem(g[1], item)).join("") + "</div></div>";
    }
  });
  $("search-summary").textContent = total + (total === 1 ? " result" : " results") + ' for "' + q + '"';
  $("search-results").innerHTML = total ? html : renderEmptyState("No results", "Nothing matched. Try a shorter or different word.");
}

// Refresh whichever lists are showing so every Bookmark button stays in sync.
function refreshAll() {
  renderOrganisations();
  renderPublications();
  renderPolicy();
  renderEvents();
  renderBookmarks();
  renderSearch();
  renderConstellationPanel();
}

// ---------- About page ----------

function renderAbout() {
  $("legend").innerHTML = Object.keys(VERIFICATION_LEVELS)
    .map((key) => "<div><dt>" + verificationBadge({ level: key }) + "</dt><dd>" + esc(VERIFICATION_LEVELS[key].short) + "</dd></div>")
    .join("");

  const groups = [
    ["organisation", organisations],
    ["publication", publications],
    ["policy", policyUpdates],
    ["event", events],
  ];
  const lines = [];
  groups.forEach((group) => {
    group[1].forEach((item) => {
      if (item.verification.note) {
        lines.push(
          "<li><strong>" + esc(itemTitle(group[0], item)) + "</strong> " + verificationBadge(item.verification) +
          "<br>" + esc(item.verification.note) + "</li>"
        );
      }
    });
  });
  $("uncertainty-list").innerHTML = lines.join("");
  $("excluded-list").innerHTML = excludedItems.map((t) => "<li>" + esc(t) + "</li>").join("");
}

// ---------- Setup ----------

function setupFilters() {
  fillSelect(
    $("org-category"),
    "All areas",
    uniqueSorted(organisations.map((o) => o.area)).map((a) => ({ value: a, label: a }))
  );
  fillSelect(
    $("pub-topic"),
    "All topics",
    uniqueSorted(publications.map((p) => p.topic)).map((t) => ({ value: t, label: t }))
  );
  fillSelect(
    $("pub-verification"),
    "All levels",
    Object.keys(VERIFICATION_LEVELS).map((k) => ({ value: k, label: VERIFICATION_LEVELS[k].label }))
  );
  fillSelect(
    $("pol-region"),
    "All regions",
    uniqueSorted(policyUpdates.map((p) => p.region)).map((r) => ({ value: r, label: r }))
  );
}

function resetView(name) {
  const ids = {
    organisations: ["org-search", "org-category"],
    research: ["pub-search", "pub-topic", "pub-verification"],
    policy: ["pol-search", "pol-region"],
    events: ["evt-search"],
  }[name];
  ids.forEach((id) => ($(id).value = ""));
  if (name === "research") $("pub-sort").value = "newest";
  if (name === "policy") setPolicyLayout("table", false);
  refreshAll();
  syncHash();
}

function setupEvents() {
  // Search boxes and dropdowns re-render their list on every change.
  [["org-search", renderOrganisations], ["org-category", renderOrganisations],
   ["pub-search", renderPublications], ["pub-topic", renderPublications],
   ["pub-verification", renderPublications], ["pub-sort", renderPublications],
   ["pol-search", renderPolicy], ["pol-region", renderPolicy],
   ["evt-search", renderEvents]].forEach((pair) => {
    const eventName = pair[0].endsWith("search") ? "input" : "change";
    $(pair[0]).addEventListener(eventName, () => {
      pair[1]();
      syncHash();
    });
  });

  // One click listener for the whole page ("event delegation"):
  // it handles Bookmark buttons and Reset buttons, even for cards created later.
  document.addEventListener("click", (event) => {
    const bookmark = event.target.closest(".btn-bookmark");
    if (bookmark) {
      toggleBookmark(bookmark.dataset.bookmarkType, bookmark.dataset.bookmarkId);
      refreshAll();
      return;
    }
    const reset = event.target.closest("[data-reset]");
    if (reset) resetView(reset.dataset.reset);
  });

  $("pol-layout-table").addEventListener("click", () => setPolicyLayout("table", true));
  $("pol-layout-timeline").addEventListener("click", () => setPolicyLayout("timeline", true));

  // Global search: Enter or the search button goes to #search?q=...
  $("global-search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = $("global-search").value.trim();
    window.location.hash = "search?q=" + encodeURIComponent(q);
  });

  document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", toggleTheme));
  $("hero-search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.hash = "search?q=" + encodeURIComponent($("hero-search").value.trim());
  });

  $("menu-toggle").addEventListener("click", () => {
    document.body.classList.contains("menu-open") ? closeMenu() : openMenu();
  });
  $("scrim").addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("hashchange", () => {
    const h = parseHash();
    showView(h.view, h.params);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme());
  setupFilters();
  setupEvents();
  setupBookmarkTools();
  renderProjectAuthor();
  renderAbout();
  refreshAll();
  const h = parseHash();
  showView(h.view, h.params);
});
