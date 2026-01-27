<script>
import { userRoute } from '@src/router'
import { useIndexStore } from '@src/store'

export default {
  name: 'Toolbar',
  computed: {
    store () {
      return useIndexStore()
    },
    userName () {
      const user = this.store.user || null
      return user ? user.fullName : '/'
    },
  },
  methods: {
    handleChangeLanguage (lang) {
      this.$vuetify.locale.current = lang
      this.$language.current = lang
    },
    handleUserClick () {
      this.$router.push({ name: userRoute.name })
    },
  },
}
</script>
<template>
  <v-toolbar
    class="app-toolbar"
    :elevation="4"
    density="compact"
    color="white"
  >
    <img
      class="logo"
      src="@static/logo-v1-dark.png"
      alt="Myapp"
    >
    <div class="toolbar-buttons-container">
      <v-tooltip
        location="left"
        color="secondary"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            size="small"
            :style="{marginRight: '40px'}"
            v-bind="props"
            color="secondary"
            icon="fas fa-user"
            @click="handleUserClick"
          />
        </template>
        <span>{{ userName }}</span>
      </v-tooltip>
      <div
        v-for="(language, lang) in $language.available"
        :key="lang"
        class="language"
        :class="[lang === $language.current ? 'active' : '']"
        :title="language"
        @click="handleChangeLanguage(lang)"
      >
        {{ lang.toUpperCase() }}
      </div>
    </div>
  </v-toolbar>
</template>
