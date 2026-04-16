import { useEffect, useState } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider as LinguiProvider } from '@lingui/react'
import { I18nContext, languages, loadCatalog, selectBestLocale } from './'

export const LOCALE_STORAGE_KEY = 'locale'
export const I18nProvider = ({ children, defaultLocale = undefined }) => {
  const initialLocale = defaultLocale ?? selectBestLocale()
  const [loaded, setLoaded] = useState(false)
  const [locale, setLocale] = useState(() => {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
    return storedLocale || initialLocale
  })
  useEffect(() => {
    if (loaded) {
      i18n.activate(locale)
      localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    }
  }, [loaded, locale]) // each time the locale change
  useEffect(() => {
    const loadLocales = async() => {
      for (const lang of Object.keys(languages)) {
        await loadCatalog(lang)
      }
      setLoaded(true)
    }
    if (!loaded) {
      loadLocales()
    }
  }, [loaded])
  return loaded ? (
    <I18nContext.Provider value={{ locale, setLocale, initialLocale, languages }}>
      <LinguiProvider i18n={i18n}>
        {children}
      </LinguiProvider>
    </I18nContext.Provider>
  ) : null
}
