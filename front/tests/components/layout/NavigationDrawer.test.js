import { setupCommonTest, createTestComponent, clone } from '@test/common'
import NavigationDrawer from '@comp/layout/NavigationDrawer.vue'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { logout } from '@src/utils/auth'

vi.mock('@src/router', () => {
  return {
    navigationRoutes: [
      {
        name: 'toto',
        icon: 'toto icon',
        title: 'toto title',
      },
      {
        name: 'titi',
        title: 'titi title',
      },
      {
        name: 'tata',
        icon: 'tata icon',
      },
    ],
    disconnectRoute: {
      name: 'Disconnect',
    },
  }
})
vi.mock('@src/utils/auth', () => ({
  logout: vi.fn(),
}))

describe('NavigationDrawer', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp
  let comp
  let store

  beforeEach(() => {
    Comp = clone(NavigationDrawer)
    expect(Comp).toBeDefined()
    store = useIndexStore()
    options.global.mocks.$gettext = vi.fn(s => s.toUpperCase())
    options.global.mocks.$router.go = vi.fn()
    options.global.mocks.$router.currentRoute = { path: '' }
  })

  describe('Definition', () => {
    test('has the correct initial data and computed props', async () => {
      store.route = 'plop'
      comp = await createTestComponent(Comp, options, { props: { overlay: false } })
      expect(comp.vm.drawer).toBe(true)
      expect(comp.vm.closed).toBe(true)
      expect(comp.vm.overlay).toBe(false)
      expect(comp.vm.menuItems).toEqual([
        {
          name: 'toto',
          icon: 'toto icon',
          title: 'toto title',
        },
        {
          name: 'titi',
          title: 'titi title',
        },
        {
          name: 'tata',
          icon: 'tata icon',
        },
      ])
    })
  })
  describe('methods', () => {
    test('method getDisplayedRoutes', async () => {
      comp = await createTestComponent(Comp, options)
      expect(comp.vm.getDisplayedRoutes()).toEqual([
        {
          name: 'toto',
          icon: 'toto icon',
          title: 'toto title',
        },
      ])
    })
    test('method getRouteTitle', async () => {
      comp = await createTestComponent(Comp, options)
      const searchRoute = {
        name: 'search',
        icon: 'search icon',
        title: 'search title',
      }
      expect(comp.vm.getRouteTitle(searchRoute)).toEqual('SEARCH TITLE')
      expect(comp.vm.$gettext).toHaveBeenCalledWith('search title')
    })
    test('method isCurrentRoute', async () => {
      comp = await createTestComponent(Comp, options)
      const searchRoute = {
        name: 'search',
        icon: 'search icon',
        title: 'search title',
        path: 'search path',
      }
      store.route = 'plop'
      await comp.vm.$nextTick()
      expect(comp.vm.isCurrentRoute(searchRoute)).toBe(false)
      store.route = 'search'
      await comp.vm.$nextTick()
      expect(comp.vm.isCurrentRoute(searchRoute)).toBe(true)
    })
    test('method handleClickMenuItem', async () => {
      comp = await createTestComponent(Comp, options)
      const searchRoute = {
        name: 'search',
        icon: 'search icon',
        title: 'search title',
        path: 'search path',
      }
      const searchRoute2 = {
        name: 'search2',
        icon: 'search2 icon',
        title: 'search2 title',
        path: 'search2/path/:id',
        generatePushOptions: (_store, _$route) => {
          return {
            name: 'Search',
            params: { id: 'id1' },
          }
        },
      }
      const discRoute = {
        name: 'Disconnect',
        icon: 'disc icon',
        title: 'disc title',
      }
      comp.vm.handleClickMenuItem(searchRoute)
      expect(comp.vm.$router.push).toHaveBeenCalledWith(searchRoute.path)
      expect(comp.vm.$router.go).not.toHaveBeenCalled()
      expect(logout).not.toHaveBeenCalled()
      // same page
      comp.vm.$router.push.mockClear()
      comp.vm.$router.go.mockClear()
      comp.vm.$router.currentRoute = { ...searchRoute }
      logout.mockClear()
      comp.vm.handleClickMenuItem(searchRoute)
      expect(comp.vm.$router.push).not.toHaveBeenCalled()
      expect(comp.vm.$router.go).toHaveBeenCalled()
      expect(logout).not.toHaveBeenCalled()
      // page with params
      comp.vm.$router.push.mockClear()
      comp.vm.$router.go.mockClear()
      comp.vm.handleClickMenuItem(searchRoute2)
      logout.mockClear()
      expect(comp.vm.$router.push).toHaveBeenCalledWith({
        name: 'Search',
        params: { id: 'id1' },
      })
      expect(comp.vm.$router.go).not.toHaveBeenCalled()
      expect(logout).not.toHaveBeenCalled()
      // disconnect
      comp.vm.$router.push.mockClear()
      comp.vm.$router.go.mockClear()
      logout.mockClear()
      comp.vm.handleClickMenuItem(discRoute)
      expect(comp.vm.$router.push).not.toHaveBeenCalled()
      expect(comp.vm.$router.go).not.toHaveBeenCalled()
      expect(logout).toHaveBeenCalled()
    })
    test('method changeOverlay', async () => {
      comp = await createTestComponent(Comp, options)
      expect(comp.vm.overlay).toBe(false)
      expect(comp.vm.closed).toBe(true)
      comp.vm.changeOverlay()
      await comp.vm.$nextTick()
      expect(comp.vm.overlay).toBe(true)
      expect(comp.vm.closed).toBe(false)
    })
    test('method getListItemMarginTop', () => {
      const item = {
        name: 'plop',
      }
      expect(Comp.methods.getListItemMarginTop(item)).toEqual('0')
      item.name = 'Disconnect'
      expect(Comp.methods.getListItemMarginTop(item)).toEqual('auto')
    })
  })
})
