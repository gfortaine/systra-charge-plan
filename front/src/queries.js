import gql from 'graphql-tag'
import {
  postBasicFragment,
  postFullFragment,
  userFragment,
  categoryFragment,
} from '@src/fragments'

export const getAllPostsQuery = gql`
${postBasicFragment}
query (
  $search: String!
) {
  allPosts (
    filters: { search: $search }
  ) {
    ...PostBasicFragment
  }
}
`
export const getCategoryQuery = gql`
${postBasicFragment}
query (
  $id: ID!
  $search: String!
) {
  category (pk: $id) {
    name
    posts (
      filters: { search: $search }
    ) {
      ...PostBasicFragment
    }
  }
}
`
export const getPostQuery = gql`
${postFullFragment}
query ($id: ID!) {
  post(pk: $id) {
    ...PostFullFragment
  }
}
`
export const getAllUsersQuery = gql`
${userFragment}
query {
  allUsers {
    ...UserFragment
  }
}
`
export const getAllUsersAndCategoriesQuery = gql`
${userFragment}
${categoryFragment}
query {
  allUsers {
    ...UserFragment
  }
  allCategories {
    ...CategoryFragment
  }
}
`
