/*
  data.js - all the content of the website lives here.

  Every entry comes from the approved research in docs/data-verification-log.md.
  Nothing here was invented. Each entry keeps its own sourceUrl.

  THREE DIFFERENT DATES (never mixed up):
    publicationDate  - when a research resource was published (by its author/publisher)
    developmentDate  - when a policy development happened
    dateAdded        - when the entry was added to THIS website (used for "Recently Added")

  Dates are text in ISO format. "2026-07" means "July 2026, exact day not verified",
  and the website shows it as a month only (we never invent a day).

  verification.level is one of the keys in VERIFICATION_LEVELS below.
*/

// FILL THESE IN with your own details (leave "" to hide). Nothing is shown for empty values.
const PROJECT_INFO = {
  authorName: "",        // e.g. "Your Name"
  authorLinkUrl: "",     // e.g. your LinkedIn or GitHub profile URL
  authorLinkLabel: "",   // e.g. "LinkedIn"
  repoUrl: "",           // e.g. your GitHub repository URL
};

const SITE_INFO = {
  today: null, // filled in by app.js using the visitor's own clock
  verificationDate: "2026-11-19",
};

const VERIFICATION_LEVELS = {
  verified: {
    label: "Verified",
    short: "The exact linked page was opened and read during research.",
  },
  indirect: {
    label: "Indirectly verified",
    short: "A different page on the same official site confirms it; the exact linked page was not opened.",
  },
  partial: {
    label: "Partly verified",
    short: "Key facts are supported, but the official page could not be opened directly.",
  },
  organiser: {
    label: "Organiser site only",
    short: "Checked only on the organiser's own website, with no independent confirmation.",
  },
};

const organisations = [
  {
    id: "org-govai",
    name: "Centre for the Governance of AI (GovAI)",
    description: "Think tank helping government and industry decision-makers handle advanced AI through research and fellowships. Offices in Washington DC and London.",
    area: "AI governance research",
    sourceUrl: "https://www.governance.ai/about-us",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "org-aisi",
    name: "UK AI Security Institute (AISI)",
    description: "Research organisation within the UK Department for Science, Innovation and Technology. Tests advanced AI systems and informs governments about their risks.",
    area: "Government AI evaluation",
    sourceUrl: "https://www.aisi.gov.uk/about",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "org-oecd",
    name: "OECD.AI Policy Observatory (incl. GPAI)",
    description: "OECD platform for AI policy data and analysis. Hosts the OECD AI Principles, the Hiroshima AI Reporting Framework and the Global Partnership on AI.",
    area: "International AI policy",
    sourceUrl: "https://oecd.ai/en/about",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "org-ada",
    name: "Ada Lovelace Institute",
    description: "Independent UK research institute, part of the Nuffield Foundation, working to make data and AI serve people and society.",
    area: "AI policy and ethics",
    sourceUrl: "https://www.adalovelaceinstitute.org/",
    verification: {
      level: "indirect",
      note: "Confirmed through a report page on the same site (adalovelaceinstitute.org); the homepage itself was not the page read.",
    },
    dateAdded: "2026-11-19",
  },
  {
    id: "org-cset",
    name: "Center for Security and Emerging Technology (CSET)",
    description: "Georgetown University policy research centre analysing the security implications of emerging technology, especially AI.",
    area: "National security and AI policy",
    sourceUrl: "https://cset.georgetown.edu/",
    verification: { level: "verified", note: "Checked via CSET's publications page." },
    dateAdded: "2026-11-19",
  },
  {
    id: "org-fli",
    name: "Future of Life Institute (FLI)",
    description: "Non-profit working to steer transformative technologies away from extreme large-scale risks.",
    area: "AI safety and policy",
    sourceUrl: "https://futureoflife.org/about-us/",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "org-pai",
    name: "Partnership on AI (PAI)",
    description: "Non-profit partnership of academic, civil society, industry and media organisations. Says it is not a trade group or advocacy organisation.",
    area: "Responsible AI",
    sourceUrl: "https://partnershiponai.org/about/",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "org-cser",
    name: "Centre for the Study of Existential Risk (CSER)",
    description: "University of Cambridge research centre studying risks that could cause civilisational collapse or extinction, including from AI.",
    area: "Existential and catastrophic risk",
    sourceUrl: "https://www.cser.ac.uk/",
    verification: {
      level: "indirect",
      note: "Confirmed through two other pages on cser.ac.uk. The homepage linked here could not be opened during research, and the news page that was read dates from 2019.",
    },
    dateAdded: "2026-11-19",
  },
  {
    id: "org-cais",
    name: "Center for AI Safety (CAIS)",
    description: "Non-profit reducing societal-scale AI risk through research, field-building and advocacy.",
    area: "AI safety research",
    sourceUrl: "https://safe.ai/about",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "org-caissi",
    name: "NIST Center for Advancing Innovation and Standards for Super Intelligence (CAISSI), formerly CAISI",
    description: "US government centre within NIST. Works with industry on testing, voluntary standards and security evaluations of commercial AI.",
    area: "US government AI standards",
    sourceUrl: "https://www.nist.gov/caissi",
    verification: { level: "verified", note: "The current name (CAISSI) is taken from NIST's own page." },
    dateAdded: "2026-11-19",
  },
];

