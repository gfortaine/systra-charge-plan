<script>
import { login } from '@src/utils/auth'
import { useIndexStore } from '@src/store'

export default {
  name: 'Login',
  async mounted () {
    const store = useIndexStore()
    store.changeRoute(this.$options.name)
    store.changeUser(null)
  },
  methods: {
    login () {
      login()
    },
  },
}
</script>
<template>
  <div class="layout">
    <div class="layout-overlay" />
    <v-card class="card login-card">
      <v-card-title class="text-h6 login-title">
        <img
          src="@static/icon_circle.png"
          alt="Myapp"
        >
      </v-card-title>
      <v-card-subtitle class="text-h7 login-subtitle">
        {{ $gettext("Login") }}
      </v-card-subtitle>
      <v-card-text class="text login-text">
        <div>
          <!-- eslint-disable-next-line max-len -->
          {{ $gettext("You must be logged in to have access to this application. Please click on the button below to do so.") }}
        </div>
      </v-card-text>
      <div class="login-btn-container">
        <v-btn
          color="primary"
          prepend-icon="fas fa-sign-in-alt"
          size="large"
          class="login-btn"
          @click="login"
        >
          {{ $gettext('Login') }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.login-card {
  width: 500px;
  max-height: calc(100% - 2em);
  overflow-y: auto;
  padding: 40px;
}
.login-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}
.login-title > img {
  margin: 0;
  max-height: 12rem;
  max-width: 20rem;
}
.login-subtitle {
  font-size: 2em;
  color: $secondary !important;
  text-align: center;
  font-weight: bold;
  padding: 30px;
}
.login-text {
  text-align: center;
}
.login-btn-container {
  display: flex;
  justify-content: center;
}
.login-btn {
  margin-top: 20px;
  width: min-content;
}
</style>
