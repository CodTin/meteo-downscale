# Export Center Implementation Spec

**Version:** 1.0  
**Date:** 2024-10-05  
**Status:** Ready for Implementation  
**Linear Issues:** YU-280, YU-294, YU-295, YU-296

---

## Problem Statement

Professional meteorologists analyzing AI 3km ensemble forecasts need to extract published forecast data with complete traceability for downstream use in reports, external systems, and archival. Currently, there is no mechanism to:

- Configure and submit data export requests that preserve the exact published batch identity
- Track the generation status of export tasks independently from ongoing analysis sessions
- Download generated files with complete provenance metadata (cycle, lead, batch, grid coordinates, physical units)
- Return to in-progress or completed exports without losing access context

As a result, users cannot take analyzed forecast data outside the platform while maintaining scientific reproducibility and quality assurance.

---

## Solution

The Export Center provides a three-page workflow for configuring, tracking, and retrieving data exports:

1. **New Export Configuration Page:** Pre-fill from current analysis context, select output format (NetCDF grid or CSV point/region), choose data layers (mean/spread, full ensemble, EC comparison, threshold exceedance), validate constraints (≤256×256 grid points, ≤24 lead times), and submit after verifying all requested leads are published
2. **Task List Page:** View all export tasks accessible to the current user/browser, see generation status, download completed files within retention period, retry failed requests
3. **Task Detail Page:** Inspect locked request metadata, actual batch identities used during generation, file availability status, and failure reasons

The workflow separates export task lifecycle from page navigation—users can configure an export from analysis, leave to continue forecasting, and return later to download results. All exports lock to specific published batches at submission time and fail explicitly if source products are withdrawn during generation.

---

## User Stories

1. As a meteorologist analyzing a specific forecast cycle, I want to export the AI ensemble mean temperature field for my business region and time range, so that I can incorporate 3km forecast data into regional weather briefings
2. As a forecaster reviewing ensemble spread, I want to export all 10 members for a critical valid time, so that I can perform offline statistical analysis
3. As an analyst comparing AI and EC forecasts, I want to export AI mean, EC interpolated, and AI−EC difference together, so that the comparison remains aligned to the same grids and batches
4. As a user configuring a grid export, I want to see immediate feedback when my selected region exceeds 256×256 points, so that I can adjust the spatial extent before submission
5. As a user submitting an export request, I want the system to block submission if any requested lead time is unpublished, so that I don't receive incomplete files without realizing data is missing
6. As a user who has left the analysis page, I want to return to the Export Center task list and see all my in-progress and completed exports, so that I can download files when ready
7. As a user downloading an export file, I want the file to contain complete metadata including cycle, lead, batch ID, grid coordinates, physical units, and member numbers, so that I can verify data provenance later
8. As a user whose export failed due to missing data, I want to see the specific failure reason, so that I can modify the request and resubmit
9. As a user whose source batch was withdrawn after export completion, I want to see a clear notice that the file is no longer available for new downloads, so that I understand the data validity status
10. As a user exporting point time-series or regional statistics to CSV, I want the output to preserve actual grid coordinates and coverage for each lead, so that I know which data points are valid vs. missing
11. As a user selecting threshold exceedance counts, I want to specify the variable, comparison direction (> or <), numeric value, and unit, so that the export matches my defined threshold exactly
12. As a user previewing an export request, I want to see the total number of grid points, lead times, and selected data layers, so that I can verify the request scope before submission
13. As a user with an active export task, I want the task to remain accessible in my current browser session, so that I can check status without losing the task reference
14. As a user whose completed export file has expired after 7 days, I want to see the expiration notice with the original request preserved, so that I can copy the configuration and regenerate the file
15. As a user viewing task metadata records after 30 days, I want to see a retention policy notice, so that I understand when task history will be removed
16. As a user who accidentally navigated away from the New Export page, I want to return and see my partially configured request still filled, so that I don't have to re-enter all parameters
17. As a user exporting wind speed mean and spread, I want these derived from U/V components according to the documented formula, so that exported wind speed matches the values shown in analysis pages
18. As a user at the 24-lead-time limit, I want clear messaging that the constraint is due to file size and processing time, so that I understand why longer ranges require multiple requests
19. As a user whose export is still generating, I want to view task details and see which batch IDs were locked at submission, so that I know exactly which data will be in the file
20. As a user returning to analysis from a task detail page, I want the analysis pages to reload with the original export request context (cycle, region, variable, time range), so that I can verify what I requested

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

