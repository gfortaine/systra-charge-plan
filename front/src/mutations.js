import gql from 'graphql-tag'

export const createPostMutation = gql`
mutation (
  $title: String!
  $text: String!
  $image: Upload
  $author: UserPartialInput
  $categories: [ID!]!
) {
  createPost(data: {
    title: $title
    text: $text
    image: $image
    author:  $author
    categories: { set: $categories }
  }) {
    id
  }
}
`
export const deletePostMutation = gql`
mutation ($id: ID!) {
  deletePost(pk: $id) {
    __typename
  }
}
`
export const createCommentMutation = gql`
mutation (
  $postId: ID!
  $text: String!
  $authorId: ID
) {
  createComment(data: {
    postId: $postId
    text: $text
    author: { set: $authorId }
  }) {
    __typename
  }
}
`
export const updateCommentMutation = gql`
mutation (
  $id: ID!
  $text: String!
  $authorId: ID!
) {
  updateComment(
    pk: $id
    data: {
      text: $text
      author: { set: $authorId }
    }
  ) {
    __typename
  }
}
`
export const deleteCommentMutation = gql`
mutation (
  $id: ID!
) {
  deleteComment(pk: $id) {
    __typename
  }
}
`
