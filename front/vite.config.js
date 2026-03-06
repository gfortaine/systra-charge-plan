import DjVitePlugin from 'djvite'
import react from '@vitejs/plugin-react'
import { reactScopedCssPlugin } from 'rollup-plugin-react-scoped-css'
import path from 'path'
import { env } from 'process'
import { defineConfig } from 'vite'

const django_server = `http://localhost:${env.DJANGO_PORT || '8000'}`
const chunksMap = (() => {
  const map = {}
  map['config'] = 'front/src/config.js'
  Object.entries({
    react: ['react', 'react-dom', 'react-router', 'react-hook-form'],
    mui: ['@mui'],
    mapbox: ['@mapboxql', 'mapbox-gl'],
  }).forEach(([big, depIds]) => {
    depIds.forEach(depId => {
      map[depId] = `vendor-${big}`
    })
  })
  map['vendor-all'] = 'node_modules'
  return map
})()

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: (env.VITE_HOST || 'localhost'),
    allowedHosts: true,
    port: 1 * (env.PORT || '3978'),
    origin: `http://localhost:${env.PORT || '3978'}`,
    proxy: {
      '^/(static|__debug__|graphql|oidc)': django_server,
      'favicon.ico': django_server,
    },
  },
  plugins: [
    DjVitePlugin({ verbose: true, manifestPath: 'front/vite.manifest.json' }),
    react(),
    reactScopedCssPlugin(),
  ],
  resolve: {
    alias: {
      '@src': path.resolve('./front/src'),
      '@page': path.resolve('./front/src/pages'),
      '@comp': path.resolve('./front/src/components'),
      '@scss': path.resolve('./front/src/scss'),
      '@static': path.resolve('./front/static'),
      '@test': path.resolve('./front/tests'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@scss/sds-design-system/color-shades" as *;\n',
      },
    },
  },
  test: {
    environment: 'jsdom',
    environmentOptions: {
      customExportConditions: ['node', 'node-addons'],
    },
    server: { deps: { inline: ['gettext'] } },
    reporters: ['junit', 'default'],
    include: ['front/tests/**/*.test.js'],
    outputFile: {
      junit: './reports/report-js.xunit',
    },
    coverage: {
      provider: 'istanbul',
      enabled: true,
      include: ['front/src/**'],
      extension: ['js', 'vue'],
      reportsDirectory: './reports/coverage-js',
      reporter: ['cobertura', 'clover', 'text', 'text-summary', 'html'],
      reportOnFailure: true,
    },
  },
  build: {
    outDir: path.resolve('./front/dist'),
    sourcemap: true,
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
      output: {
        compact: true,
        manualChunks: (id) => {
          for (const [chunk, depId] of Object.entries(chunksMap)) {
            if (id.includes(depId)) {
              return chunk
            }
          }
        },
      },
    },
  },
})
