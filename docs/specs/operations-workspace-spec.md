# Implementation Spec: Operations Workspace and Product Release/Withdrawal

## Problem Statement

Operations personnel need dedicated workspace to manage production batches, diagnose failures, retry failed steps, and control product publication to business users. Currently, business users see read-only production status in the forecast catalog, but there is no operations-specific interface for:

- Viewing production batch records with diagnostic information across input validation, execution steps, quality checks, and publication status
- Identifying failure root causes with upstream data availability, input readiness, execution errors, and quality check results
- Retrying failed production steps with proper configuration traceability and new attempt tracking
- Publishing validated products to make them available for business analysis
- Withdrawing published products when quality issues are discovered

The operations workspace must maintain strict role boundaries—only authorized operations personnel can access production controls—while ensuring business forecast pages continue referencing stable published batches throughout retry and republication workflows.

## Solution

Implement an independent operations workspace with two sub-pages: Production Batch List for retrieval and status overview, and Production Batch Detail for diagnostics, traceability, and operation entry points (retry, publish, withdraw). Operations are executed within batch detail context with role verification, state validation, and explicit confirmation of scope and impact.

The workspace separates production attempt records from publication records, preserving failure history and published batch traceability. Failed step retries generate new production attempt identities while keeping original failure records. Publication and withdrawal create new publication records without overwriting previous states. Business pages continue using their locked batch references until users explicitly switch or products are withdrawn.

## User Stories

