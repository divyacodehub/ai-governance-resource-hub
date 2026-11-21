/*
  constellation.js - the interactive map on the dashboard.

  Every dot is ONE real entry from data.js (no extra data is added):
    - dots are grouped in four clusters: organisations, research, policy, events
    - a ring around a dot shows how well it was verified
    - hover or focus a dot to see a preview, click it (or press Enter) to open its card
    - the chips above the map hide/show types and verification levels
  The lines are only there to show which cluster a dot belongs to.
*/

const SVG_NS = "http://www.w3.org/2000/svg";

const CLUSTERS = [
  { type: "organisation", label: "Organisations", x: 190, y: 135, css: "org" },
  { type: "publication", label: "Research", x: 610, y: 135, css: "pub" },
  { type: "policy", label: "Policy", x: 190, y: 335, css: "pol" },
  { type: "event", label: "Events", x: 610, y: 335, css: "evt" },
];

const constellation = {
  built: false,
  nodes: [], // { type, item, el }
  hiddenTypes: {},
  hiddenLevels: {},
  selected: null, // { type, id }
};

function svgEl(name, attrs) {
  const el = document.createElementNS(SVG_NS, name);
  Object.keys(attrs || {}).forEach((k) => el.setAttribute(k, attrs[k]));
  return el;
}

function constellationItems(type) {
  if (type === "organisation") return organisations;
  if (type === "publication") return publications;
  if (type === "policy") return policyUpdates;
  return events;
}

function itemDateText(type, item) {
  if (type === "publication") return "Published " + formatDate(item.publicationDate);
  if (type === "policy") return formatDate(item.developmentDate);
  if (type === "event") return formatDateRange(item.startDate, item.endDate);
  return "";
}

function buildConstellation() {
  if (constellation.built) return;
  const svg = $("constellation-svg");
  const spokes = svgEl("g", {});
  const dots = svgEl("g", {});
  svg.appendChild(spokes);
  svg.appendChild(dots);

  CLUSTERS.forEach((cluster) => {
    const items = constellationItems(cluster.type);
    items.forEach((item, i) => {
      // Spiral layout: spreads dots evenly around the cluster centre.
      const angle = i * 2.39996; // the "golden angle" in radians
      const radius = 34 + 15.5 * Math.sqrt(i);
      const x = cluster.x + radius * Math.cos(angle);
      const y = cluster.y + radius * Math.sin(angle);

      spokes.appendChild(svgEl("line", { x1: cluster.x, y1: cluster.y, x2: x.toFixed(1), y2: y.toFixed(1), class: "spoke spoke-" + cluster.css }));

      const g = svgEl("g", {
        class: "node node-" + cluster.css + " level-" + item.verification.level,
        tabindex: "0",
        role: "button",
        "aria-label": TYPE_LABELS[cluster.type] + ": " + itemTitle(cluster.type, item) + ". " + VERIFICATION_LEVELS[item.verification.level].label + ".",
        transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")",
      });
      g.appendChild(svgEl("circle", { class: "node-ring", r: 12.5 }));
      g.appendChild(svgEl("circle", { class: "node-dot", r: 8 }));
      g.style.animationDelay = (i * 40) % 600 + "ms";
      const entry = { type: cluster.type, item: item, el: g, x: x, y: y };
      g.addEventListener("mouseenter", () => showTooltip(entry));
      g.addEventListener("focus", () => showTooltip(entry));
      g.addEventListener("mouseleave", hideTooltip);
      g.addEventListener("blur", hideTooltip);
      g.addEventListener("click", () => selectNode(cluster.type, item.id));
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectNode(cluster.type, item.id);
        }
      });
      dots.appendChild(g);
      constellation.nodes.push(entry);
    });

    // Cluster hub with its label and count
    const hub = svgEl("g", { class: "hub hub-" + cluster.css, transform: "translate(" + cluster.x + " " + cluster.y + ")" });
    hub.appendChild(svgEl("circle", { r: 22 }));
    const label = svgEl("text", { y: 4, "text-anchor": "middle" });
    label.textContent = constellationItems(cluster.type).length;
    hub.appendChild(label);
    const name = svgEl("text", { y: -30, "text-anchor": "middle", class: "hub-name" });
    name.textContent = cluster.label;
    hub.appendChild(name);
    spokes.appendChild(hub);
  });

  // Filter chips
  $("c-type-chips").innerHTML = CLUSTERS.map(
    (c) => '<button type="button" class="cchip cchip-' + c.css + '" data-ctype="' + c.type + '" aria-pressed="true">' + esc(c.label) + "</button>"
  ).join("");
  $("c-level-chips").innerHTML = Object.keys(VERIFICATION_LEVELS)
    .map((k) => '<button type="button" class="cchip cchip-level level-key-' + k + '" data-clevel="' + k + '" aria-pressed="true">' + esc(VERIFICATION_LEVELS[k].label) + "</button>")
    .join("");

  $("constellation").addEventListener("click", (e) => {
    const t = e.target.closest("[data-ctype]");
    const l = e.target.closest("[data-clevel]");
    if (t) toggleFilter(constellation.hiddenTypes, t.dataset.ctype, t);
    if (l) toggleFilter(constellation.hiddenLevels, l.dataset.clevel, l);
  });
  constellation.built = true;
  updateConstellation();
  renderConstellationPanel();
}

