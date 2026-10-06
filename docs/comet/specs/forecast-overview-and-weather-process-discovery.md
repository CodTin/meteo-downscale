# Implementation Spec: Forecast Overview & Weather Process Discovery

**Status:** Ready for Implementation  
**Date:** 2024-10-05  
**Scope:** 预报总览 (Forecast Overview) and 天气过程发现 (Weather Process Discovery) pages  
**Linear Decisions:** YU-275, YU-278  
**Terminology Source:** GLOSSARY.md

---

## Problem Statement

Operational meteorologists need to quickly identify weather events worth detailed investigation from AI ensemble forecasts. Currently, they must manually scan through spatial fields and time series to find extrema, significant changes, and threshold-crossing regions. This is time-consuming and risks missing critical events during operational deadlines.

When forecasters do identify interesting features, they need to jump into detailed analysis with the exact context (cycle, valid time, variable, position, batch) preserved. Any loss of context or silent data substitution undermines trust and forces re-navigation.

Additionally, when the authoritative product catalog is unavailable or products are missing, the system must clearly distinguish between "catalog query failed", "no products in range", "only historical products exist", and "partial coverage" — never synthesizing fake data or silently substituting old values.

---

## Solution

Build two integrated pages that serve as entry points into the detailed analysis workspace:

**Forecast Overview (预报总览)** — Default landing page showing a high-level summary of the most recent published cycle for the user's business region. Displays extrema (T max/min, SP min, wind max), temporal evolution patterns, and ensemble spread signals. Each summary card jumps directly to the relevant analysis view with complete context.

**Weather Process Discovery (天气过程发现)** — Search interface for finding noteworthy events within a specified cycle, region, variable, and time range. Returns ranked results for extrema, hour-to-hour changes, spread peaks, and threshold member support. Each result carries complete provenance and jumps to analysis with full context restoration.

Both pages follow strict unavailable-state handling: distinguish catalog failures from empty query results from partial coverage, never fabricate data, and preserve TP capability restrictions until semantic verification completes.

---

## User Stories

### Forecast Overview - Entry and Default Selection

1. As an operational meteorologist, I want to open the platform and immediately see the most recent published forecast for my region, so that I can start my analysis without manually searching for available products.

2. As a forecaster working with historical replays, I want the overview to clearly show "Historical Mode" and the actual cycle date when only historical products exist, so that I don't mistake replay data for real-time forecasts.

3. As a user without saved preferences, I want the system to use the Sichuan-Chongqing example region (27-33°N, 102-108°E) as the first-time default, so that I see meaningful results immediately.

4. As a forecaster, I want the overview to show the actual time range used for summaries, so that I know whether I'm seeing a single-timestep snapshot or multi-hour aggregation.

5. As an operational user, I want the overview to show cycle ID, processing completion time, available leads, spatial coverage, and member completeness at the top, so that I can assess data quality before relying on summaries.

### Forecast Overview - Extrema and Summary Cards

6. As a forecaster, I want to see regional temperature max/min from AI ensemble mean with exact grid position and valid time, so that I can identify potential heat/cold events.

7. As a user, I want to see regional SP minimum and 10m wind speed maximum with their locations and times, so that I can spot low-pressure systems and high-wind events.

8. As a forecaster, I want all extrema explicitly labeled as "from AI ensemble mean", so that I understand they represent mean behavior not individual member extremes.

9. As an analyst, I want to see temporal evolution patterns and ensemble spread signals as separate cards, so that I can identify trend changes and uncertainty peaks.

10. As a user, I want spread and member support metrics to preserve their distinct calculation口径, so that I don't confuse total variance with threshold crossing counts.

11. As a forecaster clicking an extrema card, I want to jump to the 2D map or point analysis with the exact valid time, variable, position, and batch from that result (not the page default time), so that I see the actual event without re-navigating.

12. As a user clicking ensemble spread, I want to enter the ensemble & threshold view preserving the high-spread location and time, so that I can immediately inspect member distribution.