**Export Center-Specific Application:**
Export Center uses TanStack Table for task list grid with sortable columns and status filtering, TanStack Query for polling task generation status and tracking file availability, date-fns for calculating retention expiration timestamps and lead time formatting in metadata preview.

### Module Structure

**Three route-level pages under `/export-center/`:**
- `/export-center/new` — New Export Configuration
- `/export-center/tasks` — Task List
- `/export-center/tasks/[taskId]` — Task Detail

**Shared modules:**
- `ExportRequestBuilder` — Constructs and validates export requests from analysis context or user configuration
- `ExportTaskTracker` — Manages task references in browser storage, polls generation status
- `BatchVerifier` — Re-validates published batch availability before submission and during generation
- `ExportMetadataFormatter` — Formats provenance metadata for file headers and task detail display
- `RetentionPolicyDisplay` — Shows file/metadata expiration times based on deployment configuration

### Page Responsibilities

**New Export Configuration Page:**
- Accept pre-filled context from analysis pages (mode, cycle, variable, region/point, time range, published batch list)
- Allow manual selection when entering directly (query available products first)
- Display grid dimensions and lead count as user adjusts region/time range
- Enforce 256×256 grid point limit and 24 lead-time limit with specific error messages
- List available data layer options: AI mean/spread, full 10-member ensemble, EC + AI−EC package, threshold count/proportion
- For threshold exports, capture comparison direction, numeric value, unit
- Exclude TP (precipitation) from formal options until accumulation window confirmed
- Preview complete request metadata before submission
- Re-verify each batch's published status and capability at submission time
- Block submission if any requested lead is unpublished, listing missing leads explicitly
- Return task ID on successful submission

**Task List Page:**
- Query export tasks accessible to current user/browser context
- Display task creation time, data mode, cycle/valid time range, variable, point/region indicator, batch references, file type, generation status
- Filter/sort by status (generating, completed, failed), creation date, variable
- Provide actions: view details (all tasks), download (completed with valid file), retry (failed tasks)
- Store task references in browser local storage for re-entry
- Show file and metadata retention periods with actual expiration timestamps
- Handle missing task references gracefully ("lost access context" vs. "task does not exist")
- Note: Does not support task cancellation or manual deletion in first version

**Task Detail Page:**
- Display locked request parameters exactly as submitted
- Show actual cycle, lead list, published batch IDs used per lead, variable, physical unit, grid coordinates/mask, member count and member indices, model version
- List threshold definition (direction, value, unit) if applicable, interpolation method for EC, wind speed formula
- Display generation status: awaiting generation, generating, completed, failed
- Separate file availability from generation status (file may be expired after successful generation)
- On failure, show specific reason: missing data, constraint exceeded, semantic capability unconfirmed, product withdrawn
- On source product withdrawal during generation, mark task as failed; if withdrawal after completion, preserve generation record but block new downloads with explanation
- Provide download action when file available and within retention period
- Provide "return to analysis" action that navigates back to analysis pages with original request context and re-verifies batch availability

### Data Model Contracts

**ExportRequest:**
```typescript
{
  mode: 'historical' | 'operational',
  cycle: ISO8601DateTime,
  variable: 'T2m' | 'SP' | 'wind10m' | 'TP',
  validTimeRange: { start: ISO8601DateTime, end: ISO8601DateTime },
  leads: LeadHour[], // explicitly listed, max 24
  batchIdPerLead: Map<LeadHour, BatchID>,
  spatialExtent: {
    type: 'grid' | 'point' | 'region',
    boundingBox?: { north, south, east, west },
    point?: { lat, lon },
    actualGridCoords?: { lat[], lon[] }
  },
  dataLayers: ('ai_mean' | 'ai_spread' | 'ai_members' | 'ec' | 'ai_minus_ec' | 'threshold_count' | 'threshold_proportion')[],
  threshold?: {
    direction: '>' | '<',
    value: number,
    unit: string
  },
  outputFormat: 'netcdf' | 'csv',
  submittedAt: ISO8601DateTime,
  requestedBy: UserContext
}
```

**ExportTask:**
```typescript
{
  taskId: string,
  request: ExportRequest,
  status: 'pending' | 'generating' | 'completed' | 'failed',
  generationStartedAt?: ISO8601DateTime,
  generationCompletedAt?: ISO8601DateTime,
  fileUrl?: string,
  fileAvailableUntil?: ISO8601DateTime,
  metadataExpiresAt: ISO8601DateTime,
  failureReason?: {
    code: 'missing_data' | 'constraint_exceeded' | 'semantic_unconfirmed' | 'product_withdrawn',
    details: string,
    affectedLeads?: LeadHour[]
  },
  actualBatchesUsed?: Map<LeadHour, BatchID>, // locked at generation time
  fileMetadata?: {
    modelVersion: string,
    memberIndices: number[],
    physicalUnits: Map<Variable, Unit>,
    gridMask: SpatialMask
  }
}
```

