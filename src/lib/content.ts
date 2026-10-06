// Single source of truth for portfolio content.
// Both theme A (Systems) and theme B (Signal) render from this file —
// edit here once and both UIs update. Items marked TODO still need your input.

export const profile = {
  name: "Kirti Kumar Sahu",
  handle: "/KIRTISAHU05",
  // Falls back to initials in the Hero avatar if this file is ever missing.
  photo: "/my-pic.jpg",
  role: "Lead Software Engineer | Frontend Architect",
  location: "Bhopal, India",
  // In office in Bengaluru 2016–2020 (CenturyLink, Shippable, JFrog — see
  // `experience` below), fully remote since, now based in Bhopal.
  workPreference: "Remote since 2020 · Open to relocating to Bengaluru",
  timezone: "IST (UTC+5:30) — overlaps 4–6 hrs with US Eastern and most of the European workday",
  tagline:
    "I build and scale production web platforms with React, Next.js, and TypeScript — from architecture and system design to implementation, performance, and production delivery.",
  // Second, shorter line rendered right under `tagline` in the Hero — keep it
  // honest about what's actually shipped (see `projects`), not "exploring".
  aiTagline:
    "Recently extended into AI-native engineering — shipping a streaming LLM assistant and the application layer for a multi-tenant RAG platform.",
  // Default-theme hero extras (BotFriday style): the mint badge above the
  // name, the small "•" proof line under the buttons, and the thin strip
  // along the bottom of the hero.
  heroBadge: "Open to senior frontend & architect roles · Remote",
  heroProofLine: "Leading a 9-person frontend team at CoffeeWeb · 200,000+ users in 175+ countries",
  heroStrip: {
    text: "Want the short version? Ask the AI assistant trained on my experience.",
    linkLabel: "Ask AI",
    href: "/ask-ai",
  },
  logTagline:
    "I’m Kirti. This is my corner of the internet—a place where I share thoughts on tech, life, things I’m learning, and the occasional rabbit hole I find myself exploring. Glad you’re here.",
  // TODO(redesign): consider trimming the bio to ~60 words for the dark hero
  // (it's ~230 now and pushes the buttons far down); the full detail already
  // lives in Experience and the Ask AI knowledge base. Undecided — parked.
  bio: "Lead Software Engineer and Frontend Architect with 10+ years of experience designing, building, and scaling high-performance web platforms across consumer, B2B SaaS, e-commerce, food tech, and market intelligence products. I currently lead a 9-person frontend engineering team at CoffeeWeb, owning frontend architecture for a mobile-first PWA serving 200,000+ users across 175+ countries — including re-architecting an immature, hard-to-maintain codebase into a structured system with clear component boundaries, consistent state/data patterns, and production observability. Before that, I led frontend engineering at Peppo across BookMyShow Deals and a suite of B2B consoles, helped build JFrog Pipelines from inception as part of the JFrog platform — its Vue.js UI and the Node.js client behind it — helped scale Shippable's CI/CD platform to 100,000+ Docker containers a month, and built CenturyLink's e-commerce and mobile ordering platforms. Across every team, I've owned tech stack decisions, hiring, and production reliability — and I'm now extending that decade of frontend architecture into AI-native engineering: I've shipped a streaming LLM assistant (Ask AI) and built the application layer for YourBot, a multi-tenant RAG chatbot platform. This entire site — architecture, the live streaming Ask AI assistant, and deployment — was designed, built, and shipped by me alone, working remotely, with no team in the room.",
  // Replaces the old percentage-based skill meters — those implied a false
  // precision. This groups strengths by category instead.
  coreStrengths: [
    { title: "Frontend Architecture", items: "React · Next.js · TypeScript · State Management · Performance" },
    { title: "Technical Leadership", items: "Architecture · Hiring · Mentoring · Roadmaps · Engineering Standards" },
    { title: "Full Stack", items: "Node.js · PostgreSQL · Prisma · APIs · Authentication" },
    { title: "AI Engineering", items: "RAG · LLM Applications · pgvector · Streaming · Context Engineering" },
  ],
  // One single-line achievement per experience, most recent first — keep in sync with `experience` below
  quickFacts: [
    "I've spent 10+ years turning messy, half-formed product ideas into frontend systems that don't fall over — and I like that part more than writing the first line of code.",
    "Right now I lead a 9-person frontend engineering team building a platform 200,000+ people across 175+ countries use every day, working fully remote.",
    "Early in my career I helped build JFrog Pipelines from inception — the Vue.js UI inside JFrog's platform console, plus the Node.js client its middleware uses to talk to the Pipelines service.",
    "I've hired and grown every frontend team I've led — the team is usually the part I'm proudest of, not the codebase.",
    "5-6 years working fully remote — leading distributed frontend teams and shipping production systems without anyone looking over my shoulder.",
    "I'm teaching myself RAG pipelines and agentic AI the same way I've learned everything else: by shipping something real and letting it break in production.",
  ],
  email: "kirtisahu05@gmail.com",
  phone: "+91 9039909300",
  links: {
    github: "https://github.com/kirtisahu05",
    linkedin: "https://linkedin.com/in/kirtisahu05",
    // Hidden from the site (not active there) — kept for reference. To show it
    // again, add it back to the links list in Contact.tsx and sameAs in layout.tsx.
    leetcode: "https://leetcode.com/u/kirtisahu05/",
    medium: "https://medium.com/@kirtisahu05",
    youtube: "", // TODO: add or leave blank to hide
  },
};

