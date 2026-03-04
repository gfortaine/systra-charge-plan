// Theming
import { createTheme } from '@mui/material/styles'
import { vuetifyColors } from './scss/sds-design-system/color-shades'

const theme = createTheme({
  palette: {
    primary: {
      main: vuetifyColors.primary,
      dark: vuetifyColors.primarydark,
      light: vuetifyColors.primarylight,
    },
    secondary: {
      main: vuetifyColors.secondary,
      dark: vuetifyColors.secondarydark,
      light: vuetifyColors.secondarylight,
    },
    black: {
      main: vuetifyColors.black,
    },
    white: {
      main: vuetifyColors.white,
    },
    error: {
      main: vuetifyColors.error,
    },
    success: {
      main: vuetifyColors.success,
    },
    warning: {
      main: vuetifyColors.warning,
    },
    main: {
      main: vuetifyColors.main,
    },
    grey: {
      main: vuetifyColors.mediumgrey,
      dark: vuetifyColors.darkgrey,
      light: vuetifyColors.lightgrey,
      ultralight: vuetifyColors.ultralightgrey,
    },
  },
})

export default theme
