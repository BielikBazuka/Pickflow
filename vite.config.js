import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',          // relative paths → works on GitLab Pages sub-paths too
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
