<script>
export default {
  name: 'RadioAlert',
  data () {
    return {
      transport: '',
    }
  },
  computed: {
    isTransportModeClean () {
      return this.transport === 'Bus' || this.transport === 'Train'
    },
    isTransportModeNotClean () {
      return this.transport === 'Car'
    },
  },
  methods: {
    clearTransport () {
      this.transport = ''
    },
  },
}
</script>
<template>
  <div class="card">
    <h1 class="text-h6">
      {{ $gettext('Radio / Alert') }}
    </h1>
    <div class="container-question">
      <h3 class="question">
        {{ $gettext('What is your favorite mean of transport?') }}
      </h3>
      <div>
        <v-btn
          v-if="transport"
          size="small"
          class="clear-btn"
          variant="text"
          color="primarydark"
          icon="fas fa-xmark"
          @click="clearTransport"
        />
      </div>
    </div>
    <v-radio-group
      v-model="transport"
      color="primarydark"
      hide-details
    >
      <v-radio
        class="radio"
        :label="$gettext('Car')"
        value="Car"
      />
      <v-radio
        class="radio"
        :label="$gettext('Bus')"
        value="Bus"
      />
      <v-radio
        class="radio"
        :label="$gettext('Train')"
        value="Train"
      />
    </v-radio-group>
    <div>
      <v-alert
        v-if="isTransportModeClean"
        :title="$gettext('Good choice !')"
        :text="$gettext('We are glad to hear that you prefer to travel by train or bus rather than by car.')"
        border="start"
        type="success"
        :closable="true"
        @click:close="clearTransport"
      />
      <v-alert
        v-if="isTransportModeNotClean"
        :title="$gettext('Bad choice !')"
        border="start"
        type="error"
        :closable="true"
        @click:close="clearTransport"
      >
        <template #text>
          <!-- eslint-disable-next-line max-len -->
          {{ $gettext('You should think again about your answer before confirming it. We think it would be better to choose another option.') }}
        </template>
      </v-alert>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container-question {
  display: flex;
}
.question {
  color: $secondary;
}
.clear-btn {
  position: absolute;
  padding-bottom: 10px;
}
.radio {
  color: $secondary;
  font-weight : bold;
}
</style>
