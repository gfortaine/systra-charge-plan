import { useState } from 'react'
import { styled } from '@mui/material/styles'
import {
  ClickAwayListener,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { NavLink } from 'react-router-dom'
import useRoutes from '@src/routes.jsx'
import { useAuth, useAuthContext } from '@src/utils/auth'
import { useI18n } from '@src/utils/i18n'

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
  const { routes, LogoutRoute } = useRoutes()
  const { logout: logoutUser } = useAuthContext()
  const { logout } = useAuth()
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleClickAway = () => {
    setOpen(false)
  }

  const handleLogout = () => {
    setOpen(false)
    logoutUser()
    logout()
  }

  const DrawerList = (
    <List sx={{ height: '100%' }}>
      {routes.map((route, index) => {
        if (route.isNav) {
          if (route != LogoutRoute) {
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
              <ListItem
                key={index}
                className="app-menu-item"
                sx={{ position: 'absolute', bottom: '1em' }}
                disablePadding
              >
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
    <ClickAwayListener onClickAway={handleClickAway}>
      <Drawer className="drawer" variant="permanent" open={open}>
        <DrawerHeader className="drawer-header" disablePadding>
          <ListItem className="app-menu-item" disablePadding>
            {button}
          </ListItem>
        </DrawerHeader>
        <Divider />
        {DrawerList}
      </Drawer>
    </ClickAwayListener>
  )
}