1. As an operations personnel, I want to filter production batches by mode/cycle/lead/region/status, so that I can quickly locate failed batches requiring attention
2. As an operations personnel, I want to see production batch list sorted by time descending, so that I can prioritize recent failures
3. As an operations personnel, I want distinct status dimensions (input/execution/quality/publication), so that I can diagnose where each batch failed
4. As an operations personnel, I want to enter batch detail from the list, so that I can investigate specific failure causes
5. As an operations personnel, I want the list to preserve my filter selections when returning from detail, so that I don't lose my working context
6. As an operations personnel, I want empty results to clearly distinguish "no matching records" from "query service failed", so that I know whether to adjust filters or report infrastructure issues
7. As an operations personnel, I want batch detail to show input source and actual receipt time, so that I can verify upstream data availability
8. As an operations personnel, I want batch detail to show required field completeness and member integrity, so that I can identify missing input components
9. As an operations personnel, I want batch detail to show execution step status (pending/running/success/failure), so that I can identify which step failed
10. As an operations personnel, I want batch detail to show failure causes with actual error messages, so that I can diagnose root problems
11. As an operations personnel, I want batch detail to show spatial coverage and valid mask, so that I can assess partial availability
12. As an operations personnel, I want batch detail to show configuration and model identity, so that I can trace production parameters
13. As an operations personnel, I want batch detail to separately track production attempts and publication records, so that I can distinguish "step succeeded" from "product published"
14. As an operations personnel, I want retry operations to verify prerequisites (failed step known, upstream ready, original config traceable, role authorized), so that retry requests are valid
15. As an operations personnel, I want retry to generate new production attempt identity, so that I can track multiple retry attempts
16. As an operations personnel, I want retry to preserve original failure records, so that failure history is not lost
17. As an operations personnel, I want retry submission to return attempt identity and status, so that I can track the new attempt
18. As an operations personnel, I want duplicate retry submissions to report existing in-progress attempts, so that I don't create redundant work
19. As an operations personnel, I want retry failures to preserve failure reasons, so that I can re-verify prerequisites
20. As an operations personnel, I want successful retry to still require quality check and publication, so that business users only see validated products
21. As an operations personnel, I want retry to not overwrite existing published batches, so that business pages continue working during retry
22. As an operations personnel, I want publication operations to verify target batch/lead/spatial scope, so that publication scope is explicit
23. As an operations personnel, I want publication operations to verify ten-member completeness and required variable/unit/grid/quality checks, so that only validated products are published
24. As an operations personnel, I want publication to respect variable capability restrictions (e.g., TP semantic verification), so that unverified variables don't enter business products
25. As an operations personnel, I want publication operations to preview target and impact scope before submission, so that I understand what will be affected
26. As an operations personnel, I want publication submission to re-verify permissions and state, so that concurrent changes are detected
27. As an operations personnel, I want publication to record publication identity, operation time/role, batch used, and reason, so that publications are auditable
28. As an operations personnel, I want duplicate publication of the same valid record to not create different content, so that idempotent operations are safe
29. As an operations personnel, I want new batch publication to preserve old batch traceability, so that history is not lost
30. As an operations personnel, I want publication check failures to report specific reasons, so that I can address validation issues
31. As an operations personnel, I want publication permission failures to report authorization problems, so that I know to request proper access
32. As an operations personnel, I want publication concurrent state change failures to report what changed, so that I can re-verify and retry
33. As an operations personnel, I want withdrawal operations to specify withdrawal scope and reason, so that withdrawal intent is documented
34. As an operations personnel, I want withdrawal to record withdrawal identity/time/role, so that withdrawals are auditable
35. As an operations personnel, I want withdrawal to stop providing valid analysis or new exports, so that withdrawn products are not used
36. As an operations personnel, I want withdrawal of one batch to preserve other un-withdrawn batches in the same cycle, so that partial withdrawals are supported
37. As an operations personnel, I want mistaken withdrawals to require re-verification and new publication record, so that re-publication is deliberate
38. As an operations personnel, I want original withdrawal records to be preserved after re-publication, so that withdrawal history is retained
39. As a business user, I want existing pages to re-verify batch validity and show invalidation reason when products are withdrawn, so that I know analysis is no longer valid
40. As a business user, I want direct analysis links to re-verify original batch and show failure reason when invalidated, so that bookmarked links remain safe
41. As a business user, I want historical verification to re-verify original batch and show failure reason, so that verification results stay tied to specific batches
42. As a business user, I want in-progress exports to fail when source product is withdrawn, so that export content matches publication status
43. As a business user, I want completed export tasks to preserve generation record but stop new downloads when source withdrawn, so that export history is retained with status update
44. As a business user, I want alternative batch selection to require explicit choice, so that batch substitution is never silent
45. As a business user, I want business forecast catalog to remain read-only, so that production controls stay in operations workspace
46. As a business user, I want to continue using current published batch during retry, so that analysis is not interrupted by production attempts
47. As a business user, I want pages to show update notifications when new batch published, so that I can choose to switch
48. As a business user, I want pages to continue referencing original batch until I explicitly switch, so that batch changes are user-controlled
49. As a business user, I want export requests to not automatically adopt new batches, so that export content matches request intent
50. As an operations personnel, I want role verification to occur before operation entry and at operation submission, so that authorization is current
51. As an operations personnel, I want permission or state changes after page load to trigger re-verification, so that stale permissions don't allow invalid operations
52. As an operations personnel, I want operations workspace to execute fixed production contract operations only, so that scope is bounded
53. As an operations personnel, I want CSC custom parameter tuning to not be exposed, so that operations don't become model research
54. As an operations personnel, I want task creation and scheduling to be explicitly out of scope for this phase, so that expectations are clear
55. As an operations personnel, I want absence of production records to not imply automatic production should start, so that production is deliberate
56. As an operations personnel, I want input status to distinguish "not checked", "waiting for required input", "input validation failed", "input ready", so that I can identify input-stage problems
57. As an operations personnel, I want input validation failures to include actual observation time and missing fields, so that I can verify upstream
58. As an operations personnel, I want input status to not assert permanent unavailability from single upstream timeout, so that transient failures are not confused with permanent gaps
59. As an operations personnel, I want execution step status to distinguish "pending", "running", "success", "failure" by actual step, so that I can identify execution-stage problems
60. As an operations personnel, I want quality check status to distinguish "pending check", "passed", "failed" with check scope/reason/member completeness, so that I can identify quality-stage problems
61. As an operations personnel, I want publication status to distinguish "unpublished", "published", "withdrawn" with publication identity and scope, so that I can identify publication-stage status
62. As an operations personnel, I want cycle-level aggregation status to clearly indicate it represents multiple lead/spatial ranges, so that I don't mistake partial success for complete validation

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

