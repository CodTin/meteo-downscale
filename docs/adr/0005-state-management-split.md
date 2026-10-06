# State Management Split: TanStack Query + Zustand + useState

We split state by concern across three layers:

- **TanStack Query** for server state: API data fetching, automatic caching, background refetching, optimistic updates, and SSR support
- **Zustand** (1.2KB) for shared client state: the 6-dimensional analysis context (周期/时刻/变量/位置/逐时效批次) that's shared across analysis sub-pages but doesn't persist on the server
- **useState** for truly local component state: UI toggles, form inputs, ephemeral interactions

This explicitly rejects Redux Toolkit (8KB, 7x larger than Zustand with unnecessary boilerplate). The three-tier split matches React's composition model: server concerns stay in TanStack Query, cross-component coordination uses Zustand, and local state stays local.

## Consequences

Navigation logic must distinguish between analysis context (stored in Zustand, preserved across page transitions within the analysis flow) and catalog/operations state (fetched fresh via TanStack Query on each page entry). The Global Framework Navigation spec's Context Preservation rules define these boundaries.
