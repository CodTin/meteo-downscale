# Implementation Spec: Forecast Catalog (Cycle List, Cycle Details, Valid Time Retrieval)

**Status:** Ready for Agent  
**Created:** 2024-10-05  
**Related Linear Tickets:** YU-277, YU-289, YU-290, YU-291

---

## Problem Statement

Regional meteorologists analyzing AI downscaled ensemble forecasts need to discover which forecast cycles have published products, verify their publication status and spatial coverage, and find forecasts for specific valid times. Currently, there is no implemented system for users to:

- Browse available forecast cycles and understand which lead times are published vs. missing
- Inspect detailed production status, batch traceability, and failure reasons for individual cycles
- Search for all cycles that have published products for a specific UTC valid time to enable cross-cycle comparison

Without this catalog capability, users cannot determine what forecast products are actually available for analysis, cannot trace which model batch produced a given forecast, and cannot efficiently set up cross-cycle evolution analysis for a fixed valid time.

## Solution

Implement a **Forecast Catalog** with three interconnected sub-pages that provide read-only visibility into forecast production status for business users:

1. **Cycle List** - Browse historical/operational cycles in reverse chronological order, showing available lead times, gaps, spatial coverage, and processing completion time
2. **Cycle Details** - Inspect per-lead production status (input, inference, quality check, publication) with batch traceability, member completeness, and failure reasons
3. **Valid Time Retrieval** - Query for a specific UTC valid time to find all cycles with published products at that time, enabling cross-cycle evolution analysis

The catalog distinguishes "catalog unknown" from "no products in query range," never fabricates data, handles unpublished cycles as explicit production records only, and ensures failed new attempts don't overwrite old published batches.

## User Stories

1. As a regional meteorologist, I want to see a list of all available forecast cycles in reverse chronological order, so that I can identify the most recent published forecasts
2. As a forecaster, I want to see which lead times are published and which are missing for each cycle, so that I can understand the temporal coverage before starting analysis
3. As a forecaster, I want to filter cycles by date range and region, so that I can narrow down to cycles relevant to my area of responsibility
4. As a forecaster, I want to see spatial coverage information for each cycle, so that I can verify my region of interest has valid data
5. As a forecaster, I want to distinguish between "fully available" and "partially available" cycles, so that I can prioritize cycles with complete coverage
6. As a forecaster, I want to click a cycle to view its detailed status, so that I can inspect production issues before entering analysis
7. As a forecaster, I want to enter analysis from a cycle only when lead times are actually published, so that I don't attempt to analyze unavailable data
8. As a forecaster, I want to see processing completion timestamps, so that I can judge data freshness
9. As a forecaster, I want the default view to show only cycles with published products, so that I can focus on analyzable forecasts
10. As a power user, I want to optionally include unpublished cycles in the list, so that I can investigate production failures
11. As a forecaster viewing cycle details, I want to see per-lead production status (input/inference/quality check/publication), so that I understand where failures occurred
12. As a forecaster, I want to see batch identifiers and model versions for published products, so that I can trace which model produced the forecast
13. As a forecaster, I want to see member completeness status, so that I know whether ensemble analysis is possible
14. As a forecaster, I want to see failure reasons for unpublished leads, so that I can understand why certain lead times are unavailable
15. As a forecaster, I want to distinguish between "currently publishing batch" and "active published batch", so that I understand which batch is being used in analysis
16. As a forecaster, I want to see when new batch attempts fail without overwriting old published batches, so that I can continue using stable products
17. As a forecaster, I want to see withdrawn batch status with reasons, so that I understand why a previously available forecast is no longer usable
18. As a forecaster, I want to enter 2D map or specific analysis views directly from cycle details for published leads, so that I can quickly start analysis
19. As a forecaster, I want to view permitted product provenance documentation, so that I can understand data sources
20. As a business user, I want read-only access to production status without retry/publish controls, so that I can inspect state without risk of operational changes
21. As a forecaster planning analysis for a specific event time, I want to search by exact UTC valid time, so that I can find all cycles that forecasted that moment
22. As a forecaster, I want to see which cycles have published products for my target valid time along with their lead times, so that I can understand forecast lead time diversity
23. As a forecaster, I want to see batch identifiers and coverage for each valid time result, so that I can verify data quality before comparison
24. As a forecaster, I want to enter single-cycle analysis when only one cycle is available, so that I can still work with limited data
25. As a forecaster, I want to enter cross-cycle evolution view when two or more cycles are available, so that I can compare how forecasts for the same time evolved
26. As a forecaster, I want the search to distinguish "no cycles found" from "cycle exists but lead not published" from "target region invalid", so that I understand specific reasons for unavailability
27. As a forecaster, I want to return from valid time retrieval to cycle list while preserving my search conditions, so that I can refine my query
28. As a forecaster, I want to be offered alternative available times without auto-switching my request, so that I remain in control of the query
29. As a forecaster entering catalog without query parameters, I want to land on cycle list, so that I can browse available cycles
30. As a forecaster with a direct link containing a cycle ID, I want to jump directly to cycle details, so that I can quickly inspect that specific cycle
31. As a forecaster with a direct link containing a valid time, I want to jump directly to valid time retrieval, so that I can immediately see cross-cycle options
32. As a forecaster, I want unavailable catalog states to clearly explain "catalog service unavailable" vs. "no matching results", so that I understand whether to retry or adjust my query
33. As a forecaster, I want gaps in lead time ranges to be explicitly shown rather than implied by first/last lead, so that I don't assume completeness
34. As a forecaster, I want to see when only input/labels exist without published AI products, so that I understand the product isn't ready for analysis
35. As a forecaster, I want filter changes to trigger complete recalculation rather than reusing old cached results, so that I see accurate current state
36. As a forecaster, I want context (mode, filters, selected cycle) preserved when navigating between catalog sub-pages, so that I don't lose my place
37. As a forecaster, I want to see real production records rather than fabricated theoretical cycles, so that I can trust the catalog accuracy
38. As a forecaster, I want withdrawn batches to preserve identity and reason but disable analysis entry, so that I understand historical state
39. As a forecaster, I want variable capability restrictions (e.g., TP limitations) to be enforced in catalog just as in analysis pages, so that invalid workflows are prevented early

