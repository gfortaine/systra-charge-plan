import { defineConfig } from '@lingui/cli'
import locales from './src/i18n/locales.json'

export default defineConfig({
  sourceLocale: locales.default,
  locales: Object.keys(locales.languages),
  catalogs: [
    {
      path: '<rootDir>/src/i18n/locales/{locale}',
      include: ['<rootDir>/src'],
    },
  ],
})
