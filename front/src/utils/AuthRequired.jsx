import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from './auth'
import useRoutes from '@src/routes'

export const AuthRequired = ({ children }) => {
  const authContext = useAuthContext()
  const { user, login } = authContext || { user: {}, login: () => ({}) }
  const [authOk, setAuthOk] = useState(null)
  const location = useLocation()
  const { LoginRoute } = useRoutes()
  useEffect(() => {
    if (!user) {
      (async () => {
        const user = await login()
        setAuthOk(!!user)
      })()
    }
  }, [login, user])
  if (user || authOk) {
    return children // render the site
  } else if (authOk === false) { // redirect to login page
    return (<Navigate to={LoginRoute.path} state={{ from: location }} replace />)
  } else { // authOk is still null, wait for it
    return null
  }
}
