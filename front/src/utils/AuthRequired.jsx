import { Navigate, useLocation } from 'react-router-dom'
import useRoutes from '@src/routes'
import { useAuth } from './auth'

export const AuthRequired = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()
  const { LoginRoute } = useRoutes()
  if (user) {
    return children // render the site
  } else { // redirect to login page
    return (<Navigate to={LoginRoute.path} state={{ from: location }} replace />)
  }
}
