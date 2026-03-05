import { useState } from 'react'

/* Router and routes */
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import useRoutes from '@src/routes.jsx'
import { AuthProvider } from '@src/utils/AuthProvider'

/* i18n */
import { selectBestLanguage } from './utils/i18n'
import { createNodeGettextAdapter, LionessProvider } from '@src/lioness'
import { LANGUAGES, DEFAULT_LANGUAGE } from './constants'
import translations from './translations.json'

import NavigationDrawer from '@comp/layout/NavigationDrawer'
import { Box } from '@mui/material'

// Theming
import { ThemeProvider } from '@mui/material/styles'
import theme from '@src/theme.js'

export default function App() {
  const bestLanguage = selectBestLanguage(navigator.languages, Object.keys(LANGUAGES), DEFAULT_LANGUAGE)
  const gettextAdapter = createNodeGettextAdapter()
  const { routes } = useRoutes()
  const [open, setOpen] = useState(false)
  const toggleDrawer = (newState) => () => {
    setOpen(newState)
  }

  return (
    <LionessProvider
      adapter={gettextAdapter}
      messages={translations}
      locale={bestLanguage}
    >
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <div className="app">
              <Box className="container">
                <NavigationDrawer open={open} toggleDrawer={toggleDrawer} />
                <Routes>
                  {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))}
                </Routes>
              </Box>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LionessProvider>
  )
}
