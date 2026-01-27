import { setupCommonTest, createTestComponent, clone } from '@test/common'
import Toolbar from '@comp/layout/Toolbar.vue'
import { userRoute } from '@src/router'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

describe('Toolbar', () => {
  const options = setupCommonTest(beforeEach, afterEach, false)
  let Comp
  let comp
  let store
  beforeEach(() => {
    Comp = clone(Toolbar)
    store = useIndexStore()
  })
  describe('Definition', () => {
    test('has the correct initial data and computed props', async () => {
      comp = await createTestComponent(Comp, options)
      expect(comp.vm.userName).toEqual('/')
      const user = {
        fullName: 'Alice B',
      }
      store.user = user
      await comp.vm.$nextTick()
      expect(comp.vm.userName).toEqual('Alice B')
    })
  })
  describe('methods', () => {
    test('method handleChangeLanguage', async () => {
      comp = await createTestComponent(Comp, options)
      expect(comp.vm.$vuetify.lang.current).toEqual('en')
      expect(comp.vm.$language.current).toEqual('en')
      const lang = 'fr'
      comp.vm.handleChangeLanguage(lang)
      expect(comp.vm.$vuetify.locale.current).toEqual('fr')
      expect(comp.vm.$language.current).toEqual('fr')
    })
    test('method handleUserClick', async () => {
      comp = await createTestComponent(Comp, options)
      comp.vm.handleUserClick()
      expect(comp.vm.$router.push).toHaveBeenCalledWith({
        name: userRoute.name,
      })
    })
  })
})
