import { setupCommonTest, createTestComponent, clone } from '@test/common'
import Wizard from '@page/Wizard.vue'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

describe('Wizard', () => {
  const options = setupCommonTest(beforeEach, afterEach, false)
  let Comp
  let wrapper
  let store

  beforeEach(async () => {
    store = useIndexStore()
    Comp = clone(Wizard)
    expect(Comp).toBeDefined()
    wrapper = await createTestComponent(Comp, options)
    expect(wrapper).toBeDefined()
  })

  describe('Definition', async () => {
    test('should have been initialized', async () => {
      expect(wrapper.vm.currentStep).toEqual(1)
      expect(store.route).toEqual('Wizard')
    })
  })

  describe('Methods', () => {
    test('goToStep', async () => {
      expect(wrapper.vm.currentStep).toEqual(1)
      wrapper.vm.goToStep(5)
      expect(wrapper.vm.currentStep).toEqual(5)
    })
  })
})
