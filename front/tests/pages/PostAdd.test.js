import { setupCommonTest, createTestComponent, clone } from '@test/common'
import PostAdd from '@page/PostAdd.vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { getAllUsersAndCategoriesQuery } from '@src/queries'
import { useIndexStore } from '@src/store'
import { homeRoute } from '@src/router'
import { createPostMutation } from '@src/mutations'

describe('PostAdd', () => {
  const options = setupCommonTest(beforeEach, afterEach, false)
  let Comp
  let wrapper
  let store
  let $graphqlQuery
  let $graphqlMutate

  beforeEach(() => {
    Comp = clone(PostAdd)
    expect(Comp).toBeDefined()
    store = useIndexStore()
    $graphqlQuery = options.global.mocks.$graphqlQuery
    $graphqlQuery.mockResolvedValue({ allUsers: [], allCategories: [] })
    $graphqlMutate = options.global.mocks.$graphqlMutate
  })

  describe('Definition', () => {
    test('should have been initialized', async () => {
      Comp.methods.setData = vi.fn().mockResolvedValue()
      wrapper = await createTestComponent(Comp, options)
      expect(wrapper.vm.avail_users).toEqual([])
      expect(wrapper.vm.avail_categories).toEqual([])
      expect(wrapper.vm.valid).toEqual(false)
      expect(wrapper.vm.title).toEqual('')
      expect(wrapper.vm.text).toEqual('')
      expect(wrapper.vm.author).toEqual(null)
      expect(wrapper.vm.categories).toEqual([])
      expect(Comp.methods.setData).toHaveBeenCalled()
      expect(store.changeRoute).toHaveBeenCalledWith('PostAdd')
    })
  })

  describe('Methods', () => {
    test('setData', async () => {
      wrapper = await createTestComponent(Comp, options)
      const allUsers = [{ id: 8 }, { id: 3 }]
      const allCategories = [{ id: 75 }, { id: 31 }]
      $graphqlQuery.mockClear().mockResolvedValue({ allUsers, allCategories })
      await wrapper.vm.setData()
      expect($graphqlQuery).toHaveBeenCalledWith(getAllUsersAndCategoriesQuery)
      expect(wrapper.vm.avail_users).toEqual(allUsers)
      expect(wrapper.vm.avail_categories).toEqual(allCategories)
    })
    test('cancel', () => {
      const vm = {
        ...options.global.mocks,
      }
      Comp.methods.cancel.bind(vm)()
      expect(vm.$router.push).toHaveBeenCalledWith({ name: homeRoute.name })
    })
    test('onImageChanged', async () => {
      const vm = {
        imageUrl: 'some url',
      }
      const ev = {
        target: {
          files: [],
        },
      }
      await Comp.methods.onImageChanged.bind(vm)(ev)
      expect(vm.imageUrl).toBe(null)
      const testImgBase64 = (
        'data:image/png;base64,'
        + 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2Ow9L7/HwAEhwJj95h82gAAAABJRU5ErkJggg=='
      )
      const file = await fetch(testImgBase64).then(
        response => response.arrayBuffer(),
      ).then(
        buffer => new File([buffer], 'test.png', { type: 'image/png' }),
      )
      ev.target.files.push(file)
      await Comp.methods.onImageChanged.bind(vm)(ev)
      expect(vm.imageUrl).toBe(testImgBase64)
    })
    test('addPost', async () => {
      wrapper = await createTestComponent(Comp, options)
      $graphqlMutate.mockClear().mockResolvedValue({ createPost: { post: 'some post' } })
      await wrapper.vm.addPost()
      expect($graphqlMutate).not.toHaveBeenCalled()
      expect(wrapper.vm.$router.push).not.toHaveBeenCalled()
      const title = 'My post title'
      const text = 'This is the content of my post.'
      const author = { id: 47 }
      const categories = [{ id: 5 }, { id: 52 }]
      wrapper.setData({
        title,
        text,
        author,
        categories,
        imageFiles: ['an image blob'],
        valid: true,
      })
      await wrapper.vm.addPost()
      expect($graphqlMutate).toHaveBeenCalledWith(
        createPostMutation,
        {
          title,
          text,
          author: { id: author.id },
          categories: [5, 52],
          image: 'an image blob',
        },
      )
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: homeRoute.name })
    })
  })
})
