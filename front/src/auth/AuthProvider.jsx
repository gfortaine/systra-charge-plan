import { useCallback, useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { backUrl, fakeUser } from '@src/config'
import useGraphql from '@src/graphql'
import useRoutes from '@src/routes'
import { AuthContext } from './'

export const AuthProvider = ({ children }) => {
  const loginUri = 'oidc/authenticate?next=%nextURI%&fail=%failURI%'
  const logoutUri = 'oidc/logout?next=%nextURI%&fail=%failURI%'
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
  const { graphqlQuery } = useGraphql()
  const { LoginRoute, FailRoute, HomeRoute } = useRoutes()
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem('authUser')
    if (!userStr) {
      return null
    }
    try {
      return JSON.parse(userStr)
    } catch {
      localStorage.removeItem('authUser')
      return null
    }
  })

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

  const redirectTo = useCallback(({ uri, next, fail }) => {
    if (fakeUser) {
      window.location.replace(next)
    } else {
      window.location.replace(
        backUrl + uri.replace(
          '%nextURI%', encodeURIComponent(next),
        ).replace(
          '%failURI%', encodeURIComponent(fail),
        ),
      )
    }
  }, [])

  const redirectLogin = useCallback(() => {
    redirectTo({
      uri: loginUri,
      next: `${window.location.protocol}//${window.location.host}${HomeRoute.path}`,
      fail: `${window.location.protocol}//${window.location.host}${FailRoute.path}`,
    })
  }, [redirectTo, HomeRoute, FailRoute])

  const redirectLogout = useCallback(() => {
    redirectTo({
      uri: logoutUri,
      next: `${window.location.protocol}//${window.location.host}${LoginRoute.path}`,
      fail: `${window.location.protocol}//${window.location.host}${FailRoute.path}`,
    })
  }, [redirectTo, LoginRoute, FailRoute])

  const login = useCallback(() => {
    redirectLogin()
  }, [redirectLogin])

  const logout = useCallback(() => {
    localStorage.removeItem('authUser')
    setUser(null)
    redirectLogout()
  }, [redirectLogout])

  useEffect(() => {
    let isCancelled = false
    checkAuth().then(nextUser => {
      if (isCancelled) {
        return
      }
      if (nextUser) {
        localStorage.setItem('authUser', JSON.stringify(nextUser))
      } else {
        localStorage.removeItem('authUser')
      }
      setUser(nextUser)
    }).catch(error => {
      console.debug(error)
    })
    return () => {
      isCancelled = true
    }
  }, [checkAuth]) // once on mount

  const context = {
    user,
    setUser,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  )
}
