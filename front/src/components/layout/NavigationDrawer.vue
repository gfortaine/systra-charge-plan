<script>
import { navigationRoutes, disconnectRoute } from '@src/router'
import { logout } from '@src/utils/auth'
import { useIndexStore } from '@src/store'

export default {
  name: 'NavigationDrawer',
  data () {
    return {
      drawer: true,
      overlay: false,
      menuItems: navigationRoutes,
    }
  },
  computed: {
    closed () {
      return !this.overlay
    },
  },
  methods: {
    getDisplayedRoutes () {
      return this.menuItems.filter(o => o.icon && o.title)
    },
    getRouteTitle (route) {
      const gettext = this.$gettext
      return gettext(route.title)
    },
    isCurrentRoute (item) {
      return useIndexStore().route === item.name
    },
    handleClickMenuItem (route) {
      switch (route.name) {
        case disconnectRoute.name:
          logout()
          break
        default:
          if (this.$router.currentRoute.name === route.name) {
            this.$router.go()
          } else {
            const pushOptions = route.generatePushOptions
              ? route.generatePushOptions(this.store, this.$route) : route.path
            this.$router.push(pushOptions)
          }
          break
      }
    },
    changeOverlay () {
      this.overlay = !this.overlay
    },
    getListItemMarginTop (item) {
      return item.name === 'Disconnect' ? 'auto' : '0'
    },
  },
}
</script>
<template>
  <v-navigation-drawer
    v-model="drawer"
    class="drawer elevation-4"
    :style="{ zIndex: 3000 }"
    :rail="closed"
    rail-width="50"
    permanent
  >
    <v-list-item-title
      class="drawer-header"
      @click="changeOverlay"
    >
      <v-icon size="small">
        {{ closed ? 'fas fa-bars' : 'fas fa-angle-left' }}
      </v-icon>
      <span
        :class="[ closed ? 'fold-down-pane-text-closed' : 'fold-down-pane-text-opened']"
      >
        {{ $gettext('Fold down pane') }}
      </span>
    </v-list-item-title>
    <v-list class="app-menu">
      <template
        v-for="item in getDisplayedRoutes()"
        :key="item.title"
      >
        <v-list-item
          class="app-menu-item"
          :class="[ isCurrentRoute(item) ? 'app-menu-item-selected' : '']"
          :style="{marginTop: getListItemMarginTop(item)}"
          @click="handleClickMenuItem(item)"
        >
          <template #prepend>
            <v-icon
              class="icon"
              :class="[ isCurrentRoute(item) ? 'icon-selected' : '']"
              size="small"
              :title="getRouteTitle(item)"
            >
              {{ item.icon }}
            </v-icon>
          </template>
          <v-list-item-title
            class="app-menu-item-title"
            :class="[ isCurrentRoute(item) ? 'app-menu-item-title-selected' : '']"
          >
            {{ getRouteTitle(item) }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
    <v-overlay
      v-model="overlay"
      close-on-back
      scroll-strategy="block"
      z-index="2000"
    />
  </v-navigation-drawer>
</template>
