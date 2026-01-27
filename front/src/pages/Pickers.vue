<script>
import { useIndexStore } from '@src/store'
import DateRangePicker from '@comp/DateRangePicker.vue'
import DatePicker from '@comp/DatePicker.vue'
import TimePicker from '@comp/TimePicker.vue'
import DatetimePicker from '@comp/DatetimePicker.vue'
import TimePickerWithAllowedTimes from '@comp/TimePickerWithAllowedTimes.vue'

export default {
  name: 'Pickers',
  components: {
    DatetimePicker,
    DateRangePicker,
    DatePicker,
    TimePicker,
    TimePickerWithAllowedTimes,
  },
  mounted () {
    const store = useIndexStore()
    store.changeRoute(this.$options.name)
  },
}
</script>
<template>
  <div class="view">
    <div class="card">
      <DateRangePicker />
      <DatePicker />
      <DatetimePicker />
    </div>
    <div class="card">
      <TimePicker />
      <TimePickerWithAllowedTimes />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  justify-content: space-evenly;
  align-items: center;
  width: 50%;
}
</style>
