import { Viewer, Globe } from 'resium'
import * as Cesium from 'cesium'

Cesium.Ion.defaultAccessToken = ''

const baseLayer = Cesium.ImageryLayer.fromProviderAsync(
  Cesium.TileMapServiceImageryProvider.fromUrl(
    Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII'),
  ),
)

export default function GlobeTab() {
  return (
    <div style={{ height: '70vh', borderRadius: 8, overflow: 'hidden' }}>
      <Viewer
        full={false}
        style={{ width: '100%', height: '100%' }}
        baseLayer={baseLayer}
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
        <Globe enableLighting />
      </Viewer>
    </div>
  )
}
