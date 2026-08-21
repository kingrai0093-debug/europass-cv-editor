import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Base '/' for custom domain (rbcking.dpdns.org). GitHub Pages project site needs '/europass-cv-editor/' — set via GH_PAGES=true env.
export default defineConfig({
  plugins: [react()],
  base: process.env.GH_PAGES === 'true' ? '/europass-cv-editor/' : '/',
  server: {
    allowedHosts: true
  }
})
