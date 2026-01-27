import { setupCommonTest, createTestComponent, clone } from '@test/common'
import Stepper from '@comp/stepper/Stepper.vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

describe('Stepper', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp
  let props
  beforeEach(() => {
    Comp = clone(Stepper)
    props = {
      currentStep: 3,
      maxSteps: 6,
      clickableSteps: false,
    }
  })
  describe('Definition', () => {
    test('should have been initialized', async () => {
      const comp = await createTestComponent(Comp, options, { props })
      expect(comp.vm.steps).toEqual([1, 2, 3, 4, 5, 6])
    })
  })
  describe('Methods', () => {
    test('goToStep', () => {
      const vm = { $emit: vi.fn() }
      Comp.methods.goToStep.bind(vm)(2)
      expect(vm.$emit).toHaveBeenCalledWith('update:currentStep', 2)
    })
    test('getStepHeaderName', () => {
      const vm = {}
      expect(Comp.methods.getStepHeaderName.bind(vm)(5)).toEqual('header-5')
    })
    test('getStepContentName', () => {
      const vm = {}
      expect(Comp.methods.getStepContentName.bind(vm)(4)).toEqual('content-4')
    })
    test('getStepFooterName', () => {
      const vm = {}
      expect(Comp.methods.getStepFooterName.bind(vm)(1)).toEqual('footer-1')
    })
  })
})
