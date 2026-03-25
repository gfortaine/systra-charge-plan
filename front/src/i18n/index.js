import { i18n } from '@lingui/core'
import { detect, fromNavigator, fromStorage } from '@lingui/detect-locale'
import { messages as en } from './locales/en.po'
import { messages as fr } from './locales/fr.po'
import locales from './locales.json'

export const LOCALE_STORAGE_KEY = 'locale'

i18n.load({ en, fr })

const canonicalizeLocale = locale => {
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? locale
  } catch {
    return String(locale || '').trim()
  }
}

const normalizeForLookup = locale => canonicalizeLocale(locale).toLowerCase()

export const selectBestLocale = (
  requestedLocales,
  availableLocales = Object.keys(locales.languages),
  fallbackLocale = locales.default,
) => {
  const availableLookup = new Map(
    availableLocales.map((locale) => [normalizeForLookup(locale), locale]),
  )

  for (const requestedLocale of requestedLocales) {
    if (!requestedLocale) {
      continue
    }

    const normalizedRequested = normalizeForLookup(requestedLocale)

    // 1) match exact
    const exactMatch = availableLookup.get(normalizedRequested)
    if (exactMatch) {
      return exactMatch
    }

    // 2) fallback régional : fr-CA -> fr
    const [languagePart] = normalizedRequested.split('-')
    if (!languagePart) {
      continue
    }

    const baseMatch = availableLookup.get(languagePart)
    if (baseMatch) {
      return baseMatch
    }
  }

  return fallbackLocale
}

const getStoredLocale = () => {
  const detected = detect(fromStorage(LOCALE_STORAGE_KEY))
  return typeof detected === 'string' && detected.length > 0
    ? detected
    : undefined
}

const getBrowserLocales = () => {
  if (typeof window === 'undefined') {
    return []
  }

  if (Array.isArray(window.navigator.languages) && window.navigator.languages.length > 0) {
    return window.navigator.languages.filter(Boolean)
  }

  const locale = detect(fromNavigator())
  return typeof locale === 'string' && locale.length > 0 ? [locale] : []
}

export const resolveInitialLocale = () => {
  const storedLocale = getStoredLocale()
  if (storedLocale) {
    return selectBestLocale([storedLocale])
  }

  return selectBestLocale(getBrowserLocales())
}

export const activateLocale = locale => {
  const nextLocale = selectBestLocale([locale])
  i18n.activate(nextLocale)
  return nextLocale
}

export const setLocale = locale => {
  const nextLocale = activateLocale(locale)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
  }

  return nextLocale
}

export const activateInitialLocale = () => activateLocale(resolveInitialLocale())
export const languages = locales.languages
