import { describe, test, expect } from 'vitest'
import { LANGUAGES, DEFAULT_LANGUAGE } from '@src/constants'

describe('constants', () => {
  test('well defined', () => {
    expect(DEFAULT_LANGUAGE).toBeDefined()
    expect(LANGUAGES).toBeDefined()
    expect(Object.keys(LANGUAGES)).toContain(DEFAULT_LANGUAGE)
    expect(LANGUAGES.en).toEqual('English')
  })
})
