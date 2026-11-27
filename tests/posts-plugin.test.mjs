import test from 'node:test'
import assert from 'node:assert/strict'
import { stat } from 'node:fs/promises'
import { postsPlugin } from '../scripts/posts-plugin.mjs'

const RESOLVED_ID = '\0virtual:posts'

// Collect the paths load() registers via addWatchFile.
async function loadWatching() {
  const watched = []
  const plugin = postsPlugin()
  const code = await plugin.load.call({ addWatchFile: (f) => watched.push(f) }, RESOLVED_ID)
  return { code, watched }
}

test('resolveId maps the virtual specifier and ignores everything else', () => {
  const plugin = postsPlugin()
  assert.equal(plugin.resolveId('virtual:posts'), RESOLVED_ID)
  assert.equal(plugin.resolveId('react'), null)
})

test('load only handles the resolved virtual id', async () => {
  const plugin = postsPlugin()
  assert.equal(await plugin.load.call({ addWatchFile() {} }, 'something-else'), null)
})

// Regression: addWatchFile(<directory>) broke `npm run dev` entirely — Vite
// resolves a virtual module's watched paths as imports and a directory does
// not resolve, so the dev server 500s on virtual:posts. New/removed post
// folders are handled by the configureServer watcher instead.
test('load never registers a directory with addWatchFile', async () => {
  // public/posts/ may be empty, so an empty watch list is valid here.
  const { watched } = await loadWatching()
  for (const f of watched) {
    const s = await stat(f)
    assert.ok(s.isFile(), `addWatchFile must receive files, got directory: ${f}`)
  }
})

test('configureServer watches the posts dir and invalidates on folder changes', () => {
  const handlers = {}
  let added = null
  let invalidated = false
  let sent = null
  const mod = {}
  const server = {
    watcher: { add: (p) => (added = p), on: (evt, fn) => (handlers[evt] = fn) },
    moduleGraph: {
      getModuleById: (id) => (id === RESOLVED_ID ? mod : null),
      invalidateModule: (m) => (invalidated = m === mod),
    },
    ws: { send: (msg) => (sent = msg) },
  }

  postsPlugin().configureServer(server)

  assert.ok(added && added.endsWith('posts'), 'should watch public/posts')
  for (const evt of ['add', 'unlink', 'addDir', 'unlinkDir']) {
    assert.equal(typeof handlers[evt], 'function', `missing handler for ${evt}`)
  }

  handlers.addDir(added + '/2026-11-new-post')
  assert.ok(invalidated, 'virtual:posts should be invalidated')
  assert.deepEqual(sent, { type: 'full-reload' })

  // Paths outside public/posts are ignored.
  invalidated = false
  sent = null
  handlers.add('/somewhere/else/file.md')
  assert.equal(invalidated, false)
  assert.equal(sent, null)
})

test('compiled output is a JS module exporting published posts', async () => {
  const { code } = await loadWatching()
  assert.match(code, /^export default \[/)
  const posts = JSON.parse(code.replace(/^export default /, '').trim())
  assert.ok(Array.isArray(posts))
  for (const p of posts) {
    assert.equal(p.draft, false, `draft post leaked into output: ${p.slug}`)
    assert.match(p.dateKey, /^\d{4}-\d{2}-\d{2}$/)
  }
  // Newest first.
  const keys = posts.map((p) => p.dateKey)
  assert.deepEqual(keys, [...keys].sort().reverse())
})
