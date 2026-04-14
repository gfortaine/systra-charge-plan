import { useEffect, useState } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider as LinguiProvider } from '@lingui/react'
import { I18nContext, languages, selectBestLocale, translations } from './'

export const LOCALE_STORAGE_KEY = 'locale'
export const I18nProvider = ({ children, defaultLocale = undefined }) => {
  const initialLocale = defaultLocale ?? selectBestLocale()
  const [locale, setLocale] = useState(() => {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
    return storedLocale || initialLocale
  })
  for (const lang of Object.keys(languages)) {
    if (!translations[lang]) {
      throw `${lang} defined as language but locale i18n/locales/${lang}.po not imported in i18n/index`
    }
  }
  i18n.load(translations)
  useEffect(() => {
    i18n.activate(locale)
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }, [locale]) // each time the locale change
  return (
    <I18nContext.Provider value={{ locale, setLocale, initialLocale, languages }}>
      <LinguiProvider i18n={i18n}>
        {children}
      </LinguiProvider>
    </I18nContext.Provider>
  )
}
