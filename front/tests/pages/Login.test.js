import { setupCommonTest, createTestComponent, clone } from '@test/common'
import Login from '@page/Login.vue'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { login } from '@src/utils/auth'

vi.mock('@src/utils/auth', () => ({
  login: vi.fn(),
}))

describe('Login', () => {
  const options = setupCommonTest(beforeEach, afterEach)
  let Comp
  let store
  beforeEach(() => {
    Comp = clone(Login)
    store = useIndexStore()
  })
  describe('Mounted', () => {
    test('should have been mounted', async () => {
      await createTestComponent(Comp, options)
      expect(store.changeRoute).toHaveBeenCalledWith('Login')
      expect(store.changeUser).toHaveBeenCalledWith(null)
    })
  })
  describe('Methods', () => {
    test('login', () => {
      Comp.methods.login.bind()()
      expect(login).toHaveBeenCalled()
    })
  })
})
