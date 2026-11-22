/*
  analysis-data.js - the content of the Research Analysis page.

  RULES USED FOR EVERY ENTRY
  - A "sourced fact" is something a page we opened actually says. It always carries a
    reference id like "R2" that points to the reference list at the bottom of the page.
  - "Our analysis" is a judgement or inference. It is always labelled, always says which
    sourced facts it rests on, and always says how confident we are and what we did not check.
  - If a source we read was silent on a point, the table says "Not stated in the pages we read".
    That is NOT the same as "does not exist".
  - Short quotations (a few words) are copied from the text the fetch tool returned. They were
    not re-checked character by character against the live page.
  - "checked" is the day the page was read for this analysis (2026-11-22), or 2026-11-19 for the
    items first verified in the main data-verification phase.
*/

const ANALYSIS_META = {
  readOn: "2026-11-22",
  title: "Research Analysis",
  question:
    "How do selected AI governance instruments differ in legal force, scope and mechanism, and what do the primary sources say about gaps, evidence and next steps?",
};

// kind: "primary" (official / legislative / the organisation's own document), "secondary" (commentary or a tracker site)
// read: how much of the source we actually saw
const ANALYSIS_REFS = [
  {
    id: "R1", kind: "primary", author: "European Commission", title: "AI Act enters into force",
    date: "2024-08-01", url: "https://commission.europa.eu/news/ai-act-enters-force-2024-08-01_en",
    read: "Full page.", checked: "2026-11-22", hubId: "pol-eu-act",
  },
  {
    id: "R2", kind: "primary", author: "European Commission", title: "AI Act (regulatory framework for AI), Shaping Europe's digital future",
    date: "Undated, continuously updated page", url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
    read: "Full page as it stood on the day read. It states dates up to 2028 and mentions 2026 changes. We did not check those dates against the text of Regulation (EU) 2026/1744.",
    checked: "2026-11-22",
  },
  {
    id: "R3", kind: "primary", author: "NIST", title: "Artificial Intelligence Risk Management Framework (AI RMF 1.0): launch page",
    date: "2023-01-26", url: "https://www.nist.gov/news-events/events/2023/01/nist-ai-risk-management-framework-ai-rmf-10-launch",
    read: "Full page. The page did not list the framework's core functions.", checked: "2026-11-22", hubId: "pub-nist-rmf",
  },
  {
    id: "R4", kind: "primary", author: "NIST", title: "AI RMF: Generative Artificial Intelligence Profile (NIST AI 600-1), publication page",
    date: "2024-07-26", url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence",
    read: "Abstract only. We did not read the profile itself.", checked: "2026-11-22", hubId: "pub-nist-genai",
  },
  {
    id: "R5", kind: "primary", author: "Council of Europe", title: "Council of Europe opens first-ever global treaty on AI for signature (press release)",
    date: "2024-09-05", url: "https://www.coe.int/en/web/portal/-/council-of-europe-opens-first-ever-global-treaty-on-ai-for-signature",
    read: "Full press release. We did not read the treaty text.", checked: "2026-11-22", hubId: "pol-coe",
  },
  {
    id: "R6", kind: "primary", author: "United Nations General Assembly", title: "Resolution A/RES/79/325",
    date: "2025-08-26", url: "https://www.un.org/pga/wp-content/uploads/sites/110/2025/12/A_RES_79_325-EN.pdf",
    read: "Resolution text (paragraph numbers as returned by the fetch tool).", checked: "2026-11-22", hubId: "pol-un",
  },
  {
    id: "R7", kind: "primary", author: "UK Government", title: "Countries agree to safe and responsible development of frontier AI in landmark Bletchley Declaration (press release)",
    date: "2023-11-01", url: "https://www.gov.uk/government/news/countries-agree-to-safe-and-responsible-development-of-frontier-ai-in-landmark-bletchley-declaration",
    read: "Full press release. We did not read the Declaration text itself.", checked: "2026-11-22", hubId: "pol-bletchley",
  },
  {
    id: "R8", kind: "primary", author: "California Assembly Committee on Privacy and Consumer Protection (analysis by John Bennett)",
    title: "Analysis of SB 53 (Wiener), as amended September 5, 2025, for hearing September 11, 2025",
    date: "2025-09-05", url: "https://apcp.assembly.ca.gov/media/1019",
    read: "Committee analysis of a pre-enactment version of the bill. We did not read the chaptered (final) bill text, so details may differ from the law as signed.",
    checked: "2026-11-22",
  },
  {
    id: "R9", kind: "primary", author: "Matt Davies and Michael Birtwistle, Ada Lovelace Institute", title: "Regulating AI in the UK (policy briefing)",
    date: "2023-07-18", url: "https://www.adalovelaceinstitute.org/policy-briefing/regulating-ai-in-the-uk/",
    read: "Full web page (summary tables and recommendations). A 2023 document: later UK developments are not reflected.", checked: "2026-11-22", hubId: "pub-ada",
  },
  {
    id: "R10", kind: "primary", author: "UK Government", title: "Tackling AI security risks to unleash growth and deliver Plan for Change (press release)",
    date: "2025-02-14", url: "https://www.gov.uk/government/news/tackling-ai-security-risks-to-unleash-growth-and-deliver-plan-for-change",
    read: "Full press release.", checked: "2026-11-22", hubId: "pol-aisi-rename",
  },
  {
    id: "R11", kind: "primary", author: "UK AI Security Institute", title: "Frontier AI Trends Report",
    date: "2025-12-18", url: "https://www.aisi.gov.uk/frontier-ai-trends-report",
    read: "The report's web page (key findings). We did not read the underlying evaluations.", checked: "2026-11-22", hubId: "pub-aisi-trends",
  },
  {
    id: "R12", kind: "primary", author: "Future of Life Institute", title: "AI Safety Index, Summer 2026 Edition",
    date: "2026-07 (month only; evidence collected to 3 June 2026)", url: "https://futureoflife.org/ai-safety-index-summer-2026/",
    read: "Full web page. Grades are one expert panel's judgement. FLI is an advocacy-oriented non-profit.", checked: "2026-11-22", hubId: "pub-fli-index",
  },
  {
    id: "R13", kind: "primary", author: "Mina Narayanan, Jessica Ji, Vikram Venkatram, Ngor Luong (CSET)", title: "AI Governance at the Frontier: Unpacking Foundational Assumptions",
    date: "2025-11 (month only)", url: "https://cset.georgetown.edu/wp-content/uploads/CSET-AI-Governance-at-the-Frontier.pdf",
    read: "The PDF. Page numbers were inferred from printed footers in the text the tool returned.", checked: "2026-11-22", hubId: "pub-cset",
  },
  {
    id: "R14", kind: "primary", author: "Girish Sastry, Lennart Heim, Haydn Belfield, Markus Anderljung et al.", title: "Computing Power and the Governance of Artificial Intelligence",
    date: "2024-02-14", url: "https://www.governance.ai/research-paper/computing-power-and-the-governance-of-artificial-intelligence",
    read: "Abstract page only. We did not read the full paper.", checked: "2026-11-22", hubId: "pub-compute",
  },
  {
    id: "R15", kind: "primary", author: "Dan Hendrycks, Mantas Mazeika, Thomas Woodside", title: "An Overview of Catastrophic AI Risks",
    date: "2023-06-21 (first arXiv version)", url: "https://arxiv.org/abs/2306.12001",
    read: "Abstract and executive summary (first part of the page).", checked: "2026-11-22", hubId: "pub-catastrophic",
  },
  {
    id: "R16", kind: "primary", author: "Yoshua Bengio, Stephen Clare, Carina Prunkl et al.", title: "International AI Safety Report 2026 (arXiv deposit)",
    date: "Report 2026-02-03 (per the official site, not opened). arXiv deposit submitted 2026-02-24.", url: "https://arxiv.org/abs/2602.21012",
    read: "arXiv abstract page only. We did not read the report.", checked: "2026-11-22", hubId: "pub-iasr-2026",
  },
  {
    id: "R17", kind: "secondary", author: "Plural Policy (Open States)", title: "California SB 53 bill page (reproduces the Legislative Counsel's Digest)",
    date: "Page shows: became law 29 September 2025", url: "https://open.pluralpolicy.com/ca/bills/20252026/SB53",
    read: "The bill page showed the digest (abstract) only, not the chaptered text. Used only for the enforcement body and the CalCompute provision.", checked: "2026-11-22",
  },
  {
    id: "R18", kind: "secondary", author: "Future of Privacy Forum", title: "California's SB 53: The First Frontier AI Law, Explained",
    date: "Undated in the text we saw", url: "https://fpf.org/blog/californias-sb-53-the-first-frontier-ai-law-explained/",
    read: "Full article (commentary, not law). Used only to corroborate thresholds and to note two features (definition updates, no mandatory third-party audits).", checked: "2026-11-22",
  },
];

