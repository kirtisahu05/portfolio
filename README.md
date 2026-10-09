# Kirti Kumar Sahu — Portfolio

Personal portfolio of a Lead Software Engineer / Frontend Architect, with a live AI assistant that answers questions about my work and a log of notes and writing.

**Live:** [kirti-kumar-sahu-portfolio.vercel.app](https://kirti-kumar-sahu-portfolio.vercel.app)

Designed, built, and deployed by me — architecture, UI, the streaming assistant, and the content pipeline.

## What's inside

- **Portfolio homepage** — hero, skills (bento grid), experience, education, selected work, and contact. All copy lives in one typed content file, [`src/lib/content.ts`](src/lib/content.ts).
- **Ask AI** (`/ask-ai`) — a streaming chat assistant grounded in my experience, projects, skills, and public log posts.
  - **Context stuffing, not RAG:** the whole knowledge base fits in the model's context window, so it's assembled server-side and sent with every request — no retrieval step.
  - Gemini Flash-Lite at temperature 0.3, streamed to the browser token by token over a `ReadableStream`.
  - Guardrails: input validation, per-IP rate limiting, capped conversation history, and private/draft log entries stripped before anything reaches the model.
- **Interactive architecture diagrams** on the project cards — an animated walkthrough of how Ask AI answers a question, and the three flows of YourBot (a multi-tenant RAG chatbot platform).
- **Log** (`/log`) — notes and articles stored in a Google Sheet, with search, type/category filters, and list, compact, magazine, and grid views.
  - Published to the web as CSV and cached with Next.js revalidation.
  - Private entries show only a title and date; drafts don't show at all.
  - A PIN-gated form at `/log/add-log` writes new entries to the sheet through a Google service account. The form, the API, and the sheet reader share one set of validation rules.
- **Two UI themes** — the default "systems" theme and a terminal-style "signal" theme. The theme switcher is behind a feature flag while the signal theme is unfinished.

## Tech stack

- **Next.js 16** (App Router, Route Handlers) · **React 19** · **TypeScript**
- **Tailwind CSS 4** with CSS-variable design tokens for both themes
- **Gemini API** (`@google/genai`) for Ask AI
- **Google Sheets** as the log's CMS — published CSV to read, Sheets API with a service account to write
- `react-markdown` + `remark-gfm` for log posts · `react-icons` for skill logos
- Deployed on **Vercel**

## Getting started

```bash
npm install
# create .env.local with the variables you need (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The homepage works with no environment variables. Ask AI and the Log each need their own variables, listed below.

### Environment variables

| Variable | Needed for | Notes |
|---|---|---|
| `GEMINI_API_KEY` | Ask AI | Server-side only. |
| `AI_ASK_RATE_LIMIT` | Ask AI | Questions per IP per hour. Default `10`. |
| `LOG_SHEET_CSV_URL` | Log | The Google Sheet published to the web as CSV. |
| `LOG_REVALIDATE_SECONDS` | Log | How often the sheet is re-fetched. Default `900` (15 min). |
| `LOG_REVALIDATE_SECRET` | Log | Enables `GET /api/log/revalidate?secret=…` to refresh the log immediately. Unset = disabled. |
| `LOG_CONTRIBUTE_PIN` | Add Log form | PIN for `/log/add-log`. Unset = form disabled. |
| `LOG_CONTRIBUTE_RATE_LIMIT` | Add Log form | Wrong-PIN attempts per IP per hour. Default `5`. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Add Log form | A Google Cloud service account with the Sheets API enabled and Editor access on the sheet. Paste the private key with its newlines escaped as `\n`. |
| `NEXT_PUBLIC_SITE_URL` | SEO | Canonical URL for metadata, sitemap, and OG image. Defaults to the Vercel URL. |
| `NEXT_PUBLIC_MULTI_UI_ENABLED` | Themes | `true` shows the theme switcher. Default off. |
| `NEXT_PUBLIC_HIDE_EXPLORING` | Skills | `true` hides the "Currently exploring" block. Default off. |

### Log sheet columns

`Title`, `Date` (`YYYY-MM-DD`), `Time` (24-hour `HH:MM`, optional), `Type`, `Category`, `Summary`, `Content` (Markdown), `ExternalUrl`, `ImageUrl`, `Tags` (comma-separated), `Status` (`Published` / `Draft`), `Visibility` (`Public` / `Private`).

Each entry needs either `Content` or an `ExternalUrl`. Rows that break these rules are skipped, and the reason is logged on the server.

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Project structure

```
src/
  app/
    page.tsx            homepage
    ask-ai/             Ask AI chat page
    log/                log list, entry pages, add-log form
    api/ask/            streaming Ask AI endpoint
    api/log/            add-log, PIN verify, cache revalidate
  components/           page sections, Ask AI and Log UI, architecture diagrams
  lib/
    content.ts          all site copy — profile, experience, projects, skills
    ai-knowledge.ts     builds the Ask AI knowledge base from content + log
    ai-system-prompt.ts Ask AI's grounding rules
    log-source.ts       reads and parses the log sheet
    log-validation.ts   shared log entry rules (form, API, reader)
    google-sheets.ts    writes rows through the Sheets API
    rate-limit.ts       per-IP limiters for Ask AI and the PIN
```

## Contact

[LinkedIn](https://linkedin.com/in/kirtisahu05) · [GitHub](https://github.com/kirtisahu05) · kirtisahu05@gmail.com