### Constraint Enforcement

**Grid NetCDF Exports:**
- Maximum 256×256 grid points (65,536 total)
- Maximum 24 hourly lead times
- When exceeded, show actual dimensions (e.g., "Your region is 280×240 = 67,200 points, exceeds limit of 65,536") and suggest reducing extent
- Do not auto-crop to allowed size
- If lead range has gaps, list missing leads explicitly, do not silently generate partial file

**CSV Exports (Point Time-Series or Regional Statistics):**
- Maximum 24 lead times (same as grid)
- Preserve actual grid coordinates for point (selected vs. nearest valid grid center)
- Preserve region bounding box, valid coverage ratio, and mask for regional statistics
- Invalid grids remain as missing values in CSV, not filled with zero

**Capability Gates:**
- TP (precipitation) excluded from formal export options until accumulation window semantics confirmed
- P10/P50/P90 percentiles not listed as current formal options
- GeoTIFF format not listed as current formal option
- Wind speed mean/spread exported as independent derived quantities; averaged U/V vectors not substituted

### Batch Verification Logic

**At Submission Time:**
- Query published product directory for each requested (cycle, lead, variable, region)
- Verify batch status = published, coverage overlaps requested extent, capability flags permit requested data layers
- If any lead is unpublished, block submission and list unavailable leads
- If any batch does not support requested data layer (e.g., EC missing for comparison), block submission with specific capability message
- Lock batch ID per lead in ExportRequest

**During Generation:**
- Re-verify batch availability before reading data
- If batch withdrawn or no longer accessible, fail task with `product_withdrawn` reason
- Do not switch to newer batch automatically

**After Generation:**
- If source batch withdrawn after file generated, preserve generation record and file expiration timestamp
- Block new downloads, show "source product withdrawn" notice
- User can copy request and re-submit with current published batches

### File Retention and Metadata Expiration

**Default Retention Periods:**
- Generated files: 7 days from generation completion
- Task metadata: 30 days from task creation
- Deployment may configure different values; display actual expiration timestamps in UI

**Expiration Handling:**
- File expired: Show expiration notice, preserve task metadata, allow copying request to regenerate
- Metadata expired: Remove task from list, show retention policy notice if user attempts direct access via old task ID

**First Version Scope:**
- No task cancellation (pending or generating tasks run to completion)
- No manual file deletion (files expire automatically per retention policy)

### Navigation and Context Preservation

**Entry from Analysis Pages:**
- Pass mode, cycle, variable, spatial extent (point/region), valid time range, per-lead batch list
- Pre-fill New Export page with these values
- User may adjust before submission

**Direct Entry to New Export:**
- Present product selection UI: mode, cycle, variable, region
- Query available published products
- Once selected, proceed with data layer and constraint configuration

**Return from Task Detail to Analysis:**
- Pass original request's cycle, variable, spatial extent, valid time range
- Analysis pages re-query published batches (may differ from original if new batches published)
- If original batch no longer available, show unavailability reason, do not silently substitute

**Task List Re-Entry:**
- Browser local storage holds task IDs for current user session
- On re-entry, query task status by ID
- If task ID not found or access context lost, show "task not accessible" vs. "invalid task ID"
- Do not attempt to guess or recover task IDs not explicitly saved

### Error States and User Feedback

**Configuration Errors (Block Submission):**
- Grid exceeds 256×256: "Selected region is {actual dimensions}, exceeds limit of 256×256 points. Reduce spatial extent."
- Lead range exceeds 24: "Selected time range spans {count} leads, exceeds limit of 24. Reduce time range or submit multiple requests."
- Unpublished leads in range: "Leads {list} are not published. Adjust time range to include only published leads."
- Missing capability: "EC comparison data not available for this cycle. Remove EC layers or select a different cycle."

**Generation Failures (Show in Task Detail):**
- `missing_data`: "Generation failed: Required data not available for leads {list}. Source batch may have been withdrawn."
- `constraint_exceeded`: "Generation failed: Request exceeded processing limits. This should not occur after pre-submission validation."
- `semantic_unconfirmed`: "Generation failed: Requested data layer capability not confirmed. (e.g., TP accumulation window not verified)"
- `product_withdrawn`: "Generation failed: Source product batch withdrawn during generation. Copy request and resubmit with current published batches."