// ---------- 1. Comparison ----------
// Each statement: { t: text, r: [reference ids] }  or  { none: "..." } when the pages we read were silent.
const NS = "Not stated in the pages we read.";

const ANALYSIS_DIMENSIONS = [
  { key: "status", label: "Legal status" },
  { key: "scope", label: "What it covers" },
  { key: "mechanism", label: "Core mechanism" },
  { key: "reporting", label: "Transparency and reporting" },
  { key: "enforcement", label: "Enforcement and accountability" },
  { key: "dates", label: "Key dates (as stated in the sources)" },
];

const ANALYSIS_FRAMEWORKS = [
  {
    id: "eu", name: "EU AI Act", kind: "Regulation (EU)",
    cells: {
      status: [
        { t: `Entered into force on 1 August 2024, using "a forward-looking definition of AI and a risk-based approach".`, r: ["R1"] },
        { t: `Became applicable on 2 August 2026, "with some exceptions".`, r: ["R2"] },
      ],
      scope: [
        { t: `Four risk levels. Unacceptable-risk systems are banned; high-risk use cases face strict obligations; a "transparency risk" level exists; minimal-risk AI gets no new rules.`, r: ["R2"] },
        { t: `Providers of general-purpose AI (GPAI) models have rules, "e.g. on transparency and copyright". Providers of GPAI models that may pose systemic risks "should assess and mitigate those risks".`, r: ["R2"] },
      ],
      mechanism: [
        { t: `High-risk systems "will be subject to strict obligations before they can be put on the market", including risk assessment and mitigation and human oversight measures.`, r: ["R2"] },
        { t: `The Act prohibits nine practices, including "social scoring".`, r: ["R2"] },
      ],
      reporting: [
        { t: `Chatbots "must clearly inform users that they are interacting with a machine".`, r: ["R1"] },
        { t: `GPAI providers: rules on transparency (details not given on the pages we read).`, r: ["R2"] },
      ],
      enforcement: [
        { t: `"The AI Office and authorities of the Member States are responsible for implementing, supervising and enforcing the AI Act."`, r: ["R2"] },
        { t: `For GPAI models the AI Office "can request technical documentation, evaluate models, require corrective measures and issue fines". Fine amounts are not given on the pages we read.`, r: ["R2"] },
      ],
      dates: [
        { t: `In force 1 Aug 2024. Prohibitions and AI literacy from 2 Feb 2025. GPAI and governance rules from 2 Aug 2025.`, r: ["R2"] },
        { t: `The Commission page says Annex III high-risk use cases are "extended to 2 December 2027" and Annex I systems run "until 2 August 2028". We did not verify this against the text of Regulation (EU) 2026/1744.`, r: ["R2"] },
      ],
    },
  },
  {
    id: "ca", name: "California SB 53 (Transparency in Frontier AI Act)", kind: "US state statute",
    cells: {
      status: [
        { t: `Signed into law on 29 September 2025 (as stated in the hub's verified entry for this development and on the bill page).`, r: ["R17"] },
        { t: `Analysed here from a committee analysis of the bill as amended 5 September 2025, not the final text.`, r: ["R8"] },
      ],
      scope: [
        { t: `Frontier models: "a quantity of computing power greater than 10^26 integer or floating-point operations".`, r: ["R8"] },
        { t: `Large frontier developers: "annual gross revenues in excess of $500 million in the preceding calendar year".`, r: ["R8"] },
      ],
      mechanism: [
        { t: `A developer must "clearly and conspicuously publish on its internet website a frontier AI framework".`, r: ["R8"] },
        { t: `The bill also creates whistleblower protections for covered employees and a framework for a public cloud computing cluster ("CalCompute").`, r: ["R8", "R17"] },
      ],
      reporting: [
        { t: `Developers must "publish on its internet website a transparency report".`, r: ["R8"] },
        { t: `Critical safety incidents are reported to the Office of Emergency Services within 15 days of discovery. A 24-hour disclosure applies in some circumstances (the circumstances are not shown in the text we read).`, r: ["R8"] },
      ],
      enforcement: [
        { t: `A civil penalty "that does not exceed one million dollars per violation". The analysis notes a reduction from $10 million to $1 million during amendment.`, r: ["R8"] },
        { t: `Enforced by the Attorney General, per the Legislative Counsel's digest.`, r: ["R17"] },
        { t: `The commentary notes SB 53 does not include annual third-party audits (secondary source).`, r: ["R18"] },
      ],
      dates: [
        { t: `Signed 29 September 2025. The effective date is not stated in the pages we read.`, r: ["R17"] },
      ],
    },
  },
  {
    id: "coe", name: "Council of Europe Framework Convention on AI", kind: "International treaty",
    cells: {
      status: [
        { t: `Described as "the first-ever international legally binding treaty" on AI.`, r: ["R5"] },
      ],
      scope: [
        { t: `Aims at "ensuring that the use of AI systems is fully consistent with human rights, democracy and the rule of law" across "the entire lifecycle of AI systems".`, r: ["R5"] },
        { t: `Whether it applies to the public sector, the private sector, or both: ${NS}`, none: true },
      ],
      mechanism: [
        { t: `A legal framework for "managing the risks it may pose to human rights, democracy and the rule of law".`, r: ["R5"] },
      ],
      reporting: [{ t: `Transparency or reporting duties: ${NS}`, none: true }],
      enforcement: [
        { t: `Oversight mechanism: ${NS}`, none: true },
        { t: `Enters into force on the first day of the month after three months have passed since five signatories, including at least three Council of Europe member states, have ratified it. Whether that has happened was not verified.`, r: ["R5"] },
      ],
      dates: [
        { t: `Opened for signature 5 September 2024. Signed that day by the United Kingdom, Israel, the United States and the European Union, among others.`, r: ["R5"] },
      ],
    },
  },
  {
    id: "nist", name: "NIST AI Risk Management Framework (AI RMF 1.0) and Generative AI Profile", kind: "US voluntary framework",
    cells: {
      status: [
        { t: `"The Framework is intended for voluntary use."`, r: ["R3"] },
        { t: `The Generative AI Profile (NIST AI 600-1) is also "intended for voluntary use".`, r: ["R4"] },
      ],
      scope: [
        { t: `Covers "the design, development, use, and evaluation of AI products, services, and systems".`, r: ["R3"] },
        { t: `The Generative AI Profile is a "cross-sectoral profile of and companion resource for" AI RMF 1.0.`, r: ["R4"] },
      ],
      mechanism: [
        { t: `"A framework to better manage risks to individuals, organizations, and society associated with artificial intelligence (AI)", developed through "a consensus-driven, open, transparent, and collaborative process".`, r: ["R3"] },
      ],
      reporting: [{ t: `Reporting duties: ${NS} (it is voluntary).`, none: true }],
      enforcement: [{ t: `Enforcement body or penalties: ${NS}`, none: true }],
      dates: [
        { t: `AI RMF 1.0 released 26 January 2023. Generative AI Profile published 26 July 2024.`, r: ["R3", "R4"] },
      ],
    },
  },
  {
    id: "bletchley", name: "Bletchley Declaration (AI Safety Summit)", kind: "International declaration",
    cells: {
      status: [
        { t: `Agreed by "28 countries ... as well as the EU". Whether it is binding: ${NS}`, r: ["R7"] },
      ],
      scope: [
        { t: `Frontier AI. Countries recognise "substantial risks may arise from potential intentional misuse or unintended issues of control" and potential for "serious, even catastrophic, harm".`, r: ["R7"] },
      ],
      mechanism: [
        { t: `Countries agreed to "support a network of scientific research on Frontier AI" and to inform "national and international risk-based policies".`, r: ["R7"] },
        { t: `Actors developing frontier AI "have a particular responsibility for ensuring the safety of these systems, including by implementing systems to test them".`, r: ["R7"] },
      ],
      reporting: [{ t: `Reporting duties: ${NS}`, none: true }],
      enforcement: [{ t: `Enforcement: ${NS}`, none: true }],
      dates: [{ t: `Agreed 1 November 2023.`, r: ["R7"] }],
    },
  },
  {
    id: "un", name: "UN General Assembly A/RES/79/325 (Scientific Panel and Global Dialogue)", kind: "UN resolution (institutions)",
    cells: {
      status: [
        { t: `A General Assembly resolution that creates two bodies. The panel's annual report is "policy-relevant but non-prescriptive".`, r: ["R6"] },
      ],
      scope: [
        { t: `The panel has 40 members "serving in their personal capacity" for three-year terms. The Dialogue involves "Governments and all relevant stakeholders".`, r: ["R6"] },
      ],
      mechanism: [
        { t: `The panel issues "evidence-based scientific assessments synthesizing and analysing existing research" and can "provide updates on its work up to twice a year".`, r: ["R6"] },
        { t: `The Dialogue is "a platform to discuss international cooperation, share best practices and lessons learned".`, r: ["R6"] },
      ],
      reporting: [
        { t: `The panel presents its annual report at the Global Dialogue.`, r: ["R6"] },
      ],
      enforcement: [
        { t: `No enforcement role is described for either body in the paragraphs we read: the panel's output is non-prescriptive and the Dialogue is a discussion platform.`, r: ["R6"] },
      ],
      dates: [
        { t: `Resolution dated 26 August 2025. The Dialogue meets annually for up to two days, alternating between Geneva and New York, with Geneva in 2026 and New York in 2027.`, r: ["R6"] },
      ],
    },
  },
];

