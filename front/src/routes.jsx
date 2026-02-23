import Home from '@page/Home'
import Fail from '@page/Fail'
import AddPost from '@page/AddPost'
import MapPage from '@page/MapPage'
import Pickers from '@page/Pickers'
import User from '@page/User'
import HomeIcon from '@mui/icons-material/Home'
import PostAddIcon from '@mui/icons-material/PostAdd'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MapIcon from '@mui/icons-material/Map'

const routes = [
  {
    title: 'Home',
    path: '/',
    element: <Home />,
    icon: <HomeIcon />,
    isNav: true,
  },
  {
    title: 'Add Post',
    path: '/add-post',
    element: <AddPost />,
    icon: <PostAddIcon />,
    isNav: true,
  },
  {
    title: 'Map',
    path: '/map',
    element: <MapPage />,
    icon: <MapIcon />,
    isNav: true,
  },
  {
    title: 'Pickers',
    path: '/pickers',
    element: <Pickers />,
    icon: <CalendarMonthIcon />,
    isNav: true,
  },
  {
    title: 'User',
    path: '/user',
    element: <User />,
    icon: <HomeIcon />,
    isNav: false,
  },
  {
    title: 'Fail',
    path: '/fail',
    element: <Fail />,
    icon: <HomeIcon />,
    isNav: false,
  },
]

export default routes