// Supports inline **bold** markup — rendered via renderInline.
export const whyHireMeIntro = {
  lead: "I sit at the intersection of architecture, engineering, and product.",
  body: "I don't just build interfaces. I turn product requirements into technical direction, build systems that can scale, help teams execute, and stay accountable for what happens in production.",
};

export const whyHireMe = [
  {
    id: "architecture",
    file: "strengths/architecture.txt",
    title: "Architecture That Starts With the Product",
    description:
      "I design frontend systems around real product requirements — not around frameworks or trends. At CoffeeWeb, I defined the frontend architecture and technology stack from scratch for a mobile-first platform spanning 16 product domains and serving 200,000+ users across 175+ countries.",
  },
  {
    id: "leadership",
    file: "strengths/leadership.txt",
    title: "Hands-On Technical Leadership",
    description:
      "I lead from the front. I make architectural decisions, write and review code, solve difficult engineering problems, and establish standards — while also giving engineers the ownership and context they need to make good decisions themselves.",
  },
  {
    id: "remote",
    file: "strengths/remote.txt",
    title: "Built for Distributed, Async-First Teams",
    description:
      "5-6 years fully remote, leading and being led without anyone in the room. I document decisions instead of relying on hallway context, drive PR-based reviews and async standups, and stay accountable to outcomes rather than visible hours online. I've led two frontend teams — at CoffeeWeb and Peppo — entirely remotely, from hiring through delivery.",
  },
  {
    id: "execution",
    file: "strengths/execution.txt",
    title: "From Roadmap to Production",
    description:
      "I am comfortable owning the complete engineering lifecycle: understanding requirements, shaping technical solutions, working through dependencies, breaking roadmaps into executable work, coordinating with product and design, and getting features reliably into production.",
  },
  {
    id: "production",
    file: "strengths/production.txt",
    title: "I Care About What Happens After Release",
    description:
      "Shipping is not the finish line. I build with testing, observability, CI/CD, performance, and reliability in mind, and I stay close to production when things go wrong. At CoffeeWeb, I established the team's testing and quality foundation with Jest and React Testing Library, alongside Sentry-based production monitoring and Azure DevOps CI/CD.",
  },
  {
    id: "team-building",
    file: "strengths/team-building.txt",
    title: "I Build Teams, Not Just Codebases",
    description:
      "I've led frontend teams through hiring, technical interviews, sprint execution, task allocation, mentoring, code reviews, knowledge sharing, and technical upskilling. My goal is to build teams that can operate independently, make better decisions, and continuously improve.",
  },
  {
    id: "breadth",
    file: "strengths/breadth.txt",
    title: "Broad Engineering Perspective",
    description:
      "My experience spans consumer products, B2B platforms, SaaS, e-commerce, food tech, MarTech, DevOps, CI/CD, and commodity market intelligence. That breadth helps me look at problems from more than just a frontend perspective and make decisions with the larger system and business in mind.",
  },
  {
    id: "ai",
    file: "strengths/ai.txt",
    title: "Building Toward AI-Native Products",
    description:
      "I've shipped two AI-integrated builds: this site's streaming Ask AI assistant (Gemini API, grounded using context stuffing) and YourBot, a multi-tenant RAG chatbot platform with a pgvector-backed retrieval pipeline, document ingestion, and per-tenant configuration. I'm also leading how my own team adopts AI-assisted development. Agent-based tooling is next on my roadmap.",
  },
];

// Supports inline **bold** markup — rendered via renderInline.
export const whyHireMeClosing = {
  lead: "What You Get",
  body: "A technical leader who can **understand the product, shape the architecture, guide the team, stay hands-on with the code, and take ownership through production.**",
};

// The live "Why work with me" section, rendered by WhyHireMeV2. The older
// whyHireMe/whyHireMeIntro/whyHireMeClosing and professionalAbilities above
// are no longer shown on the page but are kept on purpose — whyHireMe and
// professionalAbilities feed the Ask AI knowledge base.
export const whyHireMeV2Intro = {
  lead: "I sit at the intersection of architecture, engineering, and product.",
  body: "I turn product requirements into technical direction, build systems that scale, help teams execute, and stay accountable for what happens in production — shaped by work across consumer, B2B SaaS, e-commerce, food tech, DevOps, and market intelligence products.",
};

