<script>
import { useIndexStore } from '@src/store'

export default {
  name: 'Notification',
  data () {
    return {
      snackbar: false,
    }
  },
  computed: {
    notification () {
      return useIndexStore().notification
    },
  },
  watch: {
    notification () {
      this.snackbar = true
    },
  },
  methods: {
    closeSnackbar () {
      this.snackbar = false
    },
  },
}
</script>
<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="notification.autoClose ? 3000 : -1"
    transition="slide-y-reverse-transition"
    color="white"
    class="snackbar"
    :class="`snackbar-${notification.type}`"
  >
    {{ notification.text }}
    <template v-slot:actions="{ attrs }">
      <v-btn
        size="small"
        color="secondary"
        variant="text"
        v-bind="attrs"
        @click="closeSnackbar"
      >
        {{ $gettext("Close") }}
      </v-btn>
    </template>
  </v-snackbar>
</template>
