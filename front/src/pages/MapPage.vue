<script>
import { LngLatBounds } from 'mapbox-gl'
import { MapboxMap, MapboxNavigationControl, MapboxMarker } from '@studiometa/vue-mapbox-gl'
import { mapboxPublicKey } from '@src/config'
import pkPoints from '@static/markers.json'
import line from '@static/line.json'
import { useIndexStore } from '@src/store'
import colorShades from '@scss/sds-design-system/color-shades'

export default {
  name: 'MapPage',
  components: {
    MapboxMap,
    MapboxNavigationControl,
    MapboxMarker,
  },
  data () {
    return {
      map: null,
      showLeftPanel: false,
      showLeftPanelContent: false,
      checkPk: true,
      checkLine: true,
      points: pkPoints.features,
      mapboxPublicKey: null,
      line: {},
    }
  },
  watch: {
    showLeftPanel (val) {
      if (val) {
        // Leave time for animation to end (.fade-enter-active css rule)
        setTimeout(() => {
          this.showLeftPanelContent = true
        }, 500)
      } else {
        this.showLeftPanelContent = false
      }
    },
  },
  created () {
    this.mapboxPublicKey = mapboxPublicKey
    this.line = line
  },
  mounted () {
    const store = useIndexStore()
    store.changeRoute(this.$options.name)
  },
  methods: {
    toggleShowLeftPanel () {
      this.showLeftPanel = !this.showLeftPanel
    },
    onCheckLine (newValue) {
      const opacity = newValue ? 1 : 0
      this.map.setPaintProperty('line-layer', 'line-opacity', opacity)
    },
    initializeMap () {
      this.map.addSource('myLine', {
        type: 'geojson',
        data: line,
      })
      this.map.addLayer({
        id: 'line-layer',
        type: 'line',
        source: 'myLine',
        paint: {
          'line-color': colorShades.primary,
          'line-width': 3,
        },
      })
      this.$watch('checkLine', this.onCheckLine)
    },
    onMapLoaded (event) {
      const bounds = new LngLatBounds()
      this.line.features[0].geometry.coordinates.forEach(coord => {
        bounds.extend(coord)
      })
      event.fitBounds(bounds, { padding: 100 })
      this.map = event
      this.map.on('load', this.initializeMap)
    },
  },
}
</script>
<template>
  <section class="map-view">
    <div
      class="left-panel elevation-4"
      :style="{'width': showLeftPanel ? '20%' : '0'}"
    >
      <div
        class="left-panel-toggle-btn elevation-4"
        :style="{'left': showLeftPanel ? 'calc(20%)' : '0px'}"
        @click="toggleShowLeftPanel"
      >
        <v-icon
          size="small"
          color="secondary"
        >
          {{ showLeftPanel ? 'fas fa-chevron-left' : 'fas fa-chevron-right' }}
        </v-icon>
      </div>
      <Transition name="slide-fade">
        <div v-show="showLeftPanelContent">
          <div class="left-panel-title">
            {{ $gettext('Legend') }}
          </div>
          <v-col class="left-panel-content">
            <v-checkbox
              v-model="checkPk"
              :label="$gettext('Markers')"
              color="primary"
              hide-details
            />
            <v-checkbox
              v-model="checkLine"
              :label="$gettext('Line')"
              color="primary"
              hide-details
            />
          </v-col>
        </div>
      </Transition>
    </div>
    <MapboxMap
      style="width: 100%; height: 100%; position:absolute;"
      :access-token="mapboxPublicKey"
      map-style="mapbox://styles/mapbox/light-v9"
      @mb-created="onMapLoaded"
    >
      <MapboxNavigationControl position="bottom-right" />
      <template v-if="checkPk">
        <MapboxMarker
          v-for="(point, index) in points"
          :key="`marker-${index}`"
          :lng-lat="point.geometry.coordinates"
          color="secondary"
          popup
        >
          <div class="pk-marker" />
          <template #popup>
            <div>
              {{ $gettext('Pk:') }} {{ point.properties.pk }}
            </div>
          </template>
        </MapboxMarker>
      </template>
    </MapboxMap>
  </section>
</template>
<style lang="scss" scoped>
.map-view {
  height: calc(100% - 50px);
  width: 100%;
  display: flex;
}
.left-panel {
  height: 100%;
  background-color: $white;
  transition: 0.3s;
  z-index: 20;
}
.left-panel-toggle-btn {
  position: absolute;
  left: 100%;
  width: 25px;
  z-index: 1;
  background-color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  transition: 0.3s;
  cursor: pointer;
}
.left-panel-title {
  height: 50px;
  line-height: 55px;
  padding-left: 20px;
  font-size: 1.1em;
  margin-bottom: 10px;
}
.left-panel-content {
  margin-left: 20px
}
.pk-marker {
  width: 15px;
  height: 15px;
  border-radius: 20px;
  background-color: $secondary;
}
</style>
