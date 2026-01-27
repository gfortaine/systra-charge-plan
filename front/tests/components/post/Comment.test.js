import { setupCommonTest, createTestComponent, clone } from '@test/common'
import Comment from '@comp/post/Comment.vue'
import moment from 'moment'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

describe('Comment', () => {
  const options = setupCommonTest(beforeEach, afterEach, false)
  let Comp
  let currentDate

  beforeEach(() => {
    Comp = clone(Comment)
    currentDate = moment()
    expect(Comp).toBeDefined()
  })

  describe('Definition', () => {
    test('should have initialized', async () => {
      const wrapper = await createTestComponent(Comp, options, {})
      expect(wrapper).toBeDefined()
      expect(wrapper.vm.comment.text).toEqual('')
      expect(wrapper.vm.comment.author).toEqual(null)
      expect(wrapper.vm.comment.date).toEqual(null)
      expect(wrapper.vm.text).toEqual('')
      expect(wrapper.vm.authorName).toEqual('')
      expect(wrapper.vm.dateAsString).toEqual('')
      await wrapper.setProps({
        comment: {
          text: 'My comment',
          author: { fullName: 'User A' },
          date: currentDate,
        },
      })
      expect(wrapper.vm.text).toEqual('My comment')
      expect(wrapper.vm.authorName).toEqual('User A')
      expect(wrapper.vm.commentDate).toEqual(new Date(currentDate))
      expect(wrapper.vm.dateAsString).toEqual(moment(currentDate).format('MM/DD/YYYY @ hh:mm A'))
    })
  })

  describe('Computed', () => {
    test('text', async () => {
      const comp1 = await createTestComponent(Comp, options, {
        props: {
          comment: { author: 'Somebody else' },
        },
      })
      expect(comp1.vm.text).toEqual('')
      const comp2 = await createTestComponent(Comp, options, {
        props: {
          comment: {
            author: 'Someone',
            text: 'This is what I wrote',
          },
        },
      })
      expect(comp2.vm.text).toEqual('This is what I wrote')
    })
    test('authorName', async () => {
      const comp1 = await createTestComponent(Comp, options, {
        props: {
          comment: { text: 'This is what I wrote' },
        },
      })
      expect(comp1.vm.authorName).toEqual('')
      const comp2 = await createTestComponent(Comp, options, {
        props: {
          comment: {
            author: { fullName: 'John Doe' },
            text: 'This is what I wrote',
          },
        },
      })
      expect(comp2.vm.authorName).toEqual('John Doe')
    })
    test('dateAsString', async () => {
      const comp1 = await createTestComponent(Comp, options, {
        props: {
          comment: { text: 'This is what I wrote' },
        },
      })
      expect(comp1.vm.dateAsString).toEqual('')
      const comp2 = await createTestComponent(Comp, options, {
        props: {
          comment: {
            text: 'This is what I wrote',
            date: new Date('2023-09-28 12:15'),
          },
        },
      })
      expect(comp2.vm.dateAsString).toEqual('09/28/2023 @ 12:15 PM')
    })
  })

  describe('Methods', () => {
    test('onEditComment', async () => {
      const comment = {
        text: 'This is what I wrote',
        date: new Date('2023-09-28 12:15'),
      }
      const wrapper = await createTestComponent(Comp, options, { props: { comment } })
      wrapper.vm.onEditComment()
      expect(wrapper.emitted().editComment[0]).toEqual([comment])
    })
    test('onDeleteComment', async () => {
      const comment = {
        text: 'This is what I wrote',
        date: new Date('2023-09-28 12:15'),
      }
      const wrapper = await createTestComponent(Comp, options, { props: { comment } })
      wrapper.vm.onDeleteComment()
      expect(wrapper.emitted().deleteComment[0]).toEqual([comment])
    })
  })
})
