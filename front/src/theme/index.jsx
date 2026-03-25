import { useCallback, useMemo } from 'react'
import { useLingui } from '@lingui/react'
import * as muiLocales from '@mui/material/locale'
import { createTheme } from '@mui/material/styles'
import colors from '@scss/color-shades'

export function useTheme() {
  const { i18n } = useLingui()
  const findMuiLocale = useCallback((locale) => {
    for (const [muiKey, muiLocale] of Object.entries(muiLocales)) {
      if (muiKey.startsWith(locale)) {
        return muiLocale
      }
    }
    return muiLocales.enUS
  }, [])
  const muiLocale = findMuiLocale(i18n.locale)
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
        black: {
          main: colors.black,
        },
        white: {
          main: colors.white,
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
        main: {
          main: colors.main,
        },
        grey: {
          main: colors.grey_medium,
          dark: colors.grey_dark,
          light: colors.grey_light,
          ultralight: colors.grey_ultralight,
        },
      },
    }, muiLocale), [muiLocale])
}
