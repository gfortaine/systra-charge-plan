import { describe, expect, test } from 'vitest'
import { DEFAULT_LANGUAGE, LANGUAGES } from '@src/constants'

describe('constants', () => {
  test('well defined', () => {
    expect(DEFAULT_LANGUAGE).toBeDefined()
    expect(LANGUAGES).toBeDefined()
    expect(Object.keys(LANGUAGES)).toContain(DEFAULT_LANGUAGE)
    expect(LANGUAGES.en).toEqual('English')
  })
})