13. As a forecaster clicking temporal change, I want to enter regional analysis preserving the exact time range and region where change occurred, so that I can examine the evolution in detail.

### Forecast Overview - Unavailable States

14. As a user when the catalog is unreachable, I want to see "Product availability unconfirmed" (not "No forecasts"), so that I know the system cannot verify inventory rather than products definitely not existing.

15. As a forecaster when no published products exist for my query, I want to see "No published products for current query" with the actual query conditions, so that I can adjust region/mode rather than assuming the entire system is empty.

16. As an operational user when only historical products exist, I want to see an explicit "Historical only" state with an explanation, so that I don't mistake old data for current forecasts.

17. As a forecaster when coverage is partial, I want each summary item to show its actual valid range, so that I don't assume complete coverage when viewing partial results.

18. As a user, I want TP to show a capability restriction notice until accumulation window verification completes, so that I know TP summaries are not yet approved for operational use.

19. As a forecaster when summaries cannot be calculated this time, I want to see the specific unavailable reason (not old cached values), so that I trust the system isn't showing stale data.

20. As a user viewing partial results, I want items to individually indicate their valid scope, so that I don't interpret the entire overview as complete when only some metrics succeeded.

### Forecast Overview - Context Preservation and Batch Handling

21. As a forecaster, I want status issues to link to cycle details, so that I can investigate missing leads or coverage gaps.

22. As a user when a new batch publishes while I'm viewing the overview, I want to see an update notification but continue using the current batch until I explicitly switch, so that my analysis session stays consistent.

23. As a forecaster when a batch is withdrawn, I want the overview to stop displaying it as valid data and show the withdrawal reason, so that I don't base decisions on revoked products.

### Weather Process Discovery - Query Input

24. As a forecaster, I want to select one cycle, rectangular region, variable, and valid time range for discovery queries, so that I scope the search to a specific forecast situation.

25. As a user, I want to choose query categories: AI mean extrema (T high/low, SP low, wind high), adjacent-hour regional mean changes, spread peaks, and threshold member support, so that I find different types of noteworthy events.

26. As a forecaster running a threshold query, I want to specify the threshold value, comparison direction (strict >), and unit, so that results match my operational criteria.

27. As an operational user, I want wind thresholds preset at 10/15/20/25 m/s and temperature thresholds at >35°C or <0°C with custom override, so that I can quickly check common warning levels without manual entry every time.

### Weather Process Discovery - Results and Ranking

28. As a forecaster, I want each result to include physical value/unit, time, lead, grid position/spatial range, region boundary, valid mask, batch used, and calculation口径, so that I have complete provenance.

29. As a user, I want different query categories ranked separately (not mixed into a single risk score), so that I understand whether I'm looking at extrema vs. changes vs. spread.

30. As a forecaster viewing change results, I want them ranked by absolute change magnitude while preserving sign, so that both warming and cooling trends appear by intensity without conflating different quantities into a single risk score.

31. As an operational user, I want change queries to only compare timesteps that are both valid and actually one hour apart, so that data gaps don't produce misleading "changes" across discontinuities.

32. As a forecaster, I want results to skip grid points that are not fully valid across all 10 members, so that partial-member grids don't pollute rankings.

33. As a user running a new query, I want old results cleared (not reused as if they match new conditions), so that I trust displayed results actually reflect current filters.

### Weather Process Discovery - Navigation to Analysis

34. As a forecaster clicking an extrema result, I want to enter the 2D map or point analysis with the exact grid position, valid time, variable, and batch from that result, so that I see the event without re-searching.

35. As a user clicking a regional change result, I want to enter regional analysis preserving the region boundary, time range, and batch, so that I can examine the temporal evolution in detail.

36. As a forecaster clicking a threshold or spread result, I want to enter the ensemble & threshold view with the exact threshold definition (direction, value, unit) and location preserved, so that I see the member distribution that generated the result.

