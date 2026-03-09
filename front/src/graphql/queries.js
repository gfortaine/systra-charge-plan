import gql from 'graphql-tag'
import {
  postBasicFragment,
  postFullFragment,
  userFragment,
  categoryFragment,
} from './fragments'

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
query (
  $id: ID!
) {
  category (pk: $id) {
    name
  }
}
`
export const getCategoryPostsQuery = gql`
${postBasicFragment}
query (
  $id: ID!
  $search: String!
) {
  category (pk: $id) {
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
