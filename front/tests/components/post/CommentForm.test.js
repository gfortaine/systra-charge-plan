import { setupCommonTest, createTestComponent, clone } from '@test/common'
import CommentForm from '@comp/post/CommentForm.vue'
import { getAllUsersQuery } from '@src/queries'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

describe('CommentForm', () => {
  const options = setupCommonTest(beforeEach, afterEach, false)
  let Comp
  let wrapper
  let $graphqlQuery
  const allUsers = [{ id: 545 }, { id: 95 }, { id: 674 }]

  beforeEach(async () => {
    $graphqlQuery = options.global.mocks.$graphqlQuery
    $graphqlQuery.mockResolvedValue({ allUsers })
    Comp = clone(CommentForm)
    expect(Comp).toBeDefined()
    wrapper = await createTestComponent(Comp, options, {})
  })

  describe('Definition', () => {
    test('should have been initialized', () => {
      expect(wrapper.vm.avail_users).toEqual(allUsers)
      expect(wrapper.vm.formData).toEqual({
        text: '',
        author: null,
      })
      expect(wrapper.vm.textRules[0]()).toEqual('Comment is required')
    })
  })

  describe('Methods', () => {
    test('setData', async () => {
      const newUsers = [{ id: 78 }, { id: 9 }]
      $graphqlQuery.mockResolvedValue({ allUsers: newUsers })
      await wrapper.vm.setData()
      expect($graphqlQuery).toHaveBeenCalledWith(getAllUsersQuery)
      expect(wrapper.vm.avail_users).toEqual(newUsers)
    })
  })
})
