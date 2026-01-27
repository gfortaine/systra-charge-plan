<script>
import AddItemDialog from '@comp/newComp/AddItemDialog.vue'
import { getRandomDate, stringToDate } from '@src/utils/date'

export default {
  name: 'DataTable',
  components: {
    AddItemDialog,
  },
  data () {
    return {
      NB_COLUMNS: 8,
      dialog: false,
      editedIndex: -1,
      editedItem: {},
      items: [],
      largeTable: false,
    }
  },
  computed: {
    headers () {
      const headers = [{ title: this.$gettext('id'), align: 'start', sortable: false, key: 'id' }]
      for (let i = 1; i <= this.NB_COLUMNS; i++) {
        headers.push({ title: `col${i}`, align: 'end', key: `col${i}` })
      }
      headers.push({ title: 'Actions', align: 'end', sortable: false, key: 'actions' })
      return headers
    },
    tableSize () {
      const LARGE_ARRAY_SIZE = 20000
      const SIMPLE_ARRAY_SIZE = 20
      return this.largeTable ? LARGE_ARRAY_SIZE : SIMPLE_ARRAY_SIZE
    },
  },
  mounted () {
    this.generateItems()
  },
  methods: {
    generateItems () {
      const startDate = new Date(2000, 0, 1)
      this.items = [...Array(this.tableSize).keys()].map(i => {
        const item = { id: `#${i}` }
        item.col1 = getRandomDate(startDate, new Date())
        for (let j = 2; j <= this.NB_COLUMNS; j++) {
          item[`col${j}`] = Math.floor(Math.random() * 1000)
        }
        return item
      })
    },

    editItem (item) {
      this.editedIndex = this.items.findIndex(i => i === item)
      this.editedItem = Object.assign({}, item)
      this.editedItemDate = this.editedItem.col1.toLocaleDateString(this.$language.current)
      this.dialog = true
    },
    deleteItem (item) {
      const index = this.items.findIndex(i => i === item)
      this.items.splice(index, 1)
    },
    closeDialog () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({})
        this.editedIndex = -1
      })
    },
    saveItem () {
      Object.assign(this.items[this.editedIndex], this.editedItem)
      this.items[this.editedIndex].col1 = stringToDate(this.editedItemDate, this.$language.current)
      this.closeDialog()
    },
  },
}
</script>
<template>
  <section class="card data-table-card">
    <h2>
      Virtual data table
    </h2>
    <v-data-table-virtual
      :fixed-header="true"
      :headers="headers"
      :items="items"
      :height="300"
      item-value="name"
      class="my-table"
    >
      <template v-slot:[`item.col1`]="{ item }">
        {{ item.col1.toLocaleDateString($language.current) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          size="small"
          icon="fas fa-pen"
          variant="text"
          @click="editItem(item)"
        />
        <v-btn
          size="small"
          icon="fas fa-trash"
          variant="text"
          @click="deleteItem(item)"
        />
      </template>
    </v-data-table-virtual>
    <AddItemDialog
      :dialog="dialog"
      :edited-item="editedItem"
      @close-dialog="closeDialog"
      @save-item="saveItem"
    />
  </section>
</template>
<style lang="scss" scoped>
.data-table-virtual {
  color: $secondary;
}
.my-table {
  overflow-y: auto;
}
</style>
