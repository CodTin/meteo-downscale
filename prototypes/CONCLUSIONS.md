# Visualization Library Prototypes - Summary

**Created:** 2025-10-06  
**Purpose:** Support visualization library selection decisions for meteo-downscale platform

---

## Executive Summary

Three throwaway prototypes have been created to evaluate visualization libraries:

### 1. 2D Meteorological Field Map
**Prototype:** `/app/prototypes/map-2d/page.tsx`  
**URL:** http://localhost:3000/prototypes/map-2d

**Recommendation:** ✅ **MapLibre GL JS + deck.gl**
- MapLibre (600KB) for basemap + camera controls
- deck.gl GridLayer (200KB) for efficient meteorological field rendering
- Total: ~800KB bundle
- Hardware-accelerated WebGL for smooth playback animation
- Meets YU-283 requirements: variable switching, time playback, point/rectangle selection, invalid grid handling

**Why not OpenLayers:** Larger bundle (~1.2MB), Canvas 2D rendering slower for animation

---

### 2. 3D Terrain + Cross-Section
**Prototype:** `/app/prototypes/terrain-3d/page.tsx`  
**URL:** http://localhost:3000/prototypes/terrain-3d

**Recommendation:** ✅ **Three.js + @react-three/fiber**
- 600KB bundle (vs 15MB for CesiumJS)
- Full control over DEM mesh generation + custom sampling
- React Three Fiber = excellent React 19 integration
- Custom ~3km transect sampling with nearest grid lookup
- Meets YU-284 requirements: DEM overlay, line sampling, vertical exaggeration, invalid segment handling

**Why not CesiumJS:** 25x larger bundle for globe features we don't need (surface-only visualization)  
**Why not deck.gl:** TerrainLayer expects tiled data, not raw DEM grids; less flexibility for custom sampling

---

### 3. Charts & Time Series
**Prototype:** `/app/prototypes/charts/page.tsx`  
**URL:** http://localhost:3000/prototypes/charts

**Recommendation:** ✅ **Recharts**
- 400KB bundle
- Declarative React API (idiomatic for React 19)
- Built-in area bands for ensemble spread visualization
- ComposedChart handles multi-member lines + threshold annotations
- Meets YU-286 & YU-288 requirements: 10 members, spread bands, threshold counts, cross-cycle evolution

**Why not ECharts:** Larger bundle (900KB), imperative API less React-native  
**Why not visx:** Too low-level, would reinvent Recharts for standard charts  
**Why not uPlot:** Too minimal (45KB but no spread bands, limited customization)

---

## Combined Stack Recommendation

| Visualization | Library | Bundle Size | Rationale |
|---------------|---------|-------------|-----------|
| 2D Maps | MapLibre + deck.gl | ~800KB | Hardware acceleration, grid rendering efficiency |
| 3D Terrain | Three.js + R3F | ~600KB | Custom DEM mesh, sampling control, React integration |
| Charts | Recharts | ~400KB | Declarative React, built-in spread bands, maintainability |

**Total Impact:** ~1.8MB (acceptable for specialized scientific platform)

**All selections:**
- ✅ Next 16 + React 19 compatible
- ✅ MIT or BSD licenses
- ✅ Actively maintained (2024-2025 releases)
- ✅ TypeScript support

---

## Validation Against Requirements

### YU-283 (2D Map) ✅
- ✅ Regular grid scalar field rendering
- ✅ Variable switching
- ✅ Time-based playback (hardware-accelerated)
- ✅ Point selection (show coordinates + nearest grid)
- ✅ Rectangle selection capability (maplibre-gl-draw)
- ✅ Invalid grid feedback (no interpolation)
- ✅ Multi-variable overlay support (wind vectors via deck.gl IconLayer)

### YU-284 (3D Terrain) ✅
- ✅ DEM + surface meteorological field overlay
- ✅ ~3km transect sampling
- ✅ Nearest grid lookup
- ✅ Merge consecutive duplicate grids
- ✅ Break on invalid segments (no interpolation)
- ✅ Vertical exaggeration control
- ✅ Surface-only (not volumetric atmosphere)

### YU-286 (Charts - Ensemble) ✅
- ✅ Multi-member time series (10 members)
- ✅ Ensemble mean + spread bands (not confidence intervals)
- ✅ Threshold exceedance counts (strict > comparison)
- ✅ Count/10 format (not percentage)
- ✅ Missing data shown as gaps (connectNulls=false)
- ✅ If any member invalid → all metrics NULL (not 7/8 adjusted)

### YU-288 (Cross-Cycle) ✅
- ✅ Fixed valid time, variable lead across cycles
- ✅ Each row uses own EC baseline (not averaged)
- ✅ Common valid mask for spatial comparison
- ✅ Don't misinterpret AI−EC as "improvement"

---

## Running the Prototypes

```bash
# Start dev server
bun run dev

# Visit prototypes
open http://localhost:3000/prototypes/map-2d
open http://localhost:3000/prototypes/terrain-3d
open http://localhost:3000/prototypes/charts
```

---

## Next Steps

1. **Test prototypes** against actual DEM/meteorological data samples
2. **Document decisions** in Linear issues (YU-283, YU-284, YU-286)
3. **Install recommended libraries** for production:
   ```bash
   bun add maplibre-gl react-map-gl deck.gl
   bun add three @react-three/fiber @react-three/drei
   bun add recharts
   ```
4. **Archive prototypes** to throwaway branch:
   ```bash
   git checkout -b prototypes/viz-selection-2025-10-06
   git add prototypes/ docs/research/visualization-libraries.md
   git commit -m "prototypes: visualization library selection (throwaway)"
   git push origin prototypes/viz-selection-2025-10-06
   ```
5. **Remove prototypes from main** after decisions captured

---

## References

- **Research:** `docs/research/visualization-libraries.md`
- **Linear Issues:** YU-283 (2D map), YU-284 (3D terrain), YU-286 (ensemble charts), YU-288 (cross-cycle)
- **Design System:** `docs/SHADCN_COMPONENT_MAPPING.md`
- **Product Requirements:** `docs/product-design.md`

---

**Prototypes Status:** ✅ Complete - Ready for decision-making
