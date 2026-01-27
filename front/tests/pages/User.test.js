import { setupCommonTest, createTestComponent, clone } from '@test/common'
import User from '@page/User.vue'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

describe('User', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp
  let comp
  let store
  beforeEach(() => {
    Comp = clone(User)
    store = useIndexStore()
  })
  describe('Mounted', () => {
    test('should have been mounted', async () => {
      store.user = {
        fullName: 'Mufasa',
      }
      comp = await createTestComponent(Comp, options)
      expect(comp.vm.store).toEqual(store)
      expect(store.changeRoute).toHaveBeenCalledWith('User')
    })
  })
})
