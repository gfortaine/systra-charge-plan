import { setupCommonTest, createTestComponent, clone } from '@test/common'
import WelcomePanel from '@comp/home/WelcomePanel.vue'
import { addPostRoute } from '@src/router'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

describe('WelcomePanel', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp

  beforeEach(() => {
    Comp = clone(WelcomePanel)
    expect(Comp).toBeDefined()
  })

  describe('Definition', () => {
    test('should have been initialized', async () => {
      expect(await createTestComponent(Comp, options)).toBeDefined()
    })
  })

  describe('Methods', () => {
    test('onAddPost', () => {
      const vm = {
        $router: {
          push: vi.fn(),
        },
      }
      Comp.methods.onAddPost.bind(vm)()
      expect(vm.$router.push).toHaveBeenCalledWith({ name: addPostRoute.name })
    })
  })
})
