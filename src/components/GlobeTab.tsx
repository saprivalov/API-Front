import { useEffect, useRef, useState } from 'react'
import { Viewer, Globe } from 'resium'
import * as Cesium from 'cesium'

export default function GlobeTab() {
  const viewerRef = useRef<{ cesiumElement: Cesium.Viewer } | null>(null)
  const [imageryProvider, setImageryProvider] =
    useState<Cesium.TileMapServiceImageryProvider | null>(null)

  useEffect(() => {
    Cesium.TileMapServiceImageryProvider.fromUrl(
      Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII'),
    ).then(setImageryProvider)
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer || !imageryProvider) return

    viewer.scene.globe.enableLighting = true
    if (viewer.scene.skyAtmosphere) {
      viewer.scene.skyAtmosphere.show = true
    }
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(0, 20, 20_000_000),
    })
    viewer.imageryLayers.removeAll()
    viewer.imageryLayers.addImageryProvider(imageryProvider)
  }, [imageryProvider])

  return (
    <div style={{ height: '70vh', borderRadius: 8, overflow: 'hidden' }}>
      <Viewer
        ref={viewerRef}
        full={false}
        style={{ width: '100%', height: '100%' }}
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        navigationHelpButton={false}
        homeButton={false}
        sceneModePicker={false}
        geocoder={false}
        fullscreenButton={false}
        infoBox={false}
        selectionIndicator={false}
      >
        <Globe />
      </Viewer>
    </div>
  )
}
