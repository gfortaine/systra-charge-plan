<script>
import moment from 'moment'

export default {
  name: 'TimePicker',
  data () {
    return {
      time: null,
      menu: false,
    }
  },
  methods: {
    closePicker () {
      this.menu = false
    },
    selectNow () {
      this.time = moment(new Date()).format('HH:mm')
    },
  },
}
</script>
<template>
  <v-container>
    <v-row justify="space-around">
      <v-col sm="5">
        <v-text-field
          v-model="time"
          :active="menu"
          :focused="menu"
          label="Time picker"
          prepend-icon="fas fa-clock"
          readonly
        >
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            activator="parent"
            transition="scale-transition"
          >
            <v-time-picker
              v-if="menu"
              v-model="time"
              format="24hr"
              full-width
            />
            <div class="picker-row-action">
              <v-btn
                color="primary"
                @click="selectNow"
              >
                {{ $gettext('Now') }}
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