## Implementation Decisions

### Technical Stack

See Architecture Decision Records (ADRs) in `docs/adr/` for detailed rationale.

**Foundation:**
- **Unit Testing**: Vitest (ADR-0001) - 4x faster than Jest, native ESM/TypeScript, React 19 compatible
- **E2E Testing**: Playwright (ADR-0002) - Free parallelization, multi-browser including Safari
- **API Mocking**: MSW (ADR-0003) - Network-level interception for dev/test/Storybook
- **Design System**: shadcn/ui + Radix UI + Heroicons (ADR-0004) - Copy-paste architecture, WCAG 2.2 AA accessibility
- **State Management**: TanStack Query + Zustand + useState (ADR-0005) - Server state in Query, shared client state in Zustand, local state in useState
- **Date Library**: date-fns (ADR-0006) - Tree-shakable, 5-15KB bundle for init time + lead time calculations
- **Tables**: TanStack Table (ADR-0007) - Headless table library for cycle lists and production status grids

**Visualization:**
- **2D Maps**: MapLibre GL JS + deck.gl (ADR-0008) - Hardware-accelerated WebGL for meteorological field rendering
- **3D Terrain**: Three.js + @react-three/fiber (ADR-0009) - DEM mesh generation and cross-section sampling
- **Charts**: Recharts via shadcn/ui (ADR-0010) - Declarative React API for ensemble spread bands and time series

**Catalog-Specific Application:**
- Cycle list tables use TanStack Table with sorting/filtering
- Cycle metadata (init time, valid time calculations) uses date-fns
- Server state (cycle lists, cycle details, valid time queries) managed by TanStack Query with automatic caching
- Shared filter state (date range, region, mode toggle) stored in Zustand for preservation across catalog sub-pages
- All components styled with shadcn/ui for visual consistency with analysis pages

### Module Structure