37. As an operational user navigating from discovery to analysis, I want to preserve the complete query identity (cycle, time, variable, position, batch, calculation口径), so that the analysis view shows exactly what the discovery result referenced.

38. As a forecaster returning from analysis to discovery, I want to restore my original query filters and result position, so that I can continue reviewing other candidates without re-running the search.

### Weather Process Discovery - Unavailable States and Restrictions

39. As a user when adjacent-hour changes cannot be calculated due to gaps, I want to see "time steps not adjacent" rather than fabricated continuity, so that I don't interpret gap-boundary discontinuities as weather changes.

40. As a forecaster when TP capability is restricted, I want TP discovery queries disabled with an explanation, so that I know the restriction is pending semantic confirmation not a system bug.

41. As a user when no results meet my query conditions, I want to see "No results matching criteria" (distinct from "Cannot calculate"), so that I know whether the query executed successfully with empty results or failed to run.

42. As a forecaster when partial grids are invalid, I want those grids excluded from rankings with a note, so that I understand coverage limitations affected result counts.

### Cross-Page Shared Behaviors

43. As a forecaster navigating from overview/discovery to any analysis sub-page, I want context to include cycle, valid time, variable, position/region, and batch (not just page defaults), so that analysis opens at the exact state I selected.

44. As a user opening a direct link with explicit context, I want the system to prioritize accurate restoration over defaults, so that shared links work reliably.

45. As a forecaster when a linked batch is no longer valid, I want to see the original request identity and withdrawal reason (not silent redirect to a new batch), so that I can assess whether the linked analysis is still meaningful.

46. As an operational user, I want all numerical results (extrema, changes, spread, thresholds) to follow the shared calculation口径: scalar mean and spread from 10 members in physical units, spread as population standard deviation (denominator 10), wind speed from per-member U/V magnitude then mean, so that metrics are consistent across pages.

47. As a forecaster, I want point selection to show both user-clicked coordinates and actual nearest grid center, so that I understand grid snapping behavior.

48. As a user when a selected grid is invalid, I want to see "no value at this location" rather than silent relocation to another valid grid, so that I trust position selection.

49. As a forecaster, I want rectangular region queries to preserve original boundary and valid coverage separately, so that I know when effective area differs from requested area.

50. As an operational user switching valid times, I want to rebind the batch for that lead independently, so that multi-lead sessions don't incorrectly assume a single batch covers all leads.

51. As a forecaster switching cycles, I want to preserve my target valid time and see unavailability reasons if that lead isn't published in the new cycle (not automatic jump to nearest available lead), so that I control time selection explicitly.

52. As a user when new batches publish or existing batches update, I want a notification that lets me choose when to switch (not automatic replacement), so that ongoing analysis sessions remain consistent.

53. As a forecaster when a batch is withdrawn, I want analysis/overview/discovery to stop showing it as valid and display explicit withdrawal reasons, so that I don't base decisions on revoked data.

54. As an operational user exporting from overview or discovery context, I want the export to lock the exact batches I was viewing (not follow subsequent page navigation changes), so that exported data matches what I analyzed.

### Data Integrity and Constraints

55. As a forecaster, I want coverage changes (spatial valid area varying across leads) to never be interpreted as weather trends, so that data boundary shifts don't appear as meteorological phenomena.

56. As an analyst, I want EC-AI differences to never be presented as proof of AI skill improvement without independent verification evidence, so that forecast differences don't become unverified quality claims.

57. As a user, I want unavailable real release inventory to render as unavailable/empty states (not fake data or rewritten default requests), so that I see honest data availability.

58. As a forecaster, I want the system to distinguish "catalog unknown" from "query range has no products", so that I understand whether the problem is service access or truly empty results.

59. As an operational user, I want TP capability restrictions to remain in effect until accumulation window, unit, f000, and valid time semantics are verified against actual products (not just upstream parameter names matching), so that TP doesn't enter operational use prematurely.

