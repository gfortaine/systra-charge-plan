<script>
export default {
  name: 'Step',
  props: {
    step: {
      type: Number,
      required: true,
    },
    currentStep: {
      type: Number,
      required: true,
    },
    clickableSteps: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [
    'goToStep',
  ],
  computed: {
    headerClass () {
      return this.clickableSteps ? 'clickable' : ''
    },
  },
  methods: {
    isActive (step) {
      return step === this.currentStep
    },
    isCompleted (step) {
      return step < this.currentStep
    },
    getStepClass (step) {
      if (this.isCompleted(step)) {
        return 'completed'
      } else if (this.isActive(step)) {
        return 'active'
      } else {
        return 'inactive'
      }
    },
    goToStep (step) {
      this.$emit('goToStep', step)
    },
    headerClicked (step) {
      if (this.clickableSteps) {
        this.goToStep(step)
      }
    },
  },
}
</script>
<template>
  <div
    class="step"
    :class="getStepClass(step)"
  >
    <div
      class="step-header"
      :class="headerClass"
      @click="headerClicked(step)"
    >
      <div class="number">
        <v-icon
          v-if="isCompleted(step)"
          size="small"
        >
          fas fa-check
        </v-icon>
        <span
          v-else
        >
          {{ step }}
        </span>
      </div>
      <slot name="header" />
    </div>
    <div class="step-body">
      <div class="step-content">
        <slot name="content" />
      </div>
      <div class="step-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.step {
  display: flex;
  flex-direction: column;
  height: 1%;
  flex-grow: 1;
  gap: 1ch;
  margin-bottom: 1ch;
}
.step.inactive,
.step.completed {
  height: auto;
  flex-grow: 0;
}
.step-header {
  display: flex;
  flex-direction: row;
}
.step.active .step-header {
  text-shadow: 0 0 0 #000;
}
.step.inactive .step-header {
  color: $grey-dark;
}
.step.completed .step-header {
  color: inherit;
}
.step-header.clickable {
  cursor: pointer;
}
.step-header > .number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: $primary;
  border-color: $primary;
  color: $white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 2ch;
}
.step.inactive .step-header > .number {
  background-color: $grey-medium;
}
.step.completed .step-header > .number {
  background-color: $primary;
}
.step-body {
  display: flex;
  flex-direction: column;
  height: 1%;
  flex-grow: 1;
  gap: 1ch;
  margin-left: 11px;
  padding-left: 3ch;
  border-left: 2px solid $grey-medium;
}
.step:last-child > .step-body {
  border: none;
}
.step-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
}
.step.inactive .step-body,
.step.completed .step-body {
  height: 0;
  visibility: hidden;
}
.step-footer {
  display: flex;
  flex-direction: row-reverse;
  column-gap: 1ch;
}
</style>
