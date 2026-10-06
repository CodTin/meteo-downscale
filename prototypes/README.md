# Visualization Library Prototypes

**Purpose:** Three throwaway prototypes to support visualization library selection decisions.

**Status:** Prototype (NOT production code - will be archived after decision)

---

## Prototypes

### 1. 2D Meteorological Field Map (`map-2d-comparison/`)
- **Candidates:** MapLibre vs deck.gl vs OpenLayers
- **Test scenario:** Regular grid scalar field with variable switching, playback, point/rectangle selection
- **Run:** `bun run dev` and navigate to `/prototypes/map-2d`

### 2. 3D Terrain + Cross-Section (`terrain-3d-comparison/`)
- **Candidates:** Three.js vs deck.gl vs CesiumJS
- **Test scenario:** DEM overlay with surface field, ~3km transect sampling
- **Run:** `bun run dev` and navigate to `/prototypes/terrain-3d`

### 3. Charts & Time Series (`charts-comparison/`)
- **Candidates:** ECharts vs Recharts vs visx vs uPlot
- **Test scenario:** Multi-member time series + spread bands + threshold counts
- **Run:** `bun run dev` and navigate to `/prototypes/charts`

---

## Running Prototypes

All prototypes are accessible via Next.js dev server:

```bash
bun run dev
```

Then visit:
- http://localhost:3000/prototypes/map-2d
- http://localhost:3000/prototypes/terrain-3d
- http://localhost:3000/prototypes/charts

---

## Decision Capture

After testing, document final decisions in Linear issues:
- YU-283: 2D map library choice
- YU-284: 3D terrain library choice
- YU-286: Charts library choice

Archive this directory to a throwaway branch (`prototypes/viz-selection`) after decisions are committed.

---

**Created:** 2025-10-06  
**References:** YU-283, YU-284, YU-286, YU-288, docs/research/visualization-libraries.md
