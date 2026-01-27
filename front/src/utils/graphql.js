import { graphqlUrl } from '@src/config'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'

export const apolloClient = new ApolloClient({
  link: createUploadLink({
    uri: graphqlUrl,
    headers: {},
    credentials: 'include',
  }),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
  },
})

export async function unwrapGraphqlResponse (rawPromise) {
  return new Promise((resolve, reject) => {
    rawPromise.then(response => {
      if (response.errors) {
        reject(response.errors)
      } else {
        resolve(response.data)
      }
    }).catch(err => reject([err]))
  })
}

export const graphqlMixin = {
  methods: {
    $graphqlQuery: function (query, variables) {
      return unwrapGraphqlResponse(this.$apollo.query({ query, variables }))
    },
    $graphqlMutate: function (mutation, variables) {
      return unwrapGraphqlResponse(this.$apollo.mutate({ mutation, variables }))
    },
  },
}
