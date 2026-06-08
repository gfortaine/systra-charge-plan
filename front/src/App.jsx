import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import { AuthProvider } from '@src/auth/AuthProvider'
import { apolloClient } from '@src/graphql'
import { I18nProvider } from '@src/i18n/I18nProvider'
import FullLayout from '@src/layout/FullLayout'
import AllRoutes from '@src/routes/AllRoutes'
import { ThemeProvider } from '@src/theme/ThemeProvider'
import '@scss/main.scss'

export default function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <Router>
              <FullLayout>
                <AllRoutes />
              </FullLayout>
            </Router>
          </AuthProvider>
        </ApolloProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}
