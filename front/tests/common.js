import { mount, flushPromises } from '@vue/test-utils'
import clone from 'clone'
import { createVuetify } from 'vuetify'
import { vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

export const setupCommonTest = (beforeEach = () => {}, afterEach = () => {}, mockConsole = true) => {
  const options = {}

  const commonBeforeEach = () => {
    const $vuetify = createVuetify()
    const $apollo = {
      query: vi.fn().mockResolvedValue({}),
      mutate: vi.fn().mockResolvedValue({}),
    }
    const $graphqlQuery = vi.fn().mockResolvedValue({ data: {} })
    const $graphqlMutate = vi.fn().mockResolvedValue({ data: {} })
    const $router = {
      push: vi.fn(),
    }
    const $language = {
      current: 'en',
      available: {
        en: 'English',
        fr: 'Français',
      },
    }
    $vuetify.lang = { current: 'en' }
    const $gettext = vi.fn(msg => msg)
    // https://pinia.vuejs.org/cookbook/testing.html#Customizing-behavior-of-actions
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false, // store is clean (setters don't call externals)
    })
    options.vuetify = $vuetify
    options.props = {}
    options.global = {
      mocks: {
        $router,
        $language,
        $vuetify,
        pinia,
        $gettext,
        $apollo,
        $graphqlQuery,
        $graphqlMutate,
      },
      plugins: [pinia],
    }
    if (mockConsole) {
      console.log = vi.fn()
      console.error = vi.fn()
    }
    console.warn = vi.fn()
  }

  const commonAfterEach = () => {
    if (mockConsole) {
      console.log.mockRestore()
      console.error.mockRestore()
    }
    console.warn.mockRestore()
  }

  beforeEach(commonBeforeEach)
  afterEach(commonAfterEach)
  return options
}

export const createTestComponent = async (
  component,
  options,
  componentDefinition = {},
  shallow = true,
  wait = true,
) => {
  const wrapper = mount(component, {
    ...options,
    shallow,
    props: {
      ...options.props,
      ...componentDefinition.props,
    },
    global: {
      mocks: {
        ...options.global.mocks,
        ...componentDefinition.mocks,
      },
      stubs: {
        ...componentDefinition.stubs,
      },
    },
  })
  if (wait) {
    await wrapper.vm.$nextTick()
    await flushPromises() // wait for mounted to finish
  }
  return wrapper
}

export { clone, flushPromises }