**File Availability States:**
- File available: Show download button with file size and expiration timestamp
- File expired: "File expired on {date}. Copy request to regenerate."
- Product withdrawn after generation: "Source product withdrawn. File no longer available for download. Generation record preserved for provenance."

---

## Testing Decisions

### What Makes a Good Test

Tests must verify external behavior visible to the user or downstream systems, not implementation details. A good test:
- Asserts on user-facing state changes (task status, file availability, error messages)
- Validates published product integration contracts (batch verification, metadata accuracy)
- Checks constraint enforcement at page boundaries (submission blocked with correct message)
- Does not depend on internal component structure, state management implementation, or CSS class names

### Testing Seams

**Seam 1: ExportRequestBuilder**

Test that request construction and validation correctly handles:
- Pre-filled context from analysis pages (cycle, variable, region, time range, batch list)
- Manual configuration from empty state
- Grid dimension calculation (lat/lon ranges → actual grid point count)
- Lead time counting with gap detection
- Constraint violations (grid size, lead count, unpublished leads)
- Batch verification integration (query published status, capability flags)
- Threshold specification validation (direction, value, unit required)

Mock: Published product directory API (return synthetic published/unpublished states)

**Seam 2: ExportTaskTracker**

Test that task lifecycle management correctly handles:
- Task submission (request → task ID mapping)
- Status polling (pending → generating → completed/failed transitions)
- Browser storage persistence (save/retrieve task IDs)
- Task list queries (filter by status, sort by creation date)
- Access context loss detection (missing task ID, invalid task ID, permission change)

Mock: Export generation service API (return synthetic task status progressions)

**Seam 3: BatchVerifier**

Test that batch verification logic correctly handles:
- Submission-time verification (all leads published, all capabilities available)
- Generation-time re-verification (detect withdrawn batches)
- Post-generation withdrawal detection (file remains but blocked for new downloads)
- Specific failure reasons mapped to user-facing error messages

Mock: Published product directory API, batch withdrawal events

**Seam 4: File Download and Metadata**

Test that generated files contain:
- Complete provenance metadata in file headers (cycle, lead, batch ID per variable/lead, grid coordinates, physical units, member indices, model version)
- Correct data alignment (AI mean/spread/members, EC interpolated to 3km, AI−EC difference on common mask)
- Missing value handling (invalid grids remain missing in NetCDF/CSV, not filled with zero)
- Wind speed derived correctly from U/V components
- Threshold counts match specified direction and value

Mock: Export generation service (return synthetic NetCDF/CSV with known metadata and data patterns)

### Prior Art in Codebase

This is a greenfield Next.js 16 project with no existing export or data fetching patterns. Testing approach should follow Next.js App Router conventions:
- Server Components for initial data fetching (published product queries, task list)
- Client Components for interactive configuration (region selection, data layer checkboxes, constraint validation feedback)
- Server Actions for mutations (submit export request, retry failed task)
- Route handlers for polling (task status updates, file availability checks)

Testing stack recommendations:
- Unit tests: Vitest for pure functions (constraint validation, metadata formatting)
- Integration tests: Playwright or Cypress for full page workflows (configure → submit → track → download)
- API integration tests: MSW (Mock Service Worker) for published product directory and export service responses

---

## Out of Scope

**UI Layout and Visual Design:**
- Specific component placement, spacing, colors, fonts are governed by DESIGN.md
- This spec defines functional behavior, data flow, and validation logic only

**Backend/API/Database/Deployment:**
- Export generation service implementation (NetCDF/CSV file creation from published batches)
- Task queue and background job processing
- File storage and retention policy enforcement
- Published product directory service (already assumed to exist per GLOSSARY.md)
- Authentication and user role management

**Model Training and CSC Parameter Tuning:**
- This spec consumes published AI forecast products as read-only inputs
- Model configuration, CSC sensitivity parameters, and training data management are separate concerns

**Real Data Production and Production Acceptance:**
- Actual availability of published forecast batches is a data condition, not a feature implementation concern
- When real product directory is unavailable, Export Center shows "product availability unconfirmed" state per GLOSSARY.md rules

**Production Task Creation and Scheduling:**
- Export tasks are user-initiated data extractions from published products
- Operational production batch creation, scheduling, and retry are covered in Operations Workspace spec (out of scope for Export Center)

