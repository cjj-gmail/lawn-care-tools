import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve, dirname, join } from 'path'
import { copyFileSync, mkdirSync, cpSync, existsSync } from 'fs'

// Resolve .js imports to .ts files
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
      for (const f of ['auth-success.html', 'tracker.html', 'dashboard.html']) {
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
  plugins: [
    react(),
    resolveJsToTs(),
    copyLegacyAssets(),
    VitePWA({
      registerType: 'autoUpdate',
      // Only include app shell in precache -- data files are fetched at runtime
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Lawn Care Tools',
        short_name: 'Lawn Care',
        description: '12-month lawn care program for Oakhurst NSW',
        theme_color: '#3a5a28',
        background_color: '#f5f0e8',
        display: 'standalone',
        start_url: '/lawn-care-tools/',
        scope: '/lawn-care-tools/',
        icons: [
          { src: '/lawn-care-tools/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/lawn-care-tools/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // App shell: cache-first (versioned by Vite hash, never stale)
        globPatterns: ['**/*.{js,css,html,ico,woff2}'],
        runtimeCaching: [
          {
            // program.json via raw CDN -- NetworkFirst so updates come through,
            // but falls back to cache when offline
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/cjj-gmail\/lawn-care-tools\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'github-raw-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Google Fonts
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  base: '/lawn-care-tools/',
  build: {
    outDir:    'dist',
    sourcemap: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
})
