import { useCallback, useMemo } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs' // eslint-disable-line import/extensions
import { graphqlUrl } from '@src/config'

function isGraphqlResponse(value) {
  return typeof value === 'object' && value && ('data' in value || 'errors' in value)
}

export function createApolloClient() {
  return new ApolloClient({
    link: new UploadHttpLink({
      uri: graphqlUrl,
      headers: {},
      credentials: 'include',
    }),
    cache: new InMemoryCache(),
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
}

export async function unwrapGraphqlResponse (rawPromise) {
  return new Promise((resolve, reject) => {
    rawPromise.then(response => {
      if (!isGraphqlResponse(response)) {
        throw new Error('Unexpected GraphQL response shape')
      }
      if (response.errors) {
        reject(response.errors)
      } else if (!response.data) {
        throw new Error('GraphQL response did not contain data')
      } else {
        resolve(response.data)
      }
    }).catch(err => reject([err]))
  })
}

export async function graphqlQuery (apolloClient, query, variables) {
  return await unwrapGraphqlResponse(apolloClient.query({ query, variables }))
}
export async function graphqlMutate (apolloClient, mutation, variables) {
  return await unwrapGraphqlResponse(apolloClient.mutate({ mutation, variables }))
}
export default function useGraphql() {
  // created only once per component lifetime
  const apolloClient = useMemo(() => createApolloClient(), [])
  const graphqlQueryStable = useCallback(
    async (query, variables) => await graphqlQuery(apolloClient, query, variables),
    [apolloClient],
  )
  const graphqlMutateStable = useCallback(
    async (mutation, variables) => await graphqlMutate(apolloClient, mutation, variables),
    [apolloClient],
  )
  return {
    graphqlQuery: graphqlQueryStable,
    graphqlMutate: graphqlMutateStable,
  }
}
