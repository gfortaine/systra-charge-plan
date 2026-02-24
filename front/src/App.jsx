import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'

/* i18n */
import { selectBestLanguage } from './utils/i18n'
import { createNodeGettextAdapter, LionessProvider } from '@src/lioness'
import { LANGUAGES, DEFAULT_LANGUAGE } from './constants'
import translations from './translations.json'

import NavigationDrawer from '@comp/layout/NavigationDrawer'
import useRoutes from '@src/routes.jsx'

// Theming
import { ThemeProvider } from '@mui/material/styles'
import theme from '@src/theme.js'

function App() {
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
        <div className="app">
          <Box className="container">
            <NavigationDrawer
              open={open}
              toggleDrawer={toggleDrawer}
            />
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </Box>
        </div>
      </ThemeProvider>
    </LionessProvider>
  )
}

export default App
