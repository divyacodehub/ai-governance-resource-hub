/*
  analysis.js - draws the Research Analysis page from analysis-data.js.

  Every statement shows a label:
    "Sourced fact"  = a page we opened says this (see the [R#] reference)
    "Our analysis"  = our judgement, with the facts it rests on and how confident we are
*/

const compareSelected = ["eu", "ca", "nist"]; // up to 3 columns in the comparison table

function refById(id) {
  return ANALYSIS_REFS.find((r) => r.id === id);
}

function citeLinks(ids) {
  return (ids || [])
    .map((id) => {
      const ref = refById(id);
      return '<a class="cite" href="#ref-' + esc(id) + '" data-ref="' + esc(id) + '" title="' + esc(ref ? ref.author + ": " + ref.title : id) + '">[' + esc(id) + "]</a>";
    })
    .join(" ");
}

function factBadge() {
  return '<span class="lbl lbl-fact">Sourced fact</span>';
}

function analysisBadge() {
  return '<span class="lbl lbl-analysis">Our analysis</span>';
}

function claimItem(c) {
  if (c.none) return '<li class="claim claim-none">' + esc(c.t) + "</li>";
  return '<li class="claim">' + esc(c.t) + " " + citeLinks(c.r) + "</li>";
}

// ----- 1. Comparison -----
function renderCompareChips() {
  $("cmp-chips").innerHTML = ANALYSIS_FRAMEWORKS.map(
    (f) =>
      '<button type="button" class="cchip cchip-pol" data-cmp="' + esc(f.id) + '" aria-pressed="' + compareSelected.includes(f.id) + '">' + esc(f.name.split(" (")[0]) + "</button>"
  ).join("");
}

function renderCompareTable() {
  const frameworks = compareSelected.map((id) => ANALYSIS_FRAMEWORKS.find((f) => f.id === id));
  let html = '<table class="cmp-table"><thead><tr><th scope="col">Dimension</th>';
  frameworks.forEach((f) => {
    html += '<th scope="col">' + esc(f.name) + '<span class="small">' + esc(f.kind) + "</span></th>";
  });
  html += "</tr></thead><tbody>";
  ANALYSIS_DIMENSIONS.forEach((dim) => {
    html += '<tr><th scope="row">' + esc(dim.label) + "</th>";
    frameworks.forEach((f) => {
      html += "<td><ul>" + f.cells[dim.key].map(claimItem).join("") + "</ul></td>";
    });
    html += "</tr>";
  });
  html += "</tbody></table>";
  $("cmp-table").innerHTML = html;
  $("cmp-count").textContent = "Comparing " + frameworks.length + " of " + ANALYSIS_FRAMEWORKS.length + " instruments. Choose 2 or 3.";
}

// ----- 2. Gaps -----
function renderGaps() {
  $("an-gaps").innerHTML = ANALYSIS_GAPS.map(
    (g) =>
      '<article class="gap-card" id="gap-' + g.id + '">' +
      '<div class="card-top"><span class="tag">' + esc(g.id) + " · " + esc(g.type) + "</span></div>" +
      "<h3>" + esc(g.title) + "</h3>" +
      "<h4>" + factBadge() + " What the sources say</h4>" +
      '<ul class="claims">' + g.sourced.map(claimItem).join("") + "</ul>" +
      "<h4>" + analysisBadge() + " Our reading</h4>" +
      "<p>" + esc(g.analysis) + "</p>" +
      '<p class="conf"><strong>Confidence:</strong> ' + esc(g.confidence) + '. <strong>Not checked / limits:</strong> ' + esc(g.limits) + "</p>" +
      "</article>"
  ).join("");
}

// ----- 3. Findings -----
function renderFindings() {
  $("an-findings").innerHTML = ANALYSIS_FINDINGS.map(
    (f) =>
      '<article class="finding">' +
      '<div class="card-top"><span class="tag">' + esc(f.id) + " · " + esc(f.topic) + "</span>" + factBadge() + "</div>" +
      "<p>" + esc(f.text) + " " + citeLinks([f.ref]) + "</p>" +
      '<blockquote class="quote">&ldquo;' + esc(f.quote) + "&rdquo;</blockquote>" +
      '<p class="small"><strong>Scope:</strong> ' + esc(f.scope) + ". <strong>Caveat:</strong> " + esc(f.caveat) + "</p>" +
      "</article>"
  ).join("");
}

// ----- 4. Recommendations -----
function renderRecs() {
  $("an-recs").innerHTML = ANALYSIS_RECS.map(
    (r) =>
      '<article class="rec" id="rec-' + r.id + '">' +
      '<div class="card-top"><span class="tag">' + esc(r.id) + "</span>" + analysisBadge() + "</div>" +
      "<h3>" + esc(r.title) + "</h3>" +
      '<p class="small"><strong>For:</strong> ' + esc(r.audience) + "</p>" +
      "<p>" + esc(r.reasoning) + "</p>" +
      '<p class="small"><strong>Rests on:</strong> ' +
      r.basis.map((b) => '<a href="#" data-scroll="gap-' + esc(b) + '">' + esc(b) + "</a>").join(", ") + " · " + citeLinks(r.refs) + "</p>" +
      '<p class="small"><strong>What would change our mind:</strong> ' + esc(r.changeIf) + "</p>" +
      "</article>"
  ).join("");
}

