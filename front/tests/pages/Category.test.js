import { clone, createTestComponent, setupCommonTest } from '@test/common'
import Category from '@page/Category.vue'
import { useIndexStore } from '@src/store'
import { describe, beforeEach, test, expect, afterEach, vi } from 'vitest'
import { getCategoryQuery } from '@src/queries'

describe('Category', () => {
  const options = setupCommonTest(beforeEach, afterEach, false)
  let Comp
  let wrapper
  let store
  let $graphqlQuery
  let category
  let posts

  beforeEach(() => {
    Comp = clone(Category)
    expect(Comp).toBeDefined()
    posts = [
      { title: 'post 1' },
      { title: 'post 2' },
    ]
    category = {
      name: 'Bus',
      posts,
    }
    store = useIndexStore()
    $graphqlQuery = options.global.mocks.$graphqlQuery
    $graphqlQuery.mockResolvedValue({ category })
    options.global.mocks.$route = { params: { id: 1 } }
  })

  describe('Definition', () => {
    test('should have been initialized and mounted', async () => {
      Comp.methods.setData = vi.fn().mockResolvedValue()
      wrapper = await createTestComponent(Comp, options)
      expect(wrapper.vm.id).toEqual(1)
      expect(wrapper.vm.name).toEqual('')
      expect(wrapper.vm.posts).toEqual(null)
      expect(wrapper.vm.search).toEqual('')
      expect(Comp.methods.setData).toHaveBeenCalled()
      expect(store.changeRoute).toHaveBeenCalledWith('Category')
    })
  })

  describe('Computed', () => {
    test('should have initialized computed values', async () => {
      wrapper = await createTestComponent(Comp, options)
      expect(wrapper.vm.isDataReady).toBe(true)
    })
  })

  describe('Methods', () => {
    test('setData', async () => {
      wrapper = await createTestComponent(Comp, options)
      const variables = {
        id: 12,
        search: 'test',
      }
      await wrapper.setData({
        ...variables,
        name: '',
        posts: null,
      })
      expect(wrapper.vm.name).toEqual('')
      expect(wrapper.vm.posts).toBe(null)
      $graphqlQuery.mockClear()
      await wrapper.vm.setData()
      expect($graphqlQuery).toHaveBeenCalledWith(getCategoryQuery, variables)
      expect(wrapper.vm.name).toEqual(category.name)
      expect(wrapper.vm.posts).toEqual(posts)
    })
    test('onSearchTermChanged', async () => {
      const vm = {
        search: 'on keyword',
      }
      const keyword = 'My document'
      Comp.methods.onSearchTermChanged.bind(vm)(keyword)
      expect(vm.search).toEqual(keyword)
    })
  })
})
