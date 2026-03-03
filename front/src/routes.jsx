import Home from '@page/Home'
import AddPost from '@page/AddPost'
import MapPage from '@page/MapPage'
import Pickers from '@page/Pickers'
import HomeIcon from '@mui/icons-material/Home'
import PostAddIcon from '@mui/icons-material/PostAdd'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MapIcon from '@mui/icons-material/Map'

export default function useRoutes() {
  const routes = {
    HomeRoute: {
      title: t => t('Home'),
      path: '/',
      element: <Home />,
      icon: <HomeIcon />,
      isNav: true,
    },
    AddPostRoute: {
      title: t => t('Add Post'),
      path: '/add-post',
      element: <AddPost />,
      icon: <PostAddIcon />,
      isNav: true,
    },
    PostRoute: {
      title: t => t('Post'),
      path: '/post/:id',
      isNav: false,
    },
    MapRoute: {
      title: t => t('Map'),
      path: '/map',
      element: <MapPage />,
      icon: <MapIcon />,
      isNav: true,
    },
    PickersRoute: {
      title: t => t('Pickers'),
      path: '/pickers',
      element: <Pickers />,
      icon: <CalendarMonthIcon />,
      isNav: true,
    },
    UserRoute: {
      title: t => t('User'),
      path: '/user',
      isNav: false,
    },
    FailRoute: {
      title: t => t('Fail'),
      path: '/fail',
      isNav: false,
    },
  }
  function replacePathParams(path, params) {
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
  Object.values(routes).forEach(route => {
    route.replaceParams = function(params) {
      return replacePathParams(this.path, params)
    }.bind(route)
  })
  return {
    replacePathParams,
    ...routes,
    routes: Object.values(routes),
  }
}
