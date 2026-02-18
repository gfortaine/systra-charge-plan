import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import app_logo from '@static/logo-v1-white.png'

export default function AppToolbar({ onClickOpenDrawer }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onClickOpenDrawer(true)}
            edge="start"
            sx={[
              { marginRight: 5 },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <img src={app_logo} className="app-logo" alt="logo" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
