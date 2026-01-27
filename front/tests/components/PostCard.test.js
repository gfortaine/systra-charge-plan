import { setupCommonTest, createTestComponent, clone } from '@test/common'
import PostCard from '@comp/PostCard.vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

describe('PostCard', () => {
  const options = setupCommonTest(beforeEach, afterEach, false)
  let Comp

  beforeEach(() => {
    Comp = clone(PostCard)
    expect(Comp).toBeDefined()
  })

  describe('Definition', () => {
    test('should have been initialized', async () => {
      const expectedButtons = [
        {
          class: 'cancel-btn',
          label: 'Cancel',
          icon: 'fas fa-times',
          event: 'cancelDeletePostDialog',
        },
        {
          class: 'delete-btn',
          label: 'Confirm',
          icon: 'fas fa-trash',
          color: 'white',
          event: 'deletePost',
        },
      ]
      const comp1 = await createTestComponent(Comp, options, {
        props: { item: {} },
      })
      expect(comp1.vm.post).toEqual({})
      expect(comp1.vm.showDeletePostDialog).toEqual(false)
      expect(comp1.vm.categoryNames).toEqual([])
      expect(comp1.vm.authorName).toEqual('')
      expect(comp1.vm.deletePostDialogButtons).toEqual(expectedButtons)
      const mockItem = {
        title: 'My Post',
        author: { fullName: 'Someone' },
        categories: [
          { name: 'Subject A' },
          { name: 'Subject B' },
        ],
      }
      const comp2 = await createTestComponent(Comp, options, {
        props: { item: mockItem },
        mocks: {
          setData: vi.fn(),
        },
      })
      expect(comp2.vm.showDeletePostDialog).toEqual(false)
      expect(comp2.vm.categoryNames).toEqual(['Subject A', 'Subject B'])
      expect(comp2.vm.authorName).toEqual('Someone')
      expect(comp2.vm.deletePostDialogButtons).toEqual(expectedButtons)
    })
  })

  describe('Methods', () => {
    test('setData', async () => {
      const vm = {
        props: {
          item: {
            author: { fullName: 'Someone' },
            categories: [
              { name: 'Subject A' },
              { name: 'Subject B' },
            ],
          },
        },
      }
      Comp.methods.setData.bind(vm)()
      expect(vm.post).toEqual(vm.item)
    })
    test('deletePost', async () => {
      const vm = {
        ...options.global.mocks,
        $emit: vi.fn(),
        showDeletePostDialog: true,
        post: { id: 12, text: 'My text' },
      }
      Comp.methods.deletePost.bind(vm)()
      expect(vm.showDeletePostDialog).toEqual(false)
      expect(vm.$emit).toHaveBeenCalledWith('deletePost', vm.post)
    })
    test('toggleDeletePostDialog', async () => {
      const vm = {
        ...options.global.mocks,
        showDeletePostDialog: false,
      }
      Comp.methods.toggleDeletePostDialog.bind(vm)()
      expect(vm.showDeletePostDialog).toEqual(true)
    })
    test('enterPost', async () => {
      const vm = {
        ...options.global.mocks,
        $emit: vi.fn(),
      }
      const post = { id: 12, text: 'My text' }
      Comp.methods.enterPost.bind(vm)(post)
      expect(vm.$emit).toHaveBeenCalledWith('enterPost', post)
    })
  })
})