const publications = [
  {
    id: "pub-aisi-trends",
    title: "Frontier AI Trends Report",
    author: "UK AI Security Institute",
    publicationDate: "2025-12-18",
    topic: "AI evaluation",
    summary: "A report from the UK AI Security Institute on trends in frontier AI.",
    sourceUrl: "https://www.aisi.gov.uk/frontier-ai-trends-report",
    verification: {
      level: "verified",
      note: "The date comes from the gov.uk press release (\"Published 18 December 2025\"), which was also opened.",
    },
    dateAdded: "2026-11-19",
  },
  {
    id: "pub-iasr-2026",
    title: "International AI Safety Report 2026",
    author: "Chair Yoshua Bengio; lead writers Stephen Clare and Carina Prunkl; 100+ experts. Secretariat: UK AI Security Institute (Mila also credited).",
    publicationDate: "2026-02-03",
    topic: "AI risk assessment",
    summary: "The 2026 annual report of the International AI Safety Report series, chaired by Yoshua Bengio.",
    sourceUrl: "https://arxiv.org/abs/2602.21012",
    verification: {
      level: "partial",
      note: "This links the arXiv copy. The official publication page (internationalaisafetyreport.org/publication/international-ai-safety-report-2026) could not be opened directly. The date and authorship are supported by a reader copy of the official site's front page (\"3 February 2026 - Annual Report\") and by the report cover (\"February 2026\"). Another site gives 6 February, so treat the exact day with care.",
    },
    dateAdded: "2026-11-19",
  },
  {
    id: "pub-nist-rmf",
    title: "Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
    author: "NIST",
    publicationDate: "2023-01-26",
    topic: "Risk management frameworks",
    summary: "NIST's voluntary framework for managing risks of AI systems. The link goes to NIST's launch page, which states the release date.",
    sourceUrl: "https://www.nist.gov/news-events/events/2023/01/nist-ai-risk-management-framework-ai-rmf-10-launch",
    verification: { level: "verified", note: "A document number and PDF link were deliberately left out because they were not confirmed on a NIST page." },
    dateAdded: "2026-11-19",
  },
  {
    id: "pub-nist-genai",
    title: "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (NIST AI 600-1)",
    author: "Chloe Autio, Reva Schwartz, Jesse Dunietz, Shomik Jain, Martin Stanley, Elham Tabassi, Patrick Hall, Kamie Roberts (NIST)",
    publicationDate: "2024-07-26",
    topic: "Generative AI risk",
    summary: "A companion profile to the AI RMF that applies it to generative AI. DOI: 10.6028/NIST.AI.600-1.",
    sourceUrl: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "pub-compute",
    title: "Computing Power and the Governance of Artificial Intelligence",
    author: "Girish Sastry, Lennart Heim, Haydn Belfield, Markus Anderljung, Miles Brundage, Julian Hazell, Cullen O'Keefe, Gillian K. Hadfield et al.",
    publicationDate: "2024-02-14",
    topic: "Compute governance",
    summary: "A research paper on how computing power can be used as a lever for governing AI.",
    sourceUrl: "https://www.governance.ai/research-paper/computing-power-and-the-governance-of-artificial-intelligence",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "pub-catastrophic",
    title: "An Overview of Catastrophic AI Risks",
    author: "Dan Hendrycks, Mantas Mazeika, Thomas Woodside (Center for AI Safety)",
    publicationDate: "2023-06-21",
    topic: "Catastrophic AI risk",
    summary: "An overview of major sources of catastrophic risk from advanced AI.",
    sourceUrl: "https://arxiv.org/abs/2306.12001",
    verification: { level: "verified", note: "The date is that of the first arXiv version (v1); later versions may exist." },
    dateAdded: "2026-11-19",
  },
  {
    id: "pub-fli-index",
    title: "AI Safety Index, Summer 2026 Edition",
    author: "Future of Life Institute",
    publicationDate: "2026-07",
    topic: "Industry safety assessment",
    summary: "FLI's assessment of AI company safety practices. Evidence was collected up to 3 June 2026.",
    sourceUrl: "https://futureoflife.org/ai-safety-index-summer-2026/",
    verification: { level: "verified", note: "Only the month of publication is shown; the exact day was not verified." },
    dateAdded: "2026-11-19",
  },
  {
    id: "pub-pai",
    title: "Guidance for Safe Foundation Model Deployment (public-comment version)",
    author: "Partnership on AI",
    publicationDate: "2023-10-24",
    topic: "Foundation model deployment",
    summary: "Partnership on AI's guidance for deploying foundation models safely, released for public comment.",
    sourceUrl: "https://partnershiponai.org/pai-model-deployment-guidance-press-release/",
    verification: {
      level: "verified",
      note: "The link goes to PAI's press release (London, 24 October 2023), which was opened. The guidance page itself (partnershiponai.org/modeldeployment/) is not linked because it could not be opened.",
    },
    dateAdded: "2026-11-19",
  },
  {
    id: "pub-ada",
    title: "Regulating AI in the UK (policy briefing)",
    author: "Matt Davies and Michael Birtwistle, Ada Lovelace Institute",
    publicationDate: "2023-07-18",
    topic: "UK AI regulation",
    summary: "A policy briefing on how AI could be regulated in the UK.",
    sourceUrl: "https://www.adalovelaceinstitute.org/policy-briefing/regulating-ai-in-the-uk/",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "pub-cset",
    title: "AI Governance at the Frontier: Unpacking Foundational Assumptions",
    author: "Mina Narayanan, Jessica Ji, Vikram Venkatram, Ngor Luong (CSET)",
    publicationDate: "2025-11",
    topic: "US AI governance proposals",
    summary: "An analysis of the assumptions behind US proposals for governing frontier AI. DOI printed in the PDF: 10.51593/20240005.",
    sourceUrl: "https://cset.georgetown.edu/wp-content/uploads/CSET-AI-Governance-at-the-Frontier.pdf",
    verification: {
      level: "verified",
      note: "Links the PDF, which was opened. The cover calls it an \"Issue Brief\" while CSET's listing calls it a \"Report\". Only the month is shown.",
    },
    dateAdded: "2026-11-19",
  },
];

