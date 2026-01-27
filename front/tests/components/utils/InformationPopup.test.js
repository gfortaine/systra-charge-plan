import { setupCommonTest, createTestComponent, clone } from '@test/common'
import InformationPopup from '@comp/utils/InformationPopup.vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

describe('InformationPopup', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp

  beforeEach(() => {
    Comp = clone(InformationPopup)
    expect(Comp).toBeDefined()
  })

  describe('Defintion', () => {
    test('should have been initialized', async () => {
      options.global.mocks.$gettext = vi.fn(s => s.toUpperCase())
      const wrapper = await createTestComponent(
        Comp,
        options, {
          props: {
            title: 'My Popup',
            buttons: [],
          },
        },
      )
      expect(wrapper.vm.valid).toBe(true)
      expect(wrapper.vm.translatedTitle).toEqual('MY POPUP')
      expect(wrapper.vm.$gettext).toHaveBeenCalledWith('My Popup')
    })
  })

  describe('Methods', () => {
    test('isButtonDisabled', async () => {
      const vm = {
        valid: false,
      }
      const button1 = { type: 'submit' }
      expect(Comp.methods.isButtonDisabled.bind(vm)(button1)).toEqual(true)
      vm.valid = true
      expect(Comp.methods.isButtonDisabled.bind(vm)(button1)).toEqual(false)
      const button2 = { type: 'emit' }
      expect(Comp.methods.isButtonDisabled.bind(vm)(button2)).toEqual(false)
      vm.valid = false
      expect(Comp.methods.isButtonDisabled.bind(vm)(button2)).toEqual(false)
    })
    test('handleButtonClick', () => {
      const vm = {
        ...options.global.mocks,
        $emit: vi.fn(),
      }
      const button1 = {
        label: 'Annuler',
        icon: 'fas fa-times',
        color: 'lightgrey',
        event: 'toggleAddProjectDialog',
        params: [],
      }
      Comp.methods.handleButtonClick.bind(vm)(button1)
      expect(vm.$emit).toHaveBeenCalledWith('toggleAddProjectDialog')
      const button2 = {
        label: 'Détruire',
        icon: 'fas fa-trash',
        color: 'lightgrey',
        event: 'destroy',
        params: ['p1', 'p2'],
      }
      Comp.methods.handleButtonClick.bind(vm)(button2)
      expect(vm.$emit).toHaveBeenCalledWith('destroy', 'p1', 'p2')
    })
    test('submitForm', () => {
      const vm = {
        buttons: [
          { type: 'emit' },
          { type: 'submit', params: ['param1', 'param2'] },
          { type: 'emit' },
        ],
        $emit: vi.fn(),
        valid: false,
      }
      Comp.methods.submitForm.bind(vm)()
      expect(vm.$emit).toHaveBeenCalledWith('submitForm', false, 'param1', 'param2')
    })
  })
})
