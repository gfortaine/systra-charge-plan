import {
  CalendarMonth,
  Home,
  LocalPostOffice,
  Login,
  Logout,
  Map,
  PostAdd,
  TableView,
} from '@mui/icons-material'
import AddPostPage from '@page/AddPost'
import CategoryPage from '@page/Category'
import XDataGridDemo from '@page/DataGridDemo'
import HomePage from '@page/Home'
import LoginPage from '@page/Login'
import MapPage from '@page/MapPage'
import PickersPage from '@page/Pickers'
import PostPage from '@page/Post'
import UserPage from '@page/User'
import AuthRequired from '@src/auth/AuthRequired'

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
    PostRoute: {
      title: t => t('Post'),
      path: '/post/:id',
      element: (
        <AuthRequired>
          <PostPage />
        </AuthRequired>
      ),
      icon: <LocalPostOffice />,
      isNav: false,
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
          <XDataGridDemo />
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
        path2 = path2.replace(m[0], String(params[m[1]]))
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
