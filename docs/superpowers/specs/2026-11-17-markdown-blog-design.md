# Markdown Blog Pipeline — Design

- Date: 2026-11-17
- Status: Draft (pending review)
- Author: Codex

## 1. Goal

Let the site owner write new blog posts as **markdown files in their own folder**,
and have them automatically compiled into the Writing section of the site. Each
post's text and all of its assets live together in one folder, so creating a post
is "make a folder, drop in the files."

### Non-goals
- No static-HTML export, SEO, RSS, or sitemap (this is a hash-routed SPA).
- No CMS, no runtime user login, no editing UI.
- No changes to the other six sections (About, Projects, Pubs, Talks, Work, Misc).

## 2. Source format (folder per post)

Posts live under `public/posts/`, one folder per post:

```
public/posts/
  2026-02-ar1-process/
    index.md          # frontmatter + body — the post text
    fig1.png          # assets, may be nested
  2026-03-bandit-feedback/
    index.md
    plots/
      loss.png
```

- **Slug = folder name** (no `slug` field needed in frontmatter).
- **Body = `index.md`** in the folder. A post may alternatively use `index.json`
  with the shape `{ title, date, tags, summary, body }` where `body` is a
  markdown string run through the same pipeline. Markdown is the primary format;
  JSON is supported for parity with the "or json" request.
- **Assets** may live anywhere inside the post folder and are referenced from the
  body by **relative path**: `![fig](fig1.png)`, `![loss](plots/loss.png)`,
  or `[data](data.csv)`.

### Frontmatter (markdown posts)

```yaml
---
title: AR(1) process and its properties
date: "2026-02-14"          # required, YYYY-MM or YYYY-MM-DD — QUOTE it
tags: [statistics, time-series]
summary: A brief note on... # optional; falls back to first paragraph
draft: false                # optional; default false
---
```

- `title` and `date` are required.
- **Quote the date** (`"2026-02-14"`) so YAML keeps it a string. Unquoted
  dates are also tolerated (YAML parses them to `Date`; the parser formats
  them back via UTC getters), but the quoted form is the documented one.
- `date` may omit the day (`YYYY-MM`); treat as the first of the month for
  sorting/display.
- `tags` is an optional list (used for the row UI and the search filter).

### Compiled post object

```js
{
  slug: '2026-02-ar1-process',
  title: 'AR(1) process and its properties',
  date: '2026-02-14',       // normalized to YYYY-MM-DD
  dateKey: '2026-02-14',    // sortable
  tags: ['statistics', 'time-series'],
  summary: 'A brief note on...',
  html: '<p>...</p>',        // rendered body, asset URLs rewritten
  draft: false,
}
```

## 3. Pipeline

### 3.1 Files

- `scripts/posts/parse.mjs` — pure function `{ raw, slug, kind } → post object`.
  Parses frontmatter, renders markdown → HTML, rewrites relative asset URLs
  (the rewrite helper, `rewriteAssetUrls`, lives in this same file — it is
  ~10 lines). Pure (no I/O) so it is unit-testable.
- `scripts/posts-plugin.mjs` — the Vite plugin.
- `scripts/posts-preview.mjs` — dev helper that prints the compiled module
  (`node scripts/posts-preview.mjs`) for debugging without a browser.
- `tests/posts.test.mjs` — unit tests via `node:test`.
- `vite.config.js` — registers the plugin.

### 3.2 Vite plugin (`virtual:posts`)

A custom Vite plugin that:

1. **Resolves** the id `virtual:posts` to a virtual module.
2. On load, **reads** every `public/posts/<slug>/{index.md,index.json}`,
   calls the pure `parse` function, and returns a generated ES module:
   `export default [ ...posts ]` sorted by `dateKey` **descending**.
3. In **dev**, calls `this.addWatchFile()` on each source file so editing a post
   triggers HMR of the Writing list and the article page.
4. Excludes posts with `draft: true`.

The app consumes it like any other data module:

```js
import posts from 'virtual:posts'
```

### 3.3 Dependencies

Runtime/build:
- `gray-matter` — YAML frontmatter.
- `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-stringify`
  — md → HTML (`remark-rehype` bridges the remark AST to the rehype AST and is
  required for the rehype plugins to run).
- `rehype-highlight` — code-block highlighting (one CSS theme valid in both themes).
- **Recommended, include now:** `remark-math` + `rehype-katex` — the writing is
  statistics-heavy, so `$…$`/`$$…$$` support is one line of config.

No new dev-dependency test runner: use Node's built-in `node:test`.

### 3.4 Asset URL rewrite

After rendering to HTML, for each `src="…"` / `href="…"` value:
- If it starts with `/`, `http://`, `https://`, `data:`, `mailto:`, `#` → leave as-is.
- Otherwise (relative) → prefix with `/posts/<slug>/`.

This makes `![](fig1.png)` resolve to `/posts/2026-02-ar1-process/fig1.png`,
which is where Vite serves the asset (see §4).

