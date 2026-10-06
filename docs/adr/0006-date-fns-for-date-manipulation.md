# date-fns for Date Manipulation

We chose **date-fns** for tree-shakable functional API (5-15KB typical bundle vs 17KB Luxon), native Date objects, and excellent TypeScript support. Meteorological use cases require frequent init time + lead time calculations (e.g., "2025-01-15T00Z + 72h lead time"). date-fns's pure functions and tree-shaking deliver the best balance between bundle size and developer ergonomics for time arithmetic operations.

## Considered Options

- **Luxon**: Rejected due to 17KB non-tree-shakable bundle and immutable DateTime wrapper overhead
- **Day.js**: Good alternative if bundle size becomes critical, but date-fns's TypeScript support and functional API are superior for complex calculations