- **`/app/catalog/` route group** - Three sub-pages under unified catalog navigation
  - `/app/catalog/cycles/` - Cycle list (default catalog entry)
  - `/app/catalog/cycles/[cycleId]/` - Cycle details
  - `/app/catalog/valid-time/` - Valid time retrieval (query string for valid time parameter)

- **Shared catalog components** - `components/catalog/`
  - `CycleStatusBadge` - Visual indicator for fully available / partially available / unpublished status
  - `LeadTimeRangeDisplay` - Show continuous ranges with explicit gap markers
  - `BatchIdentifier` - Display batch ID with model version and timestamp
  - `ProductionStepStatus` - Show input/inference/quality-check/publication pipeline status
  - `CoverageIndicator` - Display spatial coverage percentage with valid/requested area ratio

- **Catalog data layer** - `lib/catalog/`
  - `fetchCycleList(filters)` - Query cycles with date range, region, mode filters
  - `fetchCycleDetails(cycleId)` - Get per-lead production status for one cycle
  - `fetchValidTimeResults(validTime, region, variable)` - Find cycles with published products at exact valid time
  - Type definitions for cycle metadata, production status, batch identity

### Data Contract

**Cycle metadata structure:**
```typescript
type CycleMetadata = {
  cycleId: string
  mode: 'historical' | 'operational'
  initTime: string // ISO 8601 UTC
  processingCompletedAt: string | null
  availableLeads: number[] // sorted array of published lead hours
  leadGaps: Array<{ after: number; before: number }> // explicit gap markers
  spatialCoverage: {
    requestedRegion: BoundingBox
    validCoverageRatio: number // 0-1
  }
  availabilityStatus: 'fully-available' | 'partially-available' | 'unpublished'
  hasAnalysisEntrypoint: boolean // false for unpublished
}
```

**Cycle details per-lead structure:**
```typescript
type LeadProductionStatus = {
  lead: number
  validTime: string // ISO 8601 UTC
  input: {
    status: 'not-checked' | 'awaiting' | 'validation-failed' | 'ready'
    observedAt: string | null
    missingFields: string[] | null
  }
  execution: {
    status: 'pending' | 'running' | 'succeeded' | 'failed'
    failureReason: string | null
  }
  qualityCheck: {
    status: 'pending' | 'passed' | 'failed'
    checkScope: string | null
    memberCompleteness: number // 0-10
  }
  publication: {
    status: 'unpublished' | 'published' | 'withdrawn'
    batchId: string | null
    publishedAt: string | null
    withdrawnAt: string | null
    withdrawalReason: string | null
  }
  isCurrentBatch: boolean // active for analysis
}
```

**Valid time result structure:**
```typescript
type ValidTimeResult = {
  cycleId: string
  lead: number
  batchId: string
  spatialCoverage: {
    validCoverageRatio: number
  }
  isAvailableForAnalysis: boolean
}
```

### Catalog Query Behavior

- **Default cycle list query**: Current data mode (operational if available, else historical), last 30 days, user's saved default region, published-only filter active
- **"Include unpublished" filter**: Adds cycles with real production records but no published products; these rows have disabled analysis entry and show production status indicators
- **Empty results**: Distinguish `{ success: true, cycles: [] }` (successful query, no matches) from `{ success: false, error: 'catalog-unavailable' }`
- **Partial availability**: Cycle shown in list if ANY lead is published; details page shows per-lead granularity
- **Unpublished cycle handling**: Only included when explicitly filtered; never fabricate theoretical cycles; show actual production attempt records only

### Navigation and Context Flow

- **Catalog entry without params** → Cycle list with default filters
- **Link with `?cycle=<id>`** → Direct to cycle details
- **Link with `?validTime=<iso-utc>`** → Direct to valid time retrieval
- **From cycle list row click** → Cycle details (preserves list filters in browser history)
- **From cycle details "Enter Analysis" button** → Analysis pages with locked cycle/lead/batch
- **From cycle details for published lead** → Can target specific analysis sub-page (e.g., 2D map, point analysis)
- **From valid time retrieval "Enter Analysis" single result** → Single-cycle analysis
- **From valid time retrieval "Cross-Cycle Evolution" 2+ results** → Evolution sub-page with locked valid time and candidate cycles
- **Return from any analysis** → Restores catalog context (filters, scroll position, selected cycle)

