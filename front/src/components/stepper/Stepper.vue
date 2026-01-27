<script>
import Step from '@comp/stepper/Step.vue'

export default {
  name: 'Stepper',
  components: {
    Step,
  },
  props: {
    currentStep: {
      type: Number,
      required: true,
    },
    maxSteps: {
      type: Number,
      required: false,
      default: 1,
    },
    clickableSteps: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [
    'update:currentStep',
  ],
  computed: {
    steps () {
      return Array.from(Array(this.maxSteps)).map((_, i) => i + 1)
    },
  },
  methods: {
    goToStep (step) {
      this.$emit('update:currentStep', step)
    },
    getStepHeaderName (step) {
      return `header-${step}`
    },
    getStepContentName (step) {
      return `content-${step}`
    },
    getStepFooterName (step) {
      return `footer-${step}`
    },
  },
}
</script>
<template>
  <section class="stepper">
    <Step
      v-for="step in steps"
      :key="step"
      :step="step"
      :current-step="currentStep"
      :clickable-steps="clickableSteps"
      @go-to-step="goToStep"
    >
      <template #header>
        <slot :name="getStepHeaderName(step)" />
      </template>
      <template #content>
        <slot :name="getStepContentName(step)" />
      </template>
      <template #footer>
        <slot :name="getStepFooterName(step)" />
      </template>
    </Step>
  </section>
</template>
<style lang="scss" scoped>
.stepper {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
}
</style>
