import { useState } from 'react'
import { matchPath, NavLink, useLocation } from 'react-router'
import { useLingui } from '@lingui/react/macro'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import {
  ClickAwayListener,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import { Stack } from '@mui/system'
import { useAuth } from '@src/auth'
import useRoutes from '@src/routes'
import './NavigationDrawer.scss'

const drawerWidth = 320

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
  width: '57px',
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
  const navRoutes = routes.filter(r => r.isNav)
  const topRoutes = navRoutes.filter(r => r != LogoutRoute && !r.bottom)
  const bottomRoutes = navRoutes.filter(r => r != LogoutRoute && r.bottom)
  const logoutRoutes = navRoutes.filter(r => r == LogoutRoute)
  const { logout } = useAuth()
  const { t } = useLingui()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }
  const handleLogout = () => {
    setOpen(false)
    logout()
  }

  const DrawerListItem = ({ route }) => {
    const isLogoutRoute = route == LogoutRoute
    const isCurrentLocation = matchPath(route.path, location.pathname)
    const MyListItemButton = ({ children }) => isLogoutRoute ? (
      <ListItemButton onClick={handleLogout}>
        { children }
      </ListItemButton>
    ) : (
      <ListItemButton
        component={NavLink}
        to={route.path}
        state={route.state}
        onClick={handleDrawerClose}
        className={`button ${isCurrentLocation ? 'selected' : ''}`}
      >
        { children }
      </ListItemButton>
    )
    return (
      <ListItem
        className="app-menu-item"
        disablePadding
      >
        <Tooltip title={t(route.title)} enterDelay={500} leaveDelay={0}>
          <MyListItemButton>
            <ListItemIcon
              className={`app-menu-item-icon ${isCurrentLocation ? 'selected' : ''}`}
              color="secondary"
            >
              { route.icon }
            </ListItemIcon>
            <ListItemText
              className={`app-menu-item-title ${isCurrentLocation ? 'selected' : ''}`}
              primary={t(route.title)}
              sx={{ marginLeft: 1 }}
            />
          </MyListItemButton>
        </Tooltip>
      </ListItem>
    )
  }

  const DrawerList = (
    <Stack
      sx={{ height: '100%', bgcolor: 'secondary.main', placeContent: 'space-between' }}
    >
      <List>
        {topRoutes.map((route, index) => (
          <DrawerListItem
            key={index}
            route={route}
          />
        ))}
      </List>
      <List
        disablePadding
        sx={{ marginBottom: '20px' }}
      >
        <Divider
          color="white"
          variant="middle"
          sx={{ marginBottom: '10px' }}
        />
        {bottomRoutes.map((route, index) => (
          <DrawerListItem
            key={index}
            route={route}
          />
        ))}
        {logoutRoutes.map((route, index) => (
          <DrawerListItem
            key={index}
            route={route}
          />
        ))}
      </List>
    </Stack>
  )

  const button = open ? (
    <ListItemButton onClick={handleDrawerClose}>
      <ListItemIcon className="app-menu-item-icon">
        <ChevronLeftIcon />
      </ListItemIcon>
      <ListItemText primary={t`Fold down pane`} />
    </ListItemButton>
  ) : (
    <ListItemButton onClick={handleDrawerOpen}>
      <MenuIcon />
    </ListItemButton>
  )

  return (
    <ClickAwayListener onClickAway={handleDrawerClose}>
      <Drawer
        variant="permanent"
        open={open}
      >
        <DrawerHeader
          className="drawer-header"
          sx={{ bgcolor: 'secondary.main' }}
        >
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
