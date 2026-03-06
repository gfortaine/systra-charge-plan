import { I18nProvider } from '@src/utils/I18nProvider'
import { ThemeProvider } from '@mui/material/styles'
import useTheme from '@src/theme'
import { AuthProvider } from '@src/utils/AuthProvider'
import { BrowserRouter as Router } from 'react-router-dom'
import DefaultLayout from '@comp/layout/DefaultLayout'

export default function App() {
  const MyThemeProvider = ({ children }) => {
    const theme = useTheme()
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    )
  }
  return (
    <I18nProvider>
      <MyThemeProvider>
        <AuthProvider>
          <Router>
            <DefaultLayout />
          </Router>
        </AuthProvider>
      </MyThemeProvider>
    </I18nProvider>
  )
}
