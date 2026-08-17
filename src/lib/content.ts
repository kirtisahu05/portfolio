// Single source of truth for portfolio content.
// Both theme A (Systems) and theme B (Signal) render from this file —
// edit here once and both UIs update. Items marked TODO still need your input.

export const profile = {
  name: "Kirti Kumar Sahu",
  handle: "/KIRTISAHU05",
  // Falls back to initials in the Hero avatar if this file is ever missing.
  photo: "/my-pic.jpg",
  role: "Software Architect, Frontend",
  location: "Bengaluru, India · Remote since 2020",
  timezone: "IST (UTC+5:30) — overlaps 4–6 hrs with US Eastern and most of the European workday",
  tagline:
    "10+ years architecting and scaling frontend systems for global platforms — 5-6 of them fully remote, leading distributed teams. Now extending that into RAG pipelines, LLM integration, and agent-based tooling.",
  logTagline:
    "I’m Kirti. This is my corner of the internet—a place where I share thoughts on tech, life, things I’m learning, and the occasional rabbit hole I find myself exploring. Glad you’re here.",
  bio: "I'm a Software Engineer with 10+ years of enterprise experience designing, engineering, and scaling high-performance web applications. Currently working as Software Architect - Frontend at CoffeeWeb, I lead frontend architecture for a mobile-first PWA serving 200,000+ users across 175+ countries. Before that, I led frontend engineering at Peppo across BookMyShow Deals and a suite of B2B consoles, built JFrog Pipelines from inception as part of a CI/CD platform trusted by Amazon, Google, and Netflix, helped scale Shippable's CI/CD platform to 100,000+ Docker containers a month, and built CenturyLink's e-commerce and mobile ordering platforms. Across every team, I've owned tech stack decisions, hiring, and production reliability — and I'm now extending that decade of frontend architecture into AI-native engineering: I've shipped a context-stuffed LLM assistant and YourBot, a multi-tenant RAG chatbot platform with a pgvector-backed retrieval pipeline, and I'm leading how my team adopts AI-assisted development, with agent-based tooling next on my roadmap. This entire site — architecture, the live streaming Ask AI assistant, and deployment — was designed, built, and shipped by me alone, working remotely, with no team in the room.",
  vitals: [
    { label: "Frontend", value: 95 },
    { label: "Backend", value: 72 },
    { label: "Team Leadership", value: 96 },
    { label: "Production Reliability", value: 88 },
    { label: "AI Systems", value: 58 },
  ],
  // One single-line achievement per experience, most recent first — keep in sync with `experience` below
  quickFacts: [
    "I've spent 10+ years turning messy, half-formed product ideas into frontend systems that don't fall over — and I like that part more than writing the first line of code.",
    "Right now I lead frontend for a platform 200,000+ people across 175+ countries use every day, working out of Bengaluru.",
    "Early in my career I built the UI for JFrog Pipelines from scratch — the frontend layer of a CI/CD tool that now quietly runs inside Amazon's, Google's, and Netflix's pipelines.",
    "I've hired and grown every frontend team I've led — the team is usually the part I'm proudest of, not the codebase.",
    "5-6 years working fully remote — leading distributed frontend teams and shipping production systems without anyone looking over my shoulder.",
    "I'm teaching myself RAG pipelines and agentic AI the same way I've learned everything else: by shipping something real and letting it break in production.",
  ],
  email: "kirtisahu05@gmail.com",
  phone: "+91 9039909300",
  links: {
    github: "https://github.com/kirtisahu05",
    linkedin: "https://linkedin.com/in/kirtisahu05",
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

// Consulting availability — shown as a distinct callout in the Contact section,
// separate from the full-time-role line above it.
// TODO: add your real scheduling link (Calendly, cal.com, etc.) to ctaUrl.
// Leave ctaUrl blank and the button falls back to a mailto link automatically.
export const consulting = {
  blurb:
    "Open to consulting engagements in platform engineering, technical leadership, and system architecture — advisory, audits, or hands-on. If you'd like to talk specifics, feel free to block some time for a quick chat.",
  ctaLabel: "Book a quick chat",
  ctaUrl: "",
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
    location: "Remote · Bengaluru",
    period: "Aug 2023 — Present",
    techStack: [
      "React.js",
      "Next.js",
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
      "Jest",
      "React Testing Library",
      "Sentry",
      "Azure DevOps Pipelines",
      "Google Tag Manager",
    ],
    bullets: [
      "Working as a Software Architect - Frontend in the CoffeeWeb team, leading the entire frontend team and owning the technical direction for the global web platform.",
      "Responsible for defining the frontend system architecture, evaluating tech stacks, and making strategic technology selections for all CoffeeWeb products from scratch.",
      "Driving end-to-end planning, execution, and delivery of core platform interfaces using React.js, Next.js, JavaScript, TypeScript, ES6, and Node.js technologies.",
      "Accountable for full team management, setting up sprint workflows, task allocation, tracking project execution, and ensuring high-quality, timely production releases.",
      "Heading talent acquisition, tech interviewing, and team hiring processes to build and scale a high-performing frontend engineering team.",
      "Fostering a culture of continuous learning, mentoring developers, establishing best practices for peer code reviews, and designing technical upskilling roadmaps.",
      "Understanding specifications and design documents.",
      "Architected and led development of a mobile-first PWA spanning 16 product domains — real-time market data (WebSocket-powered live coffee quotes), pricing differentials, industry reports, weather, news & personalized content, community/social, AI assistance, trade & exchange, and subscriptions — serving 200,000+ users across 175+ countries in English, Hindi, and Kannada via i18next.",
      "Built tiered subscription and monetization flows (Regular, Gold, Platinum) with Razorpay, PayPal, and Stripe payment gateway integrations, trial management, subscription-gated feature access, and Google OAuth login.",
      "Adopted Supabase (Postgres + realtime subscriptions) and Firebase (Auth, Firestore, push messaging) to power live chat, notifications, and real-time market data feeds across the platform.",
      "Established the team's testing and quality foundation with Jest and React Testing Library (~165 test files), ESLint (airbnb-base + Prettier), and Husky/lint-staged pre-commit hooks, alongside Sentry error monitoring for production reliability.",
      "Owned CI/CD delivery via Azure DevOps Pipelines across development/staging/production environments, and drove growth tooling — Google Tag Manager, custom analytics events, and SEO meta management (react-helmet) for organic discovery.",
      "Participated in implementing features, fixing bugs, holding responsibility over various product boundaries, documenting architectural patterns, and supporting users in various forums.",
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
    techStack: ["Vue.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Node.js"],
    bullets: [
      "Working as a Frontend Lead in the Peppo team, which develops and maintains the frontend for all Peppo products.",
      "Led the frontend engineering team from the ground up to architect, build, and deploy multiple high-traffic consumer web apps and B2B SaaS portals.",
      "Mostly worked on implementing UI utilizing Vue.js, JavaScript, TypeScript, ES6, HTML5, CSS3, and Node.js technologies.",
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
    project: "JFrog Pipelines",
    location: "Bengaluru",
    period: "Mar 2019 — Jul 2020",
    techStack: ["Vue.js", "JavaScript", "TypeScript", "Node.js"],
    bullets: [
      "Working as a developer on the JFrog Pipelines team, which develops and maintains JFrog Pipelines.",
      "Part of the JFrog Pipelines team from inception, building JFrog Pipelines from scratch.",
      "Mostly worked on implementing UI utilizing Vue.js, JavaScript, TypeScript, ES6, and Node.js technologies.",
      "Collaborated cross-team to implement high-quality, polished user interfaces using Vue.js to integrate JFrog Pipelines into platform-ui (JFrog's all-in-one product platform).",
      "Understanding specifications and design documents.",
      "Participated in implementing features, fixing bugs, peer code reviews, holding responsibility over various product boundaries, documenting implemented features, and supporting customers in various forums.",
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
    techStack: ["JavaScript", "AngularJS", "Node.js", "HTML5", "Bootstrap", "CSS3", "Sass", "Git"],
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
    techStack: ["Java", "JavaScript", "Velocity", "AngularJS", "Bootstrap"],
    bullets: [
      "Working as a developer on the E-commerce team, which develops and maintains the CenturyLink e-commerce website.",
      "Part of the ECOM Agile team, delivering requirements on direct request of the business for the e-commerce shop using the Scrum process.",
      "Automating and enhancing the quality of user experience by adding additional features based on business requirements.",
      "Worked on a web application that consumed various web services utilizing Java, JavaScript, and Velocity technologies.",
      "Also part of development of the Instalink site for CenturyLink prepaid customers with a mobile-first approach utilizing AngularJS and Bootstrap.",
    ],
  },
];

export const education = [
  {
    id: "cdac",
    degree: "Diploma in Advanced Computing",
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
    period: "2019",
    details: [],
  },
];

export const skills = {
  languages: [
    "JavaScript (ES6)",
    "TypeScript",
    "Python",
    "HTML5",
    "Java",
    "Velocity",
    "C++",
    "C#",
    "Swift",
    "Dart",
  ],
  frontend: [
    "React.js (Redux, Hooks)",
    "Next.js",
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
  { category: "Frontend Ecosystem", items: ["Redux Toolkit", "Zustand", "TanStack Query"] },
  { category: "Backend Frameworks", items: ["NestJS", "Spring Boot", "Spring Cloud", "Spring Security", "gRPC"] },
  { category: "Data & ORM", items: ["TypeORM", "Hibernate / JPA"] },
  { category: "Messaging", items: ["Kafka", "RabbitMQ", "AWS SQS/SNS"] },
  { category: "Cloud & Infra", items: ["GCP", "Kubernetes", "Terraform", "Helm"] },
  { category: "CI/CD", items: ["GitHub Actions", "GitLab CI"] },
  { category: "Observability", items: ["OpenTelemetry", "Prometheus", "Grafana", "ELK Stack"] },
  { category: "Testing", items: ["Vitest", "Playwright"] },
  { category: "Architecture", items: ["Microservices", "Event-Driven Architecture", "CQRS", "DDD"] },
  { category: "Security", items: ["OIDC", "JWT", "RBAC", "API Security"] },
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
export const projects = [
  {
    id: "ask-ai-assistant",
    title: "Ask AI — portfolio assistant",
    description:
      "A live, streaming chat assistant (this site's /ask page) that answers questions about my experience. Grounded using context stuffing — the entire knowledge base (experience, skills, public log entries) is assembled server-side and injected directly into the system prompt on every request, a deliberate choice over RAG since the corpus comfortably fits in the model's context window with no retrieval step needed. Built on the Gemini API, streams tokens to the client over a ReadableStream, enforces per-IP rate limiting, and strips private/draft content server-side before it ever reaches the model.",
    tags: ["Next.js", "Gemini API", "Context Stuffing", "Streaming (SSE)", "Rate limiting"],
    liveUrl: "/ask",
    sourceUrl: "",
  },
  {
    id: "yourbot-rag-platform",
    title: "YourBot — multi-tenant RAG chatbot platform",
    description:
      "A multi-tenant SaaS platform for building, configuring, and embedding custom RAG chatbots trained on a business's own documents. Built the app from scratch, with my work centered on the frontend, the data layer, and auth: the full Next.js (App Router) bot-creation wizard — branding/persona, tone, guardrails, document upload, live indexing progress, testing, and deploy — the Prisma/PostgreSQL schema modeling tenants, bots, documents, ingestion jobs, and subscription entitlements, and end-to-end Keycloak authentication (JWKS-verified JWT sessions read from cookies, RBAC, session refresh). On the RAG side, built the per-bot retrieval configuration (pgvector-backed vector store, tunable top-k and similarity threshold), the ingestion pipeline UI that tracks each document through download, parse, chunk, embed, and index stages via a Redis-stream-triggered worker, and the generated embed snippet that deploys a bot's chat widget onto a customer's site.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Keycloak", "RAG", "pgvector"],
    liveUrl: "",
    sourceUrl: "",
  },
  {
    id: "venue-management-console",
    title: "Venue Management Console",
    description:
      "A B2B back-office console for restaurant and venue operators — sales dashboards, restaurant/venue onboarding, an item library with categories, modifiers and sales-tax rules, role-based user management, and table management. Rebuilt the entire frontend from the ground up as a migration off the platform's legacy Angular UI to React, using MUI and react-admin for the admin interface, React Router for navigation, and Axios with JWT bearer-token auth against a Spring Boot backend.",
    tags: ["React", "Angular-to-React Migration", "MUI", "react-admin", "React Router", "JWT Auth"],
    liveUrl: "",
    sourceUrl: "",
  },
];

export const navItems = [
  { href: "/#about", label: "about" },
  { href: "/#skills", label: "skills" },
  { href: "/#experience", label: "experience" },
  { href: "/#education", label: "education" },
  { href: "/#work", label: "projects" },
  { href: "/#why", label: "why me" },
  { href: "/#contact", label: "contact" },
];
