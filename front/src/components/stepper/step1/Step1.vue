<script>
import InfoTooltip from '@comp/InfoTooltip.vue'

export default {
  name: 'Step1',
  components: {
    InfoTooltip,
  },
}
</script>
<template>
  <div class="step-1-indications">
    WHERE AM I?
    <InfoTooltip>
      {{ $gettext('Hello! I am a tooltip') }}
    </InfoTooltip>
  </div>
</template>
<style lang="scss" scoped>
.step-1-indications {
  background-color: $grey-ultralight;
  padding: 20px 30px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 1ch;
}
</style>
