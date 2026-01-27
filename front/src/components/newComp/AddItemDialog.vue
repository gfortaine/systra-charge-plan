<script>
export default {
  name: 'AddItemDialog',
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    editedItem: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'closeDialog',
    'saveItem',
  ],
  data () {
    return {
      editedItemDate: '',
      dialogState: false,
    }
  },
  watch: {
    dialog () {
      this.dialogState = this.dialog
    },
    dialogState (val) {
      val || this.close()
    },
  },
  methods: {
    close () {
      this.$emit('closeDialog')
    },
    save () {
      this.$emit('saveItem')
    },
  },
}
</script>
<template>
  <v-dialog
    v-model="dialogState"
    persistent
    width="60%"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">
          {{ $gettext('Edit Item') }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-col>
            <v-text-field
              v-model="editedItem.id"
              label="id"
              readonly
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="editedItem['col1']"
              :label="`col1`"
            />
          </v-col>
          <v-col
            v-for="index in 7"
            :key="index"
          >
            <v-text-field
              v-model="editedItem[`col${(index + 1)}`]"
              :label="`col${index + 1}`"
            />
          </v-col>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          class="cancel-btn"
          @click="close"
        >
          {{ $gettext('Cancel') }}
        </v-btn>
        <v-btn
          color="secondary"
          class="save-btn"
          @click="save"
        >
          {{ $gettext('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style lang="scss" scoped>
.save-btn {
  background-color: $primary;
}
.cancel-btn {
  background-color: $grey-light;
}
</style>
