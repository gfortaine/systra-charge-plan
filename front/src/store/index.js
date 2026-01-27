import { defineStore } from 'pinia'

export const useIndexStore = defineStore('store', () => {
  const route = null
  const notification = {}
  const user = null
  function changeRoute (newRoute) {
    this.route = newRoute
  }
  function changeNotification (payload) {
    this.notification = payload
  }
  function changeUser (newUser) {
    this.user = newUser
  }
  return {
    route,
    notification,
    user,
    changeRoute,
    changeNotification,
    changeUser,
  }
})
