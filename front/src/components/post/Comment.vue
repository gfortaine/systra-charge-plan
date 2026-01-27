<script>
export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      default: () => ({
        text: '',
        author: null,
        date: null,
      }),
    },
  },
  emits: [
    'editComment',
    'deleteComment',
  ],
  computed: {
    text () {
      return this.comment.text || ''
    },
    authorName () {
      return this.comment.author ? this.comment.author.fullName || '' : ''
    },
    commentDate () {
      return this.comment.date ? new Date(this.comment.date) : null
    },
    dateAsString () {
      if (this.commentDate) {
        const lang = this.$language.current
        const date = this.commentDate
        const dateString = date.toLocaleDateString(lang, { day: '2-digit', month: '2-digit', year: 'numeric' })
        const timeString = date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })
        return date ? `${dateString} @ ${timeString}` : ''
      } else {
        return ''
      }
    },
  },
  methods: {
    onEditComment () {
      this.$emit('editComment', this.comment)
    },
    onDeleteComment () {
      this.$emit('deleteComment', this.comment)
    },
  },
}
</script>
<template>
  <div class="comment card">
    <div class="comment-content">
      <div class="comment-header">
        {{ $gettext('By') }}
        <span class="comment-author">{{ authorName }}</span>
        {{ $gettext('On') }}
        <span class="comment-date">{{ dateAsString }}</span>
      </div>
      <div class="comment-text">
        {{ text }}
      </div>
    </div>
    <div class="comment-actions">
      <v-btn
        prepend-icon="fas fa-pen"
        color="secondary"
        class="edit"
        @click="onEditComment"
      >
        {{ $gettext('Edit') }}
      </v-btn>
      <v-btn
        prepend-icon="fas fa-trash"
        color="secondary"
        class="delete"
        variant="tonal"
        @click="onDeleteComment"
      >
        {{ $gettext('Delete') }}
      </v-btn>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.comment {
  flex-direction: row;
}
.comment-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
}
.comment-actions {
  display: flex;
  flex-direction: column;
  gap: 1ch;
  flex-grow: 0;
  flex-shrink: 0;
}
.comment-header {
  font-weight: 300;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
.comment-author {
  font-weight: 700;
  color: $secondary-dark;
}
</style>
