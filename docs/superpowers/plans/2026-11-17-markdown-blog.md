# Markdown Blog Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the site owner write posts as markdown in one folder per post under `public/posts/` and have them compiled into the Writing section of the SPA.

**Architecture:** A small in-repo Vite plugin reads `public/posts/<slug>/{index.md,index.json}`, parses frontmatter + markdown → HTML at dev/build time (unified/remark/rehype), rewrites relative asset URLs to `/posts/<slug>/...`, and exposes the compiled list as a virtual module `virtual:posts`. The React app gains a `#/post/<slug>` hash route and an `Article` component; the Writing list merges compiled posts with the existing external-link entries.

**Tech Stack:** Vite 6, React 18, gray-matter, unified (remark-parse, remark-gfm, remark-math, remark-rehype, rehype-katex, rehype-highlight, rehype-stringify), Node's built-in `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-17-markdown-blog-design.md`

**Notes for the engineer:**
- Working dir: repo root (has `package.json` with `"type": "module"`).
- Node ≥ 20 (dev machine has v24).
- **Frontmatter dates must be quoted** (`date: "2026-02-14"`) so YAML keeps them as strings. The parser also tolerates unquoted dates (YAML gives a `Date` object) via a UTC-getter fallback, but the quoted form is the documented, deterministic one.
- Asset rewrite is a string replace over rendered HTML; it does not touch code-block *text* containing `src="..."` — accepted limitation (spec §3.4).
- Posts are **top-level** subfolders of `public/posts/` only (not recursive).
- Each task leaves the app in a runnable state; verify with `npm run dev` where noted.

---

### Task 1: Install dependencies and add test script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm i gray-matter unified remark-parse remark-gfm remark-math remark-rehype rehype-katex rehype-stringify rehype-highlight highlight.js katex
```
Expected: packages added to `dependencies` in `package.json`.
`remark-rehype` is REQUIRED — it bridges the remark (markdown AST) side to the rehype (HTML AST) side; without it the rehype plugins never run. (Network required; if the sandbox blocks it, re-run with approval.)

- [ ] **Step 2: Add test script**

In `package.json`, change the `scripts` block to:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "node --test tests/"
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add markdown blog pipeline dependencies"
```

---

### Task 2: Post parser (`scripts/posts/parse.mjs`) — TDD

**Files:**
- Create: `tests/posts.test.mjs`
- Create: `scripts/posts/parse.mjs`

- [ ] **Step 1: Write the failing tests**

Create `tests/posts.test.mjs`:
```js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parsePost,
  rewriteAssetUrls,
  normalizeDate,
  firstParagraph,
} from '../scripts/posts/parse.mjs'

const MD = `---
title: AR(1) process and its properties
date: "2026-02-14"
tags: [statistics, time-series]
summary: A brief note on the AR(1) process.
---

The **AR(1)** process $X_t$ is defined by

$$X_t = c + \\phi X_{t-1} + \\varepsilon_t$$

