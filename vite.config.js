import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User site served at the domain root (https://fisherskyi.github.io/),
// so the base path is '/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
