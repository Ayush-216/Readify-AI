# Readify-AI project notes

This is the running record of changes made after the original project was reviewed. Each entry describes the purpose, request flow, changed files, verification, and known limitations. Update this file when future functionality or behavior changes; keep historical observations distinct from the current state.

## Starting point: original project

The existing application was a React/Vite frontend and a Node/Express modular monolith backed by MongoDB. It provided registration and login, PDF resume processing, Gemini-generated interview reports, report history, and AI-generated resume PDFs. The original `/` route was the protected interview preparation page. This document begins with the first changes made on top of that base.

## 1. Public home and feature-page blueprint

**Purpose:** Give visitors a public introduction to Readify-AI and separate tech news, job search, and interview preparation into distinct pages. News is public; job search and interview preparation require authentication. The job and news pages initially contained placeholders; the news placeholder was subsequently replaced in entry 3.

### Navigation and request flow

```text
Visitor opens / → public landing page
  ├─ /news → public tech news page
  ├─ /jobs → protected job search page
  └─ /prepare → protected interview preparation page

Protected page → authentication state loading → session check completes
  ├─ signed in → requested protected page
  └─ signed out → /login → successful sign-in or registration → /

/interview/:interviewId → protected existing report page
```

The navigation bar displays either sign-in or sign-out based on the shared authentication state. `AuthProvider` performs the existing current-user request once at the provider level rather than each use of `useAuth` initiating its own check. Login and registration now handle errors and navigate home only on success. Logout clears the frontend user after a successful backend response and returns to the public home page.

### Files added or changed

- `Frontend/src/app.routes.jsx` — declares public and protected routes and moves the existing preparation form from `/` to `/prepare`.
- `Frontend/src/features/home/Landing.jsx` and `landing.scss` — public landing page, links, and shared discovery-page styles.
- `Frontend/src/features/jobs/Jobs.jsx` — protected job-search blueprint; its company selector and listings are not connected yet.
- `Frontend/src/features/news/News.jsx` — initial public news blueprint; its current feed behavior is described in entry 3.
- `Frontend/src/features/interview/components/Navbar.jsx` and `style/navbar.scss` — navigation across public and protected areas, with session-aware account actions.
- `Frontend/src/features/auth/auth.context.jsx`, `authContext.js`, and `hooks/useAuth.js` — shared session initialization and authentication actions.
- `Frontend/src/features/auth/services/auth.api.js`, `pages/Login.jsx`, and `pages/Register.jsx` — propagate failed requests, show errors, and return to home after successful authentication.

**Verification at the time:** The frontend production build passed and lint passed for changed files. Full-project lint reported existing issues in other frontend files. Browser-based manual verification was not performed by the assistant.

## 2. Sass color deprecation fix

**Purpose:** Remove warnings caused by deprecated global `lighten()` calls while preserving the intended color adjustments.

- `Frontend/src/features/interview/style/interview.scss` — imports `sass:color` and replaces three calls with `color.adjust(..., $lightness: ...)`.
- **Verification:** The frontend production build passed without the previous `lighten()` warnings.

## 3. Tech news feed with Groq and MCP

**Purpose:** Replace the news placeholder with a public feed of up to 10 recent, highly ranked stories, refreshed approximately every hour. Show each headline, source link, optional article image, and up to three AI-generated points based on accessible article text. Keep the news AI integration separate from the existing Gemini interview-report service.

### Refresh and data flow

```text
Backend connects to MongoDB → news scheduler starts
  → refresh immediately and then every hour while the process runs
  → fetch Hacker News top and new story IDs and story details
  → remove unusable, deleted, old, or duplicate entries
  → rank candidates using recency, Hacker News score, and title keywords
  → for up to 10 selected stories:
       fetch accessible article HTML → extract paragraph text and image metadata
       → ask Groq for up to three structured points, when enough text exists
  → atomically replace the MongoDB news snapshot

Browser → GET /api/news → cached snapshot → public /news cards

MCP client → stdio MCP server → get_top_tech_news tool
           → same MongoDB snapshot
```

Groq structured output defaults to model `openai/gpt-oss-20b`. Results are validated before use; an unavailable article or summary produces a fallback message rather than fabricated points. The article fetcher uses a public-address check, pins the resolved IPv4 address, limits response size and time, and does not follow redirects. Image handling was updated later; see entry 5. Third-party content and images remain subject to the source's terms.

