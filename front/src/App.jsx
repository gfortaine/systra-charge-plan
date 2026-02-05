import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import AddPost from '@page/AddPost'
import Fail from '@page/Fail'
import Home from '@page/Home'
import Pickers from '@page/Pickers'
import MapPage from '@page/MapPage'
import AppToolbar from '@comp/layout/AppToolbar'
import NavigationDrawer from '@comp/layout/NavigationDrawer'
import './App.css'

function App() {
  const [open, setOpen] = useState(false)

  const toggleDrawer = (newState) => () => {
    setOpen(newState)
  }

  return (
    <div className="app">
      {/* <AppToolbar
        onClickOpenDrawer={toggleDrawer}
      /> */}
      <Box className="app-container">
        <NavigationDrawer
          open={open}
          toggleDrawer={toggleDrawer}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fail" element={<Fail />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/pickers" element={<Pickers />} />
        </Routes>
      </Box>
    </div>
  )
}

export default App
