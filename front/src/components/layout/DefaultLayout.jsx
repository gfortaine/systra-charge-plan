import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import useRoutes from '@src/routes'
import NavigationDrawer from '@comp/layout/NavigationDrawer'
import { Box } from '@mui/material'

export default function DefaultLayout() {
  const { routes } = useRoutes()
  const [open, setOpen] = useState(false)
  const toggleDrawer = (newState) => () => {
    setOpen(newState)
  }
  return (
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
  )
}
