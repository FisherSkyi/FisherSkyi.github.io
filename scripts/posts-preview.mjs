// Dev helper: print exactly what the virtual:posts module would contain.
// Usage: node scripts/posts-preview.mjs
import { postsPlugin } from './posts-plugin.mjs'

const plugin = postsPlugin()
const code = await plugin.load.call({ addWatchFile() {} }, '\0virtual:posts')
console.log(code ?? '(no posts)')
