import LoginPage from '@page/Login'
import HomePage from '@page/Home'
import AddPostPage from '@page/AddPost'
import CategoryPage from '@page/Category'
import DataGridDemo from '@page/DataGridDemo'
import MapPage from '@page/MapPage'
import PickersPage from '@page/Pickers'
import UserPage from '@page/User'
import { AuthRequired } from '@src/utils/AuthRequired'
import {
  CalendarMonth,
  Home,
  Login,
  Logout,
  Map,
  PostAdd,
  TableView,
} from '@mui/icons-material'

export default function useRoutes() {
  const routes = {
    LoginRoute: {
      title: t => t('Login'),
      path: '/login',
      element: <LoginPage />,
      icon: <Login />,
      isNav: false,
    },
    FailRoute: {
      title: t => t('Fail'),
      path: '/fail',
      isNav: false,
    },
    UserRoute: {
      title: t => t('User'),
      path: '/user',
      element: (
        <AuthRequired>
          <UserPage />
        </AuthRequired>
      ),
      isNav: false,
    },
    HomeRoute: {
      title: t => t('Home'),
      path: '/',
      element: (
        <AuthRequired>
          <HomePage />
        </AuthRequired>
      ),
      icon: <Home />,
      isNav: true,
    },
    AddPostRoute: {
      title: t => t('Add Post'),
      path: '/add-post',
      element: (
        <AuthRequired>
          <AddPostPage />
        </AuthRequired>
      ),
      icon: <PostAdd />,
      isNav: true,
    },
    PostRoute: {
      title: t => t('Post'),
      path: '/post/:id',
      isNav: false,
    },
    CategoryRoute: {
      title: t => t('Category'),
      path: '/category/:id',
      element: (
        <AuthRequired>
          <CategoryPage />
        </AuthRequired>
      ),
      isNav: false,
    },
    DatagridRoute: {
      title: t => t('Data grid and charts'),
      path: '/data',
      element: (
        <AuthRequired>
          <DataGridDemo />
        </AuthRequired>
      ),
      icon: <TableView />,
      isNav: true,
    },
    MapRoute: {
      title: t => t('Map'),
      path: '/map',
      element: (
        <AuthRequired>
          <MapPage />
        </AuthRequired>
      ),
      icon: <Map />,
      isNav: true,
    },
    PickersRoute: {
      title: t => t('Pickers'),
      path: '/pickers',
      element: (
        <AuthRequired>
          <PickersPage />
        </AuthRequired>
      ),
      icon: <CalendarMonth />,
      isNav: true,
    },
    LogoutRoute: {
      title: t => t('Logout'),
      path: '/logout', // not used
      icon: <Logout />,
      isNav: true,
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
    route.pathParams = function(params) {
      return replacePathParams(this.path, params)
    }.bind(route)
  })
  return {
    replacePathParams,
    ...routes,
    routes: Object.values(routes),
  }
}
