import { I18nProvider } from '@src/utils/I18nProvider'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@src/theme'
import { AuthProvider } from '@src/utils/AuthProvider'
import { BrowserRouter as Router } from 'react-router-dom'
import DefaultLayout from '@comp/layout/DefaultLayout'

export default function App() {
  return (
    <I18nProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <DefaultLayout />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}