// Default-theme "Why me" layout, modeled on BotFriday's "The problem"
// section: the intro lead becomes the big heading, one card is featured in
// mint, the rest sit in rows, and a thin strip closes it out.
export const whyMeLayout = {
  featuredId: "individual-contributor",
  rows: [["architecture", "leadership", "delivery"], ["remote", "ai"]],
  strip: {
    lead: "Broad perspective.",
    text: "Shaped by work across consumer, B2B SaaS, e-commerce, food tech, DevOps, and market intelligence products — so I weigh frontend decisions against the larger system and the business.",
  },
};

export const whyHireMeV2 = [
  {
    id: "architecture",
    file: "strengths/architecture.txt",
    title: "Architecture That Starts With the Product",
    description:
      "I design frontend systems around real product requirements, not frameworks or trends. At CoffeeWeb, I architected a mobile-first PWA spanning 16 product domains for 200,000+ users across 175+ countries, and re-architected the existing codebase into clear component boundaries, consistent state and data patterns, and production observability.",
  },
  {
    id: "leadership",
    file: "strengths/leadership.txt",
    title: "Hands-On Technical Leadership",
    description:
      "I lead a 9-person frontend team while staying roughly 60% hands-on — making architecture calls, writing and reviewing code, and setting engineering standards. I own hiring, mentoring, and performance reviews, and build teams that make good decisions without me in the room.",
  },
  {
    id: "delivery",
    file: "strengths/delivery.txt",
    title: "From Roadmap to Production — and After",
    description:
      "I take work from PRD to release: shaping the technical solution, breaking roadmaps into milestones, and coordinating with product, design, and backend. Shipping isn't the finish line — at CoffeeWeb I set up the quality foundation: ~165 Jest/React Testing Library test files, Sentry monitoring, and Azure DevOps CI/CD across dev, staging, and production.",
  },
  {
    id: "remote",
    file: "strengths/remote.txt",
    title: "Remote and Async-First",
    description:
      "Fully remote since 2020, including leading two frontend teams — at Peppo and CoffeeWeb — from hiring through delivery. I document decisions instead of relying on hallway context, run PR-based reviews and async standups, and stay accountable to outcomes, not hours online.",
  },
  {
    id: "individual-contributor",
    file: "strengths/individual-contributor.txt",
    title: "Just as Strong as an Individual Contributor",
    description:
      "Leading a team hasn't taken me off the keyboard. I still own hard problems end to end: I built CoffeeWeb's Node.js market-data service (external data collection, currency processing, event publishing), the application layer for YourBot (a multi-tenant RAG platform), and a full Angular-to-React rebuild of a venue-management console. I scope the work, unblock myself, write it up clearly, and ship without needing someone to check in.",
  },
  {
    id: "ai",
    file: "strengths/ai.txt",
    title: "Building AI-Native Products",
    description:
      "I built the application layer for YourBot, a multi-tenant RAG platform (pgvector retrieval, document ingestion, Keycloak RBAC), and shipped this site's streaming Ask AI assistant on the Gemini API. I'm also leading how my team adopts AI-assisted development.",
  },
];

// Consulting availability — shown as a distinct callout in the Contact section,
// separate from the full-time-role line above it.
// ctaUrl is the Google Calendar appointment schedule ("Intro Call") in its full
// /appointments/schedules/<id> form (Calendar → the schedule → Share → "Website
// embed") so SchedulingDialog can frame it in-page. The short
// calendar.app.google/... link can't be embedded and falls back to a new tab.
// Leave blank to fall back to a mailto link.
export const consulting = {
  blurb:
    "Open to consulting engagements in platform engineering, technical leadership, and system architecture — advisory, audits, or hands-on. Pick a time that works for you and we'll dig into what you're building.",
  ctaLabel: "Schedule a conversation",
  ctaUrl:
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2uOfNOPZeuA1-XHHmnfd-kGbk6PHlHnar_nvxLDnU3I43zWtvU6Z0EgMesDhoosh1urBo_s_zu",
};

// "Worked with" strip under the hero (BotFriday's "Trusted by teams at").
// Plain text wordmarks — no third-party logo files. BookMyShow was a client
// product built at Peppo (BookMyShow Deals), hence "worked with", not
// "worked at".
export const workedWith = {
  label: "Worked with teams at",
  names: ["CoffeeWeb", "BookMyShow", "Peppo", "JFrog", "Shippable", "CenturyLink"],
};

// Homepage Ask AI card (BotFriday's "Hiring for other roles?" card). A
// question typed here opens the full /ask-ai page with it already sent.
export const askAiPromo = {
  label: "Ask AI · Trained on my experience",
  title: "Have a question about my work?",
  emphasis: "Ask my AI assistant.",
  text: "It answers from my experience, projects, and writing — the same knowledge base this site is built from — and streams the answer in seconds.",
  placeholder: "Ask about my experience, stack, or projects…",
  button: "Ask",
};

