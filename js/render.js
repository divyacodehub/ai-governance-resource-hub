/*
  render.js - turns data into HTML.

  Each function takes one item (or a list) and returns a string of HTML.
  app.js then puts that string into the page. No data is changed here.
*/

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Makes text safe to put inside HTML (stops text from being treated as code).
function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// "2026-02-03" -> "3 February 2026"   |   "2026-07" -> "July 2026" (month only, no invented day)
function formatDate(iso) {
  if (!iso) return "";
  const parts = iso.split("-");
  const year = parts[0];
  const month = MONTH_NAMES[Number(parts[1]) - 1];
  if (parts.length === 2) return month + " " + year;
  return Number(parts[2]) + " " + month + " " + year;
}

function formatDateRange(start, end) {
  if (!end || end === start) return formatDate(start);
  return formatDate(start) + " to " + formatDate(end);
}

function verificationBadge(verification) {
  const level = VERIFICATION_LEVELS[verification.level];
  return (
    '<span class="badge badge-' + esc(verification.level) + '" title="' + esc(level.short) + '">' +
    esc(level.label) + "</span>"
  );
}

// The "Uncertainty / notes" box. Shown only when there is a note.
function verificationNote(verification) {
  if (!verification.note) return "";
  const isWarning = verification.level !== "verified";
  return (
    '<p class="note' + (isWarning ? " note-warning" : "") + '"><strong>Verification note:</strong> ' +
    esc(verification.note) + "</p>"
  );
}

// Expandable "How was this checked?" box. Uses only facts already in the data.
function checkDetails(item) {
  const level = VERIFICATION_LEVELS[item.verification.level];
  return (
    '<details class="how-checked"><summary>How was this checked?</summary>' +
    "<ul>" +
    "<li><strong>Status:</strong> " + esc(level.label) + ". " + esc(level.short) + "</li>" +
    "<li><strong>Checked:</strong> " + esc(formatDate(SITE_INFO.verificationDate)) + " (research date)</li>" +
    "<li><strong>Added to this site:</strong> " + esc(formatDate(item.dateAdded)) + "</li>" +
    "<li><strong>Linked source:</strong> " + esc(item.sourceUrl) + "</li>" +
    "</ul></details>"
  );
}

function bookmarkButton(type, id) {
  const saved = isBookmarked(type, id);
  return (
    '<button type="button" class="btn-bookmark' + (saved ? " is-saved" : "") + '"' +
    ' data-bookmark-type="' + esc(type) + '" data-bookmark-id="' + esc(id) + '"' +
    ' aria-pressed="' + saved + '">' +
    (saved ? "Bookmarked" : "Bookmark") + "</button>"
  );
}

function sourceLink(url, text) {
  return (
    '<a class="source-link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
    esc(text || "View source") + ' <span aria-hidden="true">&#8599;</span></a>'
  );
}

// ---------- Cards ----------

function renderOrganisationCard(org) {
  return (
    '<article class="card type-org">' +
    '<div class="card-top"><span class="tag">' + esc(org.area) + "</span>" + verificationBadge(org.verification) + "</div>" +
    "<h3>" + esc(org.name) + "</h3>" +
    "<p>" + esc(org.description) + "</p>" +
    verificationNote(org.verification) + checkDetails(org) +
    '<div class="card-actions">' + sourceLink(org.sourceUrl, "Official website") +
    bookmarkButton("organisation", org.id) + "</div>" +
    "</article>"
  );
}

function renderPublicationCard(pub) {
  return (
    '<article class="card type-pub">' +
    '<div class="card-top"><span class="tag">' + esc(pub.topic) + "</span>" + verificationBadge(pub.verification) + "</div>" +
    "<h3>" + esc(pub.title) + "</h3>" +
    '<dl class="meta">' +
    "<div><dt>Author / publisher</dt><dd>" + esc(pub.author) + "</dd></div>" +
    "<div><dt>Publication date</dt><dd>" + esc(formatDate(pub.publicationDate)) + "</dd></div>" +
    "</dl>" +
    "<p>" + esc(pub.summary) + "</p>" +
    verificationNote(pub.verification) + checkDetails(pub) +
    '<div class="card-actions">' + sourceLink(pub.sourceUrl, "Source") +
    '<span class="btn-group"><button type="button" class="btn-ghost btn-small" data-cite="' + esc(pub.id) + '">Copy citation</button>' +
    bookmarkButton("publication", pub.id) + "</span></div>" +
    "</article>"
  );
}

function renderPolicyCard(item) {
  let extra = "";
  if (item.extraDates) {
    extra =
      '<ul class="date-list">' +
      item.extraDates.map((d) => "<li><strong>" + esc(d.label) + ":</strong> " + esc(formatDate(d.date)) + "</li>").join("") +
      "</ul>";
  }
  return (
    '<article class="card type-pol">' +
    '<div class="card-top"><span class="tag">' + esc(item.region) + "</span>" + verificationBadge(item.verification) + "</div>" +
    "<h3>" + esc(item.title) + "</h3>" +
    '<dl class="meta"><div><dt>Development date</dt><dd>' + esc(formatDate(item.developmentDate)) + "</dd></div></dl>" +
    extra +
    "<p>" + esc(item.explanation) + "</p>" +
    verificationNote(item.verification) + checkDetails(item) +
    '<div class="card-actions">' + sourceLink(item.sourceUrl, "Source") +
    bookmarkButton("policy", item.id) + "</div>" +
    "</article>"
  );
}