---

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
- **Tables**: TanStack Table (ADR-0007) - Headless table library for data grids

**Visualization:**
- **2D Maps**: MapLibre GL JS + deck.gl (ADR-0008) - Hardware-accelerated WebGL for meteorological field rendering
- **3D Terrain**: Three.js + @react-three/fiber (ADR-0009) - DEM mesh generation and cross-section sampling
- **Charts**: Recharts via shadcn/ui (ADR-0010) - Declarative React API for ensemble spread bands and time series

**Forecast Overview & Weather Process Discovery-Specific Application:**
Overview uses Recharts for temporal evolution trend visualization and ensemble spread time series, TanStack Query for fetching latest cycle summaries and polling batch update notifications. Discovery uses TanStack Table for ranked search results with sortable columns (extrema magnitude, change value, spread peaks, threshold member counts), date-fns for adjacent-hour change gap detection and lead time range validation.

### Module Organization

**Product Availability Service**
- Responsible for querying the authoritative product catalog and interpreting responses
- Returns structured availability state: `CatalogUnavailable`, `NoPublishedProducts`, `PartialCoverage`, `ProductsAvailable`
- Includes query conditions in all responses so that "no products" states can display what was queried
- Never synthesizes product existence; unavailable catalog returns explicit unavailable state
- Provides per-lead, per-region coverage metadata for partial availability cases

**Forecast Overview Summary Module**
- Takes: cycle, region boundary, published time range, published batch list per lead
- Computes: regional extrema (T max/min, SP min, wind max), temporal evolution metrics, ensemble spread peaks, threshold member support
- Each summary item preserves: actual valid time, lead, grid position, batch ID, calculation口径
- Partial results: when some items fail to calculate, returns successful items with per-item validity scope
- TP restriction: skips TP summaries until capability gate lifted, returns restriction notice
- Returns navigation context for each card: target sub-page (2D map, point analysis, ensemble view, regional analysis) with complete restore data (cycle, valid time, variable, position, batch)

**Weather Process Discovery Query Module**
- Takes: cycle, region, variable, valid time range, query category, optional threshold definition
- Query categories as separate computations: AI mean extrema (by variable), adjacent-hour regional mean changes, spread peaks, threshold member support
- Result structure: value, unit, time, lead, grid position/spatial range, region boundary, valid mask ratio, batch ID, calculation口径
- Ranking: per-category independent ranking; changes ranked by absolute magnitude preserving sign
- Gap handling: adjacent-hour changes only computed for consecutive valid hours (both hours published and exactly 1 hour apart); discontinuities explicitly excluded with gap count reported
- Invalid grids: exclude grids not having 10 valid members; report excluded count
- Returns navigation context per result: target sub-page, complete restore parameters (cycle, valid time, variable, position/region, batch, threshold if applicable)

**Analysis Context Carrier**
- Data structure passed across page navigation: `{ dataMode, cycle, validTime, lead, variable, expressionMode, position: {type: 'point' | 'region', coordinates, nearestGrid?}, batchId, thresholdDef? }`
- Validation on restore: verify batch still published and valid; if invalid, preserve request identity and display withdrawal/unavailable reason
- Default fallback: when context missing on entry, use page-specific defaults (overview: browser default region + latest published cycle; discovery: require explicit query entry)
- Link construction: all navigation from overview/discovery includes complete context; direct URL links accept context parameters

**Unavailable State Renderer**
- Takes: availability state enum, query conditions, partial results if any
- Renders distinct explanations for: `CatalogUnknown`, `NoPublishedProducts`, `HistoricalOnly`, `PartialCoverage`, `TPRestricted`, `CalculationFailed`
- "No published products" includes query conditions display (mode, cycle, region, time range)
- "Partial coverage" shows which items succeeded with their valid scope
- "Catalog unknown" never displays as "no forecasts"; explicitly states cannot confirm availability
- TP restriction shows capability gate status, not a generic error
- When summaries cannot be calculated, displays reason and does not show cached old values

