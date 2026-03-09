import { Routes, Route } from 'react-router-dom'
import useRoutes from './'

export default function AllRoutes() {
  const { routes } = useRoutes()
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}
