import { createContext, useContext, useCallback } from 'react'
import useGraphql from '@src/utils/graphql'
import useRoutes from '@src/routes'
import { backUrl, fakeUser } from '@src/config'
import gql from 'graphql-tag'

export const AuthContext = createContext()
export const useAuthContext = () => useContext(AuthContext)

export function useAuth() {
  const authUserQuery = gql`
    query {
      me {
        id
        firstName
        lastName
        fullName
        email
      }
    }
  `
  const loginUri = 'oidc/authenticate?next=%nextURI%&fail=%failURI%'
  const logoutUri = 'oidc/logout?next=%nextURI%&fail=%failURI%'
  const { graphqlQuery } = useGraphql()
  const { LoginRoute, FailRoute, HomeRoute } = useRoutes()

  const checkAuth = useCallback(async () => {
    if (fakeUser) {
      return Promise.resolve({ fullName: 'Mock user' })
    } else {
      try {
        const { me } = await graphqlQuery(authUserQuery)
        return me
      } catch(error) {
        console.debug(error)
        return null
      }
    }
  }, [graphqlQuery, authUserQuery])

  const login = useCallback((Window) => {
    Window = Window || window
    const nextURI = `${Window.location.protocol}//${Window.location.host}${HomeRoute.path}`
    const failURI = `${Window.location.protocol}//${Window.location.host}${FailRoute.path}`
    if (fakeUser) {
      Window.location.replace(nextURI)
    } else {
      Window.location.replace(
        backUrl + loginUri.replace(
          '%nextURI%', encodeURIComponent(nextURI),
        ).replace(
          '%failURI%', encodeURIComponent(failURI),
        ),
      )
    }
  }, [HomeRoute, FailRoute])
  const logout = useCallback((Window) => {
    Window = Window || window
    const nextURI = `${Window.location.protocol}//${Window.location.host}${LoginRoute.path}`
    const failURI = `${Window.location.protocol}//${Window.location.host}${FailRoute.path}`
    if (fakeUser) {
      Window.location.replace(nextURI)
    } else {
      Window.location.replace(
        backUrl + logoutUri.replace(
          '%nextURI%', encodeURIComponent(nextURI),
        ).replace(
          '%failURI%', encodeURIComponent(failURI),
        ),
      )
    }
  }, [LoginRoute, FailRoute])
  return {
    checkAuth,
    loginUri,
    logoutUri,
    login,
    logout,
  }
}
