# Visualization Library Research for Meteorological Platform

**Date:** 2025-10-06  
**Context:** Three comparative prototypes to support visualization library selection for meteo-downscale platform

---

## 1. 2D Meteorological Field Maps

**Requirements from YU-283:**
- Render regular grid scalar fields (AI ensemble mean as default)
- Variable switching, time-based playback
- Point selection (show coordinates + nearest grid)
- Rectangle selection (preserve boundaries, valid coverage)
- Limited multi-variable overlay (precipitation+wind, temperature+wind, pressure+wind)
- Invalid grid feedback (no interpolation for missing data)

### Candidates

#### MapLibre GL JS
- **Version:** 5.0.0 (latest stable)
- **License:** BSD-3-Clause
- **Bundle size:** ~600KB (core + WebGL renderer)
- **Compatibility:** React 19 compatible (via `react-map-gl` wrapper)
- **Pros:**
  - Vector tiles + raster layer support
  - Hardware-accelerated WebGL rendering
  - Built-in camera controls (pan, zoom, rotate)
  - Good for basemap + meteorological overlay
  - Active maintenance (MapLibre community fork of Mapbox GL JS v1)
- **Cons:**
  - Requires custom shader for grid interpolation
  - Rectangle selection needs custom draw plugin
  - Learning curve for style specification
