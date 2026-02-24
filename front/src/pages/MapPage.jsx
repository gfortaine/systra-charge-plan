import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  Card,
  CardContent,
  CardHeader,
} from '@mui/material'
import { useTranslation } from '@src/lioness'
import { mapboxPublicKey } from '@src/config.js'

export default function MapPage() {
  const mapRef = useRef()
  const mapContainerRef = useRef()
  const { t } = useTranslation()

  useEffect(() => {
    mapboxgl.accessToken = mapboxPublicKey
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
    })
    map.addControl(new mapboxgl.NavigationControl())
    map.on('style.load', () => {
      map.setFog({}) // Set the default atmosphere style
    })
    mapRef.current = map
    return () => {
      mapRef.current.remove()
    }
  }, [])

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
      <Card elevation="5" className="map-legend">
        <CardHeader title={t('Map legend')} />
        <CardContent>
          Here is a space to show some infos.
        </CardContent>
      </Card>
    </>
  )
}
