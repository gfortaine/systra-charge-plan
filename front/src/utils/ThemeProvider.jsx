import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { useTheme } from '@src/theme'

export const ThemeProvider = ({ children }) => {
  const theme = useTheme()
  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  )
}