### Unpublished Cycle Visibility

- **Default list view**: Published-only (either fully or partially available)
- **"Include unpublished cycles" toggle**: Adds cycles where production was attempted but no leads published yet
- **Unpublished cycle indicators**: Badge shows "Unpublished", "Enter Analysis" button disabled, status text explains failure reasons
- **Use case**: Operations troubleshooting, understanding why expected cycle didn't publish
- **Not shown**: Theoretical cycles that were never attempted (no production record exists)

### Batch Traceability

- **Batch identifier display**: Shown in cycle details per-lead, valid time results, and before analysis entry
- **Current vs. in-progress batches**: Cycle details distinguishes "Active batch for analysis" (published) from "New batch in progress" (not yet published)
- **Failed batch behavior**: New batch attempt fails → old published batch remains active, failure reason shown alongside active batch
- **Withdrawn batch display**: Preserves batch ID, shows withdrawal reason, disables analysis entry, suggests alternative if available

### State Differentiation

Must distinguish these states with unique UI text and semantics:

1. **Catalog service unavailable** - Cannot query authoritative catalog (network error, service down)
2. **No cycles in query range** - Successful query returned zero results for date/region/mode filters
3. **Cycle exists but lead not published** - Cycle has production record, but specific lead time never published or was withdrawn
4. **Region invalid for cycle** - User's requested region has no valid coverage in this cycle
5. **Variable capability not enabled** - E.g., TP accumulation semantics not verified, cannot analyze yet
6. **Only input/labels exist** - Upstream data available, but AI inference not completed
7. **Production in progress** - Cycle being processed, not failed, just not complete yet

### TP (Total Precipitation) Handling

Per GLOSSARY.md constraints, TP capability is restricted until accumulation window, units, and f000 semantics are verified:
- Cycle list: Can show TP exists in production metadata, but no TP-specific filtering
- Cycle details: Show TP in variable list with "capability restricted" indicator
- Valid time retrieval: If user queries with variable=TP, return results but flag capability restriction
- Analysis entry: Warn that TP formal analysis is disabled until verification complete

### Error Handling and Fallbacks

- **Catalog query timeout**: Retry with exponential backoff, show "Checking catalog..." state, eventually fail to "Catalog unavailable" with retry button
- **Partial query failure** (e.g., metadata but not production status): Show available data, flag missing pieces, allow navigation to working sub-pages
- **Concurrent batch publication**: If batch publishes while user viewing details, show "Update available" banner, preserve current view until user explicitly refreshes
- **Withdrawn batch while user analyzing**: Analysis pages detect withdrawal, show explicit warning, do not silently switch to new batch

### Testing Seams

Primary testing seam: **Catalog data layer functions** (`lib/catalog/`)

These functions encapsulate all external data fetching and transformation logic. Tests should mock the underlying fetch/API calls and verify:
- Correct query parameter construction
- Proper handling of empty results vs. errors
- Correct parsing of production status into typed structures
- Lead gap detection logic
- Availability status derivation from per-lead statuses

Secondary seam: **Page-level data fetching** (Next.js Server Components)

Each route's data-loading logic should be testable independently:
- Cycle list: Verifies default filter application, pagination, mode selection
- Cycle details: Verifies cycleId extraction, per-lead status aggregation
- Valid time retrieval: Verifies valid time parsing, multi-cycle result sorting

Component-level seams:
- Status badge rendering logic (given status enum, renders correct color/text)
- Lead range display with gap markers (given `[0,1,3,6]`, renders "0-1, 3, 6" with gap indicators)
- Production step pipeline (given per-step statuses, renders correct stage highlighting)

## Testing Decisions

### What Makes a Good Test