**Operations Workspace-Specific Application:**
Operations workspace uses TanStack Table for production batch list with multi-dimensional status filtering (input/execution/quality/publication), TanStack Query for polling batch status and managing retry/publish/withdraw operation state, Recharts for displaying production timeline diagnostics and quality check trends.

### Module Structure

**Operations workspace module**:
- Independent top-level navigation entry, separate from business navigation
- Role-gated access: only operations-authorized roles can enter
- Two sub-pages: Production Batch List and Production Batch Detail
- Shared state management for filter preservation across list/detail navigation

**Role verification module**:
- Role check on workspace entry and sub-page access
- Re-verification before operation submission (retry/publish/withdraw)
- Permission change detection for concurrent authorization updates
- Clear failure messages distinguishing "not authorized" from "record service failed"

**Production record query module**:
- Filter production batches by: mode, cycle, lead, region, batch ID, production/check/publication status
- Time descending sort by default
- Separate status dimensions: upstream observation, input validation, execution steps, quality checks, publication
- Empty result handling: distinguish "no matching records" from "query service failed"

**Batch detail inspection module**:
- Display input source, receipt time, required field completeness, member integrity
- Display execution step status with step-by-step breakdown
- Display failure causes with actual error messages
- Display spatial coverage, valid mask, configuration identity, model identity
- Display published product association (if any)
- Separate production attempt records from publication records

**Retry operation module**:
- Prerequisite verification: failed step identified, upstream/predecessor ready, original config traceable, role authorized
- Request construction: cycle, lead, region, original batch, failed step, config
- New production attempt identity generation
- Original failure record preservation
- Submission result: attempt identity and actual status
- Duplicate submission detection: report existing in-progress attempt
- Failure preservation: retain failure reason for re-diagnosis
- Post-retry validation: success still requires quality check and publication before business availability
- Published batch preservation: retry does not overwrite/withdraw existing published batches

**Publication operation module**:
- Target verification: batch/lead/spatial scope explicit, ten-member complete, required variable/unit/grid/quality checks passed
- Variable capability gating: respect product semantic verification (e.g., TP accumulation window)
- Scope-limited publication: only publish verified scope, no whole-cycle implicit publication of all theoretical leads
- Preview: display target and impact scope before submission
- Submission re-verification: permissions and state re-checked at submission time
- Publication record: identity, operation time/role, batch used, reason
- Idempotent behavior: duplicate publication of same valid record does not create different content
- Batch version management: new batch publication preserves old batch traceability
- Validation failure handling: report specific check failures, permission failures, concurrent state changes
- No bypass: no forced publication bypassing checks

**Withdrawal operation module**:
- Scope specification: explicit withdrawal range and reason
- Withdrawal record: identity, time, role
- Propagation: withdrawn batch stops providing valid analysis or new exports
- Selective withdrawal: withdrawal of one batch preserves other un-withdrawn batches in same cycle
- Re-publication after mistaken withdrawal: requires re-verification and new publication record, original withdrawal record preserved

**Business page batch reference module**:
- Batch locking: analysis locks to specific published batch
- Validity re-verification: re-check batch validity on page load and operations
- Invalidation handling: display invalidation reason, offer alternative batch selection (user explicit choice)
- Update notification: show notification when new batch published, user controls switch timing
- Export consistency: export requests lock to original batch, do not auto-adopt new batches
- Direct link handling: re-verify original batch identity, show failure reason if invalidated
- Historical verification handling: lock to original batch, show failure reason if invalidated

### Data Model Contracts

**Production batch identity**:
- Mode (historical replay / business production)
- Cycle (UTC initialization time)
- Lead (forecast lead time)
- Region (spatial coverage)
- Batch ID (unique production attempt identifier)
- Configuration identity (traceable production parameters)
- Model identity (model version for audit)

