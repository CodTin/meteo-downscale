# MapLibre GL JS + deck.gl for 2D Meteorological Maps

We chose **MapLibre GL JS + deck.gl** (~800KB total: 600KB MapLibre + 200KB deck.gl) for hardware-accelerated WebGL rendering of meteorological field maps. The `map-2d` prototype validates this stack handles variable switching, time-based playback animation, point selection with coordinate/value inspection, and invalid grid exclusion smoothly. Hardware acceleration is essential for animating dense regular grids without frame drops.

This explicitly rejects OpenLayers (larger bundle, slower Canvas rendering) for performance reasons and serves requirement YU-283 (variable switching, playback, point/rectangle selection).

## Considered Options

- **OpenLayers**: Rejected due to larger bundle size and Canvas-based rendering (slower than WebGL for dense grids)
- **Leaflet + custom WebGL layer**: Rejected due to lack of built-in hardware acceleration and higher implementation complexity
