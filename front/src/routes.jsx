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
    title: 'Post',
    path: '/post/:id',
    element: <AddPost />,
    icon: <PostAddIcon />,
    isNav: false,
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

routes.replacePathParams = function(path, params) {
  let path2 = path
  if (!params) {
    params = {}
  }
  path.matchAll(new RegExp(':([^/]+)', 'g')).forEach(m => {
    if (params[m[1]] !== undefined) {
      path2.replace(m[0], String(params[m[1]]))
    }
  })
  return path2
}
routes.byTitle = function(title) {
  return this.find(route => route.title == title)
}.bind(routes)

export default routes
