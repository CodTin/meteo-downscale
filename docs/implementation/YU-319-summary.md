# YU-319 Implementation Summary

## What Was Built

TanStack Query configured for server state management with initial queries for cycles list and product availability, including caching and stale-time policies per DESIGN.md specifications.

## Acceptance Criteria Status

✅ **QueryClientProvider wraps app in app/providers.tsx (client component)**
- Created `app/providers.tsx` as client component
- Wraps entire app with QueryClientProvider
- Integrated into `app/layout.tsx`

✅ **Query for cycles list: queryKey ['cycles', { status }] with 5min staleTime**
- `useCyclesQuery()` hook created
- Query key: `['cycles', params]` where params includes status, mode, etc.
- staleTime: 5 minutes (300,000ms) as specified

✅ **Query for product availability: queryKey ['product-availability', cycleId, leadTime]**
- `useProductAvailabilityQuery()` hook created
- Query key: `['product-availability', cycleId, leadTime]`
- Auto-disabled when cycleId or leadTime is null

✅ **Queries distinguish GLOSSARY.md product states**
- Type: `ProductState = "已发布" | "未发布" | "产品可用性未确认" | "无已发布产品"`
- All API responses include proper state field
- Mock implementation returns "产品可用性未确认" by default

✅ **DevTools configured for development only**
- `@tanstack/react-query-devtools` installed as dev dependency
- Only rendered when `process.env.NODE_ENV === "development"`
- initialIsOpen: false for non-intrusive experience

✅ **refetchOnWindowFocus: false per DESIGN.md**
- Set globally in QueryClient defaultOptions
- No auto-refresh on window focus
- Explicit refetch required

✅ **Default staleTime: 60 seconds (1 minute)**
- Set in QueryClient defaultOptions
- Can be overridden per query
- Cycles query uses 5 minutes

✅ **Queries return proper loading/error states for UI consumption**
- All queries return standard TanStack Query states:
  * `isLoading` - initial loading
  * `isError` - error state
  * `isSuccess` - successful fetch
  * `data` - query result
  * `error` - error details

## Files Created

### API Layer
- `lib/api/types.ts` - TypeScript types for API responses
- `lib/api/client.ts` - API client functions (mock implementations)
- `lib/api/queries.ts` - TanStack Query hooks

### Providers
- `app/providers.tsx` - QueryClientProvider wrapper (client component)

### Tests
- `tests/unit/lib/api/client.test.ts` - 13 tests for API client (all passing ✅)

### Documentation
- `docs/implementation/YU-319-summary.md` - This file

## Technical Implementation

### QueryClient Configuration

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 60 seconds default
      refetchOnWindowFocus: false, // No auto-refresh
      retry: 1, // Retry once on failure
      refetchOnMount: true,
    },
  },
})
```

### Cycles Query Hook

```typescript
export function useCyclesQuery(params: CyclesQueryParams = {}) {
  return useQuery({
    queryKey: ["cycles", params],
    queryFn: () => fetchCycles(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
```

### Product Availability Query Hook

```typescript
export function useProductAvailabilityQuery(
  cycleId: string | null | undefined,
  leadTime: number | null | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["product-availability", cycleId, leadTime],
    queryFn: () => fetchProductAvailability(cycleId!, leadTime!),
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    enabled: cycleId !== null && leadTime !== null && options?.enabled !== false,
  });
}
```

### GLOSSARY.md Product States

```typescript
export type ProductState =
  | "已发布"           // Published
  | "未发布"           // Not published
  | "产品可用性未确认" // Availability unconfirmed
  | "无已发布产品";    // No published products
```

## Usage Examples

### Fetching Cycles List

```tsx
import { useCyclesQuery } from "@/lib/api/queries";

function CyclesList() {
  const { data: cycles, isLoading, error } = useCyclesQuery({
    status: "published",
    mode: "business",
  });

  if (isLoading) return <div>Loading cycles...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {cycles?.map((cycle) => (
        <li key={cycle.id}>
          {cycle.id} - {cycle.state}
        </li>
      ))}
    </ul>
  );
}
```

### Fetching Product Availability

```tsx
import { useProductAvailabilityQuery } from "@/lib/api/queries";

function ProductStatus({ cycleId, leadTime }: Props) {
  const { data, isLoading } = useProductAvailabilityQuery(cycleId, leadTime);

  if (isLoading) return <div>Checking availability...</div>;

  return (
    <div>
      <p>State: {data?.state}</p>
      <p>Available: {data?.available ? "Yes" : "No"}</p>
      {data?.reason && <p>Reason: {data.reason}</p>}
    </div>
  );
}
```

### Conditional Queries

```tsx
// Only fetch when user has selected cycle and lead time
const { data } = useProductAvailabilityQuery(
  selectedCycleId,
  selectedLeadTime,
  { enabled: !!selectedCycleId && !!selectedLeadTime }
);
```

## API Client (Mock Implementation)

Currently returns mock data for testing. Ready for API integration:

```typescript
// TODO: Replace with actual API call
export async function fetchCycles(params: CyclesQueryParams = {}): Promise<Cycle[]> {
  // const response = await fetch('/api/cycles?' + new URLSearchParams(params));
  // return response.json();
  
  // Mock implementation
  return [];
}
```

## Caching Strategy

1. **Cycles List**: 5 minute stale time
   - Catalog data changes infrequently
   - Reduces server load

2. **Product Availability**: 1 minute stale time
   - More dynamic (production batches)
   - Balance freshness with performance

3. **No Window Focus Refetch**
   - Per DESIGN.md requirements
   - User must explicitly refresh

4. **Request Deduplication**
   - TanStack Query automatically deduplicates
   - Multiple components can use same query

## Testing

All 13 tests pass successfully:

- **fetchCycles** (4 tests)
  - Returns array
  - Accepts query parameters
  - Handles mode parameter
  - Multiple parameters

- **fetchProductAvailability** (3 tests)
  - Returns availability info
  - Includes proper product state
  - Includes reason when unavailable

- **fetchLatestCycle** (2 tests)
  - Returns null when no cycles
  - Accepts mode parameter

- **GLOSSARY.md States** (4 tests)
  - All four product states validated

## Build Verification

✅ TypeScript compilation successful
✅ All routes compile correctly (28 routes)
✅ Provider correctly wraps app
✅ Tests pass: 13/13 ✅
✅ Dependencies installed correctly

## Integration Points

### With YU-317 (Analysis Context Store)
```typescript
// Queries can sync with Zustand store
const { data: cycles } = useCyclesQuery();
const { setSelectedCycleId } = useAnalysisContext();

useEffect(() => {
  if (cycles?.[0]) {
    setSelectedCycleId(cycles[0].id);
  }
}, [cycles]);
```

### With YU-318 (State Resolution)
```typescript
// State resolution can use queries
const { data: cycles } = useCyclesQuery({ status: "published" });
// Use cycles data in resolveInitialState logic
```

## Next Steps

The TanStack Query foundation is complete. Future work:

1. Implement actual API endpoints in backend
2. Replace mock implementations with real fetch calls
3. Add more specific queries as needed (variables, regions, etc.)
4. Implement optimistic updates for mutations
5. Add error boundary components for query errors
6. Implement infinite queries for paginated data
7. Add query invalidation logic when data changes
