import { useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import AccountCircle from '@mui/icons-material/AccountCircle'
import app_logo from '@static/logo-v2-dark.png'
import { NavLink } from 'react-router-dom'
import { useTranslation } from '@src/lioness'
import useRoutes from '@src/routes.jsx'
import { useAuth, useAuthContext } from '@src/utils/auth'

const drawerWidth = 240

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
)

export default function NavigationDrawer() {
  const { t } = useTranslation()
  const { routes } = useRoutes()
  const { logout: logoutUser } = useAuthContext()
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleLogout = () => {
    setOpen(false)
    logoutUser()
    logout()
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme }) => ({
    zIndex: theme.zIndex.drawer - 200,
    width: '100%',
    paddingLeft: '64px',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }))

  const TopAppBar = (
    <AppBar position="fixed" open={open} className="app-toolbar">
      <Toolbar>
        <img src={app_logo} className="app-logo" alt="logo" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
        <div>
          <IconButton
            component={NavLink}
            to="/user"
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="secondary"
          >
            <AccountCircle />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  )

  const DrawerList = (
    <List sx={{ height: '100%' }}>
      {routes.map((route, index) => {
        if (route.isNav) {
          if (route.path != '/logout') {
            return (
              <ListItem key={index} className="app-menu-item" disablePadding>
                <ListItemButton component={NavLink} to={route.path} onClick={handleDrawerClose}>
                  <ListItemIcon className="app-menu-item-icon">
                    { route.icon }
                  </ListItemIcon>
                  <ListItemText className="app-menu-item-title" primary={route.title(t)} />
                </ListItemButton>
              </ListItem>
            )
          } else {
            return (
              <ListItem key={index} className="app-menu-item" sx={{ position: 'absolute', bottom: 0 }} disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon className="app-menu-item-icon">
                    { route.icon }
                  </ListItemIcon>
                  <ListItemText className="app-menu-item-title" primary={route.title(t)} />
                </ListItemButton>
              </ListItem>
            )
          }
        }
      })}
    </List>
  )

  let button
  if (open) {
    button = (
      <ListItemButton onClick={handleDrawerClose}>
        <ListItemIcon>
          <ChevronLeftIcon color="white" />
        </ListItemIcon>
        <ListItemText primary={t('Fold down pane')} />
      </ListItemButton>
    )
  } else {
    button = (
      <ListItemButton onClick={handleDrawerOpen}>
        <MenuIcon />
      </ListItemButton>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {TopAppBar}
      <Drawer className="drawer" variant="permanent" open={open}>
        <DrawerHeader className="drawer-header" disablePadding>
          <ListItem className="app-menu-item" disablePadding>
            {button}
          </ListItem>
        </DrawerHeader>
        <Divider />
        {DrawerList}
      </Drawer>
    </Box>
  )
}
