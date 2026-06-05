import path from 'path'
import { env } from 'process'
import { lingui } from '@lingui/vite-plugin'
import react from '@vitejs/plugin-react'
import DjVitePlugin from 'djvite'
import { reactScopedCssPlugin } from 'rollup-plugin-react-scoped-css'
import { defineConfig } from 'vite'
import graphqlLoader from 'vite-plugin-graphql-loader'

const django_server = `http://localhost:${env.DJANGO_PORT || '8000'}`
const chunksMap = (() => {
  const map = {}
  map['config'] = 'front/src/config.js'
  Object.entries({
    react: ['react', 'react-dom', 'react-router', 'react-hook-form', '@mui'],
    mapbox: ['@mapboxql', 'mapbox-gl'],
  }).forEach(([big, depIds]) => {
    depIds.forEach(depId => {
      map[`vendor-${big}`] = depId
    })
  })
  map['vendor-all'] = 'node_modules'
  return map
})()

// https://vitejs.dev/config/
const config = defineConfig({
  server: {
    host: (env.VITE_HOST || 'localhost'),
    allowedHosts: true,
    port: Number(env.PORT || '3978'),
    origin: `http://localhost:${env.PORT || '3978'}`,
    proxy: {
      '^/(static|__debug__|graphql|oidc)': django_server,
      'favicon.ico': django_server,
    },
  },
  plugins: [
    DjVitePlugin({ verbose: true, manifestPath: 'front/vite.manifest.json' }),
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    lingui(),
    reactScopedCssPlugin(),
    graphqlLoader(),
  ],
  resolve: {
    alias: {
      '@src': path.resolve('./front/src'),
      '@page': path.resolve('./front/src/pages'),
      '@comp': path.resolve('./front/src/components'),
      '@scss': path.resolve('./front/src/theme/scss'),
      '@static': path.resolve('./front/static'),
      '@test': path.resolve('./front/tests'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@scss/color-shades" as *;\n',
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
      include: ['front/src/**/*.{js,jsx}'],
      exclude: [
        'front/src/i18n/locale/**',
      ],
      reportsDirectory: './reports/coverage-js',
      reporter: ['cobertura', 'clover', 'text', 'text-summary', 'html'],
      reportOnFailure: true,
    },
  },
  build: {
    outDir: path.resolve('./front/dist'),
    sourcemap: true,
    chunkSizeWarningLimit: 2 * 1024,
    // https://rolldown.rs/reference
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name(moduleId) {
                for (const [chunk, depId] of Object.entries(chunksMap)) {
                  if (moduleId.includes(depId)) {
                    return chunk
                  }
                }
                return null
              },
            },
          ],
        },
      },
    },
  },
})
export default config
