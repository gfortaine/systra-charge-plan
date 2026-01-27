<script>
import PostCard from '@comp/PostCard.vue'
import { deletePostMutation } from '@src/mutations'
import { postRoute } from '@src/router'
import { useIndexStore } from '@src/store'
import { getAllPostsQuery } from '@src/queries'

export default {
  name: 'PostList',
  components: {
    PostCard,
  },
  props: {
    providedPosts: {
      type: Array,
      required: false,
      default: () => null,
    },
    search: {
      type: String,
      required: false,
      default: () => '',
    },
  },
  emits: [
    'refreshRequired',
    'searchTermChanged',
  ],
  data() {
    return {
      searchTerm: '',
      primaryColoredIcon: false,
      posts: [],
    }
  },
  computed: {
    searchTermIsNotEmpty() {
      return !!this.searchTerm
    },
  },
  watch: {
    providedPosts: {
      handler() {
        if (this.providedPosts != null) {
          this.posts = this.providedPosts.slice()
        }
      },
      immediate: true,
    },
    search: {
      handler() {
        if (this.search != null) {
          this.searchTerm = this.search
        }
      },
      immediate: true,
    },
  },
  async mounted() {
    await this.setData()
  },
  methods: {
    async setData() {
      if (this.providedPosts === null) {
        const { allPosts } = await this.$graphqlQuery(
          getAllPostsQuery, { search: this.searchTerm },
        ).catch(console.error)
        this.posts = allPosts
      } else {
        this.$emit('refreshRequired')
      }
    },
    async onSearch(keyword) {
      if (keyword !== undefined) {
        this.searchTerm = keyword
      }
      this.$emit('searchTermChanged', this.searchTerm)
      await this.setData()
    },
    async clearSearch() {
      await this.onSearch('')
    },
    changeColorIcon(primaryColored) {
      this.primaryColoredIcon = primaryColored
    },
    async onEnterPost(post) {
      await this.$router.push({
        name: postRoute.name,
        params: { id: post.id },
      })
    },
    async onDeletePost(post) {
      await this.$graphqlMutate(deletePostMutation, { id: post.id }).catch(console.error)
      await this.setData()
      const store = useIndexStore()
      store.changeNotification({
        text: this.$gettext('A post has been deleted'),
        autoclose: false,
        type: 'warning',
      })
    },
  },
}
</script>
<template>
  <section class="posts">
    <v-text-field
      v-model="searchTerm"
      class="search"
      :class="primaryColoredIcon ? 'search-icon' : ''"
      :label="$gettext('Search')"
      :placeholder="$gettext('keyword')"
      variant="underlined"
      color="primary"
      prepend-inner-icon="fas fa-search"
      @update:focused="changeColorIcon"
      @update:model-value="onSearch"
    >
      <template
        v-if="searchTermIsNotEmpty"
        #append-inner
      >
        <v-icon
          icon="fas fa-times-circle"
          :color="primaryColoredIcon ? 'primarydark' : ''"
          @click="clearSearch"
        />
      </template>
    </v-text-field>
    <div class="post-cards-container">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :item="post"
        @enter-post="onEnterPost"
        @delete-post="onDeletePost"
      />
    </div>
  </section>
</template>
<style lang="scss" scoped>
.posts {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: 100%;
  min-height: 10%;
}
.search {
  flex-grow: 0;
}
.search-icon {
  color: $primary;
}
.post-cards-container {
  display: flex;
  flex-direction: column;
  gap: 1ch;
  max-height: 100%;
  overflow-y: auto;
}
</style>