- **Test external behavior, not implementation**: Tests should verify that given specific query parameters and mock data responses, the catalog pages render correct information to the user
- **Avoid testing framework internals**: Don't test Next.js routing directly; test that the data layer returns correct results and components render those results correctly
- **Test edge cases explicitly**: Empty results, all-unpublished cycles, withdrawn batches, catalog service down, partial member completeness
- **Test state differentiation**: Verify that "no results" renders differently from "catalog unavailable" and both differ from "results found"

### Modules to Test

1. **`lib/catalog/fetchCycleList`** - Unit tests with mocked fetch
   - Returns correct CycleMetadata array for valid response
   - Handles empty result set (success: true, cycles: [])
   - Handles network failure (success: false, error: 'catalog-unavailable')
   - Applies date range, region, mode filters correctly
   - Detects lead gaps and populates leadGaps array
   - Derives availabilityStatus from per-lead data

2. **`lib/catalog/fetchCycleDetails`** - Unit tests with mocked fetch
   - Returns per-lead production status array
   - Identifies current vs. in-progress batches
   - Parses failure reasons correctly
   - Handles withdrawn batches with preserved identity

3. **`lib/catalog/fetchValidTimeResults`** - Unit tests with mocked fetch
   - Returns cycles matching exact valid time
   - Sorts by lead time (shorter leads first)
   - Filters out unpublished leads automatically
   - Handles "no cycles found" vs. "cycle exists but lead not published"

4. **`app/catalog/cycles/page.tsx`** (cycle list page) - Integration tests with mock data layer
   - Renders cycle rows with correct metadata
   - Shows "No cycles found" for empty results
   - Shows "Catalog unavailable" for service errors
   - Applies "include unpublished" filter correctly
   - Preserves filter state in URL query params

5. **`app/catalog/cycles/[cycleId]/page.tsx`** (cycle details) - Integration tests
   - Renders per-lead production pipeline status
   - Disables analysis entry for unpublished leads
   - Shows withdrawn batch with reason
   - Links to analysis with correct cycle/lead/batch params

6. **`app/catalog/valid-time/page.tsx`** (valid time retrieval) - Integration tests
   - Renders valid time results with cycle/lead pairs
   - Enables cross-cycle button only when 2+ results
   - Shows "No cycles available for this time" correctly
   - Distinguishes error types in empty states

7. **Shared components** - Unit tests with React Testing Library
   - `CycleStatusBadge`: Renders correct badge for each status enum value
   - `LeadTimeRangeDisplay`: Renders ranges with gap markers correctly
   - `ProductionStepStatus`: Highlights correct pipeline stage based on statuses

### Prior Art for Tests

This is a greenfield Next.js project, so no existing test patterns to follow. Testing strategy should align with:
- **Next.js App Router testing patterns**: Use `@testing-library/react` for component tests, mock Server Component data fetching
- **Industry standard**: Vitest or Jest for unit tests, Playwright for E2E if needed (not in initial spec scope)
- **Data layer testing**: Pure function tests with no framework dependencies, easy to run in CI

Example test structure (not executable code, illustrative only):
```typescript
// lib/catalog/__tests__/fetchCycleList.test.ts
describe('fetchCycleList', () => {
  it('returns cycles with correct metadata for valid response', async () => {
    // Mock fetch to return sample cycle data
    // Call fetchCycleList with test filters
    // Assert returned array has correct CycleMetadata shape
  })
  
  it('detects lead gaps and populates leadGaps array', async () => {
    // Mock fetch with leads [0, 1, 3, 6, 7]
    // Assert leadGaps contains { after: 1, before: 3 } and { after: 3, before: 6 }
  })
  
  it('handles catalog service unavailable', async () => {
    // Mock fetch to reject with network error
    // Assert function returns { success: false, error: 'catalog-unavailable' }
  })
})
```

## Out of Scope

