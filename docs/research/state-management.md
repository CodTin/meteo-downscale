# State & Server Data Management Research

## Recommended Choices

1. **Server State / Data Fetching**: TanStack Query (React Query)
2. **Client State**: Zustand
3. **Not Recommended**: Redux Toolkit (overkill for this project's requirements)

**Rationale**: TanStack Query excels at server state synchronization with built-in caching, background refetching, and optimistic updates. Zustand provides lightweight client state management for UI state and cross-page shared context. This combination offers the best balance of features, performance, and developer experience for the 6 analysis sub-pages sharing state (周期/时刻/变量/位置/逐时效批次).

---

## Next 16 + React 19 Compatibility

### TanStack Query
- **Status**: ✅ Fully compatible with React 19 and Next.js 16
- **Version**: v5 requires React 18+, compatible with React 19
- **Server Components**: ✅ Supports advanced SSR patterns with App Router
- **App Router**: ✅ Official Next.js SSR/SSG examples available
- **Source**: [TanStack Query v5 Installation](https://tanstack.com/query/v5/docs/framework/react/installation), [Tech Insider TanStack Query Tutorial 2026](https://tech-insider.org/fr/tutoriel-tanstack-query-react-data-fetching-2026/)

### Zustand
- **Status**: ✅ Compatible with React 19 and Next.js 16
- **React Version**: Works with React 16.8+ (hooks-based)
- **Server Components**: ⚠️ Client-side only (as expected for client state)
- **Bundle Size**: 1.2KB gzipped (minimal impact)
- **Source**: [Tech Insider Zustand vs Redux 2026](https://tech-insider.org/zustand-vs-redux-2026/)

### Redux Toolkit
- **Status**: ✅ Compatible with React 19 and Next.js 16
- **Version**: Works with modern React versions
- **Bundle Size**: ~8KB gzipped (7x larger than Zustand)
- **Source**: [Tech Insider Zustand vs Redux 2026](https://tech-insider.org/zustand-vs-redux-2026/)

---

## Maintenance Activity

### TanStack Query
- **Status**: Actively maintained (formerly React Query, rebranded 2022)
- **Version**: v5 (latest major release, stable)
- **Ecosystem**: Large community, extensive documentation
- **Maintainer**: Tanner Linsley (TanStack)
- **GitHub**: Highly active development
- **Source**: [TanStack Query GitHub Releases](https://github.com/tanstack/query/releases), [TanStack Query Official Docs](https://tanstack.com/query/latest/docs)

### Zustand
- **Weekly Downloads**: 13.4M (as of 2026)
- **Growth**: Dramatic growth, closing gap with Redux Toolkit
- **Momentum**: ↗️ Rising adoption in React ecosystem
- **Maintainer**: Poimandres collective (pmndrs)
- **Source**: [Tech Insider Zustand vs Redux 2026](https://tech-insider.org/zustand-vs-redux-2026/)

### Redux Toolkit
- **Weekly Downloads**: 16.6M (as of 2026)
- **Market Position**: Institutional choice for enterprise apps
- **Trend**: → Stable adoption, slower growth than Zustand
- **Maintainer**: Redux team (official Redux)
- **Source**: [Tech Insider Zustand vs Redux 2026](https://tech-insider.org/zustand-vs-redux-2026/)

---

## Bundle Size Impact

### TanStack Query
- **Core Size**: Moderate (optimized for features provided)
- **Tree-Shaking**: ✅ Excellent, import only what you need
- **DevTools**: Separate optional package (`@tanstack/react-query-devtools`)
- **Production Impact**: Minimal when DevTools excluded

### Zustand
- **Size**: 1.2KB gzipped
- **Comparison**: 7x smaller than Redux Toolkit
- **Overhead**: Negligible bundle impact
- **Source**: [Tech Insider Zustand vs Redux Bundle Gap](https://tech-insider.org/zustand-vs-redux-2026/)

### Redux Toolkit
- **Size**: ~8KB gzipped
- **Overhead**: Includes Redux core, Immer, Redux Thunk, Reselect
- **Comparison**: 7x larger than Zustand
- **Source**: [Tech Insider Zustand vs Redux 2026](https://tech-insider.org/zustand-vs-redux-2026/)

---

## License Information

### TanStack Query
- **License**: MIT
- **Source**: [TanStack Query GitHub](https://github.com/tanstack/query)

### Zustand
- **License**: MIT
- **Source**: npm package metadata

### Redux Toolkit
- **License**: MIT
- **Source**: Redux official repository

---

## Architecture & Use Cases

### TanStack Query: Server State Management

**What is Server State?**
- Data fetched from APIs, databases, or external services
- Asynchronous, potentially out-of-date
- Requires caching, synchronization, and background updates

**Key Features:**
1. **Automatic Caching**: Intelligent cache management with configurable stale times
2. **Background Refetching**: Automatically refetch on window focus, network reconnect
3. **Optimistic Updates**: Update UI before server confirms
4. **Request Deduplication**: Multiple components requesting same data = 1 network call
5. **Pagination & Infinite Scroll**: Built-in support
6. **SSR/SSG Support**: Works with Next.js App Router server rendering
7. **DevTools**: Powerful debugging UI

**Source**: [TanStack Query Official Docs](https://tanstack.com/query/latest/docs), [MakerKit TanStack Start vs Next.js](https://makerkit.dev/blog/tutorials/tanstack-start-vs-nextjs)

**Example Use Cases for meteo-downscale:**
- Fetch cycle list from API
- Load forecast data for specific cycle/variable
- Fetch batch detail grids
- Load map tile data
- Retrieve time series data for charts

### Zustand: Client State Management

**What is Client State?**
- UI state that doesn't come from a server
- Transient, local to the application
- Doesn't require persistence across sessions (unless explicitly added)

**Key Features:**
1. **Minimal API**: Simple `create` function, no providers needed
2. **Hook-Based**: Direct integration with React hooks
3. **Mutable Updates**: Direct state mutation (Immer-like syntax optional)
4. **No Boilerplate**: No actions, reducers, or dispatch ceremony
5. **Slices Pattern**: Easy to split large stores into modules
6. **Middleware**: Optional persistence, DevTools, Immer

**Source**: [The Road to Enterprise: Zustand vs Redux](https://theroadtoenterprise.com/blog/zustand-vs-redux-toolkit)

**Example Use Cases for meteo-downscale:**
- Shared analysis context (周期/时刻/变量/位置/逐时效批次) across 6 sub-pages
- Timeline scrubber state (play/pause, current frame)
- Map viewport state (center, zoom)
- UI toggles (dark mode, show unpublished data)
- Filter selections (lead time range, ensemble members)

### Redux Toolkit: When You Don't Need It

**When Redux Makes Sense:**
- Large teams requiring strict patterns and conventions
- Time-travel debugging is critical
- Existing Redux codebase
- Need for extensive middleware ecosystem

**Why Not Recommended for This Project:**
- **Boilerplate**: Requires actions, reducers, slices (verbose)
- **Bundle Size**: 7x larger than Zustand
- **Complexity**: Overkill for 6 analysis sub-pages with shared state
- **Learning Curve**: Steeper than Zustand

**Source**: [IT Source Code: Zustand vs Redux 2026](https://itsourcecode.com/web-dev/zustand-vs-redux-toolkit-state-management-2026/)

---

## Performance Comparison

### Render Performance
- **Context API**: Re-renders all consumers on any state change (not recommended for frequent updates)
- **Zustand**: Granular subscriptions, only re-render components using changed state
- **Redux Toolkit**: Requires careful memoization (Reselect) to avoid unnecessary renders
- **TanStack Query**: Optimized for data fetching, automatic request deduplication

**Source**: [Dev.to: React State Management 2026 Benchmarks](https://dev.to/kirandeepjassalcrypto/react-state-management-in-2026-context-api-vs-redux-toolkit-vs-zustand-vs-jotai-same-cart-real-1d2a)

### Developer Experience
| Feature | TanStack Query | Zustand | Redux Toolkit |
|---------|---------------|---------|---------------|
| Boilerplate | Low | Minimal | High |
| TypeScript | Excellent | Excellent | Good |
| DevTools | ✅ Dedicated UI | ✅ Redux DevTools | ✅ Redux DevTools |
| Learning Curve | Moderate | Easy | Steep |
| SSR Support | ✅ Native | ⚠️ Client-only | ✅ With setup |

---

## State Architecture for meteo-downscale

### Recommended Split

#### 1. Server State (TanStack Query)
Use for all data from backend APIs:

```typescript
// Fetch cycle list
const { data: cycles, isLoading, error } = useQuery({
  queryKey: ['cycles', { status: 'published' }],
  queryFn: () => fetchCycles({ status: 'published' }),
  staleTime: 5 * 60 * 1000, // 5 minutes
})

// Fetch forecast data for specific cycle/variable
const { data: forecastData } = useQuery({
  queryKey: ['forecast', cycleId, variableId, leadTime],
  queryFn: () => fetchForecastData(cycleId, variableId, leadTime),
  enabled: !!cycleId && !!variableId, // Only fetch when IDs available
})
```

**Benefits:**
- Automatic caching: Revisit same cycle = no refetch (until stale)
- Background updates: Data stays fresh
- Loading/error states: Built-in UI state management
- Request deduplication: Multiple components = 1 API call

#### 2. Shared Analysis State (Zustand)
Use for cross-page UI state (周期/时刻/变量/位置/逐时效批次):

```typescript
// stores/analysisContext.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AnalysisContextState {
  // 周期 (Cycle)
  selectedCycleId: string | null
  setSelectedCycleId: (id: string) => void
  
  // 时刻 (Valid Time / Lead Time)
  selectedLeadTime: number | null
  setSelectedLeadTime: (lead: number) => void
  
  // 变量 (Variable)
  selectedVariableId: string | null
  setSelectedVariableId: (id: string) => void
  
  // 位置 (Location/Region)
  selectedRegion: Region | null
  setSelectedRegion: (region: Region) => void
  
  // 逐时效批次 (Per-lead Batch)
  selectedBatchId: string | null
  setSelectedBatchId: (id: string) => void
}

export const useAnalysisContext = create<AnalysisContextState>()(
  persist(
    (set) => ({
      selectedCycleId: null,
      setSelectedCycleId: (id) => set({ selectedCycleId: id }),
      
      selectedLeadTime: null,
      setSelectedLeadTime: (lead) => set({ selectedLeadTime: lead }),
      
      selectedVariableId: null,
      setSelectedVariableId: (id) => set({ selectedVariableId: id }),
      
      selectedRegion: null,
      setSelectedRegion: (region) => set({ selectedRegion: region }),
      
      selectedBatchId: null,
      setSelectedBatchId: (id) => set({ selectedBatchId: id }),
    }),
    {
      name: 'analysis-context-storage', // localStorage key
      // Optionally sync with URL query params
    }
  )
)

// Usage in components
function AnalysisPage() {
  const { selectedCycleId, setSelectedCycleId } = useAnalysisContext()
  
  // Component only re-renders when selectedCycleId changes
  return <CycleSelector value={selectedCycleId} onChange={setSelectedCycleId} />
}
```

**Benefits:**
- **Shared across pages**: All 6 analysis sub-pages access same state
- **Persistent**: Optional localStorage persistence (user returns to same context)
- **No provider**: Direct hook usage, no wrapping components
- **Granular updates**: Only components using changed state re-render

#### 3. Local Component State (useState/useReducer)
Use for truly local UI state:
- Form input values (before submission)
- Modal open/closed state
- Accordion expand/collapse
- Hover states

---

## Integration Patterns

### TanStack Query + Zustand
Combine for reactive data fetching based on shared state:

```typescript
function ForecastMapViewer() {
  // Get shared analysis context from Zustand
  const { selectedCycleId, selectedVariableId, selectedLeadTime } = useAnalysisContext()
  
  // Fetch data with TanStack Query (automatically refetches when IDs change)
  const { data, isLoading } = useQuery({
    queryKey: ['forecast-map', selectedCycleId, selectedVariableId, selectedLeadTime],
    queryFn: () => fetchMapData(selectedCycleId, selectedVariableId, selectedLeadTime),
    enabled: !!selectedCycleId && !!selectedVariableId && selectedLeadTime !== null,
  })
  
  return <MapBox data={data} loading={isLoading} />
}
```

**Pattern:**
1. Zustand stores user selections (cycle, variable, lead time)
2. TanStack Query reacts to selection changes via `queryKey`
3. Automatic refetch when user changes selection in any of the 6 sub-pages
4. Cached results when user returns to previous selections

### URL Synchronization (Optional)
Sync Zustand state with URL query parameters for shareable links:

```typescript
// middleware/urlSync.ts
import { create } from 'zustand'
import { useRouter, useSearchParams } from 'next/navigation'

export const useAnalysisContextWithURL = create<AnalysisContextState>((set) => ({
  // ... state definition
}))

// Sync to URL on state change
function useURLSync() {
  const router = useRouter()
  const state = useAnalysisContextWithURL()
  
  useEffect(() => {
    const params = new URLSearchParams()
    if (state.selectedCycleId) params.set('cycle', state.selectedCycleId)
    if (state.selectedVariableId) params.set('variable', state.selectedVariableId)
    if (state.selectedLeadTime !== null) params.set('lead', String(state.selectedLeadTime))
    
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [state.selectedCycleId, state.selectedVariableId, state.selectedLeadTime])
}
```

---

## Alternatives Considered

### Jotai
- **Pros**: Atomic state, minimal boilerplate
- **Cons**: Less mature than Zustand, smaller ecosystem
- **Verdict**: Zustand more proven for this use case

### Recoil
- **Pros**: Developed by Facebook, atomic state
- **Cons**: Heavier than Zustand, experimental status for years
- **Verdict**: Not recommended due to uncertain long-term support

### Context API + useReducer
- **Pros**: Built-in React, no dependencies
- **Cons**: Performance issues (all consumers re-render), verbose setup
- **Verdict**: Not scalable for 6 sub-pages with frequent updates

### SWR (Vercel)
- **Pros**: Similar to TanStack Query, good Next.js integration
- **Cons**: Less feature-rich than TanStack Query
- **Verdict**: TanStack Query preferred for advanced features (optimistic updates, infinite queries)

**Source**: [Dev.to: React State Management Comparison](https://dev.to/kirandeepjassalcrypto/react-state-management-in-2026-context-api-vs-redux-toolkit-vs-zustand-vs-jotai-same-cart-real-1d2a)

---

## Testing Strategies

### Testing TanStack Query
- Use `@testing-library/react` with query wrapper
- Mock API calls with MSW (see E2E & API Mocking research)
- Test loading/error states

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, waitFor } from '@testing-library/react'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

test('loads forecast data', async () => {
  const queryClient = createTestQueryClient()
  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <ForecastViewer />
    </QueryClientProvider>
  )
  
  await waitFor(() => expect(getByText('Temperature')).toBeInTheDocument())
})
```

### Testing Zustand
- Direct store access in tests, no provider needed
- Reset store between tests

```typescript
import { useAnalysisContext } from '@/stores/analysisContext'

beforeEach(() => {
  useAnalysisContext.setState({
    selectedCycleId: null,
    selectedVariableId: null,
    // ... reset all state
  })
})

test('updates selected cycle', () => {
  const { result } = renderHook(() => useAnalysisContext())
  
  act(() => {
    result.current.setSelectedCycleId('cycle-001')
  })
  
  expect(result.current.selectedCycleId).toBe('cycle-001')
})
```

---

## Implementation Recommendations

### Installation

```bash
# TanStack Query
bun add @tanstack/react-query
bun add -D @tanstack/react-query-devtools

# Zustand
bun add zustand

# Optional: Immer middleware for Zustand (complex nested updates)
bun add immer
```

### Project Structure

```
src/
├── stores/
│   ├── analysisContext.ts        # Zustand: 周期/时刻/变量/位置/逐时效批次
│   ├── mapViewport.ts             # Zustand: Map center, zoom
│   └── timelineScrubber.ts        # Zustand: Play/pause, current frame
├── queries/
│   ├── cycles.ts                  # TanStack Query: Cycle API
│   ├── forecasts.ts               # TanStack Query: Forecast data
│   └── batches.ts                 # TanStack Query: Batch details
└── app/
    ├── providers.tsx              # TanStack Query provider setup
    └── layout.tsx                 # Wrap app with QueryClientProvider
```

### Next.js App Router Setup

```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute default
        refetchOnWindowFocus: false, // Disable for meteorological app (no auto-refresh)
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

**Source**: [TanStack Query Next.js SSR Guide](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)

---

## Primary Sources

### TanStack Query
- [TanStack Query Official Documentation](https://tanstack.com/query/latest/docs)
- [TanStack Query v5 React Installation](https://tanstack.com/query/v5/docs/framework/react/installation)
- [TanStack Query Next.js Example](https://tanstack.com/query/latest/docs/framework/react/examples/nextjs)
- [TanStack Query SSR Guide](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [TanStack Query GitHub Releases](https://github.com/tanstack/query/releases)
- [Tech Insider: TanStack Query Tutorial 2026](https://tech-insider.org/fr/tutoriel-tanstack-query-react-data-fetching-2026/)

### Zustand vs Redux Comparison
- [Tech Insider: Zustand vs Redux 2026](https://tech-insider.org/zustand-vs-redux-2026/)
- [The Road to Enterprise: Zustand vs Redux Toolkit](https://theroadtoenterprise.com/blog/zustand-vs-redux-toolkit)
- [Medium: Zustand vs Redux Toolkit Complete Guide](https://medium.com/@msmt0452/zustand-vs-redux-toolkit-the-complete-guide-to-state-management-in-react-4dce420741b4)
- [IT Source Code: Zustand vs Redux Toolkit 2026](https://itsourcecode.com/web-dev/zustand-vs-redux-toolkit-state-management-2026/)
- [Dev.to: React State Management 2026 Comparison](https://dev.to/kirandeepjassalcrypto/react-state-management-in-2026-context-api-vs-redux-toolkit-vs-zustand-vs-jotai-same-cart-real-1d2a)
- [ResearchGate: Redux vs Zustand Study](https://www.researchgate.net/publication/385694701_State_Management_in_React_Redux_vs_Zustand_-_A_Comprehensive_Guide)

### State Management Patterns
- [Dev.to: Redux vs Zustand for React](https://dev.to/syncfusion/redux-vs-zustand-choosing-the-right-react-state-manager-38n6)
- [Medium: Comparing Redux, Zustand, and Context API](https://medium.com/@mnnasik7/comparing-react-state-management-redux-zustand-and-context-api-449e983a19a2)