### Shared Numerical口径

**Ensemble Mean and Spread**
- Scalar mean: arithmetic mean of 10 members in physical units before any unit conversion
- Spread: population standard deviation (sum of squared deviations / 10, then square root)
- Wind speed: per-member sqrt(U² + V²), then mean across members
- Wind direction: derived from mean U and mean V (meteorological convention: direction wind comes FROM); near-calm regions masked per published product validity rules
- Threshold member count: count members where condition holds (strict > or <, equality excluded); report as count/10, not probability

**Spatial Operations**
- Point: nearest 3km grid center to user-selected coordinates; if nearest grid invalid, report no value (do not relocate)
- Region: original rectangular boundary preserved; valid coverage computed as effective grid area / requested area; area-weighted aggregation over valid grids only
- AI-EC comparison: common valid grid mask computed per comparison; each comparison reports common mask coverage ratio

**Time Handling**
- Valid time = cycle + lead; all time selections display valid time AND lead simultaneously
- Adjacent-hour change: only valid when both hours published and exactly 1 hour apart per catalog; gaps break adjacency
- Time series: missing leads render as gaps (not interpolated); discontinuities explicitly marked

**TP Capability Gate**
- TP summaries, thresholds, changes, and formal exports disabled until: accumulation window, unit, f000 handling, and valid time semantics verified against actual published products
- Diagnostic views (explicit raw value inspection) may show TP with prominent unverified notice
- Gate status visible in page capability notices

### API Contract (Conceptual, Not Implementation Detail)

The spec avoids specific API paths, but modules expect:

- Product catalog service returns: per-cycle, per-lead availability with batch IDs, coverage bounds, member completeness, publish timestamp, withdrawal status
- Extrema and statistics computed from: AI ensemble mean fields, EC interpolated fields (where available), spread fields, individual member fields
- Threshold support computed per-grid: count of 10 members meeting condition
- Regional aggregation: area-weighted mean using valid grid areas
- Temporal queries: return only actually-published timesteps; gaps explicit

### Configuration and Defaults

**First-time User Defaults**
- Business region: Sichuan-Chongqing example (27-33°N, 102-108°E)
- Data mode: prefer business production if any published products exist, else historical replay
- Cycle: latest published cycle in selected mode
- Variable: temperature
- Expression: AI ensemble mean
- Valid time: first published valid time not earlier than current UTC (business mode), or earliest published valid time (historical mode); if all business valid times past, show latest with "cycle expired" notice

**Stored Preferences (Browser)**
- Default business region: single rectangle, stored on update
- Saved points: named point list with coordinates
- Recent export tasks: task IDs accessible from this browser

**Capability Gates**
- TP business use: disabled until semantic verification complete
- Three-dimensional terrain: disabled until DEM alignment verified

### State Management Considerations

- Overview and discovery maintain their own query state (selected cycle, region, time range, filters)
- Navigation to analysis passes context as URL parameters or structured navigation data (implementation choice)
- Analysis sub-pages share context via parent-level state (implementation choice), but context must be serializable for direct links
- Batch list per lead: track separately since multi-lead queries may use different batches per lead
- Update notifications: when new batch publishes during session, notify but do not auto-replace active context

### Navigation Flow Decisions

**From Overview**
- Extrema card → 2D map or point analysis with exact (cycle, valid time, variable, grid position, batch)
- Temporal change card → regional analysis with exact (cycle, time range, variable, region, batch list)
- Ensemble spread card → ensemble & threshold view with exact (cycle, valid time, variable, position, batch)
- Status issue → cycle details in forecast catalog

**From Discovery**
- Extrema result → 2D map or point analysis with exact result context
- Change result → regional analysis with exact result context
- Threshold result → ensemble & threshold view with exact result context including threshold definition
- Spread result → ensemble & threshold view with exact result context

