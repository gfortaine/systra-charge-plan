<script>
import { getAllUsersAndCategoriesQuery } from '@src/queries'
import { createPostMutation } from '@src/mutations'
import { homeRoute } from '@src/router'
import { useIndexStore } from '@src/store'

export default {
  name: 'PostAdd',
  data () {
    return {
      avail_users: [],
      avail_categories: [],
      valid: false,
      title: '',
      imageFiles: [],
      imageUrl: null,
      text: '',
      author: null,
      categories: [],
      titleRules: [
        v => !!v || this.$gettext('Title is required'),
        v => v.length <= 100 || this.$gettext('Title cannot excess 100 characters'),
      ],
      imageRules: [
        values => {
          if (!values[0]) {
            return this.$gettext('At least one file is required')
          }
          return !values.some(file => file.size > 2000000) || this.$gettext('Files size should be less than 2 MB!')
        },
      ],
      textRules: [
        v => !!v || this.$gettext('Text is required'),
      ],
    }
  },
  async mounted () {
    const store = useIndexStore()
    store.changeRoute(this.$options.name)
    await this.setData()
  },
  methods: {
    async setData () {
      const { allUsers, allCategories } = await this.$graphqlQuery(
        getAllUsersAndCategoriesQuery,
      ).catch(console.error)
      this.avail_users = allUsers
      this.avail_categories = allCategories
    },
    cancel () {
      this.$router.push({ name: homeRoute.name })
    },
    async onImageChanged (ev) {
      if (ev.target.files && ev.target.files.length) {
        const file = ev.target.files[0]
        await new Promise(resolve => {
          const imgReader = new FileReader()
          imgReader.onload = e => {
            this.imageUrl = e.target.result
            resolve()
          }
          imgReader.readAsDataURL(file)
        })
      } else {
        this.imageUrl = null
      }
    },
    async addPost () {
      if (this.valid) {
        const variables = {
          title: this.title,
          text: this.text,
          author: this.author && { id: this.author.id },
          categories: this.categories.map(cat => cat.id),
        }
        if (this.imageFiles && this.imageFiles.length) {
          variables.image = this.imageFiles[0]
        }
        await this.$graphqlMutate(
          createPostMutation,
          variables,
        ).catch(console.error)
        this.$router.push({ name: homeRoute.name })
      }
    },
  },
}
</script>
<template>
  <section class="view">
    <div class="card">
      <h1>
        {{ $gettext('Blog post addition') }}
      </h1>
      <v-form
        v-model="valid"
        @submit.prevent="addPost"
      >
        <v-text-field
          v-model="title"
          variant="underlined"
          :label="$gettext('Title')"
          :rules="titleRules"
          counter="100"
          persistent-counter
          color="primary"
          required
        />
        <div class="image-with-preview">
          <v-file-input
            v-model="imageFiles"
            variant="underlined"
            accept="image/*"
            :label="$gettext('add an optional image')"
            :rules="imageRule"
            prepend-icon="fas fa-paperclip"
            :show-size="1024"
            density="compact"
            clearable
            color="primarydark"
            @change="onImageChanged"
            @click:clear="onImageChanged"
          />
          <v-img
            v-if="imageUrl"
            :src="imageUrl"
          />
        </div>
        <v-textarea
          v-model="text"
          variant="underlined"
          :label="$gettext('Text')"
          :rules="textRules"
          auto-grow
          counter
          persistent-counter
          color="primary"
          required
        />
        <v-select
          v-model="author"
          variant="underlined"
          :label="$gettext('Author')"
          :items="avail_users"
          item-title="fullName"
          return-object
          color="primary"
        />
        <v-select
          v-model="categories"
          variant="underlined"
          :label="$gettext('Categories')"
          :items="avail_categories"
          item-title="name"
          return-object
          multiple
        >
          <template #selection="{ item }">
            <v-chip color="secondarydark">
              {{ item.title }}
            </v-chip>
          </template>
        </v-select>
        <div class="post-add-form-actions">
          <v-btn
            variant="elevated"
            :color="valid ? 'primary' : 'grey-medium'"
            class="publish-btn"
            elevation="2"
            prepend-icon="fas fa-save"
            :disabled="!valid"
            type="submit"
          >
            {{ $gettext('Publish') }}
          </v-btn>
          <v-btn
            variant="elevated"
            color="grey-ultralight"
            elevation="2"
            prepend-icon="fas fa-times"
            @click="cancel"
          >
            {{ $gettext('Cancel') }}
          </v-btn>
        </div>
      </v-form>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.card {
  width: 100%;
}
.v-list .v-list-item--active { /* stylelint-disable-line selector-class-pattern */
  background-color: $secondary-dark !important;
  color: $white;
}
.publish-btn {
  width: 120px;
}
div.image-with-preview {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-height: 200px;
}
div.image-with-preview > div:nth-child(2) {
  margin: 0 0 0 2em;
  max-width: 200px;
}
.post-add-form-actions {
  display: flex;
  flex-direction: row-reverse;
  gap: 1ch;
}
</style>
