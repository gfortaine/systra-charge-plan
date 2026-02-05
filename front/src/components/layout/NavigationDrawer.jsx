import * as React from 'react'
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
import app_logo from '@static/logo-v1-white.png'
import HomeIcon from '@mui/icons-material/Home'
import PostAddIcon from '@mui/icons-material/PostAdd'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MapIcon from '@mui/icons-material/Map'

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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
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
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const TopAppBar = (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
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
  )

  const DrawerList = (
    <List>
      <ListItem key="Home" disablePadding>
        <ListItemButton component="a" href="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </ListItem>
      <ListItem key="Add-post" disablePadding>
        <ListItemButton component="a" href="/add-post">
          <ListItemIcon>
            <PostAddIcon />
          </ListItemIcon>
          <ListItemText primary="Add a post" />
        </ListItemButton>
      </ListItem>
      <ListItem key="Map" disablePadding>
        <ListItemButton component="a" href="/map">
          <ListItemIcon>
            <MapIcon />
          </ListItemIcon>
          <ListItemText primary="Map" />
        </ListItemButton>
      </ListItem>
      <ListItem key="Pickers" disablePadding>
        <ListItemButton component="a" href="/pickers">
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText primary="Date and time pickers" />
        </ListItemButton>
      </ListItem>
    </List>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {TopAppBar}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <ListItem key="Home" disablePadding>
            <ListItemButton component="a" onClick={handleDrawerClose}>
              <ListItemIcon>
                <ChevronLeftIcon />
              </ListItemIcon>
              <ListItemText primary="Fold down pane" />
            </ListItemButton>
          </ListItem>
        </DrawerHeader>
        <Divider />
        {DrawerList}
      </Drawer>
    </Box>
  )
}
