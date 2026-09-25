/**
 * Single source of truth for portfolio content.
 *
 * Every fact here is taken from one of:
 *   [R] client/public/resume.pdf
 *   [S] github.com/Harshitahusts/sarathi-school-commute — README + docs/complete-product-design-and-lifecycle-document.pdf
 *   [P] the previous version of this site (links, contact details, About statement)
 * Do not add numbers or outcomes that are not in one of those sources.
 */

export const LINKS = {
  site: "https://harshit-gupta-six.vercel.app",
  linkedin: "https://www.linkedin.com/in/harshit-gupta-316b35229/", // [P][R]
  github: "https://github.com/Harshitahusts", // [P]
  x: "https://x.com/Harshit54283", // [P]
  resume: "/resume.pdf", // [P]
  email: "mailto:guptaharshit619@gmail.com", // [P]
  emailLabel: "guptaharshit619@gmail.com",
  phone: "tel:+919522012835", // [P][R]
  phoneLabel: "+91 95220 12835",
  sarathiLive: "https://sarathi-school-commute.vercel.app/", // [P]
  sarathiRepo: "https://github.com/Harshitahusts/sarathi-school-commute", // [P]
  sarathiDoc:
    "https://github.com/Harshitahusts/sarathi-school-commute/blob/main/docs/complete-product-design-and-lifecycle-document.pdf", // [S]
} as const;

/* ------------------------------------------------------------------------ */
/* Journey — the lifecycle of a product, told with Harshit's own evidence.   */
/* ------------------------------------------------------------------------ */

export type Evidence = { text: string; source: string };

export type Chapter = {
  id: string;
  index: string;
  label: string;
  headline: string;
  accent: string;
  body: string;
  evidence?: Evidence[];
  signals?: string[];
  metrics?: { value: number; prefix?: string; suffix?: string; decimals?: number; from?: string; label: string; source: string }[];
};

export const chapters: Chapter[] = [
  {
    id: "idea",
    index: "01",
    label: "Idea",
    headline: "An idea is easy.",
    accent: "Finding the right problem isn’t.",
    body:
      "I’m an Associate Product Manager at Kratikal Tech, working on AutoSecT — an AI-driven cybersecurity SaaS platform. Most of my work starts before the first feature: figuring out which problem is worth a team’s time.",
    evidence: [
      { text: "Building AI-driven B2B SaaS and cybersecurity platforms across 0→1 and growth stages.", source: "Kratikal Tech · since Jan 2025" },
    ],
  },
  {
    id: "discover",
    index: "02",
    label: "Discover",
    headline: "Listen before",
    accent: "you decide.",
    body:
      "Signals arrive from everywhere — customers, telemetry, the market, engineering constraints, the business model. Discovery is the work of making them converge on a single decision.",
    signals: ["Users", "Data", "Market", "Constraints", "Business", "Technology"],
    evidence: [
      { text: "Ran 20+ customer discovery calls to refine AutoSecT’s scan-based pricing.", source: "Kratikal · AutoSecT" },
      { text: "Prioritised performance work from scan telemetry insights.", source: "Kratikal · AutoSecT" },
      { text: "Analysed user behaviour and workflow drop-offs to find bottlenecks.", source: "BoloForms" },
    ],
  },
  {
    id: "define",
    index: "03",
    label: "Define",
    headline: "Structure turns noise",
    accent: "into a direction.",
    body:
      "A defined problem has a user, a goal, constraints and a way to know you were right. Everything else is opinion.",
    signals: ["Problem", "User", "Goal", "Constraints", "Success metric"],
    evidence: [
      { text: "Defined the ICP and repositioned AutoSecT as an MSSP-focused platform; defined core KPIs.", source: "Kratikal · AutoSecT" },
    ],
  },
  {
    id: "build",
    index: "04",
    label: "Build",
    headline: "Decisions become",
    accent: "systems.",
    body:
      "Building is where product, engineering and security have to agree on the same picture. My job is to keep that picture sharp and the trade-offs explicit.",
    evidence: [
      { text: "Led a multi-stage AI vulnerability-verification pipeline using NVD intelligence datasets.", source: "Kratikal · AI Security Verification" },
      { text: "Built automated exploit generation and validation workflows on LLM pipelines.", source: "Kratikal · AI Security Verification" },
      { text: "Implemented AI requirement tooling to shorten engineering iteration cycles and improve delivery predictability.", source: "Kratikal · Platform" },
    ],
  },
  {
    id: "launch",
    index: "05",
    label: "Launch",
    headline: "Shipping is the start",
    accent: "of learning.",
    body:
      "A release is a question put to the market. Pricing, packaging and the enterprise conversation are part of the product, not an afterthought.",
    signals: ["MVP", "Experiment", "Release", "Feedback"],
    evidence: [
      { text: "Designed a domain-approval optimisation that improved client scanning efficiency and MSSP adoption.", source: "Kratikal · AutoSecT" },
      { text: "Supported enterprise deals (HROne, Honda) through technical solutioning, pricing strategy and architecture walkthroughs.", source: "Kratikal · AutoSecT" },
    ],
  },
  {
    id: "measure",
    index: "06",
    label: "Measure",
    headline: "If it moved,",
    accent: "show the number.",
    body: "Only outcomes I can point to. Each one is tied to a decision.",
    metrics: [
      { value: 12.5, prefix: "$", suffix: "K", decimals: 1, label: "MRR driven by scan-based pricing", source: "Kratikal · AutoSecT" },
      { value: 40, suffix: "%", label: "fewer false positives via contextual AI verification", source: "Kratikal · AutoSecT" },
      { value: 35, suffix: "%", label: "faster crawls", source: "Kratikal · AutoSecT" },
      { value: 100, from: "4s →", suffix: "ms", label: "PDF render latency, for 20K+ users", source: "BoloForms" },
    ],
  },
  {
    id: "iterate",
    index: "07",
    label: "Iterate",
    headline: "Version two is",
    accent: "where the product is.",
    body:
      "AutoSecT’s verification layer didn’t appear in one release. Each step answered the question the previous one left open.",
    signals: [
      "Vulnerability detection",
      "AI verification",
      "Exploit validation",
      "RAG infrastructure context",
      "Explainable insights",
    ],
    evidence: [
      { text: "RAG-based infrastructure scanning brought false positives to near-zero, against a 20% industry benchmark.", source: "Kratikal · AI Security Verification" },
      { text: "Ran AI evaluation experiments to benchmark model accuracy and false-positive reduction.", source: "Kratikal · AI Security Verification" },
    ],
  },
  {
    id: "next",
    index: "08",
    label: "Next",
    headline: "Still",
    accent: "building.",
    body: "That’s how I build. That’s how I think. The rest of this page is the evidence.",
  },
];

