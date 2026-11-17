import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { postsPlugin } from './scripts/posts-plugin.mjs'

// User site served at the domain root (https://fisherskyi.github.io/),
// so the base path is '/'.
export default defineConfig({
  plugins: [react(), postsPlugin()],
  base: '/',
})
