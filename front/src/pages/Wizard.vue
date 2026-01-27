<script>
import { useIndexStore } from '@src/store'
import Stepper from '@comp/stepper/Stepper.vue'
import Step1 from '@comp/stepper/step1/Step1.vue'
import Step2 from '@comp/stepper/step2/Step2.vue'

export default {
  name: 'Wizard',
  components: {
    Stepper,
    Step1,
    Step2,
  },
  data () {
    return {
      currentStep: 1,
    }
  },
  mounted () {
    const store = useIndexStore()
    store.changeRoute(this.$options.name)
  },
  methods: {
    goToStep (step) {
      this.currentStep = step
    },
  },
}
</script>
<template>
  <section class="view">
    <Stepper
      v-model:current-step="currentStep"
      :max-steps="2"
      class="card"
    >
      <template #header-1>
        {{ $gettext('First Step') }}
      </template>
      <template #content-1>
        <Step1 />
      </template>
      <template #footer-1>
        <v-btn
          color="primary"
          append-icon="fas fa-arrow-right"
          @click="goToStep(2)"
        >
          {{ $gettext('Next step') }}
        </v-btn>
      </template>
      <template #header-2>
        {{ $gettext('Second Step') }}
      </template>
      <template #content-2>
        <Step2 />
      </template>
    </Stepper>
  </section>
</template>