/* ------------------------------------------------------------------------ */
/* Case studies                                                              */
/* ------------------------------------------------------------------------ */

export type StoryStep = { label: string; text: string };

export const autosect = {
  id: "autosect",
  kicker: "Flagship · Kratikal Tech · 2025 → now",
  title: "AutoSecT",
  question: "Finding vulnerabilities is the easy part. What should a security team actually act on?",
  summary:
    "AutoSecT is Kratikal’s AI-driven security platform. I work on two connected problems: making its findings trustworthy through AI verification, and making the business work by repositioning it for managed security service providers.",
  role: "Associate Product Manager",
  story: [
    { label: "Problem", text: "Scanners produce findings; security teams need decisions. Every false positive costs an analyst time and costs the platform trust." },
    { label: "Context", text: "A B2B cybersecurity SaaS in its growth stage, selling to enterprises and — after repositioning — to MSSPs who run security for many clients." },
    { label: "Users", text: "MSSP operators scanning at client scale, and enterprise security teams who have to act on the results." },
    { label: "Insight", text: "20+ customer discovery calls shaped a scan-based pricing model; scan telemetry showed where performance work would matter most." },
    { label: "Decision", text: "Define the ICP around MSSPs, price on scans, and invest in verifying findings rather than only producing more of them." },
    { label: "Solution", text: "A multi-stage verification pipeline: NVD intelligence, LLM-driven exploit generation and validation, RAG-based infrastructure context, and an explainability layer on every insight." },
    { label: "Execution", text: "Led roadmap discussions aligning Engineering, Security and Leadership with enterprise GTM priorities; introduced AI requirement tooling to shorten iteration cycles." },
    { label: "Measurement", text: "KPIs across activation, adoption, scan success rate and enterprise expansion. AI evaluation experiments benchmarked accuracy and false-positive reduction." },
    { label: "Outcome", text: "$12.5K MRR from scan-based pricing, 35% faster crawls, 40% fewer false positives — and near-zero false positives from RAG-based infrastructure scanning versus a 20% industry benchmark." },
  ] as StoryStep[],
  pipeline: [
    { name: "Detect", detail: "Infrastructure & application scans" },
    { name: "Enrich", detail: "NVD intelligence datasets" },
    { name: "Validate", detail: "LLM exploit generation & validation" },
    { name: "Contextualise", detail: "RAG over infrastructure context" },
    { name: "Explain", detail: "Enterprise-ready insight + explainability" },
  ],
  outcomes: [
    { value: "$12.5K", label: "MRR · scan-based pricing" },
    { value: "−40%", label: "false positives" },
    { value: "−35%", label: "crawl time" },
    { value: "≈0 vs 20%", label: "false positives vs industry benchmark (RAG scanning)" },
  ],
};

