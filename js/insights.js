/*
  insights.js - the "Timeline" and "Insights" views.

  Everything here is calculated from the arrays in data.js:
    - the master timeline puts publications, policy developments and events on one line
    - the charts count entries (nothing is estimated or invented)
    - the integrity checks test the STRUCTURE of the data (links, dates, labels, notes)
    - the export buttons download the same data as JSON or CSV
*/

const LEVEL_ORDER = ["verified", "indirect", "partial", "organiser"];
const timelineHidden = {}; // which types are switched off in the timeline

function allEntries() {
  const all = [];
  organisations.forEach((item) => all.push({ type: "organisation", item: item }));
  publications.forEach((item) => all.push({ type: "publication", item: item }));
  policyUpdates.forEach((item) => all.push({ type: "policy", item: item }));
  events.forEach((item) => all.push({ type: "event", item: item }));
  return all;
}

// ---------- Master timeline ----------

// The main date of an entry and what kind of date it is (kept distinct).
function mainDate(type, item) {
  if (type === "publication") return { date: item.publicationDate, kind: "Publication date" };
  if (type === "policy") return { date: item.developmentDate, kind: "Development date" };
  return { date: item.startDate, kind: "Event date" };
}

// "2026-07" sorts as "2026-07-00" so month-only dates come before exact days of that month.
function sortKey(date) {
  return date.length === 7 ? date + "-00" : date;
}

function renderTimeline() {
  const today = todayIso();
  const rows = [];
  ["publication", "policy", "event"].forEach((type) => {
    if (timelineHidden[type]) return;
    constellationItems(type).forEach((item) => {
      const d = mainDate(type, item);
      rows.push({ type: type, item: item, date: d.date, kind: d.kind, key: sortKey(d.date) });
    });
  });
  rows.sort((a, b) => a.key.localeCompare(b.key));

  let html = "";
  let lastYear = "";
  let todayShown = false;
  rows.forEach((r) => {
    if (!todayShown && r.key > today) {
      html += '<li class="mt-today"><span>Today: ' + esc(formatDate(today)) + "</span></li>";
      todayShown = true;
    }
    const year = r.date.slice(0, 4);
    if (year !== lastYear) {
      html += '<li class="mt-year">' + year + "</li>";
      lastYear = year;
    }
    const css = { publication: "pub", policy: "pol", event: "evt" }[r.type];
    html +=
      '<li class="mt-row type-' + css + '">' +
      '<div class="mt-date"><strong>' + esc(formatDate(r.date)) + '</strong><span class="small">' + esc(r.kind) + "</span></div>" +
      '<div class="mt-body"><div class="card-top"><span class="tag">' + esc(TYPE_LABELS[r.type]) + "</span>" + verificationBadge(r.item.verification) + "</div>" +
      "<h3>" + esc(itemTitle(r.type, r.item)) + "</h3>" +
      verificationNote(r.item.verification) +
      '<div class="card-actions">' + sourceLink(r.item.sourceUrl, "Source") + "</div></div></li>";
  });
  if (!todayShown && rows.length) html += '<li class="mt-today"><span>Today: ' + esc(formatDate(today)) + "</span></li>";
  $("mt-list").innerHTML = html || renderEmptyState("Nothing selected", "Switch at least one type back on.");
  $("mt-count").textContent = "Showing " + rows.length + " dated entries. Organisations have no single date, so they are not on this timeline.";
}

// ---------- Charts (plain SVG) ----------

function renderEvidenceChart() {
  const types = [
    ["organisation", "Organisations", organisations],
    ["publication", "Research", publications],
    ["policy", "Policy", policyUpdates],
    ["event", "Events", events],
  ];
  const max = Math.max.apply(null, types.map((t) => t[2].length));
  const left = 110, width = 480, rowH = 44;
  let svg = '<svg viewBox="0 0 640 ' + (types.length * rowH + 10) + '" role="img" aria-label="Number of entries per type, split by verification level">';
  types.forEach((t, row) => {
    const y = row * rowH + 8;
    svg += '<text class="ch-label" x="0" y="' + (y + 20) + '">' + t[1] + "</text>";
    let x = left;
    LEVEL_ORDER.forEach((level) => {
      const count = t[2].filter((e) => e.verification.level === level).length;
      if (!count) return;
      const w = (count / max) * width;
      svg += '<rect class="lv lv-' + level + '" x="' + x.toFixed(1) + '" y="' + y + '" width="' + w.toFixed(1) + '" height="28" rx="4"><title>' +
        t[1] + ": " + count + " " + VERIFICATION_LEVELS[level].label + "</title></rect>";
      if (w > 22) svg += '<text class="ch-count" x="' + (x + w / 2).toFixed(1) + '" y="' + (y + 19) + '" text-anchor="middle">' + count + "</text>";
      x += w;
    });
  });
  svg += "</svg>";
  const legend = LEVEL_ORDER.map((l) => '<span class="lg"><i class="lv lv-' + l + '"></i>' + esc(VERIFICATION_LEVELS[l].label) + "</span>").join("");
  $("chart-evidence").innerHTML = svg + '<div class="legend-row">' + legend + "</div>";
}

