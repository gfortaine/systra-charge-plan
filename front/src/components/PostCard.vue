<script>
import InformationPopup from '@comp/utils/InformationPopup.vue'

export default {
  name: 'PostCard',
  components: {
    InformationPopup,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'deletePost',
    'enterPost',
  ],
  data () {
    return {
      post: {
        title: '',
        categories: [],
        author: null,
        pubdate: null,
      },
      showDeletePostDialog: false,
    }
  },
  computed: {
    categoryNames () {
      return this.post.categories ? this.post.categories.map(cat => cat.name) : []
    },
    authorName () {
      return this.post.author ? this.post.author.fullName : ''
    },
    deletePostDialogButtons () {
      return [
        {
          class: 'cancel-btn',
          label: this.$gettext('Cancel'),
          icon: 'fas fa-times',
          event: 'cancelDeletePostDialog',
        },
        {
          class: 'delete-btn',
          label: this.$gettext('Confirm'),
          icon: 'fas fa-trash',
          color: 'white',
          event: 'deletePost',
        },
      ]
    },
    publicationDate () {
      return new Date(this.post.pubdate)
    },
    localeDate () {
      return this.publicationDate.toLocaleDateString(this.$language.current)
    },
    localeTime () {
      return this.publicationDate.toLocaleTimeString(this.$language.current)
    },
  },
  mounted () {
    this.setData()
  },
  methods: {
    setData () {
      this.post = this.item
    },
    deletePost () {
      this.showDeletePostDialog = false
      this.$emit('deletePost', this.post)
    },
    toggleDeletePostDialog () {
      this.showDeletePostDialog = !this.showDeletePostDialog
    },
    enterPost (post) {
      this.$emit('enterPost', post)
    },
  },
}
</script>
<template>
  <div class="post card card-hover">
    <div class="post-header">
      <div class="post-title">
        {{ post.title }}
      </div>
      <div
        v-if="categoryNames.length"
        class="post-categories"
      >
        <v-chip
          v-for="category in categoryNames"
          :key="category"
          label
        >
          {{ category }}
        </v-chip>
      </div>
    </div>
    <div class="post-author-date">
      <span>{{ `${$gettext('Published by')} ` }}</span>
      <span class="author">{{ authorName }}</span>
      <span class="publication-date">
        {{ ` ${$gettext('on')} ${localeDate} ${$gettext('at')} ${localeTime}` }}
      </span>
    </div>
    <div class="post-actions">
      <v-btn
        variant="text"
        size="small"
        icon="fas fa-trash"
        color="secondary"
        @click="toggleDeletePostDialog"
      />
      <v-btn
        variant="text"
        size="small"
        icon="fas fa-arrow-right"
        color="secondary"
        @click="enterPost(post)"
      />
    </div>
    <InformationPopup
      v-model="showDeletePostDialog"
      :title="$gettext('Delete a blog post')"
      :buttons="deletePostDialogButtons"
      @cancel-delete-post-dialog="toggleDeletePostDialog"
      @delete-post="deletePost"
    >
      <div>
        {{ `${$gettext('You are about to delete the blog post')} « ${post.title} ».
          ${$gettext('Do you really want to take that action?')}` }}
      </div>
    </InformationPopup>
  </div>
</template>
<style lang="scss" scoped>
.post.card {
  display: flex;
  flex-direction: column;
  gap: 1ch;
}
.post-title {
  font-size: 1.4rem;
}
.post-author-date {
  font-weight: 300;
}
.post-categories {
  display: flex;
  flex-direction: row;
  gap: 1ch;
}
.post-actions button + button {
  margin-left: '20px';
}
.author {
  font-weight: 700;
}
</style>