const policyUpdates = [
  {
    id: "pol-bletchley",
    title: "Bletchley Declaration at the AI Safety Summit",
    region: "International (UK-hosted)",
    developmentDate: "2023-11-01",
    explanation: "28 countries plus the EU agreed a shared understanding of frontier AI risks.",
    sourceUrl: "https://www.gov.uk/government/news/countries-agree-to-safe-and-responsible-development-of-frontier-ai-in-landmark-bletchley-declaration",
    verification: { level: "verified", note: "Source: gov.uk press release." },
    dateAdded: "2026-11-19",
  },
  {
    id: "pol-eu-act",
    title: "EU AI Act enters into force",
    region: "European Union",
    developmentDate: "2024-08-01",
    explanation: "The EU's AI regulation starts its phased application.",
    sourceUrl: "https://commission.europa.eu/news/ai-act-enters-force-2024-08-01_en",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "pol-coe",
    title: "Council of Europe Framework Convention on AI opened for signature",
    region: "Europe and global",
    developmentDate: "2024-09-05",
    explanation: "First legally binding international AI treaty. Signed on opening day by the UK, US, EU and others.",
    sourceUrl: "https://www.coe.int/en/web/portal/-/council-of-europe-opens-first-ever-global-treaty-on-ai-for-signature",
    verification: {
      level: "verified",
      note: "Whether and when the treaty has entered into force was not verified, so this entry makes no claim about it.",
    },
    dateAdded: "2026-11-19",
  },
  {
    id: "pol-aisi-rename",
    title: "UK AI Safety Institute becomes the AI Security Institute",
    region: "United Kingdom",
    developmentDate: "2025-02-14",
    explanation: "The UK government refocused the institute on security and criminal-misuse risks.",
    sourceUrl: "https://www.gov.uk/government/news/tackling-ai-security-risks-to-unleash-growth-and-deliver-plan-for-change",
    verification: { level: "verified", note: "" },
    dateAdded: "2026-11-19",
  },
  {
    id: "pol-un",
    title: "UN General Assembly creates the Independent International Scientific Panel on AI and the Global Dialogue on AI Governance (A/RES/79/325)",
    region: "United Nations",
    developmentDate: "2025-08-26",
    explanation: "Establishes a 40-member scientific panel and an annual governance dialogue.",
    sourceUrl: "https://www.un.org/pga/wp-content/uploads/sites/110/2025/12/A_RES_79_325-EN.pdf",
    verification: { level: "verified", note: "Source: the resolution text (PDF)." },
    dateAdded: "2026-11-19",
  },
  {
    id: "pol-sb53",
    title: "California signs SB 53, the Transparency in Frontier Artificial Intelligence Act",
    region: "US (California)",
    developmentDate: "2025-09-29",
    explanation: "Requires large frontier developers to publish safety frameworks and enables critical safety incident reporting.",
    sourceUrl: "https://www.gov.ca.gov/2025/09/29/governor-newsom-signs-sb-53-advancing-californias-world-leading-artificial-intelligence-industry/",
    verification: { level: "verified", note: "Source: Governor of California press release." },
    dateAdded: "2026-11-19",
  },
  {
    id: "pol-delhi",
    title: "India AI Impact Summit concludes with the New Delhi Declaration on AI Impact",
    region: "India and international",
    developmentDate: "2026-02",
    explanation: "Declaration adopted at the summit in New Delhi.",
    sourceUrl: "https://negd.gov.in/press_release/ai-impact-summit-2026-concludes-with-adoption-of-new-delhi-declaration/",
    verification: {
      level: "verified",
      note: "Only the month is shown. Sources disagree on the exact adoption day and on how many countries endorsed it, so neither is stated here.",
    },
    dateAdded: "2026-11-19",
  },
  {
    id: "pol-omnibus",
    title: "EU Digital Omnibus on AI: Regulation (EU) 2026/1744 amends the AI Act",
    region: "European Union",
    developmentDate: "2026-07-24",
    // Extra dates for this entry, shown separately so they are not confused:
    extraDates: [
      { label: "Signed", date: "2026-07-08" },
      { label: "Published in the Official Journal", date: "2026-07-24" },
      { label: "In force (per EUR-Lex)", date: "2026-07-27" },
    ],
    explanation: "Amends the AI Act (Regulation (EU) 2024/1689) as part of simplifying implementation of the EU's AI rules.",
    sourceUrl: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng",
    verification: {
      level: "verified",
      note: "The main date shown is the Official Journal publication date, kept separate from the signing date. The text was not read in full, so new deadlines for high-risk obligations are deliberately NOT stated here.",
    },
    dateAdded: "2026-11-19",
  },
];

