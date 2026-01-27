import { describe, test, expect, vi } from 'vitest'
import { ifAuthenticated } from '@src/router'
import { checkAuth } from '@src/utils/auth'

const mockStore = vi.hoisted(() => ({
  changeUser: vi.fn(),
}))
vi.mock('@src/store', () => ({
  useIndexStore: vi.fn(() => mockStore),
}))
vi.mock('@src/utils/auth', () => ({
  checkAuth: vi.fn(),
}))

describe('route', () => {
  test('ifAuthenticated', async () => {
    checkAuth.mockResolvedValue(null)
    const next = vi.fn()
    await ifAuthenticated('to', 'from', next)
    expect(mockStore.changeUser).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith('/login')
    mockStore.changeUser.mockClear()
    next.mockClear()
    const user = { fullName: 'one user' }
    checkAuth.mockResolvedValue(user)
    await ifAuthenticated('to', 'from', next)
    expect(mockStore.changeUser).toHaveBeenCalledWith(user)
    expect(next).toHaveBeenCalledWith()
  })
})