**Cross-Device Task Synchronization:**
- Task references stored in browser local storage are session-local only
- Cloud-based task history or multi-device sync is out of scope for first version

**Advanced Export Formats:**
- GeoTIFF raster export
- Custom file naming templates
- Batch export (multiple cycles/variables in one request)
- Percentile layers (P10/P50/P90) until capability confirmed

**Report Template Generation:**
- Export Center provides raw data files with provenance metadata
- Automated weather briefing reports, formatted documents, or template-based outputs are separate features

---

## Further Notes

### Relationship to Analysis Pages

Export Center is tightly coupled to Analysis pages through context passing:
- Analysis pages pre-fill export requests with current cycle, variable, region, time range, published batch list
- Export task detail provides "return to analysis" action that navigates back with original request context

This bi-directional linking ensures exports are traceable to specific analysis sessions and users can verify what they exported.

### Relationship to Operations Workspace

Export Center serves business users consuming published forecasts. Operations Workspace serves operations role managing production batches. Key distinctions:
- Export task IDs and production batch IDs are separate identifiers
- Export tasks reference published batches as inputs but do not control publication decisions
- Batch withdrawal in Operations Workspace triggers export task failure or file availability status changes in Export Center

### Batch Locking Strategy

Exports lock per-lead batch IDs at submission time to ensure reproducibility. This differs from analysis pages where users can manually switch batches:
- Analysis: "Show me the latest batch for this cycle/lead"
- Export: "Freeze exactly these batch IDs and generate a file from them"

This design prevents silent data changes in exported files when new batches are published during generation.

### TP (Precipitation) Capability Gate

Per GLOSSARY.md and user constraints, TP is excluded from formal export options until accumulation window, f000 alignment, and unit semantics are confirmed against actual published products. Current behavior:
- TP fields may exist in published batches (observed in diagnostic displays)
- New Export page does not list TP as a selectable variable
- If user attempts to construct TP export via API/URL manipulation, capability verification blocks submission with "semantic capability unconfirmed" error

Lifting this gate requires:
- Verified accumulation window per lead (hourly vs. cumulative from f000)
- Confirmed physical units (mm, mm/hr, kg/m²)
- Documentation of f000 initial condition handling (zero vs. carry-forward from previous cycle)

### Retention Policy Rationale

7-day file retention and 30-day metadata retention balance storage costs with operational needs:
- 7 days allows users to complete typical forecast analysis and verification cycles
- 30 days preserves task provenance for quality assurance and reproducing previous exports
- Both periods are deployment-configurable to accommodate different operational requirements

Users requiring longer retention can re-generate files from preserved task metadata (if source batches remain published) or archive downloaded files outside the platform.

### Wind Speed Export Details

Wind speed mean and spread are derived quantities exported as independent variables:
- Mean wind speed: Compute wind speed (√(U² + V²)) per ensemble member, then average across members
- Spread: Standard deviation of member wind speeds (denominator N=10, total population)
- Averaged U/V vectors (mean U, mean V → derived wind speed) are NOT substituted, as this produces different values

This matches the numerical definition in GLOSSARY.md "数值一致性" section and ensures exported wind speeds align with values shown in analysis pages.

### CSV Format for Point and Region Exports

CSV structure preserves provenance and validity per lead:

**Point Time-Series:**
```csv
# Selected Location: 30.5°N, 104.2°E
# Nearest Grid Center: 30.48°N, 104.19°E
# Cycle: 2024-10-23 12:00 UTC
# Variable: T2m (°C)
# Batch IDs: See metadata section
Valid Time,Lead,AI Mean,AI Spread,EC,AI-EC,Member_01,...,Member_10
2024-10-23 18:00,+6,15.2,1.1,14.8,0.4,16.1,...,14.3
2024-10-23 19:00,+7,14.9,1.2,14.5,0.4,15.8,...,14.1
```

**Region Statistics:**
```csv
# Bounding Box: 27-33°N, 102-108°E
# Valid Coverage: 0.92 (actual area / requested area)
# Cycle: 2024-10-23 12:00 UTC
# Variable: T2m (°C)
Valid Time,Lead,AI Mean,AI Min,AI Max,Min Location,Max Location,EC Mean,Common Mask Coverage
2024-10-23 18:00,+6,15.2,12.1,18.7,27.2°N 102.3°E,32.8°N 107.9°E,14.8,0.95
```

Missing leads show as empty rows or omitted rows depending on gap type (to be refined during implementation based on user feedback).

