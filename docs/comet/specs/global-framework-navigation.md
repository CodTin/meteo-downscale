# 实现规格：全局框架与导航

## Problem Statement

Users need to navigate between 27 pages across three entry points (business main navigation, research evaluation, operations workspace) while maintaining consistent analysis context (cycle, valid time, variable, location, batch). The platform must handle first-time entry with appropriate defaults, restore context from shareable links, manage batch updates and withdrawals, and distinguish between different unavailable states (目录未知 vs 无已发布产品 vs 产品可用性未确认).

Without a robust navigation framework, users would lose their analysis context when moving between pages, be unable to share specific analysis states with colleagues, and receive inconsistent behavior when products are updated or withdrawn.

## Solution

Implement a navigation framework with four core modules that handle routing, context management, initial state resolution, and access control. This framework ensures all 27 pages share consistent behavior for context preservation, link generation, batch locking, and permission enforcement, as specified in GLOSSARY.md.

## User Stories

1. As a regional meteorologist, I want to select a point on the forecast map and view its time series, so that the point location and current cycle/batch are preserved when I navigate to the point analysis page.

2. As a forecaster, I want to share a specific analysis view (including cycle, valid time, variable, region, and batch) with a colleague via URL, so that they can see exactly what I'm looking at.

3. As a meteorologist, I want to open a shared link to a specific batch, so that if that batch has been withdrawn I see a clear explanation and available alternatives rather than silently seeing different data.

4. As a business user opening the platform for the first time, I want to see the latest available forecast for my default region, so that I can immediately start my analysis without manual configuration.

5. As a user, I want the system to distinguish between "catalog unavailable" and "no published products in range", so that I understand whether to wait for system recovery or adjust my query.

6. As a forecaster analyzing a historical case, I want the true initialization date clearly marked, so that I don't confuse historical replay with current operational forecasts.

7. As a user viewing an analysis when a new batch is published, I want to be notified of the update but continue working with my current batch, so that my numbers don't change unexpectedly mid-analysis.

8. As a forecaster, I want to switch from the overview page's wind speed maximum to the 2D map, so that the exact time, location, and batch from the overview result are preserved in the map view.

9. As a user, I want to navigate from ensemble analysis to historical verification for the same cycle/lead/region, so that I can check the error pattern without re-configuring the query.

10. As a meteorologist, I want to return from point analysis to the weather process discovery page, so that my original search filters and result position are restored.

11. As a user with default region saved in browser, I want that region used on first entry, so that I don't need to select 川渝 bounding box every time.

12. As a forecaster, I want to switch between valid times within a cycle, so that each time step uses its correct published batch rather than assuming all leads share one batch.

13. As a user, I want to switch cycles while keeping my target valid time, so that the system finds the corresponding lead in the new cycle rather than guessing a nearby time.

14. As an operations user, I want access to the operations workspace entry, so that I can retry failed steps and publish products, while business users cannot access these controls.

15. As a business user, I want to access research evaluation when needed, so that I can review baseline metrics and ablation experiments without them cluttering the main business navigation.

16. As a forecaster, I want independent navigation within the six business pages, so that each page's working state (filters, selections, zoom level) is preserved when I switch between them.

17. As a user navigating from discovery results to ensemble analysis, I want the threshold definition (direction, value, unit) and member count preserved, so that I can verify the support for the identified threshold exceedance.

18. As a forecaster, I want to enter catalog search with a specific valid time, so that the system finds all cycles with published products for that moment rather than requiring me to check each cycle individually.

19. As a user, I want playback to skip missing lead times with clear indication, so that I understand the gaps rather than seeing interpolated frames.

20. As a forecaster viewing region time series, I want gaps in the time axis where leads are unpublished, so that I don't misinterpret coverage changes as weather changes.

21. As a user, I want batch withdrawal to affect all pages, active links, and export tasks consistently, so that invalid data cannot be presented as valid anywhere in the system.

22. As a forecaster, I want TP capability restrictions applied consistently across overview, difference layers, discovery, verification, and export, so that unverified accumulation windows don't leak into formal analysis.

23. As a user switching from 3D terrain to 2D map, I want to return to the exact cycle/valid time/variable/region I was viewing, so that failed DEM alignment doesn't lose my analysis state.

24. As an operations user viewing a production batch, I want read-only status in business catalog and full controls in operations workspace to be clearly separated, so that I don't confuse viewing permissions with action permissions.

