import { Box } from '@mui/material'
import AppToolbar from './AppToolbar'
import NavigationDrawer from './NavigationDrawer'

export default function FullLayout({ children }) {
  return (
    <div className="app">
      <Box className="container">
        <Box sx={{ display: 'flex' }}>
          <AppToolbar />
          <NavigationDrawer />
        </Box>
        {children}
      </Box>
    </div>
  )
}
