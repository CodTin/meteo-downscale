# Three.js + @react-three/fiber for 3D Terrain Visualization

We chose **Three.js + @react-three/fiber** (~600KB) for DEM mesh generation and meteorological field overlays. The `terrain-3d` prototype validates this stack handles vertex displacement from elevation data, meteorological field overlays via vertex colors, ~3km transect sampling along user-drawn lines, vertical exaggeration control, and cross-section profile visualization with React 19 integration.

This explicitly rejects CesiumJS (15MB bundle, 25x larger) because requirement YU-284 specifies surface-only visualization that doesn't need Cesium's globe features, satellite imagery, or multi-resolution terrain streaming. The 600KB vs 15MB trade-off is decisive for initial page load performance.

## Considered Options

- **CesiumJS**: Rejected due to 15MB bundle size for features we don't need (globe rendering, satellite imagery, multi-resolution streaming)
- **Mapbox GL JS 3D terrain**: Rejected due to lack of custom cross-section sampling control and vendor lock-in concerns
