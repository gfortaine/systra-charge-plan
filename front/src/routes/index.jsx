import { msg } from '@lingui/core/macro'
import {
  TableView,
} from '@mui/icons-material'
import ChargePlanPage from '@page/ChargePlan'

export default function useRoutes() {
  const baseRoutes = {
    ChargePlanRoute: {
      title: msg`Plan de charge`,
      path: '/',
      element: <ChargePlanPage />,
      isNav: true,
      icon: <TableView />,
    },
  }
  function replacePathParams(path, params) {
    let path2 = path
    if (!params) {
      params = {}
    }
    for (const m of path.matchAll(new RegExp(':([^/]+)', 'g'))) {
      if (params[m[1]] !== undefined) {
        path2 = path2.replace(m[0], String(params[m[1]]))
      }
    }
    return path2
  }
  const routeList = Object.values(baseRoutes).map(baseRoute => {
    const route = baseRoute
    route.pathParams = params => replacePathParams(route.path, params)
    return route
  })
  const routes = baseRoutes
  return Object.assign({}, {
    routes: routeList,
    HomeRoute: baseRoutes.ChargePlanRoute,
    UserRoute: baseRoutes.ChargePlanRoute,
    LogoutRoute: null,
  }, routes)
}