// TODO(redesign): consider a short recruiter FAQ section before Contact
// (BotFriday's "Questions"): notice period, relocation, remote / time-zone
// overlap, contract vs full-time. Needs answers from Kirti. Undecided — parked.

// Default-theme Contact section — the closing call to action on a sand band
// (BotFriday's "Tell us about the role."). The signal theme keeps the older
// consulting card + link grid.
export const contactCta = {
  label: "Get in touch",
  title: "Let's build something",
  emphasis: "worth shipping.",
  intro:
    "Open to senior and architect-level frontend roles, AI-adjacent full-stack work, and consulting in platform engineering, technical leadership, and system architecture.",
  emailLabel: "Email me",
  columns: [
    { label: "Roles", text: "Senior / architect-level frontend, and AI-adjacent full-stack." },
    { label: "Consulting", text: "Advisory, audits, or hands-on — architecture, platforms, and team leadership." },
    { label: "Based in", text: "Bhopal, India · IST (UTC+5:30) · fully remote since 2020." },
  ],
  elsewhereLabel: "Not ready to talk yet? Find me on",
};

// Kept in sync with the "Professional Abilities" section of public/resume.pdf.
// Supports inline **bold** and *italic* markup — rendered by BulletList.
export const professionalAbilities = [
  "**Own the problem end to end** — understand product requirements and PRDs, challenge assumptions, break them into technical requirements and actionable engineering tasks, and drive them through design, development, testing, and release.",
  "**Think beyond implementation** — translate business requirements into scalable frontend architecture, technical designs, reusable patterns, and engineering standards that can evolve with the product.",
  "**Build for production, not just demos** — treat testing, observability, performance, accessibility, security, CI/CD, and reliability as part of the engineering process from day one.",
  "**Stay close to production** — monitor real-world application health, investigate incidents, perform root-cause analysis, and turn production learnings into improvements rather than one-off fixes.",
  "**Lead through technical clarity** — establish coding standards, conduct meaningful code reviews, document architectural decisions, and make complex technical concepts understandable to both engineers and non-technical stakeholders.",
  "**Operate async by default** — document decisions instead of relying on hallway context, drive PR-based reviews and async standups, and stay accountable to outcomes rather than visible hours online across 5-6 years working fully remote.",
  "**Turn roadmaps into execution** — work with product, design, marketing, and dependent teams to identify constraints, dependencies, risks, and priorities, then translate the roadmap into achievable engineering milestones.",
  "**Develop people, not just software** — mentor engineers, support their growth, contribute to hiring, set team expectations, and create an environment where engineers can take ownership and make better technical decisions.",
  "**Continuously evaluate the technology landscape** — explore emerging frontend, cloud, AI, and developer-tooling trends and assess them based on real product value rather than adopting technology for its own sake.",
  "**Learn from the system and the team** — use metrics, incidents, user feedback, code reviews, and engineering discussions to continuously improve architecture, processes, and team effectiveness.",
  "**Communicate with intent** — explain technical trade-offs clearly, align stakeholders around decisions, and make sure everyone understands not only *what* we're building, but *why*.",
  "**Stay pragmatic under pressure** — balance technical quality, product priorities, deadlines, and business constraints while making decisions that keep the system maintainable in the long run.",
  "**Keep building forward** — currently extending my frontend architecture experience into **AI engineering**: shipped a context-stuffed LLM assistant and a multi-tenant RAG chatbot platform, and now leading my team's AI-assisted development practices, while exploring agentic workflows next.",
];

