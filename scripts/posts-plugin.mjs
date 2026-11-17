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
