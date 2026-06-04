import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname, join } from 'path'
import { copyFileSync, mkdirSync, cpSync, existsSync } from 'fs'

// Resolve .js imports to .ts files — lets JSX files import renamed TS modules
// without having to change every import statement during the migration.
function resolveJsToTs() {
  return {
    name: 'resolve-js-to-ts',
    resolveId(id, importer) {
      if (!importer || !id.startsWith('.') || !id.endsWith('.js')) return null
      const candidate = join(dirname(importer), id.replace(/\.js$/, '.ts'))
      return existsSync(candidate) ? candidate : null
    },
  }
}

// Post-build: copies auth-success.html and data/ into dist/
function copyLegacyAssets() {
  return {
    name: 'copy-legacy-assets',
    closeBundle() {
      for (const f of ['auth-success.html']) {
        if (existsSync(f)) {
          try { copyFileSync(f, `dist/${f}`) } catch (_) {}
        }
      }
      try {
        mkdirSync('dist/data', { recursive: true })
        cpSync('data', 'dist/data', { recursive: true })
      } catch (_) {}
    },
  }
}

export default defineConfig({
  plugins: [react(), resolveJsToTs(), copyLegacyAssets()],
  base: '/lawn-care-tools/',
  build: {
    outDir:    'dist',
    sourcemap: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
})