**Production status dimensions**:
- Input status: not_checked | waiting_input | validation_failed | input_ready
  - Fields: observation time, required fields, missing fields
- Execution status: pending | running | success | failure (per step)
  - Fields: step identifier, start time, end time, error message
- Quality check status: pending_check | passed | failed
  - Fields: check scope, failure reason, member completeness (10-member verification)
- Publication status: unpublished | published | withdrawn
  - Fields: publication identity, publication time, operator role, withdrawal reason (if withdrawn)

**Production attempt vs publication record**:
- Production attempt: input → execution → quality check status
- Publication record: publication decision, time, operator, batch reference, scope
- A batch may have multiple production attempts (original + retries)
- A batch may have multiple publication records (publish → withdraw → re-publish)
- Production success ≠ publication; both are explicit states

**Retry request contract**:
- Target: cycle, lead, region, original batch ID, failed step
- Configuration: original configuration identity (must be traceable)
- Output: new production attempt ID, initial status
- Constraint: cannot retry already-running or already-successful step as "failed retry"

**Publication request contract**:
- Target: batch ID, lead, spatial scope
- Validation: ten-member complete, required variables validated, quality check passed, variable capabilities verified
- Output: publication record ID, publication time, operator role
- Constraint: only publish verified scope, explicit per-lead publication

**Withdrawal request contract**:
- Target: batch ID (or batch + lead + spatial scope for partial withdrawal)
- Reason: withdrawal reason text
- Output: withdrawal record ID, withdrawal time, operator role
- Propagation: invalidate business analysis, stop new exports, preserve completed export records with status update

### API / Service Boundaries

**Operations workspace service**:
- `listProductionBatches(filters)`: returns paginated batch list with status summary
- `getProductionBatchDetail(batchId)`: returns full diagnostic information
- `retryFailedStep(batchId, step, config)`: submits retry request, returns attempt ID
- `publishProduct(batchId, lead, scope, validation)`: submits publication request, returns publication record
- `withdrawProduct(batchId, scope, reason)`: submits withdrawal request, returns withdrawal record

**Role authorization service**:
- `checkOperationsRole(userId)`: returns authorization status
- `verifyOperationPermission(userId, operation, target)`: returns permission verification for specific operation

**Production record service**:
- `queryBatches(filters, sort, pagination)`: returns matching production records
- `getBatchStatus(batchId)`: returns current status across all dimensions
- `getProductionAttempts(batchId)`: returns all production attempts for a batch
- `getPublicationRecords(batchId)`: returns all publication records for a batch

**Business page batch service**:
- `verifyBatchValidity(batchId)`: returns validity status and failure reason if invalid
- `getPublishedBatchForCycle(cycle, lead)`: returns currently published batch
- `notifyBatchUpdate(cycle, lead, newBatchId)`: triggers update notification for business pages

### Testing Seams

**Operations workspace role gate**:
- Test: authorized operations role can enter workspace
- Test: unauthorized role receives clear "not authorized" message
- Test: concurrent role revocation detected at operation submission

**Production batch list filtering**:
- Test: filter by mode returns only matching mode batches
- Test: filter by cycle/lead/region returns only matching batches
- Test: filter by status dimension returns batches with matching status
- Test: combined filters use AND logic
- Test: empty result returns "no matching records" message
- Test: query service failure returns "query failed" message

**Production batch detail display**:
- Test: input status shows observation time, required fields, missing fields
- Test: execution status shows per-step status and error messages
- Test: quality check status shows check scope, failure reason, member completeness
- Test: publication status shows publication identity or "unpublished"
- Test: production attempts and publication records displayed separately
- Test: spatial coverage and configuration identity displayed

**Retry operation prerequisites**:
- Test: retry blocked when step not failed (pending/running/success)
- Test: retry blocked when upstream input not ready
- Test: retry blocked when original config not traceable
- Test: retry blocked when role not authorized
- Test: retry allowed when all prerequisites met

