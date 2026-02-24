import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './MapPage.css'
import { mapboxPublicKey } from '@src/config'

export default function MapPage() {
  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = mapboxPublicKey
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
    })

    return () => {
      mapRef.current.remove()
    }
  }, [])

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
    </>
  )
}
