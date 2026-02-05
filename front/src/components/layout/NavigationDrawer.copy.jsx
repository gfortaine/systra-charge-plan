import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import HomeIcon from '@mui/icons-material/Home'
import PostAddIcon from '@mui/icons-material/PostAdd'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MapIcon from '@mui/icons-material/Map'

const DrawerHeader = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}))

export default function NavigationDrawer({ open, toggleDrawer }) {
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
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
    </Box>
  )

  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <DrawerHeader>
        <Button onClick={toggleDrawer(false)}>
          <ChevronLeftIcon />
          Fold down pane
        </Button>
      </DrawerHeader>
      <Divider />
      {DrawerList}
    </Drawer>
  )
}
