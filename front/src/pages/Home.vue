<script>
import WelcomePanel from '@comp/home/WelcomePanel.vue'
import PostList from '@comp/PostList.vue'
import { useIndexStore } from '@src/store'

export default {
  name: 'Home',
  components: {
    WelcomePanel,
    PostList,
  },
  async mounted () {
    const store = useIndexStore()
    store.changeRoute(this.$options.name)
  },
}
</script>
<template>
  <section class="view home">
    <WelcomePanel />
    <PostList />
  </section>
</template>
<style lang="scss" scoped>
.home {
  max-height: calc(100vh - 50px);
}
</style>
