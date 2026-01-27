<script>
export default {
  name: 'InfoTooltip',
  props: {
    location: {
      type: String,
      default: () => 'bottom',
    },
    maxWidth: {
      type: String,
      default: () => 'auto',
    },
  },
}
</script>
<template>
  <v-tooltip
    class="sds-tooltip"
    :location="location"
    :max-width="maxWidth"
  >
    <template v-slot:activator="{ props }">
      <v-icon
        v-bind="props"
        size="x-small"
      >
        fas fa-info-circle
      </v-icon>
    </template>
    <slot />
  </v-tooltip>
</template>
<style lang="scss">
.sds-tooltip .v-overlay__content { /* stylelint-disable-line selector-class-pattern */
  background-color: rgba($grey-dark, 0.8) !important;
}
</style>
