import { I18nProvider } from '@src/i18n/I18nProvider'
import { ThemeProvider } from '@src/theme/ThemeProvider'
import { AuthProvider } from '@src/auth/AuthProvider'
import { BrowserRouter as Router } from 'react-router-dom'
import AllRoutes from '@src/routes/AllRoutes'
import FullLayout from '@src/layout/FullLayout'
import '@scss/main.scss'

export default function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <FullLayout>
              <AllRoutes />
            </FullLayout>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}
