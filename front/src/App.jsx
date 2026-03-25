import { BrowserRouter as Router } from 'react-router-dom'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { AuthProvider } from '@src/auth/AuthProvider'
import FullLayout from '@src/layout/FullLayout'
import AllRoutes from '@src/routes/AllRoutes'
import { ThemeProvider } from '@src/theme/ThemeProvider'
import '@scss/main.scss'
import { activateInitialLocale } from './i18n'

activateInitialLocale()

export default function App() {
  return (
    <I18nProvider i18n={i18n}>
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
