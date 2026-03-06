import { createContext, useContext } from 'react'
import { LANGUAGES, DEFAULT_LANGUAGE } from '@src/constants'

export * as translations from '@src/translations.json'

export const languages = LANGUAGES
export const defaultLanguage = DEFAULT_LANGUAGE
export const I18nContext = createContext()
export const useI18nContext = () => useContext(I18nContext)

export function selectBestLanguage (browserLangs, supportedLangs, defaultLang) {
  if (browserLangs.length) {
    for (const lang of browserLangs) {
      const parts = lang.toLowerCase().split('-')
      if (parts.length > 1) {
        parts[1] = parts[1].toUpperCase()
      }
      const normLang = parts.join('-')
      if (supportedLangs.includes(normLang)) {
        return normLang
      } else if (parts.length > 1 && supportedLangs.includes(parts[0])) {
        return parts[0]
      }
    }
    return defaultLang
  } else {
    return defaultLang
  }
}

export const bestLanguage = selectBestLanguage(navigator.languages, Object.keys(languages), defaultLanguage)

export function useI18n() {
  return useI18nContext()
}