// ----- 5. Method, limits, references -----
function renderMethod() {
  $("an-method").innerHTML = "<ul>" + ANALYSIS_METHOD.map((m) => "<li>" + esc(m) + "</li>").join("") + "</ul>";
  $("an-limits").innerHTML = "<ul>" + ANALYSIS_LIMITS.map((m) => "<li>" + esc(m) + "</li>").join("") + "</ul>";
  $("an-refs").innerHTML = ANALYSIS_REFS.map((r) => {
    const hubEntry = r.hubId ? allEntries().find((e) => e.item.id === r.hubId) : null;
    const hub = hubEntry ? ' <a class="small" href="#search?q=' + encodeURIComponent(itemTitle(hubEntry.type, hubEntry.item).slice(0, 30)) + '">Also in the hub</a>' : "";
    return (
      '<li id="ref-' + esc(r.id) + '"><span class="ref-id">' + esc(r.id) + "</span><div>" +
      esc(r.author) + ". <em>" + esc(r.title) + "</em>. " + esc(r.date) + ". " +
      '<a class="source-link" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.url) + " <span aria-hidden=\"true\">&#8599;</span></a>" +
      '<div class="small"><span class="tag">' + (r.kind === "primary" ? "Primary" : "Secondary") + "</span> Read: " + esc(r.read) + " Checked: " + esc(formatDate(r.checked)) + "." + hub + "</div></div></li>"
    );
  }).join("");
}

// ----- Live citation check -----
function runCitationChecks() {
  const ids = new Set(ANALYSIS_REFS.map((r) => r.id));
  const statements = [];
  ANALYSIS_FRAMEWORKS.forEach((f) => Object.keys(f.cells).forEach((k) => f.cells[k].forEach((c) => statements.push(c))));
  ANALYSIS_GAPS.forEach((g) => g.sourced.forEach((c) => statements.push(c)));
  const factual = statements.filter((c) => !c.none);
  const used = new Set();
  factual.forEach((c) => (c.r || []).forEach((id) => used.add(id)));
  ANALYSIS_FINDINGS.forEach((f) => used.add(f.ref));
  ANALYSIS_RECS.forEach((r) => r.refs.forEach((id) => used.add(id)));
  const quoteWords = (s) => s.trim().split(/\s+/).length;
  const gapIds = new Set(ANALYSIS_GAPS.map((g) => g.id));
  return [
    ["Every sourced statement cites at least one reference", factual.every((c) => c.r && c.r.length > 0)],
    ["Every cited reference id exists in the reference list", factual.every((c) => c.r.every((id) => ids.has(id))) && ANALYSIS_FINDINGS.every((f) => ids.has(f.ref)) && ANALYSIS_RECS.every((r) => r.refs.every((id) => ids.has(id)))],
    ["Every reference is cited somewhere on the page", ANALYSIS_REFS.every((r) => used.has(r.id))],
    ["Every reference link is secure (https) and unique", ANALYSIS_REFS.every((r) => /^https:\/\//.test(r.url)) && new Set(ANALYSIS_REFS.map((r) => r.url)).size === ANALYSIS_REFS.length],
    ["Every finding quotation is short (25 words or fewer)", ANALYSIS_FINDINGS.every((f) => quoteWords(f.quote) <= 25)],
    ["Every recommendation points to an existing gap or difference", ANALYSIS_RECS.every((r) => r.basis.every((b) => gapIds.has(b)))],
    ["Every gap states a confidence level and its limits", ANALYSIS_GAPS.every((g) => g.confidence && g.limits)],
    ["Every reference that maps to a hub entry points to one that exists", ANALYSIS_REFS.every((r) => !r.hubId || allEntries().some((e) => e.item.id === r.hubId))],
  ];
}

function renderCitationCheck() {
  const checks = runCitationChecks();
  const passed = checks.filter((c) => c[1]).length;
  $("cite-summary").textContent = passed + " of " + checks.length + " citation checks passed.";
  $("cite-list").innerHTML = checks
    .map((c) => '<li class="' + (c[1] ? "pass" : "fail") + '"><span class="mark" aria-hidden="true">' + (c[1] ? "&#10003;" : "&#10007;") + '</span><span><span class="sr-only">' + (c[1] ? "Passed: " : "Failed: ") + "</span>" + esc(c[0]) + "</span></li>")
    .join("");
}

function renderAnalysis() {
  if ($("an-gaps").dataset.built) return;
  renderCompareChips();
  renderCompareTable();
  renderGaps();
  renderFindings();
  renderRecs();
  renderMethod();
  renderCitationCheck();
  $("an-gaps").dataset.built = "1";
}

function flash(el) {
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}

function setupAnalysis() {
  document.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-cmp]");
    if (chip) {
      const id = chip.dataset.cmp;
      const at = compareSelected.indexOf(id);
      if (at >= 0) {
        if (compareSelected.length > 2) compareSelected.splice(at, 1); // keep at least 2
      } else {
        compareSelected.push(id);
        if (compareSelected.length > 3) compareSelected.shift(); // keep at most 3
      }
      renderCompareChips();
      renderCompareTable();
      return;
    }
    const ref = e.target.closest("[data-ref]");
    if (ref) {
      e.preventDefault();
      const target = $("ref-" + ref.dataset.ref);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        flash(target);
      }
      return;
    }
    const jump = e.target.closest("[data-scroll]");
    if (jump) {
      e.preventDefault();
      const target = $(jump.dataset.scroll);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        flash(target);
      }
    }
  });
}