**Return to Overview/Discovery**
- Restore original query filters and result scroll position
- Do not re-run query automatically; user explicitly refreshes if needed

### Error and Unavailable State Mapping

| Internal State | User-Facing Message | Available Actions |
|---|---|---|
| Catalog query failed (network/timeout) | "Product availability cannot be confirmed at this time. Unable to query catalog." | Retry query, view cached info if any |
| Catalog query succeeded, zero matches | "No published products for: [mode, cycle range, region]. Try adjusting filters." | Modify mode/region/time, view other cycles |
| Only historical products | "Only historical replay products available. No business production products found." | Switch to historical mode, view catalog |
| Partial coverage (some leads missing) | "Partial coverage: X of Y leads published. Details: [list available leads]." | Analyze available leads, view cycle details for gaps |
| TP capability restricted | "TP (precipitation) not available for operational use. Accumulation semantics pending verification." | Use T/SP/Wind, view restriction status |
| Batch withdrawn during session | "Batch [ID] withdrawn: [reason]. Analysis no longer valid." | Select alternative batch, return to catalog |
| Calculation failed (internal error) | "Unable to calculate [summary/query] at this time. Reason: [specific]." | Retry, report issue |

---

## Testing Decisions

### What Makes a Good Test

- **Test external behavior, not implementation details:** Tests should verify that given inputs produce expected outputs and state transitions, not that internal helper functions are called in a specific order.
- **Test unavailable states as first-class scenarios:** Every module must have tests for unavailable/error states, not just happy-path success cases.
- **Test context preservation across boundaries:** Navigation tests verify exact context (cycle, batch, position) passes through, not just that navigation occurs.
- **No synthetic data in tests:** Test data should mirror actual product metadata structure (batch IDs, coverage ratios, gaps) rather than always-complete mock data.

### Module Testing Strategy

**Product Availability Service Tests**
- Catalog unavailable (network failure) → returns `CatalogUnavailable` state
- Catalog available, no matches → returns `NoPublishedProducts` with query conditions
- Catalog available, only historical → returns `HistoricalOnly` state
- Catalog available, partial coverage → returns `PartialCoverage` with per-lead availability
- Catalog available, complete coverage → returns `ProductsAvailable` with batch list

**Forecast Overview Summary Tests**
- Complete data → extrema with correct positions, times, batches
- Partial coverage → successful items with per-item validity scope
- TP capability restricted → TP summary skipped, restriction notice included
- Single timestep vs. multi-hour → summary metadata reflects actual time range
- Spread calculation → population standard deviation (denominator 10)
- Navigation context → each card includes correct target sub-page and complete restore data

**Weather Process Discovery Query Tests**
- Extrema queries → ranked by magnitude, preserves position/time/batch
- Adjacent-hour change → only valid consecutive hours, gaps excluded, absolute ranking with sign
- Threshold member support → count/10 per valid grid, invalid grids excluded
- Spread peaks → ranked by spread value
- Empty results (no matches) → distinct from calculation failure
- Invalid grids → excluded from results, exclusion count reported
- Navigation context → results include target sub-page and complete restore parameters

**Analysis Context Carrier Tests**
- Complete context passed → analysis opens at exact state
- Batch withdrawn → preserves request identity, shows withdrawal reason
- Missing context on entry → uses page defaults
- Direct link with context → prioritizes link parameters over defaults

**Unavailable State Renderer Tests**
- Each state enum → correct user-facing message
- Query conditions included in "no products" messages
- Partial results → shows succeeded items with scope
- TP restricted → shows capability gate status

### Integration Testing Scenarios

**Overview to Analysis Round Trip**
1. User opens overview → sees latest cycle summary
2. User clicks wind max extrema card → enters 2D map at exact (cycle, valid time, wind variable, grid position, batch)
3. User returns → overview restores original state
4. New batch publishes → overview shows notification, user explicitly switches
5. User clicks same card → new navigation uses new batch

