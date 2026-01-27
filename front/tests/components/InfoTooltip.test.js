import { setupCommonTest, createTestComponent, clone } from '@test/common'
import InfoTooltip from '@comp/InfoTooltip.vue'
import { afterEach, beforeEach, describe, test, expect } from 'vitest'

describe('InfoTooltip', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp
  let comp
  beforeEach(() => {
    Comp = clone(InfoTooltip)
  })
  describe('Mounted', () => {
    test('should have been mounted', async () => {
      comp = await createTestComponent(Comp, options)
      expect(comp).toBeDefined()
    })
  })
})