export const sarathi = {
  id: "sarathi",
  kicker: "Personal product · Prototype · 2025",
  title: "Sarathi",
  question: "How do you make the school commute safe enough that a parent stops worrying?",
  summary:
    "A product-design case study and interactive prototype for a scheduled, parent-paid school commute for Classes 1–5 — designed around one question ride-hailing never had to answer: “Who has my child right now, and who confirmed it?”",
  users: [
    { name: "Parent", job: "Proof my child reached school safely — without calling anyone." },
    { name: "Child", job: "A commute that feels normal, not watched or singled out." },
    { name: "Driver & attendant", job: "Predictable work, clear routes, simple safety steps." },
    { name: "School", job: "A record of which child left with which adult." },
  ],
  insight:
    "The parent’s anxiety lives in a “dark window” between boarding and a confirmed handoff. The product opportunity is that information gap — not a map with a moving dot.",
  custody: ["Home parent", "Driver + attendant", "School gate", "Home collector"],
  priorities: [
    { tier: "P0", items: ["Locked crew & pod", "Headcount + capacity interlock", "Handoff log", "Route corridor lock", "Calm live tracking"] },
    { tier: "P1", items: ["Silent SOS band — until tested with children"] },
    { tier: "Never in v1", items: ["Parent-viewable cabin video", "In-ride tablets"] },
  ],
  story: [
    { label: "Problem", text: "Adult ride-hailing replaces trust with ratings and a map. For a seven-year-old, the child can’t verify the driver or call support — custody is the real problem." },
    { label: "Decision", text: "Prioritise by harm avoided, not revenue: a RICE-style adaptation where rare-but-catastrophic failures (child left behind, wrong collector) still get engineering." },
    { label: "Solution", text: "Same crew, same pod, fixed corridors, a hard capacity cap, and every custody transfer recorded, verified and recoverable — with humans in control of exceptions." },
    { label: "AI boundary", text: "Small, local, assistive AI over event-log text. “AI flags and explains; humans decide.” No face matching, emotion detection or autonomous escalation." },
    { label: "Measurement", text: "North star: Weekly Verified Safe Handoffs. Explicitly not app sessions — a calm parent should open the app less." },
    { label: "Open question", text: "The biggest uncertainty isn’t the concept; it’s whether parents pay, schools participate and mixed operators stay consistent at route density. The pilot plan is built to test exactly that." },
  ] as StoryStep[],
  surfaces: ["Parent view", "Crew view", "School console", "Control room"],
  targets: [
    { value: "0", label: "children left behind" },
    { value: "≥ 99.5%", label: "verified handoff rate" },
    { value: "< 90s", label: "SOS response time" },
  ],
};

export const boloforms = {
  id: "boloforms",
  kicker: "Internship · BoloForms · May – Jul 2024",
  title: "BoloForms",
  question: "When a core workflow is slow, is performance a product problem?",
  summary:
    "At BoloForms I treated a 4-second PDF render as a product problem, not only an engineering ticket — partnering with engineering to move it to 100ms for 20K+ users.",
  story: [
    { label: "Signal", text: "Analysed user behaviour and workflow drop-offs to identify bottlenecks in feature adoption." },
    { label: "Decision", text: "Partnered with engineering to prioritise performance and usability improvements using customer-feedback insights." },
    { label: "Solution", text: "Async rendering and lazy-loading architecture for PDFs; a webhook chatbot automation to reduce dashboard navigation friction." },
    { label: "Outcome", text: "PDF render latency from 4s → 100ms for 20K+ users; contributed to PLG initiatives supporting $10K MRR growth expansion." },
  ] as StoryStep[],
};

/* ------------------------------------------------------------------------ */
/* How I think                                                               */
/* ------------------------------------------------------------------------ */

export const thinkingGates = ["Why?", "Who?", "What?", "How?", "Success?"] as const;

