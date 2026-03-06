import { I18nProvider } from '@src/utils/I18nProvider'
import { ThemeProvider } from '@src/theme'
import { AuthProvider } from '@src/utils/AuthProvider'
import { BrowserRouter as Router } from 'react-router-dom'
import AllRoutes from '@src/utils/AllRoutes'
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
