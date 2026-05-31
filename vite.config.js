import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, cpSync, existsSync } from 'fs'

// Post-build plugin: copies redirect shims + data/ into dist/
// tracker.html and dashboard.html are now redirect shims -> React routes
function copyLegacyAssets() {
  return {
    name: 'copy-legacy-assets',
    closeBundle() {
      // Redirect shims (old URLs -> React hash routes)
      for (const f of ['tracker.html', 'dashboard.html', 'auth-success.html']) {
        if (existsSync(f)) {
          try { copyFileSync(f, `dist/${f}`) } catch (_) {}
        }
      }
      // data/ directory — JSON files must be accessible at the same URLs
      try {
        mkdirSync('dist/data', { recursive: true })
        cpSync('data', 'dist/data', { recursive: true })
      } catch (_) {}
    },
  }
}

export default defineConfig({
  plugins: [react(), copyLegacyAssets()],
  base: '/lawn-care-tools/',
  build: {
    outDir:    'dist',
    sourcemap: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
})
