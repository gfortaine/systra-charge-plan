import { setupCommonTest, createTestComponent, clone } from '@test/common'
import Notification from '@comp/layout/Notification.vue'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

describe('Notification', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp
  let comp
  let store

  beforeEach(() => {
    Comp = clone(Notification)
    expect(Comp).toBeDefined()
    store = useIndexStore()
  })

  describe('Definition', () => {
    test('has the correct initial data and computed props', async () => {
      store.notification = {}
      comp = await createTestComponent(Comp, options)
      expect(comp.vm.snackbar).toBe(false)
      expect(comp.vm.notification).toEqual({})
      const oneNotif = {
        autoClose: true,
        message: 'test notif',
      }
      store.notification = oneNotif
      await comp.vm.$nextTick()
      expect(comp.vm.snackbar).toBe(true)
      expect(comp.vm.notification).toEqual(oneNotif)
    })
  })
  describe('methods', () => {
    test('method closeSnackbar', async () => {
      comp = await createTestComponent(Comp, options)
      store.notification = {
        autoClose: false,
        message: 'other notif',
      }
      await comp.vm.$nextTick()
      expect(comp.vm.snackbar).toBe(true)
      comp.vm.closeSnackbar()
      await comp.vm.$nextTick()
      expect(comp.vm.snackbar).toBe(false)
    })
  })
})