The frontend displays the Hacker News **submission** time, which may differ from the original article's publication date, and links to the article submitted to Hacker News. That article is not necessarily an official announcement. It also shows the last successful refresh time and a stale indicator when the cached snapshot is over two hours old.

The backend keeps the last successful snapshot if the feed refresh fails. A MongoDB lock and an in-process guard limit overlapping refreshes; the lock expires after 30 minutes. The browser checks the cached feed on page load and hourly while the page remains open. Starting more backend processes or restarting the backend can trigger refresh attempts, so Groq quota usage should be monitored.

### MCP boundary

`get_top_tech_news` is a read-only tool served over stdio by a separate MCP process. The tool and the public Express endpoint read the same cached data. The React page does not call MCP, and the MCP server does not perform scheduled refreshes or act as a proxy for Groq; Groq is called by the news service during enrichment. This keeps transport and AI-provider logic separate within the current monolith and leaves room for a later service split.

### Files added or changed

- `Backend/src/news/news.service.js` — candidate retrieval, ranking, deduplication, snapshot refresh, lock, and scheduler.
- `Backend/src/news/article.service.js` — article fetching, public-address checks, HTML text extraction, and image metadata extraction.
- `Backend/src/news/groq.service.js` — Groq structured-output request and summary validation.
- `Backend/src/news/news.model.js` — MongoDB snapshot and refresh-lock model.
- `Backend/src/news/news.routes.js` — public `GET /api/news` endpoint.
- `Backend/src/news/news.mcp.js` — stdio MCP server exposing `get_top_tech_news`.
- `Backend/src/app.js` — mounts the news endpoint.
- `Backend/server.js` — waits for MongoDB before starting the news scheduler and HTTP listener.
- `Backend/package.json` and `package-lock.json` — add the MCP SDK and Cheerio, plus the `mcp:news` command.
- `Frontend/src/features/news/News.jsx` and `news.scss` — fetch and render the news cards, loading/error states, source links, and freshness information.
- `README.md` — setup and MCP usage notes.

### Configuration and verification

- Backend environment variables: existing `MONGO_URI` and the user-provided `GROQ_API_KEY`; `GROQ_NEWS_MODEL` is optional. Do not put secret values in this document or commit them.
- The backend must be running for its in-process hourly scheduler to run. An external scheduler or dedicated worker may be needed in a deployment that sleeps or scales independently.
- A MongoDB connection, a live Groq structured-output request, and the MCP tool were verified. One live refresh returned 10 stories, 7 with summaries; inaccessible content used the fallback.
- Frontend production build and targeted news-page lint passed. News relevance is a heuristic and should be manually reviewed; Hacker News includes topics beyond technology. There is no guarantee of 10 accessible summaries or of source images.
- Dependency installation reported 9 audit vulnerabilities across the backend dependency tree; they have not yet been investigated. Groq free-tier limits and availability depend on the account and model.

## 4. Running notes established

**Purpose:** Keep a central explanation of what changed, why, how requests flow, and which files are involved as development continues.

- `PROJECT_NOTES.md` — created this running record, starting with the first changes to the original project. Future feature and behavior changes should append or update relevant entries and record verification and limitations.

## 5. News card image sizing and metadata

**Purpose:** Prevent oversized images from stretching news cards and support publishers that host their metadata images on a separate content delivery domain.

The article service now checks Open Graph and Twitter image metadata, accepts HTTPS images from public-resolving domains, and still falls back to the placeholder if metadata or the image is unavailable. During a refresh, cached stories missing an image are checked again without regenerating a successful summary. News cards render images inside a consistent aspect-ratio container with `object-fit: cover`; this crops images where necessary rather than distorting them. The browser may still fail to load an image if the publisher blocks it or removes it.

- `Backend/src/news/article.service.js` — reads multiple metadata variants and permits public HTTPS image hosts.
- `Backend/src/news/news.service.js` — retries image discovery for cached stories without spending Groq calls on existing summaries.
- `Frontend/src/features/news/News.jsx` and `news.scss` — reset image fallback when the URL changes and constrain responsive image dimensions.
- `README.md` — updates the description of supported image hosts.
- **Verification:** Frontend production build and targeted news-page lint passed; both modified backend services passed Node syntax checks. Live publisher image availability and browser rendering have not been rechecked.

## 6. Fill the full news card image area

