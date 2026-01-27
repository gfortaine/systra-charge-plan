import { createRouter, createWebHistory } from 'vue-router'
import { checkAuth } from '@src/utils/auth'
import { useIndexStore } from '@src/store'

// Pages
import Home from '@page/Home.vue'
import Login from '@page/Login.vue'
import Fail from '@page/Fail.vue'
import User from '@page/User.vue'
import MapPage from '@page/MapPage.vue'
import PostAdd from '@page/PostAdd.vue'
import NewComp from '@page/NewComp.vue'
import Pickers from '@page/Pickers.vue'
import Post from '@page/Post.vue'
import Category from '@page/Category.vue'
import Wizard from '@page/Wizard.vue'

// only used to force to see translation to vue-gettext
const $gettext = s => s

// Auth pages start
const loginPath = '/login'
export const ifAuthenticated = async (_to, _from, next) => {
  const user = await checkAuth()
  if (user) {
    useIndexStore().changeUser(user)
    next()
  } else {
    next(loginPath)
  }
}
export const loginRoute = {
  path: loginPath,
  name: 'Login',
  component: Login,
}
export const failRoute = {
  path: '/fail',
  name: 'Fail',
  component: Fail,
}
export const userRoute = {
  path: '/user',
  name: 'User',
  component: User,
  beforeEnter: ifAuthenticated,
}
export const disconnectRoute = { /* no path, no component, just a link in the menu */
  name: 'Disconnect',
  icon: 'fas fa-sign-out-alt',
  title: $gettext('Logout'),
}
// Auth pages end
export const homeRoute = {
  path: '/',
  name: 'Home',
  component: Home,
  icon: 'fas fa-house',
  title: $gettext('Home'),
  beforeEnter: ifAuthenticated,
}

export const mapRoute = {
  path: '/map',
  name: 'MapPage',
  component: MapPage,
  icon: 'fas fa-location-dot',
  title: $gettext('Map'),
  beforeEnter: ifAuthenticated,
}
export const addPostRoute = {
  path: '/add-post',
  name: 'PostAdd',
  component: PostAdd,
  icon: 'fas fa-plus',
  title: $gettext('Add a blog post'),
}
export const postRoute = {
  path: '/post/:id',
  name: 'Post',
  component: Post,
  beforeEnter: ifAuthenticated,
  generatePushOptions: (store, $route) => {
    return {
      name: 'Post',
      params: { id: $route.params.id },
    }
  },
}
export const categoryRoute = {
  path: '/category/:id',
  name: 'Category',
  component: Category,
  beforeEnter: ifAuthenticated,
  generatePushOptions: (store, $route) => {
    return {
      name: 'Category',
      params: { id: $route.params.id },
    }
  },
}
export const newCompRoute = {
  path: '/test',
  name: 'NewComp',
  component: NewComp,
  icon: 'fas fa-gear',
  title: $gettext('Component testing'),
}
export const pickersRoute = {
  path: '/pickers',
  name: 'Pickers',
  component: Pickers,
  icon: 'fas fa-calendar-days',
  title: $gettext('Date and time'),
}
export const wizardRoute = {
  path: '/wizard',
  name: 'Wizard',
  component: Wizard,
  icon: 'fas fa-shoe-prints',
  title: $gettext('Steps'),
}

export const routes = [
  homeRoute,
  loginRoute,
  failRoute,
  userRoute,
  mapRoute,
  addPostRoute,
  postRoute,
  categoryRoute,
  newCompRoute,
  pickersRoute,
  wizardRoute,
]
export const fullscreenRoutes = [
  loginRoute,
  failRoute,
]
export const navigationRoutes = [
  homeRoute,
  mapRoute,
  addPostRoute,
  newCompRoute,
  pickersRoute,
  wizardRoute,
  disconnectRoute,
]
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
