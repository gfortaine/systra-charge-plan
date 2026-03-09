import { useState, useEffect, useMemo } from 'react'
import { createNodeGettextAdapter, LionessProvider } from 'lioness'
import { I18nContext, bestLanguage, translations } from './'

export const I18nProvider = ({ children, defaultLocale = undefined }) => {
  const initialeLocale = defaultLocale ?? bestLanguage
  const [locale, setLocale] = useState(() => {
    const storedLocale = localStorage.getItem('locale')
    return storedLocale || initialeLocale
  })
  useEffect(() => {
    localStorage.setItem('locale', locale)
  }, [locale]) // each time the locale change
  const adapter = useMemo(() => createNodeGettextAdapter(), [])
  return (
    <I18nContext.Provider value={{ locale, setLocale, adapter, translations }}>
      <LionessProvider adapter={adapter} messages={translations} locale={locale}>
        {children}
      </LionessProvider>
    </I18nContext.Provider>
  )
}