![fig](fig1.png)
[Sheet](TSA4.pdf)
[Ext](https://example.com/x)
[Top](#top)
`

test('parses a markdown post with frontmatter', () => {
  const p = parsePost({ raw: MD, slug: '2026-02-ar1-process', kind: 'md' })
  assert.equal(p.slug, '2026-02-ar1-process')
  assert.equal(p.title, 'AR(1) process and its properties')
  assert.equal(p.dateKey, '2026-02-14')
  assert.deepEqual(p.tags, ['statistics', 'time-series'])
  assert.equal(p.summary, 'A brief note on the AR(1) process.')
  assert.equal(p.draft, false)
  assert.ok(p.html.includes('<strong>AR(1)</strong>'))
  assert.ok(p.html.includes('class="katex"')) // math rendered
  assert.ok(p.html.includes('src="/posts/2026-02-ar1-process/fig1.png"'))
  assert.ok(p.html.includes('href="/posts/2026-02-ar1-process/TSA4.pdf"'))
  assert.ok(p.html.includes('href="https://example.com/x"')) // untouched
  assert.ok(p.html.includes('href="#top"')) // untouched
})

test('accepts unquoted YAML date (parsed to a Date object by js-yaml)', () => {
  const raw = '---\ntitle: T\ndate: 2026-03-05\n---\nbody\n'
  const p = parsePost({ raw, slug: 'u', kind: 'md' })
  // js-yaml resolves date-only scalars via Date.UTC, so UTC getters round-trip
  assert.equal(p.dateKey, '2026-03-05')
})

test('falls back to first paragraph when summary is missing', () => {
  const raw = '---\ntitle: T\ndate: "2026-01-15"\n---\n\nFirst para here.\n\nSecond.\n'
  const p = parsePost({ raw, slug: 't', kind: 'md' })
  assert.equal(p.summary, 'First para here.')
  assert.equal(p.dateKey, '2026-01-15')
})

test('draft flag is parsed', () => {
  const raw = '---\ntitle: T\ndate: "2026-01-01"\ndraft: true\n---\nbody\n'
  assert.equal(parsePost({ raw, slug: 'd', kind: 'md' }).draft, true)
})

test('parses a json post', () => {
  const raw = JSON.stringify({
    title: 'Json post',
    date: '2026-03-05',
    tags: ['x'],
    summary: 'S',
    body: 'hello ![i](a.png)',
  })
  const p = parsePost({ raw, slug: 'jp', kind: 'json' })
  assert.equal(p.title, 'Json post')
  assert.equal(p.dateKey, '2026-03-05')
  assert.ok(p.html.includes('src="/posts/jp/a.png"'))
})

test('throws when title is missing', () => {
  assert.throws(
    () => parsePost({ raw: '---\ndate: "2026-01-01"\n---\nbody\n', slug: 'x', kind: 'md' }),
    /missing "title"/,
  )
})

test('throws when date is missing or invalid', () => {
  assert.throws(
    () => parsePost({ raw: '---\ntitle: T\n---\nbody\n', slug: 'x', kind: 'md' }),
    /missing or invalid "date"/,
  )
  assert.throws(
    () => parsePost({ raw: '---\ntitle: T\ndate: 01/02/2026\n---\nbody\n', slug: 'x', kind: 'md' }),
    /missing or invalid "date"/,
  )
})

test('rewriteAssetUrls leaves absolute, external, anchor, data urls alone', () => {
  const html = '<a href="/abs">1</a><a href="https://e.com">2</a><a href="mailto:a@b.c">3</a><a href="#x">4</a><img src="rel.png"><a href="sub/y.png">5</a>'
  const out = rewriteAssetUrls(html, 's')
  assert.ok(out.includes('href="/abs"'))
  assert.ok(out.includes('href="https://e.com"'))
  assert.ok(out.includes('href="mailto:a@b.c"'))
  assert.ok(out.includes('href="#x"'))
  assert.ok(out.includes('src="/posts/s/rel.png"'))
  assert.ok(out.includes('href="/posts/s/sub/y.png"'))
})

test('normalizeDate', () => {
  assert.equal(normalizeDate('2026-02', 's'), '2026-02-01')
  assert.equal(normalizeDate('2026-02-14', 's'), '2026-02-14')
})

test('firstParagraph', () => {
  assert.equal(firstParagraph('# H\n\n  hello   world \n\npara2\n'), 'hello world')
  assert.equal(firstParagraph(''), '')
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '../scripts/posts/parse.mjs'`.

Note: use plain `node --test` (Node 24's test runner discovers `tests/*.test.mjs` automatically); `node --test tests/` does not resolve the directory on Node 24, so the `test` script in `package.json` is `node --test`.

- [ ] **Step 3: Implement the parser**

Create `scripts/posts/parse.mjs`:
```js
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

// remark plugins → remark-rehype (md AST → HTML AST) → rehype plugins → html string
const pipe = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeHighlight, { ignoreMissing: true })
  .use(rehypeStringify)

// Rewrite src=/href= values that are relative to the post folder into
// absolute site URLs. Leaves absolute paths, external links, anchors,
// mailto: and data: urls untouched.
export function rewriteAssetUrls(html, slug) {
  const prefix = `/posts/${slug}/`
  return html.replace(/(src|href)\s*=\s*("([^"]*)"|'([^']*)')/g, (m, attr, _q, dq, sq) => {
    const url = dq !== undefined ? dq : sq
    if (!isRelative(url)) return m
    return `${attr}="${prefix}${url}"`
  })
}

function isRelative(url) {
  // Not relative when it starts with a scheme (http:, data:, mailto:), '#', or '/'
  return !/^(?:[a-zA-Z][a-zA-Z0-9+.-]*:|#|\/)/.test(url)
}

// 'YYYY-MM' → first of month; 'YYYY-MM-DD' passes through.
// Unquoted YAML dates arrive as Date objects (js-yaml resolves date-only
// scalars via Date.UTC), so format with UTC getters.
export function normalizeDate(raw, slug) {
  if (raw instanceof Date) {
    if (Number.isNaN(raw.getTime())) throw new Error(`post ${slug}: missing or invalid "date"`)
    const y = raw.getUTCFullYear()
    const m = String(raw.getUTCMonth() + 1).padStart(2, '0')
    const d = String(raw.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  const s = String(raw ?? '').trim()
  const mm = s.match(/^(\d{4})-(\d{2})$/)
  if (mm) return `${mm[1]}-${mm[2]}-01`
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  throw new Error(`post ${slug}: missing or invalid "date" (${JSON.stringify(raw)}; expected YYYY-MM or YYYY-MM-DD)`)
}

// First markdown paragraph, whitespace-collapsed. '' when none.
export function firstParagraph(markdown) {
  const tree = unified().use(remarkParse).parse(markdown || '')
  const textOf = (node) => (node.children || []).map((c) => (c.value !== undefined ? c.value : '')).join('')
  const walk = (node) => {
    if (node.type === 'paragraph') return textOf(node)
    for (const child of node.children || []) {
      const r = walk(child)
      if (r) return r
    }
    return null
  }
  const p = walk(tree)
  return p ? p.replace(/\s+/g, ' ').trim() : ''
}

// { raw, slug, kind: 'md' | 'json' } → compiled post object
export function parsePost({ raw, slug, kind }) {
  let data
  if (kind === 'json') {
    data = JSON.parse(raw)
  } else {
    const parsed = matter(raw)
    data = { ...parsed.data, body: parsed.content }
  }

  const title = data.title
  if (typeof title !== 'string' || !title.trim()) {
    throw new Error(`post ${slug}: missing "title" in frontmatter`)
  }
  const dateKey = normalizeDate(data.date, slug)
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : []
  const summary =
    typeof data.summary === 'string' && data.summary.trim()
      ? data.summary.trim()
      : firstParagraph(data.body || '')
  const html = rewriteAssetUrls(String(pipe.processSync(data.body || '')), slug)

  return {
    slug,
    title: title.trim(),
    date: dateKey,
    dateKey,
    tags,
    summary,
    html,
    draft: data.draft === true,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests in `tests/posts.test.mjs` green. If the unquoted-date test fails because your js-yaml resolved to local time, the fix is in `normalizeDate` (the Date branch); document what you find.

- [ ] **Step 5: Commit**

```bash
git add scripts/posts/parse.mjs tests/posts.test.mjs
git commit -m "feat: markdown/JSON post parser with frontmatter, math, asset rewrite"
```

---

### Task 3: Vite plugin (`virtual:posts`) + dev preview helper

**Files:**
- Create: `scripts/posts-plugin.mjs`
- Create: `scripts/posts-preview.mjs`
- Modify: `vite.config.js`

- [ ] **Step 1: Create the plugin**

Create `scripts/posts-plugin.mjs`:
```js
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parsePost } from './posts/parse.mjs'

const VIRTUAL_ID = 'virtual:posts'
const RESOLVED_ID = '\0virtual:posts'

const here = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(here, '..', 'public', 'posts')

const exists = async (p) => {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

export function postsPlugin() {
  return {
    name: 'fisherskyi-posts',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
      return null
    },
    async load(id) {
      if (id !== RESOLVED_ID) return null

      let entries = []
      try {
        entries = await readdir(POSTS_DIR, { withFileTypes: true })
      } catch {
        entries = [] // public/posts/ does not exist yet
      }
      // Watch the dir itself too, so NEW post folders appear without a restart.
      this.addWatchFile(POSTS_DIR)
      // Only TOP-LEVEL folders are posts (spec §9).
      const slugs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort()

      const posts = []
      for (const slug of slugs) {
        const dir = path.join(POSTS_DIR, slug)
        let kind = null
        if (await exists(path.join(dir, 'index.json'))) kind = 'json'
        else if (await exists(path.join(dir, 'index.md'))) kind = 'md'
        if (!kind) {
          throw new Error(`post ${slug}: missing index.md or index.json`)
        }
        const file = path.join(dir, kind === 'json' ? 'index.json' : 'index.md')
        this.addWatchFile(file) // HMR in dev when the post changes
        const raw = await readFile(file, 'utf8')
        posts.push(parsePost({ raw, slug, kind }))
      }

      posts.sort((a, b) => b.dateKey.localeCompare(a.dateKey)) // newest first
      const published = posts.filter((p) => !p.draft)
      return `export default ${JSON.stringify(published)}\n`
    },
  }
}
```

- [ ] **Step 2: Create the dev preview helper**

Create `scripts/posts-preview.mjs`:
```js
// Dev helper: print exactly what the virtual:posts module would contain.
// Usage: node scripts/posts-preview.mjs
import { postsPlugin } from './posts-plugin.mjs'

const plugin = postsPlugin()
const code = await plugin.load.call({ addWatchFile() {} }, '\0virtual:posts')
console.log(code ?? '(no posts)')
```

- [ ] **Step 3: Register the plugin in `vite.config.js`**

Replace the whole file with:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { postsPlugin } from './scripts/posts-plugin.mjs'

// User site served at the domain root (https://fisherskyi.github.io/),
// so the base path is '/'.
export default defineConfig({
  plugins: [react(), postsPlugin()],
  base: '/',
})
```

- [ ] **Step 4: Verify the plugin loads (smoke test)**

Run:
```bash
node scripts/posts-preview.mjs
```
Expected: `(no posts)` (the `public/posts/` folder does not exist until Task 4).

- [ ] **Step 5: Commit**

```bash
git add scripts/posts-plugin.mjs scripts/posts-preview.mjs vite.config.js
git commit -m "feat: vite plugin compiling public/posts into virtual:posts module"
```

---

### Task 4: First real post (dogfood) + data.js cleanup

**Files:**
- Create: `public/posts/2026-02-ar1-process/index.md`
- Move: `public/assets/files/TSA4__Problem_3_2-1.pdf` → `public/posts/2026-02-ar1-process/TSA4__Problem_3_2-1.pdf`
- Modify: `src/data.js` (remove the AR(1) entry from `DATA.posts`)

- [ ] **Step 1: Create the post folder and move the PDF**

```bash
mkdir -p public/posts/2026-02-ar1-process
git mv public/assets/files/TSA4__Problem_3_2-1.pdf public/posts/2026-02-ar1-process/TSA4__Problem_3_2-1.pdf
rmdir public/assets/files
```

- [ ] **Step 2: Write the post**

Create `public/posts/2026-02-ar1-process/index.md`:
```markdown
---
title: AR(1) process and its properties
date: "2026-02-01"
tags: [statistics, time-series]
summary: A brief note on the AR(1) process and its key properties.
---

The **autoregressive order-1** (AR(1)) process is the simplest linear
time-series model. It defines each observation as a linear function of the
previous one plus noise:

$$X_t = c + \phi X_{t-1} + \varepsilon_t, \qquad \varepsilon_t \sim \mathcal{N}(0, \sigma^2)$$

Key properties:

- **Stationarity** requires $|\phi| < 1$.
- The autocorrelation decays geometrically: $\rho_k = \phi^k$.
- It can be written as an infinite moving average, so shocks fade over time.

The full worked problem sheet is [available as a PDF](TSA4__Problem_3_2-1.pdf).
```

- [ ] **Step 3: Remove the AR(1) entry from `src/data.js`**

In `src/data.js`, delete this object from the `DATA.posts` array (the entry whose `href` is `'/assets/files/TSA4__Problem_3_2-1.pdf'`):
```js
    {
      date: '2025-09',
      title: 'AR(1) process and its properties',
      sub: 'A brief note on the AR(1) process and its key properties.',
      href: '/assets/files/TSA4__Problem_3_2-1.pdf',
    },
```
The two arXiv entries remain.

- [ ] **Step 4: Verify the compiled output**

Run:
```bash
node scripts/posts-preview.mjs
```
Expected: one line starting with `export default [{"slug":"2026-02-ar1-process",...` whose `html` contains `<strong>autoregressive` and a link rewritten to `/posts/2026-02-ar1-process/TSA4__Problem_3_2-1.pdf`.

- [ ] **Step 5: Commit**

```bash
git add public/posts/2026-02-ar1-process src/data.js
git commit -m "feat: first markdown post (AR(1) note) with PDF asset in post folder"
```

---

### Task 5: Article component + vendor CSS imports

**Files:**
- Create: `src/components/Article.jsx`
- Modify: `src/main.jsx`

(Do this before Task 6 so `src/App.jsx` can import `Article` and the app stays buildable at every step.)

- [ ] **Step 1: Create `src/components/Article.jsx`**

```jsx
function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function Article({ post }) {
  return (
    <div className="section">
      <div className="section__head">
        <a className="post__back" href="#/writing">
          ← back to writing
        </a>
        <h1 className="post__title">{post.title}</h1>
        <div className="post__meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="post" dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  )
}
```

(No HTML sanitizer by design — self-authored content, spec §7.)

- [ ] **Step 2: Import vendor CSS in `src/main.jsx`**

Replace the whole file with:
```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Both packages are direct dependencies (Task 1), so the CSS imports resolve.

- [ ] **Step 3: Verify the app still builds**

Run: `npm run build`
Expected: succeeds (Article is not used yet, but the imports/CSS resolve).

- [ ] **Step 4: Commit**

```bash
git add src/components/Article.jsx src/main.jsx
git commit -m "feat: article page component and katex/highlight css"
```

---

### Task 6: Routing — `#/post/<slug>` in `src/App.jsx`

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace the whole file with the new version**

```jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PAGES } from './data.js'
import posts from 'virtual:posts'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Article from './components/Article.jsx'
import { About, Projects, Writing, Publications, Talks, Experience, Gallery, Miscellaneous } from './sections.jsx'

const IDS = PAGES.map((p) => p.id)
const validPage = (id) => (IDS.includes(id) ? id : 'about')

// The hash is the single source of truth for routing:
//   #/post/<slug> → Writing section with that post open
//   #/<page-id>   → one of the eight pages
const parseHash = () => {
  const h = window.location.hash.replace(/^#\/?/, '')
  if (h.startsWith('post/')) {
    return { page: 'writing', postSlug: h.slice(5) || null }
  }
  return { page: validPage(h), postSlug: null }
}

export default function App() {
  const [route, setRoute] = useState(parseHash)
  const [theme, setTheme] = useState('dark')
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef(null)

  const page = route.page

  // Restore saved theme.
  useEffect(() => {
    const saved = localStorage.getItem('letian.theme')
    if (saved === 'light' || saved === 'dark') setTheme(saved)
  }, [])

  // Reflect theme on <html> for tokens + native form controls.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setPage = useCallback((id) => {
    const next = validPage(id)
    setRoute({ page: next, postSlug: null })
    setQ('')
    setMenuOpen(false)
    if (window.location.hash.replace(/^#\/?/, '') !== next) {
      window.location.hash = '/' + next
    }
  }, [])

  // Sync when the user navigates via back/forward or edits the hash
  // (including #/post/<slug> links from the Writing list).
  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash())
      setQ('')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('letian.theme', next)
      return next
    })
  }, [])

  // Keyboard shortcuts: j/k move sections, / focuses filter, t toggles theme.
  // While an article is open, `page` is 'writing', so j/k move sections.
  useEffect(() => {
    const onKey = (e) => {
      const el = e.target
      const typing = el && /^(INPUT|TEXTAREA)$/.test(el.tagName)
      if (e.key === 'Escape' && typing) {
        setQ('')
        el.blur()
        return
      }
      if (typing) return
      if (e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
        return
      }
      if (e.key === 't') {
        toggleTheme()
        return
      }
      if (e.key === 'j' || e.key === 'k') {
        const i = IDS.indexOf(page)
        const n = (i + (e.key === 'j' ? 1 : IDS.length - 1)) % IDS.length
        setPage(IDS[n])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [page, setPage, toggleTheme])

  const match = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (...parts) => !needle || parts.join(' ').toLowerCase().includes(needle)
  }, [q])

  const post = route.postSlug ? posts.find((p) => p.slug === route.postSlug) : null
  const crumb = (PAGES.find((p) => p.id === page) || PAGES[0]).label

  return (
    <div className={'app' + (menuOpen ? ' app--menu' : '')} data-theme={theme}>
      <div className="scrim" onClick={() => setMenuOpen(false)} />
      <Sidebar page={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme} />
      <main className="main">
        <Topbar q={q} setQ={setQ} crumb={crumb} inputRef={inputRef} onToggleMenu={() => setMenuOpen((v) => !v)} />
        <div className="content">
          {page === 'about' && <About />}
          {page === 'projects' && <Projects match={match} />}
          {page === 'writing' &&
            (post ? (
              <Article post={post} />
            ) : (
              <Writing match={match} posts={posts} />
            ))}
          {page === 'pubs' && <Publications match={match} />}
          {page === 'talks' && <Talks match={match} />}
          {page === 'work' && <Experience match={match} />}
          {page === 'gallery' && <Gallery />}
          {page === 'misc' && <Miscellaneous match={match} />}
        </div>
      </main>
    </div>
  )
}
```

Notes:
- Unknown slug → `post` is `null` → the Writing list renders (fallback per spec §5.1).
- `Sidebar` receives `page === 'writing'` while an article is open, so the Writing nav item stays highlighted — no Sidebar change needed.

- [ ] **Step 2: Verify in dev**

Run: `npm run dev` and open `http://localhost:5173/#/writing`.
Expected: the AR(1) row appears; clicking it opens the article at `#/post/2026-02-ar1-process`; browser back returns to the list. (The Writing list merge from Task 7 is not in yet, so the row comes from `posts` — that is fine at this step.)

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: hash route #/post/<slug> for compiled posts"
```

---

### Task 7: Writing list merges compiled posts with link entries

**Files:**
- Modify: `src/sections.jsx`

- [ ] **Step 1: Replace the `Writing` function**

In `src/sections.jsx`, replace the entire `export function Writing({ match }) { ... }` block with:
```jsx
const monthOf = (d) => (/^\d{4}-\d{2}$/.test(d) ? d + '-01' : d)

export function Writing({ match, posts }) {
  const items = [
    ...posts.map((p) => ({
      dateKey: p.dateKey,
      title: p.title,
      sub: p.summary,
      href: '#/post/' + p.slug,
      search: [p.title, p.summary, p.tags.join(' ')].join(' '),
      ext: false,
    })),
    ...DATA.posts.map((p) => ({
      dateKey: monthOf(p.date),
      title: p.title,
      sub: p.sub,
      href: p.href,
      search: [p.title, p.sub, p.date].join(' '),
      ext: true,
    })),
  ]
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
    .filter((p) => match(p.search))

  return (
    <div className="section">
      <div className="section__head">
        <h1 className="section__title">Notes as I figure things out</h1>
      </div>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <div className="rows">
          {items.map((p, i) => (
            <a className={'row' + (p.href ? ' row--link' : '')} key={i} href={p.href} {...(p.ext ? ext(p.href) : {})}>
              <div className="row__date">{p.dateKey.slice(0, 7)}</div>
              <div className="row__body">
                <div className="row__title">{p.title}</div>
                <div className="row__sub">{p.sub}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
```

Notes:
- Internal post rows use `href="#/post/<slug>"`; the `hashchange` listener in `App.jsx` does the routing — no extra callbacks.
- External entries keep `target="_blank"` via the existing `ext()` helper.
- Date column shows `YYYY-MM` for both kinds.
- Everything else in `sections.jsx` (About, Projects, Publications, Talks, Experience, Gallery, Miscellaneous, `Empty`, `ext`) is unchanged.

- [ ] **Step 2: Verify in dev**

Run: `npm run dev`, open `http://localhost:5173/#/writing`. Expected rows, newest first:
1. `2026-02 · AR(1) process and its properties` (internal link)
2. `2026-01 · Adversarially Robust Learning-to-Defer accepted to AISTATS 2026` (external)
3. `2025-10 · Preprint: Adversarial robustness in one-stage learning-to-defer` (external)

Press `/`, type `ar(1)` — only the AR(1) row remains. Click it — the article opens.

- [ ] **Step 3: Commit**

```bash
git add src/sections.jsx
git commit -m "feat: Writing list merges compiled posts with link entries by date"
```

---

### Task 8: Article typography in `src/index.css`

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Append the post styles at the end of the file**

```css
/* ==========================================================================
   Post article (compiled markdown)
   ========================================================================== */
.post__back {
  display: inline-block;
  margin-bottom: 18px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.05em;
  color: var(--dim);
}
.post__back:hover {
  color: var(--accent);
}

.post__title {
  margin: 0 0 10px;
  font-size: 30px;
  font-weight: 550;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.post__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 30px;
  font-size: 13px;
  color: var(--dim);
}

.post {
  max-width: 65ch;
  font-family: var(--serif);
  font-size: 17px;
  line-height: 1.7;
  color: var(--text);
}
.post p {
  margin: 0 0 1.1em;
}
.post h2 {
  margin: 1.6em 0 0.6em;
  font-family: var(--sans);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.post h3 {
  margin: 1.4em 0 0.5em;
  font-family: var(--sans);
  font-size: 18px;
  font-weight: 600;
}
.post a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.post ul,
.post ol {
  margin: 0 0 1.1em;
  padding-left: 1.4em;
}
.post li {
  margin: 0.25em 0;
}
.post img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
.post blockquote {
  margin: 0 0 1.1em;
  padding: 0.2em 1.1em;
  border-left: 2px solid var(--accent);
  color: var(--dim);
}
.post table {
  border-collapse: collapse;
  margin: 0 0 1.2em;
  font-size: 15px;
}
.post th,
.post td {
  border: 1px solid var(--line2);
  padding: 6px 10px;
}
.post code {
  font-family: var(--mono);
  font-size: 0.85em;
  background: var(--accent-soft);
  padding: 0.15em 0.4em;
  border-radius: 4px;
}
/* Code blocks: dark background in BOTH themes so the single
   github-dark highlight theme stays valid. */
.post pre {
  margin: 0 0 1.2em;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #0d1117;
  overflow-x: auto;
}
.post pre code {
  background: none;
  padding: 0;
  font-size: 13px;
  line-height: 1.55;
}
.post .katex-display {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0;
}
```

- [ ] **Step 2: Verify in dev**

Open the article in both themes (`t` to toggle). Check: serif body, readable code blocks (none in the AR(1) post — add a fenced code block temporarily to verify), math renders, no horizontal overflow.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: article typography, tables, code blocks, katex sizing"
```

---

### Task 9: Full verification

**Files:** none (verification only; fix anything that fails, then commit fixes)

- [ ] **Step 1: Run the test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds. Then check:
```bash
ls dist/posts/2026-02-ar1-process/
grep -c "AR(1) process" dist/assets/*.js
```
Expected: `index.md` and `TSA4__Problem_3_2-1.pdf` present in `dist/posts/2026-02-ar1-process/` (public/ copied verbatim), and the compiled post (title + html) is inside the bundled JS (count ≥ 1).

- [ ] **Step 3: Preview the production build**

Run: `npm run preview` and check in a browser (default port 4173):
- `/#/writing` — rows newest-first: AR(1) (2026-02), arXiv accepted (2026-01), arXiv preprint (2025-10); the AR(1) row opens `/#/post/2026-02-ar1-process`.
- Article page — math renders, the PDF link (`/posts/2026-02-ar1-process/TSA4__Problem_3_2-1.pdf`) opens the PDF, back link returns to the list.
- Browser back/forward works between list and article.
- `t` theme toggle and `/` filter still work on the article page.
- `j`/`k` from an article moves to the next/previous section (not to a different post).
- The two arXiv rows still open in a new tab.
- `/#/post/does-not-exist` shows the Writing list (fallback).

- [ ] **Step 4: HMR sanity check (dev only)**

Run `npm run dev`, open the Writing page, then change the post's `summary` line in `public/posts/2026-02-ar1-process/index.md`. Expected: the row's sub-line updates without a full page reload. Also verify a brand-new post folder (`public/posts/2026-11-test/index.md` with minimal frontmatter) appears after a page refresh.

- [ ] **Step 5: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: address blog pipeline issues found during verification"
```
(Skip if no changes. Delete the `2026-11-test` scratch folder from Step 4 before committing.)

---

## Self-review notes (run by the plan author)

- Spec §2 folder format / frontmatter / JSON variant → Tasks 2 (parser + tests) and 4 (real post).
- Spec §3.1 files → Tasks 2 (parse.mjs, tests) and 3 (plugin + preview helper). `rewriteAssets.mjs` was folded into `parse.mjs` (~10 lines; a separate file would be over-decomposition).
- Spec §3.2 plugin → Task 3 (virtual module, addWatchFile incl. the posts dir so new folders appear, draft exclusion, date-desc sort, top-level folders only per §9).
- Spec §3.3 dependencies → Task 1 (incl. KaTeX + highlight, `remark-rehype` bridge, and explicit `highlight.js`/`katex` deps so the CSS imports are first-class).
- Spec §3.4 asset rewrite → Task 2 (implementation + dedicated tests).
- Spec §5.1 routing → Task 6 (parseHash, j/k, fallback for unknown slug).
- Spec §5.2 Article → Task 5 (ordered before Task 6 so the app builds at every step).
- Spec §5.3 Writing merge (row sub-line shows summary or first-paragraph fallback; search covers tags) → Task 7.
- Spec §5.4 styles → Task 8.
- Spec §6 validation → Task 2 tests (missing title/date, bad date) + Task 3 (folder without `index.*` throws).
- Spec §8 migration / dogfood → Task 4 (PDF moved into the post folder and referenced relatively; `data.js` entry removed; the two arXiv link entries remain).
- Spec §10 tests → Task 2; re-run in Task 9.
- Known accepted limitations (documented, not fixed): relative-URL rewrite can touch `src=`-looking text inside code blocks; raw post source is publicly reachable at `/posts/<slug>/index.md` (spec §4/§9).