- **Sources:**
  - [MapLibre Docs](https://maplibre.org/maplibre-gl-js/docs/)
  - [npm: maplibre-gl](https://www.npmjs.com/package/maplibre-gl)

#### deck.gl
- **Version:** 9.1.0
- **License:** MIT
- **Bundle size:** ~800KB (core + layers)
- **Compatibility:** React 19 compatible (official React bindings)
- **Pros:**
  - Purpose-built for large datasets (WebGL2)
  - `GridLayer` for regular grid visualization
  - `ScatterplotLayer` for point overlays (wind vectors)
  - Animation timeline built-in
  - Integrates with MapLibre/Mapbox as basemap
- **Cons:**
  - Larger bundle size than MapLibre alone
  - Steeper learning curve (layer composition model)
  - Rectangle selection requires custom interaction layer
- **Sources:**
  - [deck.gl Docs](https://deck.gl/)
  - [npm: deck.gl](https://www.npmjs.com/package/deck.gl)

#### OpenLayers
- **Version:** 10.4.0
- **License:** BSD-2-Clause
- **Bundle size:** ~1.2MB (full build, tree-shakable to ~400KB)
- **Compatibility:** React 19 compatible (via `rlayers` wrapper)
- **Pros:**
  - Mature library (20+ years)
  - Native grid/raster support (`ImageLayer`, `TileLayer`)
  - Built-in draw/modify interactions (rectangle selection)
  - Supports WMS/WCS for meteorological data services
- **Cons:**
  - Larger bundle size (Canvas 2D rendering by default)
  - Less modern API compared to MapLibre/deck.gl
  - WebGL support exists but not default
- **Sources:**
  - [OpenLayers Docs](https://openlayers.org/)
  - [npm: ol](https://www.npmjs.com/package/ol)

### Recommendation: **MapLibre GL JS + deck.gl (hybrid)**

**Rationale:**
- MapLibre provides basemap + camera controls (600KB)
- deck.gl's `GridLayer` handles meteorological field rendering efficiently (200KB incremental)
- Combined bundle ~800KB is acceptable for specialized scientific platform
- Hardware acceleration critical for time-series animation (YU-283 playback requirement)
- MapLibre Draw plugin covers rectangle selection
- Both actively maintained with React 19 compatibility

**Why not OpenLayers:**
- Larger bundle for similar features
- Canvas 2D rendering slower for animation playback
- Less modern developer experience

---

## 2. 3D Terrain + Cross-Section

**Requirements from YU-284:**
- DEM elevation + surface meteorological field overlay
- Surface point click (actual grid values)
- Line segment sampling (~3km intervals, endpoints included)
- Sample to nearest grid, merge consecutive duplicates, break on invalid segments
- Vertical exaggeration control
- No volumetric atmosphere (surface only)

### Candidates

#### Three.js
- **Version:** 0.172.0
- **License:** MIT
- **Bundle size:** ~600KB (core)
- **Compatibility:** React 19 compatible (via `@react-three/fiber`)
- **Pros:**
  - Full control over 3D scene (camera, lighting, materials)
  - `PlaneGeometry` for DEM mesh generation
  - Custom vertex shaders for height displacement
  - Excellent React integration via R3F
  - Large ecosystem (drei helpers, postprocessing)
- **Cons:**
  - Requires manual DEM → mesh conversion
  - No built-in geospatial projection handling
  - Line sampling logic fully custom
- **Sources:**
  - [Three.js Docs](https://threejs.org/docs/)
  - [npm: three](https://www.npmjs.com/package/three)
  - [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

#### deck.gl (3D)
- **Version:** 9.1.0
- **License:** MIT
- **Bundle size:** ~800KB (core + 3D layers)
- **Compatibility:** React 19 compatible
- **Pros:**
  - `TerrainLayer` for DEM visualization
  - `PathLayer` for cross-section line
  - Integrated with MapLibre 3D basemap
  - Handles large point clouds efficiently
  - Built-in terrain mesh generation from elevation tiles
- **Cons:**
  - Less flexible than Three.js for custom 3D scenes
  - Terrain layer requires tiled elevation data (not raw DEM grid)
  - Limited control over lighting/materials
- **Sources:**
  - [deck.gl TerrainLayer](https://deck.gl/docs/api-reference/geo-layers/terrain-layer)

#### CesiumJS
- **Version:** 1.127.0
- **License:** Apache 2.0
- **Bundle size:** ~15MB (full build, includes Cesium Ion assets)
- **Compatibility:** React 19 compatible (via `resium` wrapper)
- **Pros:**
  - Production-grade geospatial 3D engine
  - Built-in terrain providers (Cesium World Terrain, custom DEM)
  - WGS84 ellipsoid + geospatial projections
  - High-quality rendering (shadows, atmosphere)
- **Cons:**
  - **Massive bundle size** (15MB unacceptable for web app)
  - Overkill for surface-only visualization (designed for globe-scale)
  - Requires Cesium Ion account for default terrain (vendor lock-in)
  - Heavy runtime performance overhead
- **Sources:**
  - [CesiumJS Docs](https://cesium.com/learn/cesiumjs/ref-doc/)
  - [npm: cesium](https://www.npmjs.com/package/cesium)

### Recommendation: **Three.js + @react-three/fiber**

**Rationale:**
- Full control over DEM mesh generation (YU-284 requires custom sampling logic)
- 600KB bundle size vs 15MB for Cesium (critical for web delivery)
- React Three Fiber provides excellent React 19 integration
- Surface-only visualization doesn't need Cesium's globe features
- Custom line sampling (~3km intervals, nearest grid) requires manual control anyway
- Vertical exaggeration trivial with vertex shaders

**Why not deck.gl:**
- TerrainLayer expects tiled elevation data, not raw DEM grids
- Less flexibility for custom cross-section sampling

**Why not Cesium:**
- 25x larger bundle size for features we don't use (globe, atmosphere, WGS84)
- Vendor lock-in to Cesium Ion for terrain data

---

## 3. Charts & Time Series

**Requirements from YU-286 & YU-288:**
- Multi-member time series (10 ensemble members)
- Ensemble mean + spread bands (not confidence intervals)
- Threshold counts (e.g., wind >10 m/s: 7/10 members)
- Cross-cycle evolution (fixed valid time, different init times)
- EC baseline comparison per row
- No silent failures (invalid data → explicit gaps)

### Candidates

#### ECharts
- **Version:** 5.6.0
- **License:** Apache 2.0
- **Bundle size:** ~900KB (full build, tree-shakable to ~300KB)
- **Compatibility:** React 19 compatible (via `echarts-for-react`)
- **Pros:**
  - Rich chart types (line, area, scatter, heatmap)
  - Built-in timeline component (slider for cycle selection)
  - `markLine` for threshold indicators
  - Animation support (smooth transitions)
  - Large user base in scientific computing
- **Cons:**
  - Imperative API (not React-native)
  - Larger bundle than Recharts
  - Configuration-heavy (steep learning curve)
- **Sources:**
  - [ECharts Docs](https://echarts.apache.org/en/index.html)
  - [npm: echarts](https://www.npmjs.com/package/echarts)

#### Recharts
- **Version:** 2.15.2
- **License:** MIT
- **Bundle size:** ~400KB
- **Compatibility:** React 19 compatible
- **Pros:**
  - Declarative React components (`<LineChart>`, `<Area>`)
  - Smaller bundle than ECharts
  - Good for standard time series + area bands
  - Tooltip/legend built-in
  - Active maintenance (11M weekly downloads)
- **Cons:**
  - Limited customization vs ECharts
  - No built-in timeline slider (need custom component)
  - Threshold annotations require custom `ReferenceLine`
- **Sources:**
  - [Recharts Docs](https://recharts.org/)
  - [npm: recharts](https://www.npmjs.com/package/recharts)

#### visx
- **Version:** 3.12.0
- **License:** MIT
- **Bundle size:** ~200KB (tree-shakable primitives)
- **Compatibility:** React 19 compatible
- **Pros:**
  - Low-level React + D3 primitives (scales, axes, shapes)
  - Maximum flexibility for custom visualizations
  - Tree-shakable (import only what you need)
  - Good TypeScript support
- **Cons:**
  - Requires more manual work (no pre-built chart components)
  - Steeper learning curve than Recharts
  - Less out-of-the-box features
- **Sources:**
  - [visx Docs](https://airbnb.io/visx/)
  - [npm: @visx/visx](https://www.npmjs.com/package/@visx/visx)

#### uPlot
- **Version:** 1.6.31
- **License:** MIT
- **Bundle size:** ~45KB (smallest)
- **Compatibility:** React 19 compatible (via `uplot-react`)
- **Pros:**
  - **Tiny bundle size** (45KB vs 400KB for Recharts)
  - High performance (Canvas-based, handles 100K+ points)
  - Good for real-time data streaming
  - Minimal API surface
- **Cons:**
  - Limited customization (designed for speed, not flexibility)
  - No built-in spread bands (requires custom series)
  - Imperative API (not React-native)
  - Smaller ecosystem than ECharts/Recharts
- **Sources:**
  - [uPlot Docs](https://github.com/leeoniya/uPlot)
  - [npm: uplot](https://www.npmjs.com/package/uplot)

### Recommendation: **Recharts**

**Rationale:**
- Declarative React API matches project stack (React 19)
- 400KB bundle acceptable for scientific platform
- Built-in support for area bands (spread visualization, YU-286)
- `ComposedChart` handles multi-member lines + threshold annotations
- Good documentation + large community (11M weekly downloads)
- Easier to maintain than visx (pre-built components) or ECharts (imperative API)

**Why not ECharts:**
- Larger bundle (900KB full, 300KB tree-shaken)
- Imperative API less idiomatic in React 19 codebase

**Why not visx:**
- Too low-level for standard time series (would reinvent Recharts)
- Better suited for novel visualizations (not needed here)

**Why not uPlot:**
- Too minimal (no spread bands, limited customization)
- Canvas-based (harder to integrate with React state)
- Performance advantage irrelevant (meteorological data <1K points per series)

---

## Summary Table

| Visualization Type | Recommended Library | Bundle Size | License | Key Reason |
|--------------------|---------------------|-------------|---------|------------|
| **2D Meteorological Maps** | MapLibre + deck.gl | ~800KB | BSD-3 + MIT | Hardware-accelerated grid rendering, animation support |
| **3D Terrain + Cross-Section** | Three.js + R3F | ~600KB | MIT | Full control over DEM mesh, custom sampling logic |
| **Charts & Time Series** | Recharts | ~400KB | MIT | Declarative React API, built-in spread bands |

**Total estimated bundle impact:** ~1.8MB (acceptable for specialized scientific platform)

**All libraries:**
- ✅ Next 16 + React 19 compatible
- ✅ Actively maintained (2024-2025 releases)
- ✅ MIT or BSD licenses (no copyleft restrictions)
- ✅ TypeScript support

---

**Next Steps:**
1. Build three comparative prototypes (one per visualization type)
2. Validate against YU-283, YU-284, YU-286, YU-288 constraints
3. Document findings + final recommendation per prototype
