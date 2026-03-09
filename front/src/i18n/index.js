import { createContext, useContext } from 'react'
import locales from './locales.json'
import { useTranslation } from 'lioness'

export { T } from 'lioness'
export * as translations from './translations.json'

export const languages = locales.languages
export const defaultLanguage = locales.default
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
  return {
    ...useTranslation(),
    ...useI18nContext(),
  }
}
