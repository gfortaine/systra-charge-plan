<script>
import moment from 'moment'

export default {
  name: 'DateRangePicker',
  data () {
    return {
      dates: [],
      menu: false,
    }
  },
  computed: {
    dateText () {
      if (this.dates.length > 1) {
        return `${moment(this.dates[0]).format('DD/MM/YYYY')} - ${moment(this.dates.at(-1)).format('DD/MM/YYYY')}`
      }
      return ''
    },
  },
  methods: {
    closePicker () {
      this.menu = false
    },
    selectToday () {
      this.dates[0] = new Date()
    },
  },
}
</script>
<template>
  <v-container>
    <v-row justify="space-around">
      <v-col sm="5">
        <v-text-field
          :model-value="dateText"
          label="Date range picker"
          prepend-icon="fas fa-calendar"
          readonly
        >
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            activator="parent"
            transition="scale-transition"
          >
            <v-date-picker
              v-if="menu"
              v-model="dates"
              full-width
              multiple="range"
            />
            <div class="picker-row-action">
              <v-btn
                color="primary"
                @click="selectToday"
              >
                {{ $gettext('Today') }}
              </v-btn>
              <v-btn
                color="primary"
                @click="closePicker"
              >
                {{ $gettext('Close') }}
              </v-btn>
            </div>
          </v-menu>
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>