## 4. Why `posts/` lives in `public/`

Vite serves `public/` at the site root in dev **and** copies it verbatim into
`dist/` on build. Placing posts under `public/posts/` therefore gives us:
- assets available at `/posts/<slug>/...` in dev with no extra config;
- assets copied to `dist/posts/<slug>/...` on build with no extra config.

The only pipeline work is the §3.4 URL rewrite so the compiled HTML points at
those public URLs. The markdown source itself is *not* served (it's consumed by
the plugin), but it also being publicly reachable is harmless for a personal site
(raw post source visible at `/posts/<slug>/index.md`). See §9 (known tradeoff).

## 5. UI / routing

### 5.1 Routing (`src/App.jsx`)
- Extend hash parsing so `#/post/<slug>` is a valid route in addition to the eight
  page ids (`about`, `projects`, `writing`, `pubs`, `talks`, `work`, `gallery`,
  `misc`).
- Unknown slugs / missing posts fall back to the Writing list.
- The `j`/`k` section navigator treats an open article as being on the "writing"
  page (so `j`/`k` from an article moves between sections, not between posts).
- Search (`/`) and theme toggle keep working unchanged.

### 5.2 Article page (`src/components/Article.jsx`, new)
- Renders: title, human date, tags, then the compiled `html` body.
- Body rendered via `dangerouslySetInnerHTML` inside a `.post` container.
- Serif body font (existing `--serif` token), ~65ch measure, `← Back to Writing`
  link to `#/writing`.
- No TOC, no prev/next links (YAGNI; trivial to add later).

### 5.3 Writing list (`src/sections.jsx`)
- Merge compiled posts with the existing `DATA.posts` link entries, interleaved
  by `date` descending (compiled posts carry `dateKey`; existing entries carry
  `YYYY-MM` and are normalized the same way).
- Compiled posts render as internal rows linking to `#/post/<slug>`; the row's
  sub-line shows `summary` (or the first-paragraph fallback from §6 when no
  summary is given), matching the article page.
- Existing external-link entries render exactly as today (unchanged).
- The `/` search filter matches compiled posts' title + tags + summary.

### 5.4 Styling (`src/index.css`)
- `.post` typography (serif, line-length, heading sizes, spacing).
- Code-block styling for dark + light themes (pairs with `rehype-highlight`).
- KTeX/`img` sizing within the post measure.

## 6. Validation & error handling

- **Structural errors throw at build/dev time** with a clear message:
  - missing `index.md`/`index.json`;
  - frontmatter missing `title` or `date`;
  - unparseable frontmatter/markdown;
  - duplicate slug (two folders yielding the same normalized slug).
- **Minor issues do not fail the build:**
  - missing `summary` → fall back to the first paragraph of the body.
  - `date` without a day → assume the 1st.
- Throwing at build keeps a broken post from shipping silently.

## 7. Content-security note

Post content is self-authored and bundled as static build-time data, so this
design does **not** add an HTML sanitizer. If posts ever become third-party or
user-supplied, add `rehype-sanitize` before this is considered production-safe.
(Deliberate choice — flagged for the owner.)

## 8. Migration

- No migration of existing `DATA.posts` entries is required — the three current
  entries (arXiv ×2, AR(1) PDF) stay in `data.js` as external links and keep
  rendering.
- **Dogfood:** convert the AR(1) entry into a real `public/posts/2026-02-ar1-process/`
  folder with a short `index.md`, to prove the pipeline with real content.
- The existing `public/assets/files/TSA4__Problem_3_2-1.pdf` can be moved into the
  post folder and referenced relatively once converted.

## 9. Tradeoffs & known limits

- Raw post source is publicly reachable at `/posts/<slug>/index.md` because the
  source sits in `public/`. Accepted for a personal site; if undesired later, the
  fix is to move `posts/` out of `public/` and add a copy step to the build.
- One folder = one post. Subdirectories are allowed only for assets; a nested
  folder containing its own `index.md` would create a second post with a
  slash in the slug — the plugin should treat only **top-level** subfolders of
  `public/posts/` as posts (not recursive). (Explicit behavior.)

## 10. Testing

`tests/posts.test.mjs` (Node `node:test`), covering the pure `parse` function:
- valid markdown post → correct slug/title/date/tags/summary/html.
- valid JSON post (`index.json`) → same pipeline.
- relative asset URL rewrite (image, nested path, link) and that absolute/external
  URLs are untouched.
- `draft: true` posts are excluded from the compiled list.
- duplicate slug → throws.
- missing `title` or `date` → throws.
- date normalization (`YYYY-MM` → first of month) and descending sort.

Run with `node --test tests/`.

## 11. What does NOT change

- CI workflow (`.github/workflows/deploy.yml`).
- `dist/` build output shape (still `vite build`).
- The six non-Writing sections.
- Search, theme, and keyboard-shortcut behavior (except the `j`/`k` article
  nuance in §5.1).
