<script>
import { getAllUsersQuery } from '@src/queries'

export default {
  name: 'CommentForm',
  props: {
    comment: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      avail_users: [],
      formData: {
        text: (this.comment && this.comment.text) || '',
        author: (this.comment && this.comment.author) || null,
      },
      textRules: [
        v => !!v || this.$gettext('Comment is required'),
      ],
    }
  },
  async mounted () {
    await this.setData()
  },
  methods: {
    async setData () {
      const { allUsers } = await this.$graphqlQuery(
        getAllUsersQuery,
      ).catch(console.error)
      this.avail_users = allUsers
    },
  },
}
</script>
<template>
  <section>
    <v-textarea
      v-model="formData.text"
      variant="underlined"
      :label="$gettext('Comment')"
      auto-grow
      :rules="textRules"
      counter
      persistent-counter
      color="primary"
      required
    />
    <v-select
      v-model="formData.author"
      variant="underlined"
      :label="$gettext('Author')"
      :items="avail_users"
      item-title="fullName"
      return-object
      color="primary"
    />
  </section>
</template>
