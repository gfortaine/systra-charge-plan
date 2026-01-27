import { setupCommonTest, createTestComponent, clone } from '@test/common'
import PostList from '@comp/PostList.vue'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { deletePostMutation } from '@src/mutations'

describe('PostList', () => {
  const options = setupCommonTest(beforeEach, afterEach, false)
  let Comp
  let store
  let $graphqlQuery
  const mockPosts = [{ id: 545 }, { id: 95 }, { id: 674 }]

  beforeEach(() => {
    Comp = clone(PostList)
    expect(Comp).toBeDefined()
    store = useIndexStore()
    $graphqlQuery = options.global.mocks.$graphqlQuery
    $graphqlQuery.mockResolvedValue({ allPosts: mockPosts })
  })

  describe('Definition', () => {
    test('should have been initialized', async () => {
      const providedPosts = [
        { id: 7 },
        { id: 23 },
      ]
      const comp = await createTestComponent(Comp, options, {
        props: { providedPosts },
      })
      expect(comp.vm.searchTerm).toEqual('')
      expect(comp.vm.primaryColoredIcon).toEqual(false)
      expect(comp.vm.posts).toEqual(providedPosts)
      expect(comp.vm.searchTermIsNotEmpty).toEqual(false)
      expect(comp.emitted()).toHaveProperty('refreshRequired')
      await comp.setProps({
        search: 'plop',
      })
      expect(comp.vm.searchTerm).toEqual('plop')
      expect(comp.vm.primaryColoredIcon).toEqual(false)
      expect(comp.vm.posts).toEqual(providedPosts)
      expect(comp.vm.searchTermIsNotEmpty).toEqual(true)
      expect(comp.emitted()).toHaveProperty('refreshRequired')
      const compNoProps = await createTestComponent(Comp, options)
      expect(compNoProps.vm.searchTerm).toEqual('')
      expect(compNoProps.vm.primaryColoredIcon).toEqual(false)
      expect(compNoProps.vm.posts).toEqual(mockPosts)
      expect(compNoProps.vm.searchTermIsNotEmpty).toEqual(false)
      expect(compNoProps.emitted()).not.toHaveProperty('refreshRequired')
    })
  })

  describe('Methods', () => {
    test('onSearch', async () => {
      const vm = {
        ...options.global.mocks,
        searchTerm: 'test',
        $emit: vi.fn(),
        setData: vi.fn().mockResolvedValue(),
      }
      await Comp.methods.onSearch.bind(vm)()
      expect(vm.searchTerm).toEqual('test')
      expect(vm.$emit).toHaveBeenCalledWith('searchTermChanged', 'test')
      expect(vm.setData).toHaveBeenCalled()
      vm.$emit.mockClear()
      vm.setData.mockClear()
      await Comp.methods.onSearch.bind(vm)('new term')
      expect(vm.searchTerm).toEqual('new term')
      expect(vm.$emit).toHaveBeenCalledWith('searchTermChanged', 'new term')
      expect(vm.setData).toHaveBeenCalled()
    })
    test('clearSearch', () => {
      const vm = {
        ...options.global.mocks,
        onSearch: vi.fn(),
      }
      Comp.methods.clearSearch.bind(vm)()
      expect(vm.onSearch).toHaveBeenCalledWith('')
    })
    test('changeColorIcon', () => {
      const vm = {
        ...options.global.mocks,
        primaryColoredIcon: 'blue',
      }
      const color = 'red'
      Comp.methods.changeColorIcon.bind(vm)(color)
      expect(vm.primaryColoredIcon).toEqual(color)
    })
    test('onEnterPost', async () => {
      const vm = { ...options.global.mocks }
      const mockPost = { id: 16 }
      const expectedParam = {
        name: 'Post',
        params: { id: mockPost.id },
      }
      await Comp.methods.onEnterPost.bind(vm)(mockPost)
      expect(vm.$router.push).toHaveBeenCalledWith(expectedParam)
    })
    test('onDeletePost', async () => {
      const vm = {
        ...options.global.mocks,
        $graphqlMutate: vi.fn().mockResolvedValue(),
        setData: vi.fn().mockResolvedValue(),
      }
      const mockPost = { id: 45 }
      await Comp.methods.onDeletePost.bind(vm)(mockPost)
      expect(vm.$graphqlMutate).toHaveBeenCalledWith(
        deletePostMutation,
        { id: mockPost.id },
      )
      expect(vm.setData).toHaveBeenCalled()
      expect(store.notification).toEqual({
        text: 'A post has been deleted',
        autoclose: false,
        type: 'warning',
      })
    })
  })
})