**Discovery Query to Analysis**
1. User enters discovery, selects cycle/region/variable/time range
2. User runs threshold query (wind > 15 m/s)
3. Results ranked by member support count
4. User clicks result → enters ensemble view with exact (cycle, valid time, wind, position, batch, threshold definition)
5. Ensemble view shows 10-member distribution at that grid with threshold line

**Unavailable State Handling**
1. Catalog query fails → overview shows "cannot confirm availability"
2. User adjusts region → new query succeeds, overview shows data
3. TP capability restricted → TP summary card shows restriction notice, does not appear in results
4. User selects cycle with partial coverage → overview shows available leads, skips missing leads in summaries

**Batch Withdrawal Propagation**
1. User views overview with batch A → summary cards reference batch A
2. Operations withdraws batch A → overview receives withdrawal event
3. Overview stops showing batch A as valid, displays withdrawal reason
4. User's saved export task referencing batch A → task shows batch withdrawn, file download disabled if in progress or stopped if complete

### Prior Art in Codebase

Since this is a new project (Next.js starter state), there are no existing tests to reference. Testing should follow:

- **Next.js App Router testing patterns:** React Server Components where applicable, Client Components for interactive queries
- **TypeScript type-safe tests:** Leverage discriminated unions for availability states
- **Testing library recommendations:** React Testing Library for component tests, MSW (Mock Service Worker) for API mocking if needed

### Testing Modules (to be tested)

1. `ProductAvailabilityService` (or equivalent data fetching layer)
2. `ForecastOverviewSummary` (computation module)
3. `WeatherProcessDiscovery` (query module)
4. `AnalysisContextCarrier` (navigation data structure and validation)
5. `UnavailableStateRenderer` (presentation logic)
6. Page components: `ForecastOverviewPage`, `WeatherProcessDiscoveryPage`

---

## Out of Scope

### Explicitly Excluded from This Spec

**UI Layout and Visual Design**
- Specific component library choices (shadcn/ui, Radix, etc.)
- Color schemes, typography, spacing systems
- Responsive breakpoints and mobile layouts
- Icon selection and illustration style
- Animation timing and transition effects
- Layout grid systems and card arrangements

**Backend, API, Database, and Deployment**
- API endpoint design and routing
- Database schema and query optimization
- Authentication and authorization implementation
- Server infrastructure and deployment pipelines
- Caching strategies and CDN configuration
- Service-level API contracts with external catalog services

**Model Training and CSC Tuning**
- Machine learning model architecture decisions
- CSC (ensemble diffusion) parameter selection
- Training data preparation and augmentation
- Model versioning and A/B testing infrastructure
- Hyperparameter optimization

**Real Data Production and Online Acceptance**
- Actual product generation scheduling
- Quality control workflows and acceptance criteria
- Production monitoring and alerting
- Data retention and archival policies
- Disaster recovery and failover procedures

**Production Task Creation and Scheduling**
- Creating new production runs from operations UI
- Automated scheduling rules for routine forecasts
- Dependency management between production steps
- Resource allocation and priority queuing
- Batch job orchestration

**Analysis Sub-Pages (Separate Spec)**
- 2D map rendering and layer management
- 3D terrain visualization
- EC-AI comparison view details
- Ensemble & threshold view implementation
- Point/region analysis time series
- Cross-cycle evolution comparison

**Forecast Catalog Pages (Separate Spec)**
- Cycle list filtering and pagination
- Cycle details layout and溯源display
- Valid time search interface

**Export Center (Separate Spec)**
- Export task configuration UI
- File format generation (NetCDF, CSV)
- Task queue management and download

**Historical Verification (Separate Spec)**
- Verification overview metrics computation
- Individual case error visualization
- Sample independence tracking

**Research Evaluation (Separate Spec)**
- Baseline metrics display
- Ablation experiment browser
- Research case gallery

