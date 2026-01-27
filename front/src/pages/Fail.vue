<script>
import { useIndexStore } from '@src/store'

export default {
  name: 'Fail',
  async mounted () {
    const store = useIndexStore()
    store.changeRoute(this.$options.name)
  },
  methods: {
    getURLParams (param, Window) {
      const url = new URL((Window || window).location.href)
      return url.searchParams.get(param)
    },
  },
}
</script>
<template>
  <div class="layout">
    <div class="layout-overlay" />
    <v-card class="card">
      <v-card-title class="title">
        <img
          src="@static/icon_circle.png"
          alt="Myapp"
        >
      </v-card-title>
      <v-card-text :style="{textAlign: 'center'}">
        <div class="subtitle">
          {{ $gettext("Error") }}
        </div>
        <div class="error-msg">
          {{ getURLParams('error') }}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.card {
  width: 500px;
  max-height: calc(100% - 2em);
  overflow-y: auto;
  padding: 40px;
}
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.title > img {
  margin: 0;
  max-height: 15rem;
}
.subtitle {
  font-size: 2em;
  color: $warning-orange !important;
  font-weight: bold;
  margin: 40px;
}
.error-msg {
  font-size: 1em;
  color: $error-red !important;
  margin: 20px;
}
</style>
