import { setupCommonTest, createTestComponent, clone } from '@test/common'
import Fail from '@page/Fail.vue'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

describe('Fail', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp
  let store
  beforeEach(() => {
    Comp = clone(Fail)
    store = useIndexStore()
  })
  describe('Mounted', () => {
    test('should have been mounted', async () => {
      const comp = await createTestComponent(Comp, options)
      expect(comp).toBeDefined()
      expect(store.changeRoute).toHaveBeenCalledWith('Fail')
    })
  })
  describe('Methods', () => {
    test('getURLParams', () => {
      const window = {
        location: {
          href: 'https://plop',
        },
      }
      expect(Comp.methods.getURLParams.bind()(1, window)).toEqual(
        new URL(window.location.href).searchParams.get(1),
      )
    })
  })
})
