# fisherskyi.github.io

Personal website of Yu Letian

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Writing a post

Posts are markdown, one folder per post. Create
`public/posts/<YYYY-MM-slug>/index.md`:

```markdown
---
title: "Estimating an AR(1) process"
date: "2025-09-14"        # quote it; YYYY-MM also works
tags: [statistics, notes] # optional
summary: One-line blurb.  # optional — falls back to the first paragraph
draft: false              # optional — true hides it from the site
---

Body text. Inline math $a^2 + b^2 = c^2$ and display math:

$$\int_0^1 x^2\,dx = \tfrac13$$

| supported | also |
|-----------|------|
| GFM tables | fenced code with highlighting |

![a figure](figure.png)
```

Drop images, PDFs and other assets **in the post folder** and reference them
by bare filename — relative `src`/`href` values are rewritten to
`/posts/<slug>/...` at build time. Only top-level folders under
`public/posts/` are treated as posts.

`npm run dev` picks up new and edited posts without a restart. The post shows
up in Writing (merged by date with the external-link entries in `src/data.js`)
and at `#/post/<slug>`.

```bash
npm test                         # parser tests
node scripts/posts-preview.mjs   # print the compiled post data
```

`index.json` is accepted instead of `index.md` for the same fields, with the
markdown body under `body`.

## Structure

- `src/data.js` — all non-post content.
- `src/App.jsx` — shell: page/theme state, keyboard shortcuts (`j`/`k`, `/`, `t`), hash routing (`#/<page>`, `#/post/<slug>`).
- `src/sections.jsx` — the eight sections.
- `src/components/` — `Sidebar`, `Topbar`, `Article`.
- `src/index.css` — design tokens (dark/light) + component styles.
- `scripts/posts-plugin.mjs` — Vite plugin compiling `public/posts/` into the `virtual:posts` module.
- `scripts/posts/parse.mjs` — frontmatter + markdown → HTML (remark/rehype, KaTeX, highlight.js).
- `public/` — static assets served at the site root (`.nojekyll`, `favicon_io/`, `assets/`, `posts/`).

Designed by Letian. Implemented by Claude Opus 4.8. Thanks Claude.
