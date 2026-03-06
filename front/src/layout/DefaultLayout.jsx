import { Routes, Route } from 'react-router-dom'
import useRoutes from '@src/routes'
import FullLayout from './FullLayout'

export default function DefaultLayout() {
  const { routes } = useRoutes()
  return (
    <FullLayout>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </FullLayout>
  )
}