function renderYearChart() {
  const series = [
    ["Research (publication date)", "pub", publications.map((p) => p.publicationDate)],
    ["Policy (development date)", "pol", policyUpdates.map((p) => p.developmentDate)],
    ["Events (event date)", "evt", events.map((e) => e.startDate)],
  ];
  const years = [];
  series.forEach((s) => s[2].forEach((d) => years.push(Number(d.slice(0, 4)))));
  const minY = Math.min.apply(null, years), maxY = Math.max.apply(null, years);
  const labels = [];
  for (let y = minY; y <= maxY; y++) labels.push(y);
  const counts = series.map((s) => labels.map((y) => s[2].filter((d) => Number(d.slice(0, 4)) === y).length));
  const max = Math.max.apply(null, [].concat.apply([], counts));
  const groupW = 640 / labels.length, barW = Math.min(34, (groupW - 24) / 3), base = 190, top = 24;
  let svg = '<svg viewBox="0 0 640 220" role="img" aria-label="Dated entries per year, by type">';
  svg += '<line class="ch-axis" x1="0" y1="' + base + '" x2="640" y2="' + base + '"/>';
  labels.forEach((year, gi) => {
    const gx = gi * groupW + (groupW - barW * 3 - 8) / 2;
    series.forEach((s, si) => {
      const n = counts[si][gi];
      const h = (n / max) * (base - top);
      const x = gx + si * (barW + 4);
      svg += '<rect class="bar bar-' + s[1] + '" x="' + x.toFixed(1) + '" y="' + (base - h).toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3"><title>' + year + " " + s[0] + ": " + n + "</title></rect>";
      if (n) svg += '<text class="ch-count-out" x="' + (x + barW / 2).toFixed(1) + '" y="' + (base - h - 5).toFixed(1) + '" text-anchor="middle">' + n + "</text>";
    });
    svg += '<text class="ch-label" x="' + (gi * groupW + groupW / 2).toFixed(1) + '" y="212" text-anchor="middle">' + year + "</text>";
  });
  svg += "</svg>";
  const legend = series.map((s) => '<span class="lg"><i class="bar bar-' + s[1] + '"></i>' + esc(s[0]) + "</span>").join("");
  $("chart-years").innerHTML = svg + '<div class="legend-row">' + legend + "</div>";
}

// ---------- Integrity checks ----------

function isRealDate(text) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(text || "");
  if (!m) return false;
  const month = Number(m[2]);
  if (month < 1 || month > 12) return false;
  if (m[3]) {
    const d = new Date(Number(m[1]), month - 1, Number(m[3]));
    return d.getMonth() === month - 1 && d.getDate() === Number(m[3]);
  }
  return true;
}

