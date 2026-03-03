import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'

/* i18n */
import { selectBestLanguage } from './utils/i18n'
import { createNodeGettextAdapter, LionessProvider } from '@src/lioness'
import { LANGUAGES, DEFAULT_LANGUAGE } from './constants'
import translations from './translations.json'

// import AppToolbar from '@comp/layout/AppToolbar'
import NavigationDrawer from '@comp/layout/NavigationDrawer'
import useRoutes from '@src/routes.jsx'
import './App.css'

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
      <div className="app">
        {/* <AppToolbar
          onClickOpenDrawer={toggleDrawer}
        /> */}
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
    </LionessProvider>
  )
}

export default App
