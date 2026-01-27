<script>
export default {
  name: 'Upload',
  data () {
    return {
      valid: false,
      files: [],
      filesRule: [
        values => {
          if (!values[0]) {
            return this.$gettext('At least one file is required')
          }
          return !values.some(file => file.size > 2000000) || this.$gettext('Files size should be less than 2 MB!')
        },
      ],
      filesAdd: null,
    }
  },
  methods: {
    insertFile () {
      if (this.valid) {
        this.filesAdd = this.files
        this.files = []
      }
    },
    showFile () {
      if (this.filesAdd) {
        const fileName = []
        this.filesAdd.forEach(file =>
          fileName.push(` ${file.name}`),
        )
        return fileName
      }
    },
  },
}
</script>
<template>
  <div class="card">
    <h1 class="text-h6">
      {{ $gettext('File upload') }}
    </h1>
    <v-form
      v-model="valid"
      @submit.prevent="insertFile"
    >
      <v-file-input
        v-model="files"
        variant="underlined"
        :label="$gettext('insert file(s)')"
        :rules="filesRule"
        prepend-icon="fas fa-folder-open"
        chips
        multiple
        :show-size="1024"
        clearable
        counter
        color="primarydark"
      />
      <v-btn
        color="secondary"
        elevation="4"
        prepend-icon="fas fa-save"
        :disabled="!valid"
        type="submit"
        class="submit-btn"
        :class="[valid ? '' : 'submit-disabled']"
      >
        {{ $gettext('Save') }}
      </v-btn>
    </v-form>
    <div
      v-show="filesAdd"
      class="file-added"
    >
      {{ $gettext('File(s) inserted: ') + showFile() }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.file-added {
  color: $secondary;
  text-align: center;
  margin-top: 1rem;
}
.submit-btn {
  background-color: $primary;
  width: 160px;
  margin-top: 20px;
}
.submit-disabled {
  background-color: $grey-medium;
}
</style>
