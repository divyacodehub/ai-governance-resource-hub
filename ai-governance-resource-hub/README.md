# AI Governance Resource Hub

A small, static website that collects **verified, source-linked** information about AI governance: organisations, research, policy developments and upcoming events. Built as a portfolio project and for an application to the GovAI UK Summer Fellowship 2027 (Applied Track).

## Features
- **Dashboard**: totals (organisations, research resources, policy updates, upcoming events), a *Recently added* list driven by the `dateAdded` field, a verification summary, and the GovAI fellowship opportunity.
- **Organisations**: cards with description, main area and official link; search and area filter.
- **Research Library**: title, author/publisher, publication date, topic, summary, source link; search, topic and verification filters, sorting, bookmarking.
- **Policy Updates**: table of developments with date, region, explanation and source link (stacked layout on phones).
- **Events**: only upcoming events (compared with the visitor's own clock). If none were left, an honest empty state is shown instead.
- **Bookmarks**: saved in the browser's LocalStorage; they survive a reload and can be removed.
- **About & Verification**: legend of verification labels, known uncertainties, and items deliberately left out.
- **Bookmark tools**: download your bookmarks as a .txt file (with source links and verification labels), copy them, print, or remove all.
- **Dashboard "About this project"** box and an About-page section explaining how the information was verified.
- **Print-friendly** styling (sidebar and buttons hidden, source URLs printed).
- **Policy timeline**: switch Policy Updates between table and a chronological timeline.
- **"How was this checked?"** expandable box on every card (status, research date, date added, linked source).
- **Global search** (sidebar): searches organisations, research, policy and events together.
- **Shareable filtered views**: filters are kept in the URL, e.g. `index.html#research?topic=Compute%20governance`.
- **Dark mode**: toggle in the sidebar (top bar on mobile). It follows your device setting the first time and remembers your choice in LocalStorage.
- **Refreshed look**: a dashboard hero with a small animated network graphic, a quick search box, topic chips that open filtered research, serif headings, count-up numbers and gentle hover effects. Animations switch off if your device asks for reduced motion.
- **Interactive map (constellation)** on the dashboard: every entry is a dot, grouped by type (organisations, research, policy, events) and coloured per type. A ring shows its verification level. Hover or tab to a dot for a preview, click it (or press Enter) to open its full card with source link and bookmark button. Chips hide types or verification levels. Dots are plain SVG built from `js/data.js`; no entries or relationships are invented (lines only show cluster membership).
- Responsive layout (sidebar becomes a slide-in menu on mobile). Dark mode was added later at the owner's request (see below). There are no bookmark notes, by design.

## Screenshots
Dashboard: `docs/screenshots/dashboard.png`, Research: `docs/screenshots/research.png`, Policy: `docs/screenshots/policy.png`, Events: `docs/screenshots/events.png`, Mobile: `docs/screenshots/mobile-research.png`. (Taken from the working site during testing.)

## Make it yours (before you share it)
Open `js/data.js` and fill in `PROJECT_INFO` (your name, a profile link such as LinkedIn or GitHub, and your repository URL). The dashboard then shows "Built by ...". Leave the values empty to hide the line. Do not change any factual data.

## Publish it for free (GitHub Pages)
1. Create a free GitHub account and a new public repository.
2. Upload the contents of this folder (so `index.html` is at the top level).
3. In the repository go to Settings, then Pages, choose the `main` branch and the root folder, and save.
4. After a minute GitHub shows your live link. Put that link and the repository URL in your application.

## Technologies
HTML, CSS and vanilla JavaScript only, plus LocalStorage. No frameworks, build step, backend, database or paid API.

## How to run
1. Unzip the folder.
2. Double-click `index.html` (it opens in your browser). That is all.
3. Optional: `python3 -m http.server` in the folder, then visit http://localhost:8000. This also makes the link to `docs/data-verification-log.md` open as a file.

## Data sources and verification approach
All content comes from `js/data.js`, which was written from the approved research in `docs/data-verification-log.md`. Every entry keeps its own `sourceUrl`, and sources are official or primary where possible. Descriptions are written in our own words.

Each entry carries one of four labels, shown on its card:

| Label | Meaning |
|---|---|
| Verified | The exact linked page was opened and read during research (19 November 2026). |
| Indirectly verified | A different page on the same official site confirms it (Ada Lovelace Institute, CSER). |
| Partly verified | Key facts supported, but the official page could not be opened (International AI Safety Report 2026, linked via arXiv). |
| Organiser site only | Checked only on the organiser's own website (Danish AI Safety Conference). |

Uncertainties are shown on the site (card notes and the About page), for example: month-only dates are displayed as a month; the New Delhi Declaration has no exact day or endorsement count; the EU Digital Omnibus entry states no new high-risk deadlines; the Council of Europe treaty's entry into force is not claimed.

**What was not done:** links were checked during research, not re-checked by the automated test suite (it had no web access). Web pages can change after 19 November 2026. Nothing is "unverified" in the data set: entries that could not be fully verified carry a weaker label instead.

### Three kinds of date
- `publicationDate`: when a resource was published.
- `developmentDate`: when a policy development happened.
- `dateAdded`: when it was added to this site (2026-11-19 for all entries).

A value like `"2026-07"` means month only and is shown as "July 2026".

## Project structure (beginner-friendly)
```
index.html          the single page: sidebar + one <section> per view
css/styles.css      colours (CSS variables at the top), layout, cards, table, mobile rules
js/data.js          ALL content as JavaScript arrays (organisations, publications, ...)
js/storage.js       LocalStorage helpers: load/save/toggle bookmarks (with try/catch)
js/render.js        functions that turn one data item into HTML text
js/constellation.js the interactive dashboard map (SVG dots built from data.js)
js/app.js           navigation, URL filters, global search, search/filters, bookmark clicks, dashboard numbers
docs/data-verification-log.md   what was checked, and how
```
Load order matters: `data.js` -> `storage.js` -> `render.js` -> `constellation.js` -> `app.js`, because each file uses things defined by the previous ones.

**How it works:** the URL hash (`#research`) picks which section is visible. When you type in a search box or change a filter, `app.js` filters the arrays from `data.js`, asks `render.js` for the HTML of each result, and puts it in the page. Clicking *Bookmark* calls `toggleBookmark()` in `storage.js`, which saves a small list in LocalStorage, then the lists redraw.

**To add an entry:** copy an existing object in `js/data.js`, change its fields, keep a real `sourceUrl`, set an honest `verification.level`, and set `dateAdded`.

## Testing performed
Automated browser tests (Python Playwright, Chromium, run on 21 November 2026; the test scripts are not included in this folder) covered: navigation to all views; dashboard counts; search, filters, reset and empty states on each list; sorting; bookmark add, remove, mixed types and persistence after reload; month-only date display; Omnibus signing vs Official Journal dates; source-link attributes; consistency of every URL in `data.js` with the approved log; no console errors; a 375px mobile layout (menu, no horizontal scroll); and, for the later additions: the map (32 dots, 4 clusters, hover preview, click-to-open card, bookmarking from the card, type and verification chips, keyboard selection, tap on a touch device),  dark mode toggle, persistence and OS-preference default, text-contrast sampling in both themes (computed WCAG ratios of 23 sampled text elements in dark mode and 14 in light mode, all at least 4.5:1 except the hero text, whose gradient background the script could not measure), topic chips and hero search,  timeline toggle, "How was this checked?" boxes, global search (including HTML-looking input), URL-based filters (including invalid values),  bookmark download/copy/remove-all, the print stylesheet hiding the sidebar, and the optional author line.
