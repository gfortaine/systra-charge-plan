import Home from '@page/Home'
import Fail from '@page/Fail'
import AddPost from '@page/AddPost'
import MapPage from '@page/MapPage'
import Pickers from '@page/Pickers'
import User from '@page/User'

const routes = [
  { path: '/', element: <Home /> },
  { path: '/fail', element: <Fail /> },
  { path: '/add-post', element: <AddPost /> },
  { path: '/map', element: <MapPage /> },
  { path: '/pickers', element: <Pickers /> },
  { path: '/user', element: <User /> },
]

export default routes