// ---------- 2. Gaps and differences ----------
const ANALYSIS_GAPS = [
  {
    id: "G1", type: "Difference", title: "Who is legally bound differs sharply across the instruments",
    sourced: [
      { t: `The EU's AI Office and Member State authorities are "responsible for implementing, supervising and enforcing the AI Act".`, r: ["R2"] },
      { t: `SB 53 sets a civil penalty "that does not exceed one million dollars per violation", enforced by the Attorney General.`, r: ["R8", "R17"] },
      { t: `The Council of Europe text is "the first-ever international legally binding treaty".`, r: ["R5"] },
      { t: `The NIST framework is "intended for voluntary use".`, r: ["R3"] },
      { t: `The UN panel's report is "policy-relevant but non-prescriptive".`, r: ["R6"] },
    ],
    analysis: `Of the six instruments compared, only the EU AI Act and SB 53 are described in the sources we read as having named enforcement bodies or penalties aimed at developers. The treaty is binding in law, but the press release does not describe how compliance is overseen. The rest are voluntary, declaratory or advisory. For a developer, practical obligations therefore seem to depend on jurisdiction (the EU market, or a developer that meets California's thresholds) far more than on the international instruments.`,
    confidence: "Medium",
    limits: `We read press releases, a committee analysis and summary pages, not the full legal texts. Other binding provisions may exist that we did not see.`,
  },
  {
    id: "G2", type: "Difference", title: "The two enforceable regimes trigger on different tests of what counts as a most-capable model",
    sourced: [
      { t: `California: compute "greater than 10^26 integer or floating-point operations" and revenue "in excess of $500 million".`, r: ["R8"] },
      { t: `The EU page links systemic risk to models that are "very capable or widely used", and gives no number on that page.`, r: ["R2"] },
      { t: `A commentary says the California compute count includes cumulative compute from fine-tuning or modifications, and that a Department of Technology role recommends updates to key definitions which the Legislature must adopt.`, r: ["R18"] },
      { t: `The compute paper argues compute is "detectable, excludable, and quantifiable", and warns that "poorly scoped approaches to compute governance carry significant risks".`, r: ["R14"] },
    ],
    analysis: `California uses a numeric compute-and-revenue test; the EU page we read uses capability and reach language. The compute paper gives a research reason for numeric triggers (they can be measured) together with a warning about scoping them badly. What the sources leave open is how a fixed number stays meaningful as training methods change. California's stated answer is a recommend-then-legislate update process (secondary source). We found no equivalent statement on the EU page.`,
    confidence: "Medium",
    limits: `The EU Act's text may contain a numeric presumption we did not read. The compute paper was read as an abstract only. The California commentary is secondary.`,
  },
  {
    id: "G3", type: "Gap", title: "Disclosure-based regimes depend on the quality of what is disclosed",
    sourced: [
      { t: `SB 53 requires publishing "a frontier AI framework" and "a transparency report".`, r: ["R8"] },
      { t: `The EU page lists rules "on transparency and copyright" for GPAI providers.`, r: ["R2"] },
      { t: `CSET: "All five proposals assume that disclosures from AI companies about AI development are necessary."`, r: ["R13"] },
      { t: `SB 53 does not include annual third-party audits (commentary).`, r: ["R18"] },
      { t: `FLI's index: "Existential Safety is the weakest domain industry-wide" and "No company exceeds C-; most score D or below" in that domain. Method: six domains, 37 indicators, nine companies, a panel of seven reviewers, evidence to 3 June 2026.`, r: ["R12"] },
    ],
    analysis: `If disclosure is the main compliance lever, the quality of what gets disclosed becomes the limiting factor. The FLI grades are one panel's judgement, not an audit, but they point at the area (existential-safety planning) where a published document is hardest for an outsider to check. None of the sources we read describe an independent check of the frameworks that developers publish. That is the gap we identify.`,
    confidence: "Medium-low",
    limits: `FLI is an advocacy-oriented organisation and grades use discretionary weights. We did not read how SB 53 or the EU Act handle review of published documents beyond the pages cited.`,
  },
  {
    id: "G4", type: "Difference", title: "Technical evidence is described in months; the main legal instruments phase in over years",
    sourced: [
      { t: `AISI: "Performance in some areas is doubling every eight months". The report also says it "should not be read as a forecast".`, r: ["R11"] },
      { t: `EU AI Act: in force August 2024; GPAI rules from August 2025; general applicability August 2026 "with some exceptions"; Annex III high-risk use cases "extended to 2 December 2027".`, r: ["R2"] },
      { t: `The Council of Europe treaty enters into force only after five ratifications, including at least three member states.`, r: ["R5"] },
      { t: `The UN panel can "provide updates on its work up to twice a year".`, r: ["R6"] },
    ],
    analysis: `This is a difference in timescales, not proof that the legal instruments are too slow. Within our set, the UN panel's twice-yearly updates are the only mechanism explicitly built for frequent refresh, but its output is non-prescriptive, so it cannot change obligations by itself.`,
    confidence: "Medium",
    limits: `"Doubling" applies to "some areas" only, and AISI says its report may underestimate capabilities. The EU dates come from a Commission summary page and were not checked against Regulation (EU) 2026/1744.`,
  },
  {
    id: "G5", type: "Gap", title: "UK: everyday-rights coverage (2023 finding) versus a security-focused institute (2025)",
    sourced: [
      { t: `Ada Lovelace Institute (2023): "the UK's diffuse legal and regulatory network for AI currently has significant gaps".`, r: ["R9"] },
      { t: `It also found "Even when legal safeguards are in place, accessing redress can be costly and unrealistic for many affected people", and recommended exploring an "AI ombudsman".`, r: ["R9"] },
      { t: `UK Government (2025): the AI Safety Institute becomes the AI Security Institute; "It will not focus on bias or freedom of speech."`, r: ["R10"] },
    ],
    analysis: `The two sources address different problems. The 2023 briefing is about rights and redress for people affected by AI-informed decisions. The 2025 change focuses the UK's AI-specific institute on serious security risks. From these two documents alone we cannot say whether the 2023 gaps still exist.`,
    confidence: "Low",
    limits: `We did not check current UK legislation or regulator guidance. The briefing is from July 2023 and addresses a policy proposal that has since changed.`,
  },
  {
    id: "G6", type: "Difference", title: "Proposals rest on assumptions that are rarely tested",
    sourced: [
      { t: `CSET analysed "five U.S.-centric AI governance proposals" and found "proposals lack consensus regarding the techniques that are most effective at mitigating AI risks and harms".`, r: ["R13"] },
      { t: `Assumptions it lists include that government has enough talent to do technical work such as standard-setting, and that a third-party auditing ecosystem exists.`, r: ["R13"] },
      { t: `The five proposals include SB 1047, a California bill that a commentary contrasts with SB 53.`, r: ["R13", "R18"] },
    ],
    analysis: `CSET's method is useful for reading our comparison table: where an instrument relies on a regulator's technical capacity (such as the EU's AI Office), that capacity is an assumption, not a demonstrated fact. CSET studied proposals, not the enacted laws we compare, so its evidence applies only by analogy.`,
    confidence: "Medium-low",
    limits: `We read the CSET brief but not each of the five proposals. Page numbers were inferred.`,
  },
];