**Operations Workspace (Separate Spec)**
- Production batch list and filtering
- Batch detail status display
- Retry, publish, and withdraw operations

### Boundary Clarifications

**This spec covers:**
- Overview and discovery page logic and data requirements
- Navigation context passing to analysis (what data to pass)
- Shared numerical calculation口径 (how to compute extrema, spread, thresholds)
- Unavailable state handling rules (when to show which message)

**This spec does NOT cover:**
- How analysis sub-pages render the received context (separate analysis spec)
- Specific React component code or file paths
- Detailed API endpoint URLs or request/response formats
- How the product catalog service is implemented internally

---

## Further Notes

### Terminology Consistency

All implementation must use GLOSSARY.md terms:
- 已发布产品 (published products), not "available forecasts"
- 起报周期 (cycle), not "initialization time" or "run time"
- 有效时刻 (valid time), not "forecast time" or "target time"
- 产品批次 (product batch), not "version" or "run ID"
- 业务区域 (business region), not "area of interest" or "domain"
- 集合均值 (ensemble mean), not "deterministic forecast"
- Spread, not "uncertainty" or "variance" (spread is standard deviation)

### Global Constraints Reiteration

1. **Never fabricate data:** Unavailable products render as unavailable states, never synthesized defaults
2. **Never silent substitution:** Requesting batch A that's withdrawn does not auto-switch to batch B without user action
3. **Distinguish unavailable types:** "Catalog unknown" ≠ "No products in range"
4. **Coverage changes ≠ weather trends:** Spatial mask changes across leads are data boundaries, not meteorological phenomena
5. **EC-AI differences ≠ skill improvement:** Forecast differences require independent verification to become quality claims
6. **TP capability gate:** TP remains restricted until accumulation window, unit, f000, and valid time semantics verified against actual products (not just parameter name matching)

### Context Preservation Rules

- Navigation from overview/discovery → analysis: pass complete context (cycle, valid time, variable, position, batch, threshold if applicable)
- Direct URL links: accept context parameters, prioritize over defaults
- Batch validation on restore: verify still published; if invalid, preserve request identity and show reason
- Multi-lead queries: track batch per lead independently
- Export from overview/discovery: lock exact batches being viewed, do not follow subsequent page changes

### Unavailable State Hierarchy

When multiple unavailable conditions exist, display in priority order:
1. Catalog unknown (service failure) — highest priority since no other facts can be verified
2. TP capability restricted (for TP queries) — feature-level restriction
3. No published products (empty query result) — data availability issue
4. Partial coverage (some leads missing) — incomplete but usable
5. Calculation failed (internal error) — computation issue on otherwise-valid data

### Development Phases Suggestion

While not mandating specific implementation order, a reasonable phasing:

**Phase 1: Product Availability Foundation**
- Product availability service with all state variants
- Unavailable state renderer
- Context carrier data structure

**Phase 2: Forecast Overview**
- Summary computation module
- Overview page with extrema cards
- Navigation to analysis (analysis receives context, rendering separately spec'd)

**Phase 3: Weather Process Discovery**
- Query module with all categories
- Discovery page with filters and results
- Navigation to analysis with context

**Phase 4: Integration and Edge Cases**
- Batch withdrawal propagation
- Update notifications
- Error recovery flows

### Open Questions for Future Decisions

(Not blocking this spec, but may need separate decisions)

1. **Saved query templates:** Should discovery allow saving common query configurations (e.g., "Wind >25 m/s in my region")?
2. **Result export from discovery:** Should discovery allow CSV export of result lists, or only navigation to analysis then export?
3. **Comparison mode:** Should overview support side-by-side comparison of two cycles (e.g., 00Z vs 06Z on same day)?
4. **Multi-region overview:** Should overview support showing summaries for multiple saved regions simultaneously?
5. **Threshold presets:** Should threshold presets be user-configurable, or remain fixed operational standards?

These do not block implementation of the core behavior defined above.

---

**End of Spec**
