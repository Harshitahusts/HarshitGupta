/**
 * Single source of truth for portfolio content.
 * Every fact here comes from client/public/resume.pdf (or the project links listed in it).
 * Do not add numbers or outcomes that are not in the résumé.
 */

export const LINKS = {
  site: "https://harshit-gupta-six.vercel.app",
  linkedin: "https://www.linkedin.com/in/harshit-gupta-316b35229/",
  github: "https://github.com/Harshitahusts",
  x: "https://x.com/Harshit54283",
  resume: "/resume.pdf",
  email: "mailto:guptaharshit619@gmail.com",
  emailLabel: "guptaharshit619@gmail.com",
  phone: "tel:+919522012835",
  phoneLabel: "+91 95220 12835",
  greentick: "https://greentick.ai",
  grcApp: "https://app.grc-flow.com",
  grcSite: "https://grc-flow.com",
  sarathiLive: "https://sarathi-school-commute.vercel.app/",
  sarathiRepo: "https://github.com/Harshitahusts/sarathi-school-commute",
  sarathiDoc:
    "https://github.com/Harshitahusts/sarathi-school-commute/blob/main/docs/complete-product-design-and-lifecycle-document.pdf",
} as const;

export const hero = {
  role: "Product Manager · AI · B2B SaaS",
  now: "Now launching GreenTick.ai at Suscin Innovation Labs",
  summary:
    "2+ years taking AI-driven B2B SaaS, cybersecurity and compliance products from 0 to 1 — strategy, pricing and go-to-market, backed by SQL, Python and product analytics.",
};

export type Metric = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

export const metrics: Metric[] = [
  {
    value: 12.5,
    prefix: "$",
    suffix: "K",
    decimals: 1,
    label: "MRR from data-backed pricing",
  },
  { value: 20, suffix: "%", label: "more organic clicks in 4 months" },
  {
    value: 40,
    suffix: "%",
    label: "fewer false positives with AI verification",
  },
  {
    value: 100,
    suffix: "ms",
    label: "PDF render, down from 4s, for 20K+ users",
  },
];

export type Role = {
  company: string;
  place: string;
  role: string;
  period: string;
  product?: string;
  points: string[];
  tags: string[];
};

export const experience: Role[] = [
  {
    company: "Suscin Innovation Labs",
    place: "Pune",
    role: "Product Manager",
    period: "Feb 2026 — Present",
    product: "GreenTick.ai",
    points: [
      "Leading the 0→1 launch of GreenTick.ai, an official Meta WhatsApp Cloud API BSP platform for Indian SMEs — roadmap, PRDs, GTM and ICP. First 20 signups in month one across SEO, GEO and Reddit.",
      "Specified 4 core Cloud API flows — WABA onboarding, template approval, webhooks, REST integrations — and designed a multi-tier pricing model that keeps every feature in Basic.",
      "Built the organic growth engine (SEO + GEO audits, content strategy): +20% organic clicks in 4 months.",
    ],
    tags: ["0→1", "WhatsApp Cloud API", "Pricing", "SEO / GEO"],
  },
  {
    company: "Kratikal Tech",
    place: "Noida",
    role: "Associate Product Manager",
    period: "Jan 2025 — Feb 2026",
    product: "AutoSecT",
    points: [
      "Defined the ICP and repositioned AutoSecT for MSSPs; 20+ discovery calls shaped scan-based pricing that drove $12.5K MRR.",
      "Led a multi-stage AI vulnerability-verification pipeline (NVD data, LLM exploit generation, RAG) — false positives to near-zero vs a 20% industry benchmark, validated with AI evals.",
      "Cut crawl time 35% and false positives 40%; supported enterprise deals with HROne and Honda.",
    ],
    tags: ["Cybersecurity", "LLM + RAG", "AI evals", "Positioning"],
  },
  {
    company: "BoloForms",
    place: "Pune",
    role: "Product Management Intern",
    period: "May — Jul 2024",
    points: [
      "Took PDF rendering from 4s to 100ms with async rendering and lazy loading for 20K+ users.",
      "Contributed to PLG work supporting $10K MRR growth; built webhook chatbot automation to lift feature adoption.",
    ],
    tags: ["PLG", "Performance", "Automation"],
  },
];

