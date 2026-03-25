import { defineConfig } from '@lingui/cli'

export default defineConfig({
  sourceLocale: 'en',
  locales: ['fr', 'en'],
  catalogs: [
    {
      path: '<rootDir>/front/src/i18n/locales/{locale}',
      include: ['front/src'],
    },
  ],
})