25. As a user, I want the system to query the authoritative catalog each time rather than assume historical cycle lists, so that newly published products and withdrawn products are reflected accurately.

26. As a forecaster, I want mode (historical replay vs business production) preserved across all pages and files, so that research runs aren't labeled as operational forecasts.

27. As a user creating an export from analysis, I want the locked request to preserve my current cycle, valid times, region, and per-lead batches, so that the export doesn't follow subsequent page navigation.

28. As a user, I want export task tracking to be independent of production batch lists, so that I can monitor my export jobs without navigating to operations workspace.

29. As a forecaster, I want EC comparison to use each cycle's own EC rather than a fixed baseline, so that cross-cycle evolution doesn't mislead as downscaling improvement.

30. As a user opening historical verification from cross-cycle evolution, I want that specific cycle/lead/region/batch locked for the verification query, so that I don't accidentally verify a different case.

31. As a business user, I want research evaluation entry accessible but separate from main navigation, so that I can consult research evidence without research pages appearing in my daily workflow tabs.

32. As a user, I want navigation to validate data layer support at each target page, so that if an expression isn't supported I stay at my current page with explanation rather than losing context.

33. As a forecaster, I want saved point locations to preserve geographic coordinates and names, so that reopening them fetches current product grids rather than stale cached values.

34. As a user selecting a region, I want the original bounding box, effective coverage, and statistical mask preserved separately, so that the system doesn't silently rewrite my query bounds.

35. As a forecaster, I want wind expression (speed, direction, U10/V10) recorded independently from variable selection, so that switching between representations doesn't lose which meteorological element I'm analyzing.

36. As a user encountering partial coverage in a cycle, I want per-lead spatial validity indicated, so that I know which time steps and grids are actually available rather than assuming full coverage.

37. As an operations user retrying a failed batch, I want the new attempt ID distinct from the original failure record, so that retry history is auditable rather than overwriting evidence.

38. As a forecaster, I want member numbering (1-10) to be consistent across the five variables for the same cycle, so that I can identify the same ensemble member across T2m, SP, and wind fields.

39. As a user, I want insufficient independent verification samples to prevent aggregated skill metrics display, so that training-contaminated results aren't presented as forecast improvement.

40. As a forecaster, I want entry to any page to re-validate product availability, so that links to withdrawn batches explain the invalidity rather than redirecting to different data.

## Implementation Decisions

### Module Architecture

Four core modules implement the navigation framework:

1. **NavigationContextManager** - Manages the shared analysis context state
2. **InitialStateResolver** - Determines first-entry defaults and mode selection
3. **RouteAccessControl** - Enforces entry point and role-based permissions
4. **URLContextCodec** - Encodes/decodes shareable links

These modules are framework-agnostic and export pure functions, making them testable without Next.js runtime.

### Navigation Context State Schema

The analysis context is a typed object containing:

- `mode: 'business-production' | 'historical-replay'` - Data mode, preserved across all pages and files
- `cycle: string` - Initialization time in UTC ISO format
- `validTime: string` - Target valid time in UTC ISO format
- `lead: number` - Forecast lead hour, derived from validTime - cycle
- `variable: 'T2m' | 'SP' | '10m-wind' | 'TP'` - Selected meteorological variable
- `windExpression?: 'speed' | 'direction' | 'U10' | 'V10'` - Wind representation when variable is wind
- `region: { bounds: BoundingBox; effectiveCoverage?: SpatialMask }` - Rectangular query bounds and actual valid grids
- `point?: { userCoord: LatLon; nearestGrid: LatLon; name?: string }` - Point selection
- `batchPerLead: Map<number, string>` - Published batch ID for each lead in current analysis
- `dataLayer: 'ai-mean' | 'ai-member' | 'ai-spread' | 'ai-threshold' | 'ec' | 'ai-minus-ec'` - Current expression
- `thresholdDef?: { variable; direction; value; unit }` - Threshold definition when using threshold layer
- `memberIndex?: number` - Selected member (1-10) when using single-member layer

This is the complete context object. Individual pages may only need subsets, but all cross-page navigation operates on this schema.

### Context Preservation Rules

When navigating between pages:

1. **Within same top-level page** (e.g., forecast-analysis subpages): Preserve full context, validate target page supports selected data layer, fall back to AI mean if layer unsupported and explain.