export const thinkingExamples: { id: string; name: string; answers: string[] }[] = [
  {
    id: "autosect",
    name: "AutoSecT",
    answers: [
      "Findings only matter if a team can act on them. False positives spend analyst time and platform trust.",
      "MSSPs running security for many clients — a deliberate ICP decision — plus enterprise security teams.",
      "Verified, explainable findings, and pricing that matches how MSSPs actually use scans.",
      "20+ discovery calls for pricing; NVD + LLM exploit validation + RAG infrastructure context for verification.",
      "Activation, adoption, scan success rate, enterprise expansion. Result: $12.5K MRR, −40% false positives.",
    ],
  },
  {
    id: "sarathi",
    name: "Sarathi",
    answers: [
      "“Who has my child right now, and who confirmed it?” — the question ride-hailing never had to answer.",
      "Four users with different jobs: parent, child, driver & attendant, school.",
      "A locked crew, hard capacity, verified handoffs and a human escalation layer. Not cabin video.",
      "Prioritise by harm avoided. Start with one dense pocket and a manual process before hardware.",
      "Weekly Verified Safe Handoffs — deliberately not app sessions or time-in-app.",
    ],
  },
  {
    id: "boloforms",
    name: "BoloForms",
    answers: [
      "A slow render sat inside every document workflow; drop-offs pointed to bottlenecks.",
      "20K+ users working with PDFs day to day.",
      "Faster rendering and less navigation friction.",
      "Async rendering + lazy loading with engineering; a webhook chatbot automation.",
      "4s → 100ms render latency; contributed to PLG work supporting $10K MRR expansion.",
    ],
  },
];

/* ------------------------------------------------------------------------ */
/* Experience                                                                */
/* ------------------------------------------------------------------------ */

export const experience = [
  {
    company: "Kratikal Tech Pvt. Ltd.",
    role: "Associate Product Manager",
    period: "Jan 2025 — Present",
    place: "Noida, India",
    space: "AI-driven cybersecurity SaaS (AutoSecT)",
    owned: "MSSP repositioning and pricing, the AI security-verification platform, core product KPIs and the roadmap with Engineering, Security and Leadership.",
    changed: ["$12.5K MRR", "−35% crawl time", "−40% false positives", "Enterprise deals: HROne, Honda"],
  },
  {
    company: "BoloForms",
    role: "Product Management Intern",
    period: "May — Jul 2024",
    place: "Pune, India",
    space: "Document workflow SaaS",
    owned: "Performance and usability priorities with engineering, workflow drop-off analysis, webhook chatbot automation.",
    changed: ["4s → 100ms rendering", "20K+ users", "PLG · $10K MRR expansion"],
  },
  {
    company: "Google Developer Student Clubs",
    role: "Technical Lead",
    period: "May 2023 — Jan 2024",
    place: "MNIT Jaipur",
    space: "Student technical community",
    owned: "Led a 120+ member community focused on AI tools, product development and applied software engineering; mentored students on AI product deployment.",
    changed: ["120+ members"],
  },
  {
    company: "MNIT Jaipur",
    role: "B.Tech, Chemical Engineering",
    period: "Jan 2021 — May 2025",
    place: "Jaipur, India",
    space: "Education",
    owned: "Malviya National Institute of Technology.",
    changed: [],
  },
];

/* ------------------------------------------------------------------------ */
/* Capabilities — each backed by a line of evidence                          */
/* ------------------------------------------------------------------------ */

export const capabilities = [
  { name: "AI", proof: "LLM pipelines, RAG systems and AI evaluation experiments for security verification." },
  { name: "Data", proof: "SQL (BigQuery), funnel analysis, KPI design, scan telemetry, Mixpanel, Looker Studio." },
  { name: "Experimentation", proof: "Pricing discovery, AI accuracy benchmarks, experiment tracking." },
  { name: "Cybersecurity", proof: "AutoSecT, AI security automation, CSPM and VMDR concepts." },
  { name: "Product strategy", proof: "ICP definition, MSSP repositioning, pricing & packaging, GTM." },
  { name: "Execution", proof: "Enterprise delivery, roadmap alignment, Jira, AI requirement tooling." },
];

export const achievements = [
  "Grew a Twitter audience to 1,300+ followers by publicly documenting a 100 Days of Code challenge.",
  "Qualified KVPY 2018.",
  "Cleared the Pre-Regional Mathematical Olympiad (Pre-RMO) 2016.",
];
