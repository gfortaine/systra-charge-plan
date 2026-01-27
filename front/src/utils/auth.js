import { apolloClient, unwrapGraphqlResponse } from '@src/utils/graphql'
import { loginRoute, failRoute, homeRoute } from '@src/router'
import { backUrl, fakeUser } from '@src/config'
import gql from 'graphql-tag'

export const authUserQuery = gql`
  query {
    me {
      id
      firstName
      lastName
      fullName
      email
    }
  }
`
export const loginUri = 'oidc/authenticate?next=%nextURI%&fail=%failURI%'
export const logoutUri = 'oidc/logout?next=%nextURI%&fail=%failURI%'

export async function checkAuth () {
  if (fakeUser) {
    return Promise.resolve({ fullName: 'Mock user' })
  } else {
    return unwrapGraphqlResponse(
      apolloClient.query({ query: authUserQuery }),
    ).then(({ me }) => me).catch(error => {
      console.error(error)
      return null
    })
  }
}

export function login (Window) {
  Window = Window || window
  const nextURI = `${Window.location.protocol}//${Window.location.host}${homeRoute.path}`
  const failURI = `${Window.location.protocol}//${Window.location.host}${failRoute.path}`
  if (fakeUser) {
    Window.location.replace(nextURI)
  } else {
    Window.location.replace(
      backUrl + loginUri.replace(
        '%nextURI%', encodeURIComponent(nextURI),
      ).replace(
        '%failURI%', encodeURIComponent(failURI),
      ),
    )
  }
}

export function logout (Window) {
  Window = Window || window
  const nextURI = `${Window.location.protocol}//${Window.location.host}${loginRoute.path}`
  const failURI = `${Window.location.protocol}//${Window.location.host}${failRoute.path}`
  if (fakeUser) {
    Window.location.replace(nextURI)
  } else {
    Window.location.replace(
      backUrl + logoutUri.replace(
        '%nextURI%', encodeURIComponent(nextURI),
      ).replace(
        '%failURI%', encodeURIComponent(failURI),
      ),
    )
  }
}
