import { setupCommonTest, createTestComponent, clone } from '@test/common'
import Step from '@comp/stepper/Step.vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

describe('Step', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp
  let props
  beforeEach(() => {
    Comp = clone(Step)
    props = {
      clickableSteps: false,
      step: 1,
      currentStep: 2,
    }
  })
  describe('Definition', () => {
    test('should have been initialized', async () => {
      const comp = await createTestComponent(Comp, options, { props })
      expect(comp.vm.headerClass).toEqual('')
      comp.setProps({ clickableSteps: true })
      await comp.vm.$nextTick()
      expect(comp.vm.headerClass).toEqual('clickable')
    })
  })
  describe('Methods', () => {
    test('isActive', () => {
      const vm1 = { currentStep: 3 }
      expect(Comp.methods.isActive.bind(vm1)(3)).toBe(true)
      const vm2 = { currentStep: 3 }
      expect(Comp.methods.isActive.bind(vm2)(1)).toBe(false)
    })
    test('isCompleted', () => {
      const vm1 = { currentStep: 3 }
      expect(Comp.methods.isCompleted.bind(vm1)(2)).toBe(true)
      const vm2 = { currentStep: 2 }
      expect(Comp.methods.isCompleted.bind(vm2)(4)).toBe(false)
    })
    test('getStepClass', () => {
      const vm = {
        isCompleted: vi.fn().mockReturnValue(true),
        isActive: vi.fn().mockReturnValue(false),
      }
      expect(Comp.methods.getStepClass.bind(vm)(2)).toEqual('completed')
      vm.isCompleted.mockReturnValue(false)
      vm.isActive.mockReturnValue(true)
      expect(Comp.methods.getStepClass.bind(vm)()).toEqual('active')
      vm.isActive.mockReturnValue(false)
      expect(Comp.methods.getStepClass.bind(vm)()).toEqual('inactive')
    })
    test('goToStep', () => {
      const vm = { $emit: vi.fn() }
      Comp.methods.goToStep.bind(vm)(2)
      expect(vm.$emit).toHaveBeenCalledWith('goToStep', 2)
    })
    test('headerClicked', () => {
      const vm = {
        clickableSteps: true,
        goToStep: vi.fn(),
      }
      Comp.methods.headerClicked.bind(vm)(2)
      expect(vm.goToStep).toHaveBeenCalledWith(2)
    })
  })
})