export type Project = {
  id: string;
  name: string;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  stats: { value: string; label: string }[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "grc-flow",
    name: "GRC-Flow",
    kicker: "0→1 SaaS · DPDP Act compliance",
    title: "AI you can defend in front of an auditor.",
    body: "India’s DPDP Act duties apply from 13 May 2027, with penalties up to ₹250 crore. I scoped a DPDPA-only product for privacy consultants and in-house compliance teams instead of another generic GRC tool.",
    points: [
      "8-step user journey across 15+ modules — consent, 90-day rights requests, 72-hour breach reporting, 5×5 risk register, DPIA, audit log.",
      "Five product rules: law-cited findings, a mandatory human review gate, AI-checked evidence, clear labels for unreadable files, delivery locked until every check passes.",
      "Directed AI coding agents to ship it; owned system design, access control, encryption, audit logging and CI/CD. Hosted on Oracle Cloud, Mumbai.",
    ],
    stats: [
      { value: "47", label: "screens shipped" },
      { value: "350", label: "automated tests" },
      { value: "9+", label: "LLM providers" },
      { value: "15+", label: "modules" },
    ],
    links: [
      { label: "app.grc-flow.com", href: LINKS.grcApp },
      { label: "grc-flow.com", href: LINKS.grcSite },
    ],
  },
  {
    id: "sarathi",
    name: "Sarathi",
    kicker: "Product design · Classes 1–5 commute",
    title: "Who has my child right now — and who confirmed it?",
    body: "A parent-paid, school-supported commute network designed end to end: 4 personas, a 5Es journey map, RICE prioritisation and an 8-screen clickable prototype.",
    points: [
      "North star: Weekly Verified Safe Handoffs, with guardrails — 0 children left behind, 99.5%+ verified handoffs, under 90s SOS response, 18%+ contribution margin.",
      "Local AI (quantized Qwen2.5-3B, YOLOv8n) with DPDP consent, human-in-the-loop escalation and a Gurugram pilot plan.",
    ],
    stats: [
      { value: "0", label: "children left behind" },
      { value: "99.5%", label: "verified handoffs" },
      { value: "<90s", label: "SOS response" },
    ],
    links: [
      { label: "Live prototype", href: LINKS.sarathiLive },
      { label: "Case study", href: LINKS.sarathiDoc },
      { label: "GitHub", href: LINKS.sarathiRepo },
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Product",
    items: [
      "Strategy & roadmap",
      "PRDs & user stories",
      "GTM",
      "Pricing & packaging",
      "ICP",
      "Discovery",
      "RICE",
      "MVP scoping",
      "Agile / Scrum",
    ],
  },
  {
    group: "AI & domain",
    items: [
      "LLMs",
      "RAG",
      "AI evals",
      "MCP",
      "Human-in-the-loop",
      "Cybersecurity SaaS",
      "DPDP Act / GRC",
      "WhatsApp Cloud API",
    ],
  },
  {
    group: "Data",
    items: [
      "SQL (BigQuery)",
      "Python",
      "Mixpanel",
      "Looker Studio",
      "Power BI",
      "Funnels",
      "KPI design",
      "A/B testing",
    ],
  },
  {
    group: "Build",
    items: [
      "System design",
      "REST & webhooks",
      "RBAC & encryption",
      "CI/CD",
      "Claude Code",
      "Cursor",
      "Jira",
      "GitHub",
    ],
  },
];

export const education = {
  school: "MNIT Jaipur",
  degree: "B.Tech, Chemical Engineering",
  period: "2021 — 2025",
};
