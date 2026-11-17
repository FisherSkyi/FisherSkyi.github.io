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
