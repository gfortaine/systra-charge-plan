<script>
import PostList from '@comp/PostList.vue'
import { getCategoryQuery } from '@src/queries'
import { useIndexStore } from '@src/store'

export default {
  name: 'Category',
  components: {
    PostList,
  },
  data () {
    return {
      id: null,
      name: '',
      posts: null,
      search: '',
    }
  },
  computed: {
    isDataReady () {
      return this.id !== null && this.posts !== null
    },
  },
  async mounted () {
    const store = useIndexStore()
    store.changeRoute(this.$options.name)
    this.id = this.$route.params.id
    await this.setData()
  },
  methods: {
    async setData () {
      const { category } = await this.$graphqlQuery(
        getCategoryQuery,
        {
          id: this.id,
          search: this.search,
        },
      ).catch(console.error)
      this.name = category.name
      this.posts = category.posts
    },
    onSearchTermChanged (keyword) {
      this.search = keyword
    },
  },
}
</script>
<template>
  <section class="view cat-view">
    <h1>{{ $gettext('Category:') }} {{ name }}</h1>
    <PostList
      v-if="isDataReady"
      :provided-posts="posts"
      :search="search"
      @refresh-required="setData"
      @search-term-changed="onSearchTermChanged"
    />
  </section>
</template>
<style lang="scss" scoped>
.cat-view {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 50px);
}
</style>
