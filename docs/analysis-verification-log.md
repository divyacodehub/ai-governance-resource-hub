# Research Analysis: Verification Log

Scope: the Research Analysis page (`js/analysis-data.js`, `js/analysis.js`).
Sources were read on **22 November 2026** (the hub entries they map to were first verified on 19 November 2026; see `data-verification-log.md`).

## How claims were checked
1. Each source page was opened with a fetch tool that returns extracted text.
2. For each point, the tool was asked for verbatim quotations. A fact was recorded only if a quotation was returned; if the page was silent, the table says "Not stated in the pages we read".
3. Wording on the site is a close paraphrase plus short quotations taken from the tool output.
4. **Limits of this method:** the tool may summarise or truncate. Quotations were **not** re-checked character by character against the live pages. Several sources were read only in part (see "Read" below). Full legal texts were **not** read.
5. Analysis statements (gaps, recommendations) are our inferences. Each lists the facts it rests on, a confidence level, and what was not checked.
6. This section was drafted with AI assistance and requires the site author's review before being presented as their own analysis.

## Sources and how much was read
| Ref | Source | Kind | Read |
|---|---|---|---|
| R1 | European Commission, AI Act enters into force (2024-08-01) | Primary | Full page |
| R2 | European Commission, AI Act regulatory framework page (continuously updated) | Primary | Full page. Dates through 2028 not checked against Regulation (EU) 2026/1744 |
| R3 | NIST, AI RMF 1.0 launch page (2023-01-26) | Primary | Full page (core functions not listed there) |
| R4 | NIST AI 600-1 publication page (2024-07-26) | Primary | Abstract only |
| R5 | Council of Europe press release (2024-09-05) | Primary | Full press release; treaty text not read |
| R6 | UN General Assembly A/RES/79/325 (2025-08-26) | Primary | Resolution text |
| R7 | UK Government, Bletchley Declaration press release (2023-11-01) | Primary | Full press release; Declaration text not read |
| R8 | California Assembly Committee on Privacy and Consumer Protection, analysis of SB 53 as amended 5 Sept 2025 | Primary (legislative) | Pre-enactment analysis; chaptered text not read |
| R9 | Ada Lovelace Institute, Regulating AI in the UK (2023-07-18) | Primary | Full web page |
| R10 | UK Government, AI Safety Institute becomes AI Security Institute (2025-02-14) | Primary | Full press release |
| R11 | UK AI Security Institute, Frontier AI Trends Report (2025-12-18) | Primary | Report web page; evaluations not read |
| R12 | Future of Life Institute, AI Safety Index Summer 2026 (July 2026) | Primary | Full web page |
| R13 | CSET, AI Governance at the Frontier (Nov 2025) | Primary | PDF; page numbers inferred |
| R14 | Sastry et al., Computing Power and the Governance of AI (2024-02-14) | Primary | Abstract page only |
| R15 | Hendrycks et al., An Overview of Catastrophic AI Risks (arXiv v1, 2023-06-21) | Primary | Abstract and executive summary |
| R16 | International AI Safety Report 2026, arXiv deposit (submitted 2026-02-24; report dated 3 Feb 2026) | Primary | arXiv abstract page only |
| R17 | Plural Policy bill page for SB 53 (Legislative Counsel's Digest) | **Secondary** | Digest only; used for enforcement body, CalCompute and the signing date |
| R18 | Future of Privacy Forum, California's SB 53 explained | **Secondary** | Full article; used for the cumulative-compute note, definition-update process and "no third-party audits" |

## Points where the sources disagreed, were silent, or needed care
- **EU fines:** the Commission pages read do not give amounts, so none are stated.
- **EU high-risk dates:** R2 says Annex III high-risk use cases are "extended to 2 December 2027" and Annex I systems "until 2 August 2028". The main data log deliberately did not state new high-risk deadlines because the text of Regulation (EU) 2026/1744 was not read. The analysis repeats the Commission's statement with attribution and says it was not checked against the Regulation.
- **SB 53 final text:** details (thresholds, 15-day and 24-hour reporting, $1 million penalty) come from a committee analysis of the bill as amended 5 September 2025. The 24-hour circumstances were not shown in the text read. The effective date was not found.
- **Council of Europe treaty:** scope (public/private sector) and oversight mechanism are not stated in the press release. Entry into force conditions are stated; whether they have been met was not verified.
- **International AI Safety Report date:** the arXiv deposit is dated 24 Feb 2026; the report itself is dated 3 Feb 2026 on the official site (not opened). The analysis cites the arXiv page and says so.
- **UK:** the Ada Lovelace briefing is from July 2023. Current UK legislation was not checked, so Gap G5 has "Low" confidence.

## Claim-to-source map (key claims)
| Claim on the page | Ref | Verbatim text returned by the tool |
|---|---|---|
| EU: risk-based approach | R1 | "based on a forward-looking definition of AI and a risk-based approach" |
| EU: enforcement bodies | R2 | "the AI Office and authorities of the Member States are responsible for implementing, supervising and enforcing the AI Act." |
| EU: GPAI systemic-risk providers | R2 | "For GPAI models that may pose systemic risks, providers should assess and mitigate those risks." |
| EU: application dates | R2 | "became applicable on 2 August 2026, with some exceptions" |
| SB 53: compute threshold | R8 | "a quantity of computing power greater than 10^26 integer or floating-point operations" |
| SB 53: revenue threshold | R8 | "annual gross revenues in excess of $500 million in the preceding calendar year" |
| SB 53: penalty | R8 | "that does not exceed one million dollars per violation" |
| SB 53: incident reporting | R8 | "to OES within 15 days of discovering the critical safety incident" |
| SB 53: enforcement body | R17 | "to be enforced by the Attorney General" |
| CoE: binding | R5 | "It is the first-ever international legally binding treaty" |
| CoE: entry into force | R5 | "after the date on which five signatories, including at least three Council of Europe member states, have ratified it" |
| NIST: voluntary | R3, R4 | "The Framework is intended for voluntary use" / "is intended for voluntary use" |
| UN panel size and output | R6 | "comprising 40 members, serving in their personal capacity" / "one annual policy-relevant but non-prescriptive summary report" |
| UN Dialogue frequency | R6 | "Decides to convene the Dialogue annually for up to two days" |
| Bletchley: responsibility to test | R7 | "have a particular responsibility for ensuring the safety of these systems, including by implementing systems to test them" |
| AISI: capability pace | R11 | "Performance in some areas is doubling every eight months, and expert baselines are being surpassed rapidly." |
| AISI: jailbreaks | R11 | "We've discovered universal jailbreaks for every single system we've tested to date." |
| FLI: weakest domain | R12 | "Existential Safety is the weakest domain industry-wide." |
| CSET: disclosures | R13 | "All five proposals assume that disclosures from AI companies about AI development are necessary." |
| Ada: gaps | R9 | "the UK's diffuse legal and regulatory network for AI currently has significant gaps" |
| UK AISI focus | R10 | "It will not focus on bias or freedom of speech." |
| Compute paper | R14 | "it is detectable, excludable, and quantifiable, and is produced via an extremely concentrated supply chain." |

## Automated checks on the page itself
The page runs 8 citation-consistency checks in the browser (every sourced statement has a reference; every id exists; every reference is cited; links are https and unique; quotations are short; recommendations point to real gaps; each gap states confidence and limits; hub links exist). These test **consistency only**. They do **not** test whether a source says what the page claims.
