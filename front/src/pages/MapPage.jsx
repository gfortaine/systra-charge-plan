import { useEffect, useCallback, useRef, useState } from 'react'
import MapboxGL from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Slide,
  Stack,
  Typography,
} from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import pkPoints from '@static/markers.json'
import line from '@static/line.json'
import colorShades from '@scss/color-shades'
import { useI18n, T } from '@src/i18n'
import { mapboxPublicKey } from '@src/config'
import './MapPage.scoped.scss'
import './MapPage.scss'

export default function MapPage() {
  const { t } = useI18n()
  const mapRef = useRef() // Mapbox instance
  const mapContainerRef = useRef() // DOM element for Mapbox
  const [showPanel, setShowPanel] = useState(false)
  const [panelContentVisible, setPanelContentVisible] = useState(false)
  const [showMarkers, setShowMarkers] = useState(true)
  const [showLine, setShowLine] = useState(true)
  const togglePanel = () => setShowPanel(shown => !shown)
  const fitLineBounds = useCallback(map => {
    const bounds = new MapboxGL.LngLatBounds()
    line.features[0].geometry.coordinates.forEach(coord => {
      bounds.extend(coord)
    })
    map.fitBounds(bounds, { padding: 100 })
  }, [])
  const drawMarkers = useCallback((map, showMarkers, showLine) => {
    map.setPaintProperty('line-layer', 'line-opacity', showLine ? 1 : 0)
    if (map._pkMarkers) { // Remove previous markers if any
      map._pkMarkers.forEach(m => m.remove())
    }
    if (showMarkers) {
      const markers = pkPoints.features.map(point => {
        const el = document.createElement('div')
        el.className = 'map-pk-marker'
        const marker = new MapboxGL.Marker({ element: el, color: colorShades.secondary })
          .setLngLat(point.geometry.coordinates)
          .setPopup(
            new MapboxGL.Popup({ offset: 25 }).setHTML(
              `<div>${t('Pk:')} ${point.properties.pk}</div>`,
            ),
          )
        marker.addTo(map)
        return marker
      })
      map._pkMarkers = markers
    }
  }, [t])
  useEffect(() => { /* Map Init */
    if (!mapRef.current) { // Create map only once
      MapboxGL.accessToken = mapboxPublicKey
      const map = new MapboxGL.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v9',
        center: [0, 0],
        zoom: 2,
      })
      map.addControl(new MapboxGL.NavigationControl(), 'bottom-right')
      map.on('style.load', () => {
        map.setFog({}) // Set the default atmosphere style
      })
      map.on('load', () => {
        map.addSource('myLine', {
          type: 'geojson',
          data: line,
        })
        map.addLayer({
          id: 'line-layer',
          type: 'line',
          source: 'myLine',
          paint: {
            'line-color': colorShades.primary,
            'line-width': 3,
            'line-opacity': 1,
          },
        })
        drawMarkers(map, true, true)
        fitLineBounds(map)
      })
      mapRef.current = map
    }
  }, [drawMarkers, fitLineBounds])
  useEffect(() => { // react to checkbox changes
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) {
      return
    }
    drawMarkers(map, showMarkers, showLine)
  }, [drawMarkers, showMarkers, showLine])
  useEffect(() => {
    setPanelContentVisible(showPanel)
  }, [showPanel])
  return (
    <Box className="map-view">
      <Paper
        elevation="4"
        className="left-panel"
        sx={{ width: showPanel ? 'auto' : '25px' }}
      >
        <Button
          className="toggle-btn"
          sx={{
            left: showPanel ? 'auto' : 0,
            right: showPanel ? 0 : 'auto',
          }}
          onClick={togglePanel}
        >
          {showPanel ? <ChevronLeft /> : <ChevronRight />}
        </Button>
        <Slide direction="right" in={panelContentVisible} mountOnEnter unmountOnExit>
          <Box sx={{ p: 2, mt: 6 }}>
            <Typography variant="h6" gutterBottom>
              <T>Legend</T>
            </Typography>
            <Stack>
              <FormControlLabel
                label={t('Markers')}
                control={<Checkbox checked={showMarkers} onChange={(e) => setShowMarkers(e.target.checked)} />}
              />
              <FormControlLabel
                label={t('Line')}
                control={<Checkbox checked={showLine} onChange={(e) => setShowLine(e.target.checked)} />}
              />
            </Stack>
          </Box>
        </Slide>
      </Paper>
      <Box ref={mapContainerRef} className="map" />
    </Box>
  )
}
