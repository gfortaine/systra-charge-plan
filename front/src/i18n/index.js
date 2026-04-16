import { createContext, useContext } from 'react'
import { i18n } from '@lingui/core'
import locales from './locales.json'

export const I18nContext = createContext(null)
export const useI18nContext = () => useContext(I18nContext)
export const languages = locales.languages

export async function loadCatalog(locale) {
  const catalog = await import(`./locales/${locale}.po`)
  i18n.load(locale, catalog.messages)
}

function normalizeLocale(locale) {
  let canonicalLocale = undefined
  try {
    canonicalLocale = Intl.getCanonicalLocales(locale)[0]
  } finally {
    if (!canonicalLocale) {
      canonicalLocale = String(locale || '').trim()
    }
  }
  return canonicalLocale.toLowerCase()
}

export function selectBestLocale (
  requestedLocales = navigator.languages,
  availableLocales = Object.keys(locales.languages),
  fallbackLocale = locales.default,
) {
  const localeMap = new Map(availableLocales.map(locale => [normalizeLocale(locale), locale]))
  for (const requestedLocale of requestedLocales.filter(l => l)) {
    const normLocale = normalizeLocale(requestedLocale)
    const countryLocale = normLocale.includes('-') ? normLocale.split('-')[0] : null
    for (const oneLocale of [normLocale, countryLocale].filter(l => l)) {
      const locale = oneLocale && localeMap.get(oneLocale)
      if (locale) {
        return locale
      }
    }
  }
  return fallbackLocale
}

export function useI18n() {
  const ctx = useI18nContext()
  if (!ctx) {
    throw new Error('You cannot invoke useI18n outside an I18nProvider')
  }
  return ctx
}
