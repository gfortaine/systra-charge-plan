<script>
export default {
  name: 'DatetimePicker',
  data () {
    return {
      date: null,
    }
  },
}
</script>
<template>
  <VueDatePicker
    v-model="date"
    time-picker-inline
    :action-row="{ showNow: true }"
    :now-button-label="$gettext('Now')"
    placeholder="Datetime picker"
  />
</template>
