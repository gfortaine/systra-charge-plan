import { setupCommonTest, createTestComponent, clone } from '@test/common'
import Post from '@page/Post.vue'
import { getPostQuery } from '@src/queries'
import {
  createCommentMutation,
  updateCommentMutation,
  deleteCommentMutation,
} from '@src/mutations'
import { useIndexStore } from '@src/store'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

describe('Post', () => {
  const options = setupCommonTest(beforeEach, afterEach, false)
  let Comp
  let wrapper
  let store
  let $graphqlQuery
  let $graphqlMutate
  let post

  beforeEach(() => {
    Comp = clone(Post)
    expect(Comp).toBeDefined()
    post = {
      id: 1,
      title: 'my post',
      categories: ['One', 'Two'],
      author: {
        fullName: 'Mock user',
      },
      pubdate: '2023-01-01',
    }
    options.global.mocks.$route = { params: { id: post.id } }
    store = useIndexStore()
    $graphqlQuery = options.global.mocks.$graphqlQuery
    $graphqlQuery.mockResolvedValue({ post })
    $graphqlMutate = options.global.mocks.$graphqlMutate
  })

  describe('Definition', () => {
    test('should have been initialized', async () => {
      Comp.methods.setData = vi.fn().mockResolvedValue()
      wrapper = await createTestComponent(Comp, options)
      expect(wrapper.find('.post').exists()).toBe(true)
      expect(wrapper.vm.post).toEqual({})
      expect(wrapper.vm.showCommentAddDialog).toEqual(false)
      expect(wrapper.vm.currentComment).toEqual(null)
      expect(wrapper.vm.showCommentEditDialog).toEqual(false)
      expect(wrapper.vm.showCommentDeleteDialog).toEqual(false)
      expect(Comp.methods.setData).toHaveBeenCalledWith(1)
      expect(store.changeRoute).toHaveBeenCalledWith('Post')
    })
  })

  describe('Computed', () => {
    test('should have initialized computed values', async () => {
      wrapper = await createTestComponent(Comp, options)
      expect(wrapper.vm.categories).toEqual(post.categories)
      expect(wrapper.vm.authorName).toEqual(post.author.fullName)
      expect(wrapper.vm.publicationDate).toEqual(new Date(post.pubdate))
      expect(wrapper.vm.localeDate).toEqual(wrapper.vm.publicationDate.toLocaleDateString('en'))
      expect(wrapper.vm.comments).toEqual(post.comments)
      expect(wrapper.vm.commentAddDialogButtons).toEqual([
        {
          class: 'cancel-btn',
          label: 'Cancel',
          icon: 'fas fa-times',
          event: 'cancelCommentAddDialog',
        },
        {
          class: 'save-btn',
          label: 'Add',
          icon: 'fas fa-save',
          type: 'submit',
        },
      ])
      expect(wrapper.vm.commentEditDialogButtons).toEqual([
        {
          class: 'cancel-btn',
          label: 'Cancel',
          icon: 'fas fa-times',
          event: 'cancelCommentEditDialog',
        },
        {
          class: 'save-btn',
          label: 'Save',
          icon: 'fas fa-save',
          type: 'submit',
        },
      ])
      expect(wrapper.vm.commentDeleteDialogButtons).toEqual([
        {
          class: 'cancel-btn',
          label: 'Cancel',
          icon: 'fas fa-times',
          event: 'cancelCommentDeleteDialog',
        },
        {
          class: 'delete-btn',
          label: 'Delete',
          icon: 'fas fa-trash',
          color: 'white',
          event: 'deleteComment',
        },
      ])
    })
  })

  describe('Methods', () => {
    test('setData', async () => {
      wrapper = await createTestComponent(Comp, options)
      const post = { id: 18, msg: 'Hello' }
      $graphqlQuery.mockClear().mockResolvedValue({ post })
      await wrapper.vm.setData(post.id)
      expect($graphqlQuery).toHaveBeenCalledWith(
        getPostQuery,
        { id: post.id },
      )
      expect(wrapper.vm.post).toEqual(post)
    })
    test('goBack', async () => {
      const vm = { ...options.global.mocks }
      Comp.methods.goBack.bind(vm)()
      expect(vm.$router.push).toHaveBeenCalledWith({ name: 'Home' })
    })
    test('onAddCommentButton', async () => {
      const vm = { ...options.global.mocks }
      Comp.methods.onAddCommentButton.bind(vm)()
      expect(vm.showCommentAddDialog).toBe(true)
    })
    test('cancelCommentAddDialog', async () => {
      const vm = { ...options.global.mocks }
      Comp.methods.cancelCommentAddDialog.bind(vm)()
      expect(vm.showCommentAddDialog).toBe(false)
    })
    test('addComment', async () => {
      const postId = 45
      const formData = { text: 'my comment', author: { id: 1 } }
      const vm = {
        ...options.global.mocks,
        post: { id: postId },
        $refs: { commentAdd: { formData } },
        setData: vi.fn().mockResolvedValue(),
      }
      $graphqlMutate.mockClear()
      await Comp.methods.addComment.bind(vm)(true)
      expect($graphqlMutate).toHaveBeenCalledWith(
        createCommentMutation,
        {
          postId,
          authorId: formData.author.id,
          text: formData.text,
        },
      )
      expect(vm.setData).toHaveBeenCalledWith(postId)
      expect(vm.showCommentAddDialog).toBe(false)
    })
    test('onEditCommentButton', async () => {
      const vm = { ...options.global.mocks }
      const mockComment = {}
      Comp.methods.onEditCommentButton.bind(vm)(mockComment)
      expect(vm.currentComment).toEqual(mockComment)
      expect(vm.showCommentEditDialog).toBe(true)
    })
    test('cancelCommentEditDialog', async () => {
      const vm = { ...options.global.mocks }
      const mockComment = {}
      Comp.methods.cancelCommentEditDialog.bind(vm)(mockComment)
      expect(vm.currentComment).toEqual(null)
      expect(vm.showCommentEditDialog).toBe(false)
    })
    test('editComment', async () => {
      const currentComment = { id: 5646 }
      const formData = { text: 'my comment', author: { id: 51 } }
      const vm = {
        ...options.global.mocks,
        post,
        currentComment,
        $refs: { commentEdit: { formData } },
        setData: vi.fn().mockResolvedValue(),
        cancelCommentEditDialog: vi.fn(),
      }
      $graphqlMutate.mockClear()
      await Comp.methods.editComment.bind(vm)(false)
      expect($graphqlMutate).not.toHaveBeenCalled()
      expect(vm.setData).not.toHaveBeenCalled()
      expect(vm.cancelCommentEditDialog).not.toHaveBeenCalled()
      await Comp.methods.editComment.bind(vm)(true)
      expect($graphqlMutate).toHaveBeenCalledWith(
        updateCommentMutation,
        {
          id: currentComment.id,
          text: formData.text,
          authorId: formData.author.id,
        },
      )
      expect(vm.setData).toHaveBeenCalledWith(post.id)
      expect(vm.cancelCommentEditDialog).toHaveBeenCalledOnce()
    })
    test('onDeleteCommentButton', async () => {
      const vm = { ...options.global.mocks }
      const mockComment = {}
      Comp.methods.onEditCommentButton.bind(vm)(mockComment)
      expect(vm.currentComment).toEqual(mockComment)
      expect(vm.showCommentEditDialog).toBe(true)
    })
    test('cancelCommentDeleteDialog', async () => {
      const vm = { ...options.global.mocks }
      const mockComment = {}
      Comp.methods.cancelCommentEditDialog.bind(vm)(mockComment)
      expect(vm.currentComment).toEqual(null)
      expect(vm.showCommentEditDialog).toBe(false)
    })
    test('deleteComment', async () => {
      const mockComment = { id: 45 }
      const vm = {
        ...options.global.mocks,
        post,
        currentComment: mockComment,
        setData: vi.fn().mockResolvedValue(),
        cancelCommentDeleteDialog: vi.fn(),
      }
      $graphqlMutate.mockClear()
      await Comp.methods.deleteComment.bind(vm)()
      expect($graphqlMutate).toHaveBeenCalledWith(
        deleteCommentMutation,
        { id: mockComment.id },
      )
      expect(vm.setData).toHaveBeenCalledWith(post.id)
      expect(vm.cancelCommentDeleteDialog).toHaveBeenCalledOnce()
    })
  })
})
