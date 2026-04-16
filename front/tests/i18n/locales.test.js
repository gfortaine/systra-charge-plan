import { describe, expect, test } from 'vitest'
import locales from '@src/i18n/locales.json'

describe('constants', () => {
  test('well defined', () => {
    expect(locales).toBeDefined()
    expect(locales.default).toBeDefined()
    expect(locales.languages).toBeDefined()
    expect(Object.keys(locales.languages)).toContain(locales.default)
    expect(locales.languages.en).toEqual('English')
  })
})