// Kept in sync with public/resume.pdf — full responsibility lists, not trimmed.
export const experience = [
  {
    id: "coffeeweb",
    role: "Software Architect - Frontend",
    company: "CoffeeWeb Technologies",
    companyProfile:
      "Privately held market intelligence and technology platform headquartered in Bengaluru — the definitive global hub for information, supply chain data, and digital resources in the coffee sector, connecting 200,000+ users across 175+ countries.",
    project: "CoffeeWeb Platform, CoffeeWeb Admin",
    location: "Remote",
    period: "Aug 2023 — Present",
    techStack: [
      "React.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "WebSocket / Realtime APIs",
      "i18next",
      "Razorpay",
      "PayPal",
      "Stripe",
      "OAuth 2.0",
      "Supabase",
      "Firebase / Firestore",
      "PWA",
      "Jest",
      "React Testing Library",
      "Sentry",
      "Azure DevOps Pipelines",
      "Google Tag Manager",
    ],
    bullets: [
      "Leading a 9-person frontend engineering team, owning technical direction, architecture, sprint planning, OKRs, task allocation, performance reviews, hiring, and mentoring — while staying roughly 60% hands-on with engineering.",
      "Architected and evolved two React applications from the ground up — the customer-facing CoffeeWeb platform and the CoffeeWeb Admin Console for managing platform content, news, market information, and operational data.",
      "Led frontend architecture for a mobile-first PWA spanning 16 product domains — real-time market data, pricing differentials, industry reports, weather, news, community, AI assistance, trade & exchange, and subscriptions — serving 200,000+ users across 175+ countries in English, Hindi, and Kannada via i18next.",
      "Re-architected an immature frontend codebase — oversized components, duplicated logic, direct API calls from UI, inconsistent state/props patterns, uncontrolled re-renders, and no consistent error handling — into a structured system with clear component boundaries, reusable patterns, state/data-management conventions, defined API boundaries, and production observability.",
      "Built and maintain the Node.js market-data service behind CoffeeWeb's live-data pipeline — authenticated external-data collection, market-data processing, persistence, currency processing, and downstream event publishing.",
      "Designed the frontend integration for real-time market experiences, consuming continuously updated data over WebSocket/realtime APIs to power live quotes, market indicators, and charting.",
      "Built tiered Regular/Gold/Platinum subscription flows with Razorpay, PayPal, and Stripe integrations, trial management, subscription-gated feature access, and Google OAuth login.",
      "Adopted Supabase (Postgres + realtime subscriptions) and Firebase (Auth, Firestore, push messaging) to power live chat, notifications, and real-time market data feeds across the platform.",
      "Established the frontend quality and production-reliability foundation — Jest and React Testing Library (~165 test files), ESLint, Prettier, Husky/lint-staged, Sentry error monitoring, and Azure DevOps CI/CD across development, staging, and production.",
      "Drove frontend performance work across code splitting, lazy loading, dependency optimization, caching, React rendering, API efficiency, WebSocket handling, and Core Web Vitals.",
    ],
  },
  {
    id: "peppo",
    role: "Lead Frontend Engineer",
    company: "Peppo Technologies",
    companyProfile:
      "MarTech company helping brands with customer acquisition and retention — products include the headless loyalty infrastructure RewardX, an online ordering system for restaurants and cloud kitchens, and a WhatsApp-delivered e-invoicing solution.",
    project: "BookMyShow Deals, Peppo PWA, Merchant/DMS/RewardX Consoles, Event Ordering",
    location: "Remote",
    period: "Aug 2020 — May 2023",
    techStack: ["Next.js", "TypeScript", "JavaScript", "Node.js", "REST APIs", "PWA", "Sentry"],
    bullets: [
      "Working as a Frontend Lead in the Peppo team, which develops and maintains the frontend for all Peppo products.",
      "Led the frontend engineering team from the ground up to architect, build, and deploy multiple high-traffic consumer web apps and B2B SaaS portals.",
      "Mostly worked on implementing UI utilizing Next.js, TypeScript, JavaScript, ES6, and Node.js technologies.",
      "Engineered the mobile-first Peppo PWA food-ordering application and the Event Ordering reservation flow, ensuring rapid load times, smooth transitions, and reliable transactional steps.",
      "Developed the consumer-facing BookMyShow (BMS) Deals interface, integrating secure checkouts and seamless payment workflows to handle real-time merchant dynamic discounts.",
      "Architected the core suite of control panels including the Merchant Console for live order processing, the geographically-mapped DMS Console for partner onboarding, and the modular RewardX Console loyalty engine infrastructure.",
      "Collaborated cross-team with product managers, backend developers, and UI/UX designers to translate complex product logic and specifications into clean, interactive user interfaces.",
      "Participated in implementing features, fixing bugs, peer code reviews, holding responsibility over various product boundaries, documenting implemented features, and supporting merchants and customers in various technical forums.",
    ],
  },
  {
    id: "jfrog",
    role: "Software Engineer, R&D",
    company: "JFrog India",
    companyProfile:
      "On a mission to enable continuous updates through Liquid Software. The world's top brands — including Amazon, Facebook, Google, Netflix, Uber, VMware, and Spotify — are among the 4,500+ companies that depend on JFrog to manage binaries for mission-critical applications.",
    project: "JFrog Pipelines — UI module in JFrog Platform UI, Pipelines Node.js client",
    location: "Bengaluru",
    period: "Mar 2019 — Jul 2020",
    techStack: [
      "Vue.js",
      "Vuex",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Socket.IO (WebSockets)",
      "D3.js",
      "Jest",
      "REST APIs",
    ],
    bullets: [
      "Joined JFrog Pipelines at inception and helped build its UI from scratch in Vue.js and Vuex — shipped as a module inside JFrog Platform UI, JFrog's unified product console.",
      "Built the Integrations experience — create, edit, and view flows for 30+ providers (GitHub, GitLab, Bitbucket, AWS, Azure, GCP, Kubernetes, Docker registries, Slack, Jira, webhooks, and more), in both the user and admin consoles.",
      "Contributed to the Pipelines Node.js client, the typed TypeScript library JFrog Platform UI's middleware uses to talk to the Pipelines microservice — wrote the Integrations, Projects, pipeline-source permissions, Steps, Resource Versions, and Extension Sources modules, each with Jest and nock tests.",
      "Worked with the team on real-time run monitoring — a Socket.IO connection tied to navigation and a client-side cache of pipeline, run, and step data kept in sync by socket events, so dashboards update live without polling.",
      "Contributed to the D3-based pipeline graph that visualizes steps, resources, and their dependencies.",
      "Worked on node pool management (static and dynamic pools on AWS, Azure, GCP, and Kubernetes), plus pipeline source and extension management.",
      "Worked on the step console log viewer, rendering colored build output for each pipeline step.",
      "Collaborated across teams on implementation, code reviews, bug fixes, and feature documentation.",
    ],
  },
  {
    id: "shippable",
    role: "Software Development Engineer",
    company: "Shippable India",
    companyProfile:
      "Automates CI/CD and DevOps activities with streamlined workflows across teams and tools — available as an on-premises server product, hosted SaaS, and a hybrid offering called Custom Nodes.",
    project: "Shippable Platform",
    location: "Bengaluru",
    period: "Mar 2018 — Mar 2019",
    techStack: ["AngularJS", "JavaScript", "Node.js", "HTML5", "Bootstrap", "CSS3", "Sass", "Git"],
    bullets: [
      "Involved in building parts of a highly scalable CI/CD platform with 100,000+ Docker containers spun up every month in production.",
      "Technologies used — JavaScript (Angular.js + Node.js), HTML5, Bootstrap, CSS, Sass, and Git.",
      "Participated in implementing features, fixing bugs, peer code reviews, holding responsibility over various product boundaries, documenting implemented features, and supporting customers in various forums.",
    ],
  },
  {
    id: "centurylink",
    role: "Software Developer",
    company: "CenturyLink India",
    companyProfile:
      "Global communications and IT services company focused on connecting its customers to the power of the digital world.",
    project: "E-Commerce, Instalink",
    location: "Bengaluru",
    period: "Mar 2016 — Feb 2018",
    techStack: ["AngularJS", "JavaScript", "Velocity", "Java", "Bootstrap", "CSS3", "Sass", "Git"],
    bullets: [
      "Working as a developer on the E-commerce team, which develops and maintains the CenturyLink e-commerce website.",
      "Part of the ECOM Agile team, delivering requirements on direct request of the business for the e-commerce shop using the Scrum process.",
      "Automating and enhancing the quality of user experience by adding additional features based on business requirements.",
      "Worked on a web application that consumed various web services utilizing Java, JavaScript, and Velocity technologies.",
      "Also part of development of the Instalink site for CenturyLink prepaid customers with a mobile-first approach utilizing AngularJS and Bootstrap.",
    ],
  },
];