**Retry operation execution**:
- Test: retry generates new production attempt ID
- Test: retry preserves original failure record
- Test: retry submission returns attempt ID and status
- Test: duplicate retry submission reports existing in-progress attempt
- Test: retry failure preserves failure reason
- Test: successful retry still requires quality check and publication
- Test: retry does not overwrite existing published batch

**Publication operation validation**:
- Test: publication blocked when ten members not complete
- Test: publication blocked when required variable validation failed
- Test: publication blocked when quality check not passed
- Test: publication blocked when variable capability not verified (e.g., TP accumulation window)
- Test: publication blocked when role not authorized
- Test: publication allowed when all validations pass

**Publication operation execution**:
- Test: publication preview displays target and impact scope
- Test: publication submission re-verifies permissions
- Test: publication submission re-verifies state
- Test: publication creates publication record with identity/time/role/batch/reason
- Test: duplicate publication of same valid record returns existing publication
- Test: publication check failure returns specific validation failure reason
- Test: publication permission failure returns authorization failure reason
- Test: publication concurrent state change returns state change description

**Withdrawal operation execution**:
- Test: withdrawal specifies explicit scope and reason
- Test: withdrawal creates withdrawal record with identity/time/role
- Test: withdrawal invalidates batch for business analysis
- Test: withdrawal stops new exports from withdrawn batch
- Test: withdrawal preserves completed export records with updated status
- Test: withdrawal of one batch preserves other batches in same cycle
- Test: mistaken withdrawal requires re-verification and new publication for re-opening

**Business page batch reference**:
- Test: business page locks to specific published batch identity
- Test: business page re-verifies batch validity on load
- Test: business page displays invalidation reason when batch withdrawn
- Test: business page offers explicit alternative batch selection when original invalid
- Test: business page shows update notification when new batch published
- Test: business page continues using original batch until user explicitly switches
- Test: export request locks to original batch, does not auto-adopt new batch
- Test: direct analysis link re-verifies original batch, shows failure reason if invalid
- Test: historical verification re-verifies original batch, shows failure reason if invalid
- Test: in-progress export fails when source batch withdrawn
- Test: completed export preserves record with "source withdrawn" status update

### Prior Art for Tests

**Role-gated workspace access**: Similar to admin panel access patterns in existing codebase (if any role-based access exists)

**Status dimension filtering**: Similar to forecast catalog filtering (YU-289 周期列表)

**Batch validity re-verification**: Similar to product availability re-verification in business pages (see GLOSSARY.md shared entry/update/return rules)

**Operation prerequisite validation**: Follow form validation patterns with explicit prerequisite checks before submission

**Audit trail recording**: Publication/withdrawal records follow audit log patterns (operation identity, time, operator role, reason)

## Out of Scope

**UI layout and visual design**: This spec defines functional behavior and data contracts; specific component placement, styling, color schemes, and visual hierarchy are determined separately

**Backend/API/database implementation**: This spec defines service boundaries and contracts; actual API endpoint design, database schema, query optimization, and deployment architecture are implementation details

**Model training and CSC parameter tuning**: Operations workspace executes fixed production contracts; model research, parameter sweeps, and CSC custom tuning belong to separate research tools

**Real data production and online validation**: This spec assumes production infrastructure exists; actual data ingestion, processing pipeline setup, and production environment validation are separate operational work

**New production task creation and scheduling**: As confirmed in YU-301, task creation and scheduling rules are deferred to subsequent design; this phase covers viewing records, retry, publish, and withdraw only

**Automatic production triggering**: Absence of production records does not imply automatic production should start; production task creation requires explicit design and user intent

**Upstream data source integration**: Integration with ECMWF/GFS upstream services, data source authentication, and upstream availability monitoring belong to data ingestion layer

**Export file generation infrastructure**: Export task generation, file format serialization, and storage lifecycle management are covered by export center design (YU-280, YU-294, YU-295, YU-296)

**Cross-device synchronization**: Operations workspace state (filters, navigation history) is browser-local; cross-device sync or user account preferences are not in scope

**Bulk operations**: Batch publication/withdrawal of multiple cycles or leads in one operation is not included; operations target explicit batch + lead + scope

