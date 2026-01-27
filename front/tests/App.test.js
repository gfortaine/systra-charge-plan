import { setupCommonTest, createTestComponent, clone } from '@test/common'
import App from '@src/App.vue'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('@src/router', () => {
  return {
    fullscreenRoutes: [
      { name: 'toto' },
      { name: 'tata' },
    ],
  }
})

describe('App', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp
  let store

  beforeEach(() => {
    Comp = clone(App)
    store = useIndexStore()
  })

  describe('Definition', () => {
    test('has the correct initial data and computed props', async () => {
      store.route = 'toto'
      let comp = await createTestComponent(Comp, options)
      expect(comp.vm.pageWithNavigation).toBe(false)
      expect(comp.vm.containerClass).toEqual('without-navigation')
      store.route = 'titi'
      comp = await createTestComponent(Comp, options)
      expect(comp.vm.pageWithNavigation).toBe(true)
      expect(comp.vm.containerClass).toEqual('with-navigation')
    })
  })
})
