<script>
export default {
  name: 'CaloriesDataTable',
  data () {
    return {
      desserts: [
        { name: 'Eclair', calories: 262, fat: 16.0 },
        { name: 'Lollipop', calories: 392, fat: 0.2 },
        { name: 'KitKat', calories: 518, fat: 26.0 },
      ],
    }
  },
  computed: {
    dessertsList () {
      return [...Array(300).keys()].map(i => {
        const dessert = { ...this.desserts[i % 3] }
        dessert.name = `${dessert.name} #${i}`
        return dessert
      })
    },
    headers () {
      return [
        {
          title: this.$gettext('Dessert (100g serving)'),
          align: 'start',
          sortable: false,
          key: 'name',
        },
        { title: this.$gettext('Calories'), align: 'end', key: 'calories' },
        { title: this.$gettext('Fat (g)'), align: 'end', key: 'fat' },
      ]
    },
  },
  methods: {
    getColor (calories) {
      if (calories > 400) {
        return 'error'
      } else if (calories > 300) {
        return 'warning'
      } else {
        return 'success'
      }
    },
  },
}
</script>
<template>
  <section class="card">
    <h2>
      Classic data table
    </h2>
    <v-data-table
      :headers="headers"
      :items="dessertsList"
      item-value="name"
      :height="300"
      :fixed-header="true"
      :show-select="true"
    >
      <template v-slot:[`item.calories`]="{ item }">
        <v-chip :color="getColor(item.calories)">
          {{ item.calories }}
        </v-chip>
      </template>
    </v-data-table>
  </section>
</template>
<style lang="scss">
.v-data-table-header__content { /* stylelint-disable-line selector-class-pattern */
  margin: auto;
  color: $secondary;
}
</style>