**Operation history search**: While publication/withdrawal records are preserved, complex audit log search/filtering across all operations is not included in this phase

**Notification system**: Update notifications to business users are in-page notifications; email, SMS, or external notification integrations are out of scope

**Performance monitoring and alerting**: Production failure alerting, latency monitoring, and operational dashboards for platform health are separate operational concerns

## Further Notes

**Terminology consistency**: This spec uses GLOSSARY.md terminology throughout:
- "Production batch" not "job" or "task"
- "Publication" not "release" or "deployment"
- "Withdrawal" not "rollback" or "unpublish"
- "Operations personnel" not "admin" or "operator"
- "Business user" not "end user" or "forecast user"

**Status dimension separation**: Input validation, execution steps, quality checks, and publication are separate status dimensions because:
- Each has different failure modes and remediation paths
- Input failures require upstream data verification
- Execution failures require infrastructure diagnosis
- Quality check failures require re-verification or configuration adjustment
- Publication is a deliberate decision, not automatic after quality pass

**Production attempt vs publication record separation**: These are separate because:
- One batch may have multiple production attempts (original + retries)
- One batch may have multiple publication records (publish → withdraw → re-publish)
- Production success is technical validation; publication is operational decision
- Business pages reference publication records, not production attempts

**Retry generates new attempt identity**: This ensures:
- Original failure is preserved for diagnosis
- Multiple retry attempts are traceable
- Retry history is queryable
- No risk of overwriting failure evidence

**Publication does not overwrite old batches**: This ensures:
- Business pages continue working during new batch production
- Old batch remains traceable after new batch published
- Users control when to switch from old to new batch
- Export requests remain tied to original batch until user explicitly changes

**Role verification at multiple checkpoints**: Role is verified at:
- Workspace entry: prevents unauthorized users from seeing operations interface
- Operation display: controls which operation buttons are shown
- Operation submission: prevents stale permission exploits
This defense-in-depth approach ensures authorization is current at decision time.

**No automatic batch substitution**: When a batch becomes invalid, business pages:
- Display clear invalidation reason
- Offer explicit alternative batch selection
- Require user confirmation to switch
This prevents silent data changes that could mislead analysis.

**Variable capability gating**: TP accumulation window verification is one example of semantic validation gates. The pattern applies to any variable where semantic verification is incomplete—the variable may have data arrays, but formal business capability remains restricted until verification completes.

**Prerequisite verification for retry**: Retry is not "run this step again"; it's "this step failed, prerequisites are now ready, create new attempt with same configuration". This distinction ensures:
- Retries are deliberate, not accidental
- Prerequisites are re-verified (upstream data may have arrived)
- Configuration traceability is maintained
- Already-running or successful steps are not disrupted

**Quality check still required after successful retry**: Successful execution means the step completed without errors, not that output passed quality validation. Separating execution success from quality validation allows:
- Different failure remediation paths (re-run vs adjust validation criteria)
- Quality standards to evolve without re-running production
- Quality failures to be investigated without assuming execution bugs

**Cycle aggregation status caveat**: When batch list shows cycle-level status (e.g., "partially available"), this aggregates multiple lead/spatial records. The spec ensures this is clearly labeled to prevent misinterpretation as "this specific batch passed all steps".

**Integration with existing business page rules**: Operations workspace decisions reference and extend existing GLOSSARY.md rules:
- Batch locking (GLOSSARY.md "分析上下文")
- Validity re-verification (GLOSSARY.md "产品撤回或验证不再有效")
- Update notification without auto-switch (GLOSSARY.md "新批次发布或出现更新周期")
This ensures operations workspace fits within established product behavior.

**Scope boundary with task creation**: Task creation and scheduling design is explicitly deferred because:
- Scheduling rules (when to produce which cycles) require user input on operational priorities
- Automatic vs manual production triggers have different infrastructure requirements
- Scheduling belongs to production automation layer; this spec covers production outcome inspection and control
The boundary ensures this slice delivers inspection and control capability without blocking on scheduling design.
