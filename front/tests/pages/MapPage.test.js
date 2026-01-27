import { describe, beforeEach, test, expect, vi, afterEach } from 'vitest'
import { clone, createTestComponent, setupCommonTest } from '@test/common'
import { LngLatBounds } from 'mapbox-gl'
import { useIndexStore } from '@src/store'
import MapPage from '@page/MapPage.vue'
import { mapboxPublicKey } from '@src/config'
import pkPoints from '@static/markers.json'
import line from '@static/line.json'

vi.mock('mapbox-gl', () => {
  let LngLatBounds = vi.fn()
  LngLatBounds.prototype = {
    extend: vi.fn(),
  }
  return {
    default: vi.fn(),
    LngLatBounds,
  }
})

vi.mock('@studiometa/vue-mapbox-gl', () => {
  class MapboxMap {}
  class MapboxNavigationControl {}
  class MapboxMarker {}
  return {
    default: vi.fn(),
    MapboxMap,
    MapboxNavigationControl,
    MapboxMarker,
  }
})

describe('MapPage', () => {
  const options = setupCommonTest(beforeEach, afterEach, false)
  let Comp
  let wrapper
  let store

  beforeEach(async () => {
    Comp = clone(MapPage)
    expect(Comp).toBeDefined()
    store = useIndexStore()
    wrapper = await createTestComponent(Comp, options, {})
  })

  describe('Definition', () => {
    test('should have been initialized', async () => {
      expect(wrapper.vm.map).toEqual(null)
      expect(wrapper.vm.showLeftPanel).toEqual(false)
      expect(wrapper.vm.showLeftPanelContent).toEqual(false)
      expect(wrapper.vm.checkPk).toEqual(true)
      expect(wrapper.vm.checkLine).toEqual(true)
      expect(wrapper.vm.points).toEqual(pkPoints.features)
      expect(wrapper.vm.mapboxPublicKey).toEqual(mapboxPublicKey)
      expect(wrapper.vm.line).toEqual(line)
      expect(wrapper.find('.map-view').exists()).toBe(true)
      expect(store.route).toEqual('MapPage')
    })
  })

  describe('Watchers', () => {
    describe('showLeftPanel', () => {
      test('should show left panel content after 0.5s', async () => {
        vi.useFakeTimers()
        await wrapper.setData({ showLeftPanel: true })
        return wrapper.vm.$nextTick().then(() => {
          vi.advanceTimersByTime(400)
          expect(wrapper.vm.showLeftPanelContent).toBe(false)
          vi.advanceTimersByTime(100)
          expect(wrapper.vm.showLeftPanelContent).toBe(true)
        })
      })
      test('should hide left panel content', async () => {
        await wrapper.setData({ showLeftPanel: true })
        await wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.showLeftPanelContent).toBe(false)
        })
      })
    })
  })

  describe('Methods', () => {
    test('toggleShowLeftPanel', () => {
      const vm = { showLeftPanel: false }
      Comp.methods.toggleShowLeftPanel.bind(vm)()
      expect(vm.showLeftPanel).toEqual(true)
      Comp.methods.toggleShowLeftPanel.bind(vm)()
      expect(vm.showLeftPanel).toEqual(false)
    })
    test('onCheckLine', () => {
      const vm = {
        map: {
          setPaintProperty: vi.fn(),
        },
      }
      Comp.methods.onCheckLine.bind(vm)(true)
      expect(vm.map.setPaintProperty).toHaveBeenCalledWith('line-layer', 'line-opacity', 1)
      Comp.methods.onCheckLine.bind(vm)(false)
      expect(vm.map.setPaintProperty).toHaveBeenCalledWith('line-layer', 'line-opacity', 0)
    })
    test('initializeMap', () => {
      const vm = {
        map: {
          addSource: vi.fn(),
          addLayer: vi.fn(),
        },
        $watch: vi.fn(),
        onCheckLine: vi.fn(),
      }
      Comp.methods.initializeMap.bind(vm)()
      expect(vm.map.addSource).toHaveBeenCalledWith('myLine', {
        type: 'geojson',
        data: line,
      })
      expect(vm.map.addLayer).toHaveBeenCalledWith({
        id: 'line-layer',
        type: 'line',
        source: 'myLine',
        paint: {
          'line-color': '#5B5FC7',
          'line-width': 3,
        },
      })
      expect(vm.$watch).toHaveBeenCalledWith('checkLine', vm.onCheckLine)
    })
    test('onMapLoaded', () => {
      const vm = {
        line: {
          features: [{
            geometry: {
              coordinates: [[1, 1], [2, 2]],
            },
          }],
        },
        initializeMap: vi.fn(),
      }
      const event = {
        fitBounds: vi.fn(),
        on: vi.fn().mockResolvedValue(),
      }
      Comp.methods.onMapLoaded.bind(vm)(event)
      expect(vm.map).toEqual(event)
      expect(LngLatBounds.prototype.extend).toHaveBeenCalledTimes(2)
      expect(LngLatBounds.prototype.extend).toHaveBeenCalledWith([1, 1])
      expect(LngLatBounds.prototype.extend).toHaveBeenCalledWith([2, 2])
      expect(event.fitBounds).toHaveBeenCalledWith(expect.any(LngLatBounds), { padding: 100 })
      expect(event.on).toHaveBeenCalledWith('load', vm.initializeMap)
    })
  })
})