// ---------- 3. Key research findings (sourced, not our analysis) ----------
const ANALYSIS_FINDINGS = [
  {
    id: "F1", topic: "Capabilities", ref: "R11", scope: "UK AISI internal testing of 30+ frontier systems released 2022 to October 2025",
    text: `AI models completed apprentice-level cyber tasks about half the time on average, up from just over 10% in early 2024, and AISI says it tested the first model able to complete expert-level cyber tasks in 2025.`,
    quote: `AI models can now complete apprentice-level tasks 50% of the time on average.`,
    caveat: `AISI says the report "may generally underestimate the ceiling of capabilities" and is not a forecast.`,
  },
  {
    id: "F2", topic: "Safeguards", ref: "R11", scope: "Same testing programme",
    text: `AISI found universal jailbreaks for every system it tested, and a 40x difference in expert effort needed to jailbreak two models released six months apart (biological misuse requests).`,
    quote: `We've discovered universal jailbreaks for every single system we've tested to date.`,
    caveat: `Safeguards are described as improving but still vulnerable.`,
  },
  {
    id: "F3", topic: "Loss-of-control precursors", ref: "R11", scope: "Controlled, simplified evaluations",
    text: `Success rates on self-replication evaluations rose from 5% to 60% between 2023 and 2025. AISI also reports there is not yet evidence of models attempting to sandbag or self-replicate spontaneously.`,
    quote: `Success rates on our self-replication evaluations went from 5% to 60% between 2023 and 2025.`,
    caveat: `These are controlled tests, not observations of real-world behaviour.`,
  },
  {
    id: "F4", topic: "Industry safety practice", ref: "R12", scope: "Nine companies; evidence to 3 June 2026; seven-member independent panel",
    text: `FLI's index gave overall grades from C+ (Anthropic) to F (DeepSeek, Mistral, xAI). Existential Safety was the weakest domain, with six companies scoring F.`,
    quote: `Existential Safety is the weakest domain industry-wide.`,
    caveat: `Grades are the panel's judgement with discretionary weights. Individual reviewer grades are confidential.`,
  },
  {
    id: "F5", topic: "Governance proposals", ref: "R13", scope: "Five U.S.-centric proposals",
    text: `CSET found the proposals lack consensus on which techniques best mitigate AI risk, but all five assume company disclosures are necessary. It advises policymakers to identify the assumptions behind proposals.`,
    quote: `All five proposals assume that disclosures from AI companies about AI development are necessary.`,
    caveat: `Page numbers inferred from printed footers.`,
  },
  {
    id: "F6", topic: "UK regulation (2023)", ref: "R9", scope: "UK regulatory system as of July 2023",
    text: `Ada Lovelace Institute found significant gaps and uneven coverage in the UK's AI regulatory network, varying regulator powers, and costly routes to redress. It made 18 recommendations.`,
    quote: `the UK's diffuse legal and regulatory network for AI currently has significant gaps`,
    caveat: `Predates later UK developments.`,
  },
  {
    id: "F7", topic: "Compute governance", ref: "R14", scope: "Research paper (abstract read)",
    text: `The authors argue AI-relevant compute is an effective point of intervention because it is detectable, excludable and quantifiable and comes from a concentrated supply chain. Readiness varies: some proposals are being piloted, others need fundamental research. Poorly scoped approaches carry risks for privacy, economic impacts and centralisation of power.`,
    quote: `it is detectable, excludable, and quantifiable, and is produced via an extremely concentrated supply chain.`,
    caveat: `The specific guardrails the authors propose are not on the abstract page.`,
  },
  {
    id: "F8", topic: "Catastrophic risk", ref: "R15", scope: "Overview paper (abstract and executive summary read)",
    text: `The paper organises catastrophic AI risks into four categories: malicious use, AI race dynamics, organisational risks and rogue AIs.`,
    quote: `malicious use, in which individuals or groups intentionally use AIs to cause harm`,
    caveat: `First arXiv version (June 2023). Later versions may differ.`,
  },
  {
    id: "F9", topic: "Scientific assessment process", ref: "R16", scope: "arXiv abstract page",
    text: `The International AI Safety Report 2026 was mandated by nations attending the Bletchley AI Safety Summit. Over 100 experts contributed with full editorial discretion, and representatives from 29 nations, the UN, the OECD and the EU sat on its Expert Advisory Panel.`,
    quote: `The International AI Safety Report 2026 synthesises the current scientific evidence on the capabilities`,
    caveat: `We read the arXiv abstract only. The official publication page could not be opened.`,
  },
];

