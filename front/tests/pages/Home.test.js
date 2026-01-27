import { setupCommonTest, createTestComponent, clone } from '@test/common'
import Home from '@page/Home.vue'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

describe('Home', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp
  let store

  beforeEach(() => {
    Comp = clone(Home)
    store = useIndexStore()
  })

  describe('Definition', () => {
    test('should have been initialized and mounted', async () => {
      const comp = await createTestComponent(Comp, options)
      expect(comp.find('.view').exists()).toBe(true)
      expect(store.changeRoute).toHaveBeenCalledWith('Home')
    })
  })
})