2. **Between top-level pages** (e.g., overview → analysis): Carry cycle, validTime, variable, region/point, batchPerLead; re-validate at target and show availability errors without changing context.

3. **From aggregation to detail** (e.g., discovery → map): Preserve result's actual cycle/validTime/variable/location/batch, not page's current defaults.

4. **Return navigation**: Restore source page's filters, scroll position, and result highlighting using browser history state.

### Initial State Resolution Logic

On first entry to business navigation:

1. Query authoritative product catalog (fail → "产品可用性未确认" state)
2. Check browser localStorage for saved default region (fallback: 川渝 27-33°N, 102-108°E)
3. If business production products exist, select that mode; else select historical replay mode
4. Within selected mode, find latest published cycle (生产失败的新周期不替代已有发布周期)
5. Within that cycle, select first valid time >= current UTC; if all past, select last valid time and mark cycle as expired
6. Select T2m as default variable, AI ensemble mean as default expression
7. Query published batches for selected cycle's available leads

If catalog query fails or returns zero products, enter corresponding empty state without fabricating defaults.

### Shareable Link Format

Links encode full context as URL query parameters:

```
/forecast/analysis/2d-map?mode=business&cycle=2024-10-23T12:00:00Z&validTime=2024-10-23T18:00:00Z&variable=10m-wind&windExpr=speed&batch=batch-abc123&region=27,102,33,108&layer=ai-mean
```

On link open:

1. Parse and validate all parameters
2. Query catalog to verify batch is still published and valid
3. If batch withdrawn: show invalidity reason, preserve original batch ID in UI, offer available alternatives, do not auto-redirect
4. If parameters missing: use page-specific defaults and document which params were defaulted
5. If parameters invalid: show specific error (e.g., "Lead +6 not published for cycle 2024-10-23T12Z") with available options

### Batch Update and Withdrawal Handling

When a new batch is published for a cycle already in use:

- **Passive detection**: NavigationContextManager checks batch validity on each page navigation
- **Active notification**: When newer batch detected, show non-blocking notification "New batch R2 available" with "Switch" action
- **No auto-switch**: Current pages, export configurations, and verification queries continue referencing original batch until user explicitly switches
- **Switch action**: Re-validate new batch, update batchPerLead map, reload data for current view

When a batch is withdrawn:

- **Immediate invalidation**: Withdrawn batch cannot be used for new analysis or export
- **Existing views**: Show "Batch R1 withdrawn: [reason]" banner, list available alternatives, preserve original batch ID for traceability
- **In-progress exports**: Fail with clear reason
- **Completed exports**: Retain file metadata, block new downloads, preserve download history for audit
- **Verification queries**: Mark results as invalid, do not auto-substitute different batch

### Entry Point Access Control

Three entry points with distinct access:

1. **Business Main Navigation** (6 pages): Accessible to all authenticated users with business role
2. **Research Evaluation**: Accessible to all authenticated users, independent entry (not in main nav)
3. **Operations Workspace**: Accessible only to operations role, independent entry

Access control module checks role before rendering protected routes. Unauthorized access returns 403 with clear message, not silent redirect.

### TP Capability Gate

TP (accumulated precipitation) is conditionally available pending verification of accumulation window, units, and f000 alignment. The framework enforces:

- **Allowed**: Diagnostic raw value viewing with explicit "口径待核实" notice
- **Blocked until verified**: Overview business summary, formal difference layers, spread/threshold expressions, region business statistics, weather process discovery, historical verification, formal export

This is enforced in NavigationContextManager's data layer validation. Attempts to select TP in blocked contexts show specific "TP累计窗口未核实，暂不开放该能力" message.

### Empty State Distinctions

The framework distinguishes three unavailable states:

1. **产品可用性未确认** (Catalog unavailable): Cannot query catalog, don't know what exists. Show "查询状态: 目录服务暂不可访问，无法确认产品库存" with retry action.

2. **无已发布产品** (No products in range): Successful catalog query, zero results for current filters. Show "当前查询范围: [filters] 无已发布产品" with option to broaden query.

3. **未发布** (Internal production incomplete): Products exist in production pipeline but quality checks/publication not complete. Show "该周期/lead生产中，尚未发布" with read-only production status if available.

Never fabricate data, default to old values, or relabel one state as another.

### Route Structure

Next.js App Router routes:

```
/                                    # Redirects to /forecast/overview
/forecast/overview                   # Forecast Overview (default entry)
/forecast/analysis/2d-map            # 2D Map
/forecast/analysis/3d-terrain        # 3D Terrain
/forecast/analysis/ec-ai-compare     # EC-AI Comparison
/forecast/analysis/ensemble          # Ensemble & Threshold
/forecast/analysis/point-region      # Point/Region Analysis
/forecast/analysis/cross-cycle       # Cross-cycle Evolution
/forecast/catalog/cycles             # Cycle List
/forecast/catalog/cycle/[id]         # Cycle Detail
/forecast/catalog/valid-time         # Valid Time Search
/forecast/discovery                  # Weather Process Discovery
/forecast/verification/overview      # Verification Overview
/forecast/verification/case/[id]     # Verification Case Detail
/forecast/export/new                 # New Export
/forecast/export/tasks               # Export Task List
/forecast/export/task/[id]           # Export Task Detail
/research                            # Research Evaluation entry
/research/baseline                   # Baseline Metrics
/research/ablation                   # Ablation Experiments
/research/cases                      # Research Cases
/operations                          # Operations Workspace entry (role-gated)
/operations/batches                  # Production Batch List
/operations/batch/[id]               # Production Batch Detail
```

### Context Storage Strategy

- **In-memory**: React Context for current navigation session, survives SPA navigation
- **URL**: Full context encoded in query params for shareable links
- **localStorage**: Only default region preference, expires after 90 days
- **No server session**: Framework is stateless, all context client-side

### Integration with Product Catalog API

All initial state resolution, batch validation, and availability checks call a ProductCatalogAPI module (interface defined here, implementation out of scope):

```typescript
interface ProductCatalogAPI {
  queryCycles(filters: CycleQueryFilters): Promise<Result<Cycle[], CatalogError>>;
  queryValidTime(validTime: string, filters: ValidTimeQueryFilters): Promise<Result<CycleLeadPair[], CatalogError>>;
  getBatchInfo(batchId: string): Promise<Result<BatchInfo, CatalogError>>;
  listPublishedLeads(cycle: string, mode: Mode): Promise<Result<LeadInfo[], CatalogError>>;
}
```

The navigation framework depends on this interface but does not implement it. Catalog unavailability is a first-class state, not an error to be caught and hidden.

### Cross-Page State Transitions

From GLOSSARY.md validation scenarios, the framework must handle:

- **日常研判 flow**: overview → 2d-map (preserve point) → point-region (preserve cycle/batch) → export-new (lock request)
- **已知时刻 flow**: catalog/valid-time → cross-cycle → ec-ai-compare → verification (each row independent EC)
- **分享并返回 flow**: ensemble (with threshold) → shared link → open link (restore all params) → back navigation (restore source filters)

State transition tests will cover all validation scenarios from GLOSSARY.md section "无布局的行为检验场景".

### Return Path Preservation

When navigating from aggregation (overview, discovery, verification overview) to detail (analysis, verification case):

1. Store source page state in browser history: `{ sourceUrl, filters, scrollY, resultIndex }`
2. Target page receives context from source result, not source page defaults
3. Browser back button restores: URL, filters, scroll position, and highlights the originating result

Implementation uses Next.js `useRouter` with custom state in `router.push(url, { state })`.

### Concurrent Batch Resolution

A single analysis view may span multiple leads, each potentially from a different batch. The framework:

1. Queries catalog for each lead independently
2. Stores per-lead batch mapping in `batchPerLead`
3. UI displays batch provenance per time step, not cycle-wide
4. Export requests lock the exact `Map<lead, batchId>` from analysis time

Never assume all leads in a cycle share one batch.

### Mode Identity Preservation

`mode: 'business-production' | 'historical-replay'` is determined once at initial entry and preserved:

- Displayed in page header/breadcrumb on all pages
- Encoded in all URLs
- Included in export file metadata
- Used in catalog queries

Historical replay products show true initialization date, never relabeled as "current operational forecast".

### Research Entry Boundary

Research evaluation pages (`/research/*`) are accessible but visually separated:

- Not in main business navigation tabs
- Distinct entry button/link labeled "研究评价"
- Can link to business analysis only when cycle/validTime/region/batch have exact published correspondence
- Research cases without published business match show "仅研究资料可查看，无对应已发布业务产品"

### Operations Entry Boundary

Operations workspace (`/operations/*`) is role-gated:

- Requires `role: 'operations'` in auth context
- 403 for non-operations users with message "运营工作区仅供运营角色访问"
- Business catalog shows read-only production status; retry/publish/withdraw actions only in operations workspace
- Both workspaces may view same underlying batch, but action permissions differ

## Testing Decisions

### Test at Module Boundaries, Not UI

All four core modules (NavigationContextManager, InitialStateResolver, RouteAccessControl, URLContextCodec) export pure functions and are tested with unit tests. UI components are thin adapters over these modules.

### Use Validation Scenarios as Test Cases

GLOSSARY.md section "无布局的行为检验场景" provides 12 test scenarios. Each scenario becomes a test suite:

- 日常研判: Test context preservation through overview → map → point → export
- 已知时刻: Test valid time search → cross-cycle with independent EC per row
- 从演变复核误差: Test verification locks correct cycle/lead/batch
- 仅历史回放: Test mode selection when only historical products exist
- 分享并返回: Test link encoding/decoding and return path restoration
- 时效断档: Test gap handling in playback and time series
- 集合缺口: Test partial member validity per grid
- 目标周期不覆盖时刻: Test cycle switch with unavailable lead
- 批次更新: Test notification without auto-switch
- 批次撤回: Test invalidation propagation to all consumers
- 目录无法访问: Test catalog unavailable state
- TP原值存在: Test capability gate with unverified variable

### Mock Product Catalog API

Tests use a mock ProductCatalogAPI that returns canned responses for:

- Available cycles
- Published leads per cycle
- Batch info (valid, withdrawn, new version available)
- Valid time search results
- Catalog unavailable errors

This allows testing all state transitions without real backend.

### Test State Transitions, Not Rendering

Example test structure:

```typescript
describe('NavigationContextManager', () => {
  describe('批次撤回 scenario', () => {
    it('preserves withdrawn batch ID and shows alternatives when opened', async () => {
      const ctx = { cycle: '2024-10-23T12Z', batchPerLead: new Map([[6, 'R1']]) };
      mockCatalog.getBatchInfo.mockResolvedValue({ status: 'withdrawn', reason: '质量检查未通过', alternatives: ['R3'] });
      
      const result = await manager.validateContext(ctx);
      
      expect(result.status).toBe('invalid');
      expect(result.invalidReason).toContain('R1 已撤回: 质量检查未通过');
      expect(result.alternatives).toEqual(['R3']);
      expect(result.preservedBatchId).toBe('R1'); // For traceability
    });
  });
});
```

### Prior Art

Similar testing pattern exists in Next.js middleware for authentication. Our framework extends this to domain-specific navigation rules.

### Integration Test Scope

Integration tests (using Playwright) only cover:

1. Route access control (role enforcement)
2. URL encoding/decoding round-trip
3. Browser back/forward with state preservation

All business logic is unit tested.

### Test Against GLOSSARY.md Vocabulary

All test cases use exact terminology from GLOSSARY.md:

- 已发布产品, 未发布, 产品可用性未确认, 无已发布产品
- 数据模式, 起报周期, 有效时刻, 产品批次
- 业务主导航, 独立入口, 顶层页面, 子页面

This ensures tests verify requirements as stated.

## Out of Scope

### UI Layout and Visual Design

This spec defines functional behavior and module interfaces. Specific layout (header, sidebar, breadcrumbs), visual styling, animations, and responsive breakpoints are not specified.

### Product Catalog API Implementation

The spec defines the ProductCatalogAPI interface consumed by the navigation framework. The actual implementation (REST/GraphQL endpoints, database queries, caching strategy) is out of scope.

### Data Fetching and Visualization

How pages fetch and display meteorological data (grids, time series, statistics) is out of scope. This spec only covers navigation context that data fetching depends on.

### Authentication and Role Assignment

The spec assumes an auth context provides `{ userId, role: 'business' | 'operations', region? }`. How users authenticate and how roles are assigned is out of scope.

### Export Task Execution

The spec covers export request creation with locked context. How export tasks are queued, executed, and files generated is out of scope.

### Production Pipeline (Retry, Publish, Withdraw)

The spec defines read-only views of production batch state and enforces where action controls appear. The actual retry/publish/withdraw implementation is out of scope (covered in separate operations workspace tickets).

### Real-Time Updates

The spec defines passive batch update detection on navigation. Active push notifications or WebSocket subscriptions for new batches are out of scope for this slice.