- **Specific UI layout and visual design** - Component styling, exact spacing, color choices, typography (covered by separate design system spec)
- **Backend API implementation** - The actual catalog service, database schema, production pipeline orchestration
- **Database and data persistence** - How cycle metadata, batch records, and production status are stored
- **Model training and CSC parameter tuning** - ML model development, hyperparameter optimization
- **Real data production and acceptance testing** - Actually running forecast production, verifying real forecast accuracy
- **Production task creation and scheduling** - Automated job orchestration, cron-like scheduling system (covered in separate Operations spec)
- **Operations workspace features** - Retry, publish, withdraw actions (covered in separate Operations spec; catalog is read-only for business users)
- **Authentication and authorization** - User roles, permissions system (assume role-based access already exists)
- **Export functionality** - Creating downloadable files from catalog queries (Export Center handles this)
- **Real-time updates** - WebSocket or polling for live batch publication notifications (initial version shows "Update available" banner on refresh only)

## Further Notes

### Cross-References to GLOSSARY.md

This spec implements the following GLOSSARY.md sections:
- **"预报目录"** (Forecast Catalog) top-level page specification (lines 113-119)
- **"预报目录 / 周期列表"** (Cycle List) sub-page (lines 215-222, decision YU-289)
- **"预报目录 / 周期详情"** (Cycle Details) sub-page (lines 224-231, decision YU-290)
- **"预报目录 / 有效时刻检索"** (Valid Time Retrieval) sub-page (lines 233-238, decision YU-291)

### Critical Behavioral Constraints

From GLOSSARY.md and Linear tickets:

1. **Never fabricate data**: If authoritative catalog is unavailable, show "unknown" state, do not fall back to cached/assumed data
2. **Distinguish unavailability reasons**: "Catalog service down" ≠ "No cycles match filters" ≠ "Cycle exists but lead not published"
3. **Failed new batches don't overwrite old published batches**: Production system may attempt new batch that fails; old batch remains active
4. **Unpublished cycles are explicit production records only**: Don't show theoretical cycles that "should" exist based on schedule
5. **TP capability restrictions apply**: Even if TP data exists in metadata, formal analysis is disabled until accumulation semantics verified
6. **Business users are read-only**: No retry/publish/withdraw buttons; operations workspace handles those (separate spec)

### Key Scenarios from GLOSSARY.md Table (lines 359-376)

The spec must handle these behavioral verification scenarios:

- **Scenario: "仅历史回放"** (Historical replay only) - If query succeeds but only historical published products exist, enter historical mode with earliest published valid time
- **Scenario: "目标周期不覆盖时刻"** (Target cycle doesn't cover time) - When switching to cycle B, if target valid time has no published lead, preserve target time with explanation, list available alternatives
- **Scenario: "批次更新"** (Batch update) - When browsing old batch R1 and new batch R2 publishes, show update notification but keep using R1 until user explicitly switches
- **Scenario: "批次撤回"** (Batch withdrawal) - Old analysis links and exports re-verify batch availability; if withdrawn, preserve request identity and show replacement options
- **Scenario: "目录无法访问"** (Catalog inaccessible) - Display "产品可用性未确认" (Product availability unconfirmed), not "没有预报" (No forecast)

### Relationship to Other Page Groups

- **Forecast Overview** (预报总览) - Links into catalog when user wants to verify cycle availability or switch cycles
- **Forecast Analysis** (预报分析) - Receives cycle/lead/batch context from catalog; returns to catalog preserving search context
- **Operations Workspace** (运营工作区) - Separate role-gated area for retry/publish/withdraw; business catalog is read-only mirror
- **Export Center** (导出中心) - References same batch identifiers; exports lock batch references just like analysis pages

### Data Availability Gates

Per GLOSSARY.md lines 377-387, actual capability enabling requires:

1. **Authoritative product catalog** - Per-lead, per-region, per-batch publication records with complete 10-member verification
2. **Input source verification** - Variable/unit/grid alignment, f000-f090 time mapping, TP accumulation window confirmed
3. **Reference analysis fields** - Common case/mask and training/tuning isolation records for verification features
4. **Production step records and permissions** - Real observed timestamps, failure reasons, export access control

Until these gates are met, catalog shows "capability restricted" indicators using the unavailability rules defined in GLOSSARY.md. The page behavior specification is complete; data availability is a deployment gate, not a spec gap.