function toggleFilter(store, key, button) {
  store[key] = !store[key];
  button.setAttribute("aria-pressed", String(!store[key]));
  updateConstellation();
}

function updateConstellation() {
  let visible = 0;
  constellation.nodes.forEach((n) => {
    const hidden = constellation.hiddenTypes[n.type] || constellation.hiddenLevels[n.item.verification.level];
    n.el.classList.toggle("dim", !!hidden);
    n.el.setAttribute("tabindex", hidden ? "-1" : "0");
    if (!hidden) visible++;
  });
  $("c-count").textContent = "Showing " + visible + " of " + constellation.nodes.length + " entries";
}

function showTooltip(entry) {
  const tip = $("c-tooltip");
  tip.innerHTML =
    '<span class="tip-row"><span class="tag">' + esc(TYPE_LABELS[entry.type]) + "</span>" + verificationBadge(entry.item.verification) + "</span>" +
    "<strong>" + esc(itemTitle(entry.type, entry.item)) + "</strong>" +
    (itemDateText(entry.type, entry.item) ? "<span>" + esc(itemDateText(entry.type, entry.item)) + "</span>" : "") +
    '<span class="small">Click for details</span>';
  tip.hidden = false;
  // Position over the dot (SVG coordinates -> percentage of the map box)
  const box = $("constellation-svg").viewBox.baseVal;
  const left = (entry.x / box.width) * 100;
  const top = (entry.y / box.height) * 100;
  tip.style.left = Math.min(Math.max(left, 22), 78) + "%";
  tip.style.top = top + "%";
  tip.classList.toggle("below", top < 40);
}

function hideTooltip() {
  $("c-tooltip").hidden = true;
}

function selectNode(type, id) {
  constellation.selected = { type: type, id: id };
  constellation.nodes.forEach((n) => n.el.classList.toggle("selected", n.type === type && n.item.id === id));
  renderConstellationPanel();
}

function renderConstellationPanel() {
  if (!constellation.built) return;
  const panel = $("c-panel");
  const sel = constellation.selected;
  const item = sel && findItem(sel.type, sel.id);
  if (!item) {
    panel.innerHTML =
      '<div class="c-hint"><h3>Explore the map</h3><p>Every dot is one entry. Hover or tab to a dot for a preview, then click it to open its full card here.</p>' +
      '<p class="small">Ring colour shows how well it was verified. Use the chips to hide types or levels.</p></div>';
    return;
  }
  panel.innerHTML = renderBookmarkedItem(sel.type, item);
}