### Analytics and Logging

User navigation tracking, page view analytics, and audit logs are not specified here.

### Error Boundaries and Crash Recovery

React error boundaries and crash recovery UI are not specified, though NavigationContextManager should gracefully handle API errors.

### Offline Support

The platform requires network connectivity to query the product catalog. Offline mode is out of scope.

### Mobile Responsive Navigation

The spec focuses on functional behavior. Mobile-specific navigation patterns (hamburger menu, bottom nav) are out of scope for this spec.

### Internationalization

All terminology is in Chinese as specified in GLOSSARY.md. Translation infrastructure is out of scope.

### Backend/API/Database Design

This spec is frontend-focused. Backend architecture, API contracts, database schema are out of scope.

### Model Training and CSC Parameter Tuning

Model training, configuration, and parameter tuning are explicitly out of scope per user constraints.

### Real Data Production and Launch Acceptance

Actual production data pipelines and launch acceptance testing are out of scope.

### Production Task Creation and Scheduling

Creating production tasks and scheduling rules are out of scope (separate future design).

## Further Notes

### Why Four Modules Instead of One Router

Separating concerns makes each module independently testable:

- **NavigationContextManager**: Pure state transitions, no Next.js dependency
- **InitialStateResolver**: Complex conditional logic, easily unit tested with mocked catalog
- **RouteAccessControl**: Security-critical, must be provably correct
- **URLContextCodec**: Serialization logic, needs exhaustive edge case coverage

A monolithic router would require integration tests for all combinations.

### Relationship to Page-Specific Tickets

This spec establishes the framework all pages depend on. Individual page tickets (overview, analysis, catalog, etc.) will:

1. Import NavigationContextManager to read/update context
2. Depend on InitialStateResolver for their first-entry defaults
3. Use URLContextCodec to generate shareable links
4. Assume RouteAccessControl has enforced permissions

Those tickets focus on page-specific UI and data fetching, not navigation plumbing.

### Glossary Compliance

Every decision in this spec traces to GLOSSARY.md:

- Context schema matches "分析上下文" definition (line 39)
- Initial state logic implements "首次打开业务入口" (line 77)
- Batch update handling follows "新批次发布或出现更新周期" (line 82)
- Withdrawal propagation implements "产品撤回或验证不再有效" (line 83)
- Empty states distinguish "产品可用性未确认" vs "无已发布产品" (lines 36-37)
- TP gate enforces line 71 restrictions

### Why Client-Side State Management

The navigation context is user-specific (saved region, current analysis) and ephemeral (no need to persist across sessions). Client-side state avoids server session complexity and enables instant navigation without server round-trips.

Shareable links encode full context in URL, allowing collaboration without shared server state.

### Batch Locking Philosophy

The framework locks batches at analysis creation time, not query time. This ensures:

- Export files match the analysis that created them
- Verification results aren't invalidated by concurrent batch updates
- Users can compare old and new batches explicitly rather than seeing silent changes

This trades freshness for consistency, appropriate for operational meteorology where traceability matters.

### Role Model

Two roles in scope:

- **business**: Accesses main navigation, research evaluation; read-only production status
- **operations**: Additionally accesses operations workspace; can retry, publish, withdraw

More granular permissions (read-only business users, regional restrictions) may be added later but don't affect the navigation framework architecture.

### Framework Extensibility

The four-module design allows future extensions without core changes:

- Adding new pages: Import NavigationContextManager, follow context schema
- Adding entry points: Extend RouteAccessControl with new role checks
- Adding context fields: Extend schema, update URLContextCodec, default to undefined for old links
- Adding availability states: Extend InitialStateResolver state machine

### Integration with ADRs

No ADRs currently exist in docs/adr/. This spec establishes architecture that future ADRs may reference. Key decisions (client-side state, four-module separation, batch locking) should be captured in ADRs once approved.

### Prototype Evidence

No prototype exists yet. This spec synthesizes decisions from YU-272 and YU-282 resolution comments and GLOSSARY.md into an implementation-ready design.

### Next Steps After This Spec

1. Implement four core modules with unit tests
2. Create Next.js App Router routes with RouteAccessControl
3. Build NavigationContext React provider
4. Stub ProductCatalogAPI with mock data
5. Implement first page (overview) to validate framework
6. Iterate on remaining pages using proven framework

Each page implementation will be a separate ticket depending on this one.
