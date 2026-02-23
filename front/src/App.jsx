import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import NavigationDrawer from '@comp/layout/NavigationDrawer'
import routes from '@src/routes.jsx'
import './App.css'

function App() {
  const [open, setOpen] = useState(false)
  const toggleDrawer = (newState) => () => {
    setOpen(newState)
  }

  return (
    <div className="app">
      <NavigationDrawer open={open} toggleDrawer={toggleDrawer} />
      <Box className="container">
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
  )
}

export default App