const events = [
  {
    id: "evt-dk",
    name: "Danish AI Safety Conference",
    organiser: "Søren Elverlin (named as organiser on the conference's own site)",
    startDate: "2027-02-27",
    endDate: "2027-02-27",
    time: "10:00 to 20:00",
    location: "PDC A/S, H.J. Holsts Vej 3-5C, 2605 Brøndby, Denmark",
    sourceUrl: "https://aisafetyconference.dk/",
    verification: {
      level: "organiser",
      note: "Details were verified using the organiser's own website only. The site lists free entry. The registration page was not opened, so no registration link is given. Self-published by a volunteer organiser.",
    },
    dateAdded: "2026-11-19",
  },
  {
    id: "evt-iapp",
    name: "IAPP Global Summit 2027",
    organiser: "IAPP",
    startDate: "2027-03-21",
    endDate: "2027-03-24",
    time: "",
    location: "Washington, DC (Marriott Marquis and the Walter E. Washington Convention Center)",
    sourceUrl: "https://iapp.org/conference/iapp-global-summit",
    verification: { level: "verified", note: "Covers privacy, AI governance and cybersecurity law. The page has no registration link, so only the event page is linked." },
    dateAdded: "2026-11-19",
  },
  {
    id: "evt-aitc",
    name: "AITC 2027, AI Transparency Conference",
    organiser: "COAI gGmbH",
    startDate: "2027-06-28",
    endDate: "2027-06-30",
    time: "",
    location: "Germanisches Nationalmuseum, Nuremberg, Germany",
    sourceUrl: "https://aitc2027.cc/",
    verification: { level: "verified", note: "Registration was shown as \"not yet open\". Paper submissions open on 1 December 2026." },
    dateAdded: "2026-11-19",
  },
  {
    id: "evt-aisf",
    name: "AI Safety Forum 2027",
    organiser: "Gradient Institute (volunteer organising committee)",
    startDate: "2027-07-06",
    endDate: "2027-07-07",
    time: "",
    location: "The University of Sydney, Australia",
    sourceUrl: "https://www.aisafetyforum.au",
    verification: { level: "verified", note: "Registration was shown as \"not yet open\" (waitlist)." },
    dateAdded: "2026-11-19",
  },
];

// Not an event, so it is kept separate and shown as a highlighted opportunity.
const opportunity = {
  id: "opp-govai-fellowship",
  name: "GovAI UK Summer Fellowship 2027 - Applied Track",
  deadlineText: "23:59 UK time (GMT), Sunday 22 November 2026 (05:29 IST on Monday 23 November)",
  deadlineIso: "2026-11-22T23:59:00Z",
  programme: "7 June to 27 August 2027, London. £14,000 plus travel support.",
  sourceUrl: "https://www.governance.ai/post/uk-summer-fellowship-2027-applied-track",
  verification: { level: "verified", note: "" },
  dateAdded: "2026-11-19",
};

// Things we looked at and chose NOT to include, shown on the About page for honesty.
const excludedItems = [
  "Geneva AI Summit 2027 - the Swiss government only says \"first half of 2027\", with no exact date.",
  "IASEAI '27 - no verified exact date from an official source.",
  "2027 UN Global Dialogue session in New York - no verified exact date from an official source.",
];
