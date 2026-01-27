<script>
import InformationPopup from '@comp/utils/InformationPopup.vue'
import Comment from '@comp/post/Comment.vue'
import CommentForm from '@comp/post/CommentForm.vue'
import { getPostQuery } from '@src/queries'
import {
  createCommentMutation,
  updateCommentMutation,
  deleteCommentMutation,
} from '@src/mutations'
import { backUrl } from '@src/config'
import { homeRoute } from '@src/router'
import { useIndexStore } from '@src/store'

export default {
  name: 'Post',
  components: {
    InformationPopup,
    Comment,
    CommentForm,
  },
  data () {
    return {
      post: {},
      showCommentAddDialog: false,
      currentComment: null,
      showCommentEditDialog: false,
      showCommentDeleteDialog: false,
    }
  },
  computed: {
    imageFullUrl () {
      if (this.post.imageUrl) {
        if (this.post.imageUrl[0] === '/') {
          return backUrl + this.post.imageUrl.substring(1)
        } else {
          return backUrl + this.post.imageUrl
        }
      } else {
        return null
      }
    },
    categories () {
      return this.post.categories || []
    },
    authorName () {
      return this.post.author ? this.post.author.fullName : ''
    },
    publicationDate () {
      return new Date(this.post.pubdate)
    },
    localeDate () {
      return this.publicationDate ? this.publicationDate.toLocaleDateString(this.$language.current) : ''
    },
    comments () {
      return this.post.comments
    },
    commentAddDialogButtons () {
      return [
        {
          class: 'cancel-btn',
          label: this.$gettext('Cancel'),
          icon: 'fas fa-times',
          event: 'cancelCommentAddDialog',
        },
        {
          class: 'save-btn',
          label: this.$gettext('Add'),
          icon: 'fas fa-save',
          type: 'submit',
        },
      ]
    },
    commentEditDialogButtons () {
      return [
        {
          class: 'cancel-btn',
          label: this.$gettext('Cancel'),
          icon: 'fas fa-times',
          event: 'cancelCommentEditDialog',
        },
        {
          class: 'save-btn',
          label: this.$gettext('Save'),
          icon: 'fas fa-save',
          type: 'submit',
        },
      ]
    },
    commentDeleteDialogButtons () {
      return [
        {
          class: 'cancel-btn',
          label: this.$gettext('Cancel'),
          icon: 'fas fa-times',
          event: 'cancelCommentDeleteDialog',
        },
        {
          class: 'delete-btn',
          label: this.$gettext('Delete'),
          icon: 'fas fa-trash',
          color: 'white',
          event: 'deleteComment',
        },
      ]
    },
  },
  async mounted () {
    const store = useIndexStore()
    store.changeRoute(this.$options.name)
    const postId = this.$route.params.id
    await this.setData(postId)
  },
  methods: {
    async setData (postId) {
      const { post } = await this.$graphqlQuery(
        getPostQuery,
        { id: postId },
      ).catch(console.error)
      this.post = post
    },
    goBack () {
      this.$router.push({ name: homeRoute.name })
    },
    onAddCommentButton () {
      this.showCommentAddDialog = true
    },
    cancelCommentAddDialog () {
      this.showCommentAddDialog = false
    },
    async addComment (isValid) {
      if (isValid) {
        const formData = this.$refs.commentAdd.formData
        await this.$graphqlMutate(
          createCommentMutation,
          {
            postId: this.post.id,
            text: formData.text,
            authorId: formData.author ? formData.author.id : null,
          },
        ).catch(console.error)
        // not subtile, refresh the whole post
        await this.setData(this.post.id)
        this.showCommentAddDialog = false
      }
    },
    onEditCommentButton (comment) {
      this.currentComment = comment
      this.showCommentEditDialog = true
    },
    cancelCommentEditDialog () {
      this.currentComment = null
      this.showCommentEditDialog = false
    },
    async editComment (isValid) {
      if (isValid) {
        const commentId = this.currentComment.id
        const formData = this.$refs.commentEdit.formData
        await this.$graphqlMutate(
          updateCommentMutation,
          {
            id: commentId,
            text: formData.text,
            authorId: formData.author.id,
          },
        ).catch(console.error)
        // not subtile, refresh the whole post
        await this.setData(this.post.id)
        this.cancelCommentEditDialog()
      }
    },
    onDeleteCommentButton (comment) {
      this.currentComment = comment
      this.showCommentDeleteDialog = true
    },
    cancelCommentDeleteDialog () {
      this.currentComment = null
      this.showCommentDeleteDialog = false
    },
    async deleteComment () {
      const commentId = this.currentComment.id
      await this.$graphqlMutate(
        deleteCommentMutation, { id: commentId },
      ).catch(console.error)
      // not subtile, refresh the whole post
      await this.setData(this.post.id)
      this.cancelCommentDeleteDialog()
    },
  },
}
</script>
<template>
  <section class="view">
    <div class="card post">
      <v-btn
        variant="tonal"
        color="secondary"
        prepend-icon="fas fa-arrow-left"
        class="back"
        @click="goBack"
      >
        {{ $gettext('Return') }}
      </v-btn>
      <div class="post-header">
        <div class="post-title">
          {{ post.title }}
        </div>
        <img
          v-if="imageFullUrl"
          class="post-image"
          :src="imageFullUrl"
        >
        <div class="post-author-date">
          {{ $gettext('Published by') }}
          <span class="author">{{ authorName }}</span>
          {{ $gettext('On') }}
          <span class="date">{{ localeDate }}</span>
        </div>
        <div
          v-if="categories.length"
          class="post-categories"
        >
          <v-btn
            v-for="category in categories"
            :key="category.id"
            :to="{ name: 'Category', params: { id: category.id } }"
            size="small"
            variant="tonal"
            color="secondary"
          >
            {{ category.name }}
          </v-btn>
        </div>
      </div>
      <div class="post-text">
        {{ post.text }}
      </div>
      <div class="post-comments">
        <div class="post-comments-header">
          {{ $gettext('Comments') }}
        </div>
        <div class="comments-container">
          <Comment
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            @edit-comment="onEditCommentButton(comment)"
            @delete-comment="onDeleteCommentButton(comment)"
          />
        </div>
        <v-btn
          color="primary"
          class="comment-add"
          prepend-icon="fas fa-plus"
          @click="onAddCommentButton"
        >
          {{ $gettext('Add a comment') }}
        </v-btn>
      </div>
      <InformationPopup
        v-model="showCommentAddDialog"
        :title="$gettext('Add a comment')"
        :buttons="commentAddDialogButtons"
        @cancel-comment-add-dialog="cancelCommentAddDialog"
        @submit-form="addComment"
      >
        <CommentForm
          v-if="showCommentAddDialog"
          ref="commentAdd"
        />
      </InformationPopup>
      <InformationPopup
        v-model="showCommentEditDialog"
        :title="$gettext('Edit a comment')"
        :buttons="commentEditDialogButtons"
        @cancel-comment-edit-dialog="cancelCommentEditDialog"
        @submit-form="editComment"
      >
        <CommentForm
          v-if="currentComment"
          ref="commentEdit"
          :comment="currentComment"
        />
      </InformationPopup>
      <InformationPopup
        v-model="showCommentDeleteDialog"
        :title="$gettext('Delete a comment')"
        :buttons="commentDeleteDialogButtons"
        @cancel-comment-delete-dialog="cancelCommentDeleteDialog"
        @delete-comment="deleteComment"
      >
        <div
          v-if="currentComment"
        >
          {{ `${$gettext('You are about to delete the comment')} « ${currentComment.date} ».
            ${$gettext('Do you really want to take that action?')}` }}
        </div>
      </InformationPopup>
    </div>
  </section>
</template>
<style lang="scss" scoped>
div.post {
  height: inherit;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex-grow: 1;
  flex-shrink: 1;
}
button.back {
  align-self: flex-start;
}
div.post-title {
  font-weight: bold;
  font-size: 2em;
}
.post-image {
  display: block;
  max-width: 400px;
  max-height: 200px;
}
.post-author-date {
  font-weight: 300;
  font-size: 1.2rem;
}
div.post-categories {
  display: flex;
  gap: 1ch;
}
.author {
  font-weight: 700;
  color: navy;
}
.date {
  font-style: italic;
}
div.post-comments {
  border-top: 1px solid black;
  width: 100%;
}
.post-comments-header {
  font-size: 1.2rem;
}
.comments-container {
  display: flex;
  flex-direction: column;
  gap: 1ch;
  margin-bottom: 2rem;
}
</style>