// Referenced inline by Experience.tsx, directly under the CoffeeWeb entry —
// kept as its own export rather than a field on `experience` since it's a
// one-off structured block, not a shape every entry shares.
export const coffeeWebCaseStudy = {
  title: "Re-architecting CoffeeWeb",
  before: [
    "Large, unbounded components mixing UI, logic, and data fetching",
    "Duplicated logic across screens with no shared patterns",
    "Direct API calls from UI components — no clear data layer",
    "Inconsistent state and prop-drilling patterns",
    "Uncontrolled re-renders with no performance guardrails",
    "No consistent error handling, poor structure, difficult to maintain",
  ],
  after: [
    "Application architecture with clear component boundaries",
    "Structured state and data-management conventions",
    "Defined API integration patterns and a proper data layer",
    "Consistent error handling across the platform",
    "Performance work — code splitting, lazy loading, caching, Core Web Vitals",
    "Testing (Jest, React Testing Library) and Sentry-based observability",
    "Azure DevOps CI/CD across development, staging, and production",
  ],
  result:
    "Established a scalable engineering foundation for continued product development across 16 domains and two React applications.",
};

export const education = [
  {
    id: "cdac",
    degree: "Post Graduate Diploma in Advanced Computing (PG-DAC)",
    institution: "C-DAC ACTS, Bangalore",
    // PG-DAC is C-DAC's own diploma — not affiliated with a university/board.
    board: "Autonomous - Ministry of Electronics and Information Technology (MeitY), Government of India.",
    period: "2016",
    details: [],
  },
  {
    id: "oct",
    degree: "Bachelor of Engineering",
    institution: "Oriental College of Technology, Bhopal",
    board: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal",
    period: "2015",
    details: [],
  },
  {
    id: "seniorSchool",
    degree: "All India Senior School Certificate Examination (AISSCE)",
    institution: "Campion School, Bhopal",
    board: "CBSE",
    period: "2011",
    details: [],
  },
  {
    id: "secondarySchool",
    degree: "All India Secondary School Examination (AISSE)",
    institution: "Campion School, Bhopal",
    board: "CBSE",
    period: "2009",
    details: [],
  },
];