function runIntegrityChecks() {
  const all = allEntries();
  const items = all.map((e) => e.item);
  const today = todayIso();
  const dateFields = [];
  publications.forEach((p) => dateFields.push(p.publicationDate));
  policyUpdates.forEach((p) => {
    dateFields.push(p.developmentDate);
    (p.extraDates || []).forEach((d) => dateFields.push(d.date));
  });
  events.forEach((e) => { dateFields.push(e.startDate); dateFields.push(e.endDate); });
  items.forEach((i) => dateFields.push(i.dateAdded));

  const ids = items.map((i) => i.id);
  const urls = items.map((i) => i.sourceUrl);
  const checks = [
    ["Every entry has a secure (https) source link", items.every((i) => /^https:\/\/[^\s]+$/.test(i.sourceUrl || ""))],
    ["No source link is reused by two entries", new Set(urls).size === urls.length],
    ["Every entry has a unique ID", new Set(ids).size === ids.length],
    ["All dates are real calendar dates (YYYY, YYYY-MM or YYYY-MM-DD)", dateFields.every(isRealDate)],
    ["Every entry uses a known verification level", items.every((i) => VERIFICATION_LEVELS[i.verification.level])],
    ["Every entry that is not fully \"Verified\" shows an explanatory note", items.every((i) => i.verification.level === "verified" || i.verification.note)],
    ["No publication or policy date is in the future", publications.every((p) => sortKey(p.publicationDate) <= today) && policyUpdates.every((p) => sortKey(p.developmentDate) <= today)],
    ["Every entry records the date it was added to this site", items.every((i) => isRealDate(i.dateAdded))],
  ];
  return { total: items.length, checks: checks };
}

function renderIntegrity() {
  const result = runIntegrityChecks();
  const passed = result.checks.filter((c) => c[1]).length;
  $("integrity-summary").textContent = passed + " of " + result.checks.length + " checks passed on " + result.total + " entries.";
  $("integrity-list").innerHTML = result.checks
    .map((c) => '<li class="' + (c[1] ? "pass" : "fail") + '"><span class="mark" aria-hidden="true">' + (c[1] ? "&#10003;" : "&#10007;") + "</span><span><span class=\"sr-only\">" + (c[1] ? "Passed: " : "Failed: ") + "</span>" + esc(c[0]) + "</span></li>")
    .join("");
}

// ---------- Export ----------

function exportRows() {
  return allEntries().map((e) => {
    const d = e.type === "organisation" ? { date: "", kind: "" } : mainDate(e.type, e.item);
    return {
      type: e.type,
      id: e.item.id,
      title: itemTitle(e.type, e.item),
      main_date: d.date,
      date_kind: d.kind,
      verification: VERIFICATION_LEVELS[e.item.verification.level].label,
      verification_note: e.item.verification.note || "",
      source_url: e.item.sourceUrl,
      date_added: e.item.dateAdded,
    };
  });
}

function toCsv(rows) {
  const cols = Object.keys(rows[0]);
  const cell = (v) => '"' + String(v).replace(/"/g, '""') + '"';
  return [cols.join(",")].concat(rows.map((r) => cols.map((c) => cell(r[c])).join(","))).join("\n");
}

function downloadText(filename, text, mime) {
  const blob = new Blob([text], { type: mime });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

// ---------- Citation ----------

function citationFor(pub) {
  return pub.author + ". (" + formatDate(pub.publicationDate) + "). " + pub.title + ". " + pub.sourceUrl;
}

// ---------- Setup ----------

function renderInsights() {
  renderEvidenceChart();
  renderYearChart();
  renderIntegrity();
}

function setupInsights() {
  $("mt-chips").innerHTML = [["publication", "Research", "pub"], ["policy", "Policy", "pol"], ["event", "Events", "evt"]]
    .map((c) => '<button type="button" class="cchip cchip-' + c[2] + '" data-mttype="' + c[0] + '" aria-pressed="true">' + c[1] + "</button>")
    .join("");

  document.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-mttype]");
    if (chip) {
      const type = chip.dataset.mttype;
      timelineHidden[type] = !timelineHidden[type];
      chip.setAttribute("aria-pressed", String(!timelineHidden[type]));
      renderTimeline();
      return;
    }
    const cite = e.target.closest("[data-cite]");
    if (cite) {
      const pub = publications.find((p) => p.id === cite.dataset.cite);
      const text = citationFor(pub);
      const original = cite.textContent;
      const done = (msg) => {
        cite.textContent = msg;
        setTimeout(() => (cite.textContent = original), 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done("Copied"), () => done("Copy blocked"));
      else done("Copy blocked");
    }
  });

  $("export-json").addEventListener("click", () => {
    downloadText("ai-governance-hub-data.json", JSON.stringify({ checked: SITE_INFO.verificationDate, entries: exportRows() }, null, 2), "application/json");
    $("export-status").textContent = "Downloaded JSON.";
  });
  $("export-csv").addEventListener("click", () => {
    downloadText("ai-governance-hub-data.csv", toCsv(exportRows()), "text/csv");
    $("export-status").textContent = "Downloaded CSV.";
  });
}
