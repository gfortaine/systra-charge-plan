import { useCallback, useMemo } from 'react'
import * as muiLocales from '@mui/material/locale'
import { createTheme } from '@mui/material/styles'
import colors from '@scss/color-shades'
import { useI18n } from '@src/i18n'

export function useTheme() {
  const { locale } = useI18n()
  const findMuiLocale = useCallback(locale => {
    for (const [muiKey, muiLocale] of Object.entries(muiLocales)) {
      if (muiKey.startsWith(locale)) {
        return muiLocale
      }
    }
    return muiLocales.enUS
  }, [])
  const muiLocale = findMuiLocale(locale)
  return useMemo(() =>
    createTheme({
      palette: {
        primary: {
          main: colors.primary,
          dark: colors.primary_dark,
          light: colors.primary_light,
        },
        secondary: {
          main: colors.secondary,
          dark: colors.secondary_dark,
          light: colors.secondary_light,
        },
        error: {
          main: colors.error,
        },
        success: {
          main: colors.success,
        },
        warning: {
          main: colors.warning,
        },
        info: {
          main: colors.main,
        },
      },
    }, muiLocale), [muiLocale])
}