export const skills = {
  languages: [
    "JavaScript (ES6)",
    "TypeScript",
    "Java",
    "Python",
    "Velocity",
    "HTML5",
    "C++",
    "C#",
    "Swift",
    "Dart",
  ],
  frontend: [
    "React.js (Redux, Hooks)",
    "Next.js",
    "Redux Saga",
    "Zustand",
    "TanStack Query",
    "Micro-frontends (Module Federation)",
    "Vue.js (Vuex)",
    "AngularJS",
    "Flutter",
    "GraphQL",
    "Bootstrap 4",
    "Tailwind CSS",
    "PrimeReact",
    "Material UI",
    "Sass / Less",
    "i18next",
  ],
  backend: [
    "Node.js / Express",
    "Spring",
    "REST Web Services",
    "WebSocket / Realtime APIs",
    "OAuth 2.0",
    "Prisma",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Supabase",
    "Firebase / Firestore",
    "Redis",
    "Keycloak",
    "JWT / JWKS",
    "RBAC",
    "MinIO",
  ],
  devops: [
    "Docker",
    "Jenkins",
    "Azure DevOps Pipelines",
    "AWS",
    "Digital Ocean",
    "Git",
    "GitLab",
    "Bitbucket",
    "Vagrant",
    "Artifactory",
    "Sentry",
  ],
  // AI/LLM stack — keep this in sync with what you've actually used as you build out RAG/agent projects.
  ai: [
    "Gemini API",
    "LLM Streaming (SSE)",
    "Prompt / Context Engineering",
    "RAG (Retrieval-Augmented Generation)",
    "pgvector (Postgres)",
  ],
  remote: ["Remote Collaboration", "Async Communication", "Distributed Teams", "Cross-Timezone Coordination"],
  tooling: [
    "Jest",
    "React Testing Library",
    "Cypress",
    "PWA (Workbox)",
    "Postman",
    "Splunk",
    "CloudWatch",
    "Google Tag Manager",
    "Jira",
    "Asana",
    "ClickUp",
    "Notion",
  ],
};

// Honest roadmap, not claimed expertise — technologies being actively explored,
// not yet used hands-on in production. Move items into `skills` above once real.
export const exploring = [
  { category: "Frontend Ecosystem", items: ["Redux Toolkit"] },
  { category: "Backend Frameworks", items: ["NestJS", "Spring Boot", "Spring Cloud", "Spring Security", "gRPC"] },
  { category: "Data & ORM", items: ["TypeORM", "Hibernate / JPA"] },
  { category: "Messaging", items: ["Kafka", "RabbitMQ", "AWS SQS/SNS"] },
  { category: "Cloud & Infra", items: ["GCP", "Kubernetes", "Terraform", "Helm"] },
  { category: "CI/CD", items: ["GitHub Actions", "GitLab CI"] },
  { category: "Observability", items: ["OpenTelemetry", "Prometheus", "Grafana", "ELK Stack"] },
  { category: "Testing", items: ["Vitest", "Playwright"] },
  { category: "Architecture", items: ["Microservices", "Event-Driven Architecture", "CQRS", "DDD"] },
  { category: "Security", items: ["OIDC", "API Security"] },
  {
    category: "AI Frontiers",
    items: [
      "Gemini",
      "Llama",
      "Mistral",
      "Tool Calling",
      "Token & Cost Management",
      "Model Evaluation",
      "Multimodal AI",
    ],
  },
];

// Only real, verifiable work belongs here — no placeholders. A RAG or
// agent/tool-calling entry goes in once one is actually built, not before.
// `architecture` and `ownership` are optional — only set for projects where
// spelling out the system flow and what's mine vs. a teammate's/backend
// service's actually adds something (currently just YourBot).
type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  sourceUrl: string;
  // True when the repo is private (visitors would hit a GitHub 404) — the
  // card shows a "private repo" badge instead of a source link.
  sourcePrivate?: boolean;
  architecture?: string[];
  ownership?: { mine: string[]; other: string[] };
};

// Shown as a subtitle under the Projects heading — Ask AI and YourBot are
// deliberately the first two entries below, framed as complementary AI
// builds rather than "I called an LLM API" twice.
export const projectsIntro =
  "Ask AI and YourBot are two different AI builds, not the same trick twice — one shows LLM integration, streaming, and context engineering, the other shows RAG architecture and multi-tenancy.";

