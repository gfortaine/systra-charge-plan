import { describe, test, expect, vi, afterAll } from 'vitest'
import { checkAuth, authUserQuery, login, logout } from '@src/utils/auth'
import { apolloClient } from '@src/utils/graphql'
import * as config from '@src/config'

vi.mock('@src/config', async () => {
  const actual = await vi.importActual('@src/config')
  return {
    ...actual,
    backUrl: 'https://fake-back.url/',
    fakeUser: false,
  }
})
vi.mock('@src/utils/graphql', async () => {
  const actual = await vi.importActual('@src/utils/graphql')
  return {
    ...actual,
    apolloClient: {
      query: vi.fn(),
    },
  }
})
vi.mock('@src/router', () => ({
  loginRoute: { path: '/mockLogin' },
  failRoute: { path: '/mockFail' },
  homeRoute: { path: '/mockHome' },
}))

const mockUser = {
  id: 32,
  firstName: 'Mock',
  lastName: 'Test',
  fullName: 'Mock Test',
  email: 'mock.test@example.com',
}

describe('auth', () => {
  const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => undefined)
  const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  afterAll(() => {
    consoleLogMock.mockReset()
    consoleErrorMock.mockReset()
  })
  test('checkAuth', async () => {
    apolloClient.query.mockResolvedValue({ data: { me: mockUser } })
    let user = await checkAuth()
    expect(user).toEqual(mockUser)
    expect(apolloClient.query).toHaveBeenCalledWith({ query: authUserQuery })
    apolloClient.query.mockClear().mockRejectedValue('network error')
    user = await checkAuth()
    expect(user).toBe(null)
    expect(apolloClient.query).toHaveBeenCalledWith({ query: authUserQuery })
    apolloClient.query.mockClear()
    vi.mocked(config).fakeUser = true
    user = await checkAuth()
    expect(user).not.toBe(null)
    expect(user.fullName).toEqual('Mock user')
    expect(apolloClient.query).not.toHaveBeenCalled()
  })
  test('login', async () => {
    const Window = {
      location: {
        protocol: 'https:',
        host: 'example.com',
        replace: vi.fn(),
      },
    }
    vi.mocked(config).fakeUser = true
    login(Window)
    expect(Window.location.replace).toHaveBeenCalledWith('https://example.com/mockHome')
    Window.location.replace.mockClear()
    vi.mocked(config).fakeUser = false
    login(Window)
    expect(Window.location.replace).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://fake-back.url/oidc/authenticate?next=https%3A%2F%2Fexample.com%2FmockHome&fail=https%3A%2F%2Fexample.com%2FmockFail',
    )
  })
  test('logout', async () => {
    const Window = {
      location: {
        protocol: 'https:',
        host: 'example.com',
        replace: vi.fn(),
      },
    }
    vi.mocked(config).fakeUser = true
    logout(Window)
    expect(Window.location.replace).toHaveBeenCalledWith('https://example.com/mockLogin')
    Window.location.replace.mockClear()
    vi.mocked(config).fakeUser = false
    logout(Window)
    expect(Window.location.replace).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://fake-back.url/oidc/logout?next=https%3A%2F%2Fexample.com%2FmockLogin&fail=https%3A%2F%2Fexample.com%2FmockFail',
    )
  })
})