// ---------- 4. Recommendations (OUR ANALYSIS) ----------
const ANALYSIS_RECS = [
  {
    id: "P1", title: "Where a regime relies on published safety frameworks, set minimum content and add an independent review step",
    audience: "Legislators and regulators drafting or revising disclosure-based rules",
    basis: ["G3"], refs: ["R2", "R8", "R12", "R13", "R18"],
    reasoning: `SB 53 and the EU's GPAI rules both lean on disclosure (R8, R2). CSET says all five proposals it studied assume disclosure is necessary (R13), and the commentary says SB 53 has no annual third-party audits (R18). FLI's panel rates existential-safety planning weakest across companies (R12). A published document that nobody independently reviews gives limited assurance. A minimum content standard and a defined reviewer would address that.`,
    changeIf: `We would withdraw this if the final text of SB 53 or the EU's GPAI code of practice already requires independent review of published frameworks, which we did not read.`,
  },
  {
    id: "P2", title: "State the type of trigger and a review schedule inside the instrument itself",
    audience: "Drafters of frontier-model and GPAI obligations",
    basis: ["G2"], refs: ["R8", "R14", "R18"],
    reasoning: `California uses fixed compute and revenue numbers (R8) with an update process (R18). The compute paper supports measurable triggers but warns that poorly scoped ones carry significant risks (R14). Writing down why a threshold was chosen, what evidence would move it and when it will be reviewed makes the trade-off visible and checkable.`,
    changeIf: `We would revise this if the EU Act's text already contains a numeric presumption with a review cycle that we did not read.`,
  },
  {
    id: "P3", title: "Tie scheduled legal review points to independent scientific updates",
    audience: "Governments that have joined the UN process or the AI safety summit series",
    basis: ["G4"], refs: ["R2", "R5", "R6", "R11", "R16"],
    reasoning: `Technical findings are reported in months (R11) while legal instruments phase in over years (R2, R5). The UN panel can update twice a year (R6) and the International AI Safety Report is produced by an international expert group (R16), but neither can change obligations. Building a defined review point that must consider such updates would turn evidence into an input to law.`,
    changeIf: `This is weaker if existing instruments already include mandatory review clauses that the pages we read did not mention.`,
  },
  {
    id: "P4", title: "Pair a security-focused institute with an explicit route to redress for everyday harms",
    audience: "UK policymakers and, by analogy, any government centring AI policy on security",
    basis: ["G5"], refs: ["R9", "R10"],
    reasoning: `The 2023 Ada Lovelace briefing found redress costly and recommended exploring an AI ombudsman (R9). The 2025 UK announcement says the institute will not focus on bias or freedom of speech (R10). Someone should be responsible for the issues that fall outside the institute's stated focus.`,
    changeIf: `Low confidence. If the UK has since created a redress route or consolidated protections, this recommendation no longer applies. We did not check current UK law.`,
  },
  {
    id: "P5", title: "Write down the assumptions behind each proposal and test the ones that carry the most weight",
    audience: "Anyone proposing or comparing AI governance measures",
    basis: ["G6"], refs: ["R13"],
    reasoning: `This is CSET's own advice ("We advise policymakers to identify the assumptions that underpin AI governance proposals", R13). We endorse it and add one practical use: in our comparison table, treat regulator technical capacity and an auditing ecosystem as assumptions to be checked, not facts.`,
    changeIf: `This is a method recommendation. Evidence that the assumptions already hold (for example a functioning auditor market) would reduce its priority.`,
  },
];