export const projects: Project[] = [
  {
    id: "ask-ai-assistant",
    title: "Ask AI — portfolio assistant",
    description:
      "A live, streaming chat assistant (this site's /ask-ai page) that answers questions about my experience. Grounded using context stuffing — the entire knowledge base (experience, skills, public log entries) is assembled server-side and injected directly into the system prompt on every request, a deliberate choice over RAG since the corpus comfortably fits in the model's context window with no retrieval step needed. Built on the Gemini API, streams tokens to the client over a ReadableStream, enforces per-IP rate limiting, and strips private/draft content server-side before it ever reaches the model.",
    tags: ["Next.js", "Gemini API", "Context Stuffing", "Streaming (SSE)", "Rate limiting"],
    liveUrl: "/ask-ai",
    sourceUrl: "https://github.com/kirtisahu05/portfolio",
  },
  {
    id: "yourbot-rag-platform",
    title: "YourBot — multi-tenant RAG chatbot platform",
    description:
      "A multi-tenant SaaS platform for building, configuring, and embedding custom RAG chatbots trained on a business's own documents. I own the application layer end to end — tenant/team management, the Next.js bot-creation and configuration UI, document management, and the integration surface into backend AI services — while the LLM inference and retrieval execution itself is handled by a separate backend AI service this app integrates with.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "MinIO", "Keycloak", "RAG", "pgvector"],
    liveUrl: "",
    sourceUrl: "https://github.com/kirtisahu05/sift-rag-chatbot.git",
    sourcePrivate: true,
    architecture: [
      "Tenant & auth — Keycloak, RBAC, JWT/JWKS",
      "Bot configuration — branding, persona, guardrails, retrieval settings",
      "Document storage — MinIO",
      "Ingestion pipeline — status tracking UI",
      "Vector retrieval — pgvector",
      "AI backend service — LLM inference",
      "Chat experience — embeddable widget",
    ],
    ownership: {
      mine: [
        "Multi-tenant data model (Prisma/PostgreSQL)",
        "Keycloak authentication & RBAC",
        "Bot creation & configuration UI",
        "Document management (MinIO) & ingestion-status UI",
        "RAG configuration UI (retrieval settings)",
        "Embeddable chat-widget deploy flow",
      ],
      other: ["AI/LLM inference & retrieval execution — backend AI service this app integrates with"],
    },
  },
  {
    id: "venue-management-console",
    title: "Venue Management Console",
    description:
      "A B2B back-office console for restaurant and venue operators — sales dashboards, restaurant/venue onboarding, an item library with categories, modifiers and sales-tax rules, role-based user management, and table management. Rebuilt the entire frontend from the ground up as a migration off the platform's legacy Angular UI to React, using MUI and react-admin for the admin interface, React Router for navigation, and Axios with JWT bearer-token auth against a Spring Boot backend.",
    tags: ["React", "Angular-to-React Migration", "MUI", "react-admin", "React Router", "JWT Auth"],
    liveUrl: "",
    sourceUrl: "https://github.com/kirtisahu05/venue-pilot-console.git",
    sourcePrivate: true,
  },
  {
    id: "finsync-finance-tracker",
    title: "finSync — multi-profile personal finance tracker",
    description:
      "A personal finance PWA for tracking multiple financial identities under one account — banks, credit cards, loans, investments, and recurring bills, each scoped to its own profile. Built as a Next.js App Router PWA on Supabase (Postgres + Auth), with a data model built around per-user \"profiles\" (personal, professional, family, spouse — up to five) rather than a single flat account, so every bank, credit card, loan, investment, recurring payment, and transaction is scoped to a profile and isolated via Row Level Security policies that join back to the owning user through auth.uid(). Session handling is hand-rolled rather than the standard Supabase SSR helper — access/refresh tokens are set as httpOnly cookies on login and re-attached per request in middleware, which gates every dashboard route. Feature set spans credit card utilization tracking (limit/utilized/available), EMI loan tracking with part-payments and remaining balance, friend-and-family lending with status and repayment schedules, recurring bill reminders, and an investments ledger — with recent work moving bank/card data fetching into Server Actions and adding page-level cache control for fresher dashboard reads.",
    tags: ["Next.js", "Supabase", "PostgreSQL", "Row Level Security", "Server Actions", "PWA"],
    liveUrl: "",
    sourceUrl: "https://github.com/kirtisahu05/finSync.git",
    sourcePrivate: true,
  },
];

// The default theme's desktop nav shows only these (BotFriday keeps its nav
// to ~5 links plus a CTA); the rest stay in the footer and mobile menu. The
// signal theme shows every navItems entry.
export const primaryNavHrefs = ["/#experience", "/#work", "/#why-me"];

export const navItems = [
  { href: "/#about", label: "about" },
  { href: "/#skills", label: "skills" },
  { href: "/#experience", label: "experience" },
  { href: "/#education", label: "education" },
  { href: "/#work", label: "projects" },
  { href: "/#why-me", label: "why me" },
  { href: "/#contact", label: "contact" },
];
