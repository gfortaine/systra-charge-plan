<script>
import { useIndexStore } from '@src/store'

export default {
  name: 'User',
  computed: {
    store () {
      return useIndexStore()
    },
  },
  async mounted () {
    await this.store.changeRoute(this.$options.name)
  },
}
</script>
<template>
  <section class="view">
    <div
      v-if="store.user"
      class="welcome"
    >
      {{ $gettext('Hello %s!').replace('%s', store.user.fullName) }}
    </div>
  </section>
</template>
<style lang="scss" scoped>
.welcome {
  font-size: 2em;
  font-weight: bold;
  color: var(--v-secondary-base) !important;
}
</style>