// ---------- 5. Methodology and limitations ----------
const ANALYSIS_METHOD = [
  `Question: ${ANALYSIS_META.question}`,
  `Selection: instruments already listed in this hub's verified policy entries (EU AI Act, California SB 53, Council of Europe convention, Bletchley Declaration, UN resolution) plus the NIST AI RMF. Research findings were drawn from publications already in the hub's research library.`,
  `Reading: every source was opened on 2026-11-22 (or checked on 2026-11-19 for the hub entries). Official and primary documents were preferred. Two secondary sources (R17, R18) are used only for the narrow points marked in the reference list.`,
  `Extraction: a fact is recorded only if the page says it. Where a page was silent, the table says "Not stated in the pages we read".`,
  `Labelling: every statement is either a sourced fact (with a reference id) or our analysis (with the facts it rests on, a confidence level and what we did not check).`,
  `Dates: three kinds of date stay separate: the date a source was published or happened, the date we read it, and the date an entry was added to the site.`,
  `AI assistance: this section was drafted with AI assistance (Claude) and must be reviewed by the site's author before it is presented as their own analysis.`,
];

const ANALYSIS_LIMITS = [
  `We read summary pages, press releases, abstracts and a committee analysis. We did not read the full legal texts of the EU AI Act, Regulation (EU) 2026/1744, the Council of Europe convention or the final SB 53 text, so we make no claims about EU fine amounts, exemptions, or the treaty's oversight mechanism.`,
  `SB 53 is described from an analysis of a pre-enactment amended version plus a bill-page digest. The law as signed may differ in details.`,
  `Text was read through a fetch tool that extracts and may summarise a page. Quotations are as returned by the tool and were not re-checked character by character. Check a quotation against the live page before citing it formally.`,
  `Several sources were read in part (abstracts only for R4, R14, R15, R16). We make no claims about their detailed content.`,
  `The comparison is selective and excludes other jurisdictions. It describes what instruments say, not whether they work.`,
  `Pages change. Everything here reflects the pages as read on the dates shown.`,
  `Several sources come from organisations with stated missions (for example FLI and the Ada Lovelace Institute). Their findings are their own assessments.`,
  `The analysis is limited to public documents that could be read in the time available. It is not a substitute for legal analysis based on the full texts.`,
];
