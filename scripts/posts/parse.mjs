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