**Purpose:** Make the picture fill the entire height beside a news card's text and improve image discovery when articles redirect or use additional image metadata formats.

- `Frontend/src/features/news/news.scss` — the desktop image panel now stretches to the card's full height, with `object-fit: cover`; mobile retains a dedicated image aspect ratio.
- `Backend/src/news/article.service.js` — follows up to three article redirects, applying the same public-address checks to each destination, and checks additional metadata and the first image inside an article.
- Some publishers block automated access, provide no suitable image, or block external image display; such cards still use the placeholder. In a live inspection, one missing-image source returned an unavailable response and another returned no detected image.
- **Verification:** Frontend production build, backend syntax check, and basic public/private address checks passed. The updated card layout has not been visually checked in a browser.

## 7. Compact news thumbnails

**Purpose:** Avoid the severe cropping caused by stretching images to the full height of tall news cards, and remove large empty placeholder panels.

- `Frontend/src/features/news/news.scss` — uses a fixed-size responsive thumbnail area and `object-fit: contain` so the full source image remains visible without distortion; padding inside the frame can appear for differently shaped images.
- `Frontend/src/features/news/News.jsx` — cards with missing or failed images use a text-only layout rather than displaying a large placeholder. Article metadata and publisher restrictions can still make images unavailable.
- **Verification:** Frontend production build and news-page lint passed. The updated layout has not been visually tested in a browser.

## 8. Require a usable image and summary

**Purpose:** Avoid displaying incomplete news cards and replace failed candidates with other stories. Previously, the refresh deliberately kept a headline when article extraction or Groq failed, which is why a card could say its summary was unavailable. Insufficient article text, publisher restrictions, API errors, or quota limits are possible causes; no per-story failure reason was stored.

The refresh now tries article extraction, image verification, and summary generation up to three times each (the initial attempt and two retries). It skips a candidate that remains incomplete and examines the next ranked candidate, bounded to 35 candidates and 20 minutes between candidate starts. It caches up to 15 complete stories: ten primary stories and up to five backups. If the image fails in a visitor's browser after two retries, the page hides that card and uses a backup where available. Existing incomplete cached stories are filtered from the public API. If there aren't enough qualifying stories, the page shows fewer than ten; if no refresh yields any, the last successful snapshot is retained.

- `Backend/src/news/article.service.js` — verifies that image URLs return an image over HTTPS, checking public addresses on each redirect.
- `Backend/src/news/news.selection.js` — shared retry and completeness checks.
- `Backend/src/news/news.selection.test.js` — tests retry limits and rejection of incomplete stories.
- `Backend/src/news/news.service.js` — retry, skip and replacement logic; the API exposes primary stories and backups.
- `Frontend/src/features/news/News.jsx` — hides broken-image cards after retries and fills their places from backups.
- `README.md` — updates news feed behavior.

The MCP tool reads the same primary stories and backups. Publisher or network behavior may differ between the backend and a visitor's browser. Repeated requests consume time and Groq quota, and the system cannot guarantee ten usable stories.

**Verification:** The retry and completeness tests passed, as did the frontend production build, news-page lint, and backend syntax checks. A live feed refresh and browser rendering were not tested for this change.

## 9. Refill the news feed

**Purpose:** Continue searching for replacement stories instead of stopping after the first 35 candidates, and prevent a refresh with fewer results from discarding suitable recent stories already in the cache.

- `Backend/src/news/news.service.js` — considers up to 150 top and 100 recent story IDs, retrieves details in bounded batches, enriches candidates in groups of four until 15 qualify or candidates/time are exhausted, and reuses qualifying recent cached stories if necessary. The refresh lock now renews a short lease, and startup retries a held lock.
- `Backend/src/news/news.selection.js` and `news.selection.test.js` — merge eligible previous stories without duplicates, expired items, or candidates that failed the current refresh; test the behavior.
- `Frontend/src/features/news/News.jsx` — checks the cached feed every 30 seconds so a newly completed refresh appears without waiting an hour, and reports when fewer than ten complete cards are available.

The target is ten cards with five backups, but a full feed still depends on enough recent accessible stories and working publisher images, Groq quota, and network access. A lock created by the previous version can remain until its earlier expiry; newly acquired locks use the shorter renewable lease.

**Verification:** Four selection tests, the frontend production build, targeted news-page lint, and backend syntax checks passed. A live check found six complete cached stories while a previous refresh lock was held, so ten live cards have not yet been verified.