function renderEventCard(ev) {
  return (
    '<article class="card type-evt">' +
    '<div class="card-top"><span class="tag">Upcoming</span>' + verificationBadge(ev.verification) + "</div>" +
    "<h3>" + esc(ev.name) + "</h3>" +
    '<dl class="meta">' +
    "<div><dt>Organiser</dt><dd>" + esc(ev.organiser) + "</dd></div>" +
    "<div><dt>Date</dt><dd>" + esc(formatDateRange(ev.startDate, ev.endDate)) + (ev.time ? ", " + esc(ev.time) : "") + "</dd></div>" +
    "<div><dt>Location</dt><dd>" + esc(ev.location) + "</dd></div>" +
    "</dl>" +
    verificationNote(ev.verification) + checkDetails(ev) +
    '<div class="card-actions">' + sourceLink(ev.sourceUrl, "Event website") +
    bookmarkButton("event", ev.id) + "</div>" +
    "</article>"
  );
}

// ---------- Policy table (desktop) ----------

function renderPolicyRow(item) {
  let extra = "";
  if (item.extraDates) {
    extra = item.extraDates.map((d) => "<div class=\"small\">" + esc(d.label) + ": " + esc(formatDate(d.date)) + "</div>").join("");
  }
  return (
    "<tr>" +
    '<td data-label="Development date"><strong>' + esc(formatDate(item.developmentDate)) + "</strong>" + extra + "</td>" +
    '<td data-label="Region">' + esc(item.region) + "</td>" +
    '<td data-label="Development"><strong>' + esc(item.title) + "</strong><p class=\"small\">" + esc(item.explanation) + "</p>" +
    verificationNote(item.verification) + checkDetails(item) + "</td>" +
    '<td data-label="Verification">' + verificationBadge(item.verification) + "</td>" +
    '<td data-label="Source">' + sourceLink(item.sourceUrl, "Source") + "<div>" + bookmarkButton("policy", item.id) + "</div></td>" +
    "</tr>"
  );
}

// ---------- Dashboard pieces ----------

// Finds one item by type + id (used by the Bookmarks view)
function findItem(type, id) {
  const lists = { organisation: organisations, publication: publications, policy: policyUpdates, event: events };
  return (lists[type] || []).find((item) => item.id === id) || null;
}

function renderBookmarkedItem(type, item) {
  if (type === "organisation") return renderOrganisationCard(item);
  if (type === "publication") return renderPublicationCard(item);
  if (type === "policy") return renderPolicyCard(item);
  return renderEventCard(item);
}

function itemTitle(type, item) {
  return type === "organisation" || type === "event" ? item.name : item.title;
}

const TYPE_LABELS = {
  organisation: "Organisation",
  publication: "Research",
  policy: "Policy update",
  event: "Event",
};

const TYPE_VIEWS = {
  organisation: "organisations",
  publication: "research",
  policy: "policy",
  event: "events",
};

function renderRecentRow(entry) {
  return (
    "<li>" +
    '<span class="tag">' + esc(TYPE_LABELS[entry.type]) + "</span>" +
    '<a href="#' + esc(TYPE_VIEWS[entry.type]) + '">' + esc(itemTitle(entry.type, entry.item)) + "</a>" +
    '<span class="small">Added to this site: ' + esc(formatDate(entry.item.dateAdded)) + "</span>" +
    "</li>"
  );
}

function renderEmptyState(title, text) {
  return '<div class="empty"><h3>' + esc(title) + "</h3><p>" + esc(text) + "</p></div>";
}

// ---------- Timeline (Policy Updates) ----------

function renderTimelineItem(item) {
  let extra = "";
  if (item.extraDates) {
    extra =
      '<ul class="date-list">' +
      item.extraDates.map((d) => "<li><strong>" + esc(d.label) + ":</strong> " + esc(formatDate(d.date)) + "</li>").join("") +
      "</ul>";
  }
  return (
    '<li class="tl-item type-pol"><span class="tl-dot" aria-hidden="true"></span><div class="tl-body">' +
    '<div class="tl-date">' + esc(formatDate(item.developmentDate)) + "</div>" +
    '<div class="card-top"><span class="tag">' + esc(item.region) + "</span>" + verificationBadge(item.verification) + "</div>" +
    "<h3>" + esc(item.title) + "</h3>" + extra +
    "<p>" + esc(item.explanation) + "</p>" +
    verificationNote(item.verification) + checkDetails(item) +
    '<div class="card-actions">' + sourceLink(item.sourceUrl, "Source") + bookmarkButton("policy", item.id) + "</div>" +
    "</div></li>"
  );
}
