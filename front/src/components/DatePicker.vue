<script>
import moment from 'moment'

export default {
  name: 'DatePicker',
  data () {
    return {
      date: null,
      menu: false,
    }
  },
  computed: {
    dateText () {
      if (this.date) {
        return moment(this.date).format('DD/MM/YYYY')
      }
      return ''
    },
  },
  methods: {
    closePicker () {
      this.menu = false
    },
    selectToday () {
      this.date = new Date()
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
          label="Date picker"
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
              v-model="date"
              full-width
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
