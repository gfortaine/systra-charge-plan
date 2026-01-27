<script>
import { addPostRoute } from '@src/router'

export default {
  name: 'WelcomePanel',
  methods: {
    onAddPost () {
      this.$router.push({ name: addPostRoute.name })
    },
  },
}
</script>
<template>
  <section class="card welcome-panel">
    <div class="welcome-subtitle">
      {{ $gettext('Welcome to') }}
    </div>
    <div class="welcome-title">
      Myapp
    </div>
    <p class="welcome-text">
      {{ $gettext("Select a blog post in the list, or create a new one!") }}
    </p>
    <v-btn
      color="primary"
      class="welcome-btn"
      prepend-icon="fas fa-plus"
      size="large"
      @click="onAddPost"
    >
      {{ $gettext('Create a new blog post') }}
    </v-btn>
    <img
      class="welcome-icon"
      src="@static/icon_circle_-full_name.png"
    >
  </section>
</template>
<style lang="scss" scoped>
.welcome-panel {
  max-width: 40%;
  overflow: auto;
}
.welcome-title {
  margin-bottom: 1rem;
  width: 80%
}
.first-section {
  padding-bottom: 30px;
}
.welcome-text {
  font-size: 1.2rem;
  position: relative;
  z-index: 2;
  margin-bottom: 1rem;
}
.welcome-icon {
  position: absolute;
  width: 40%;
  z-index: 1;
  opacity: 0.6;
  right: 2rem;
  bottom: 2rem;
}

@media (width <= 1400px), (height <= 850px) {
  .welcome-title {
    font-size: 3rem !important;
  }
  .welcome-subtitle {
    font-size: 1.6rem;
  }
}
</style>
