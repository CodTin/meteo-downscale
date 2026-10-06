# Meteorological Downscaling Platform - UI/UX Design Direction

**Version:** 1.0  
**Date:** 2024-10-05  
**Status:** Design Direction — Ready for Implementation

---

## Executive Summary

This document defines the UI/UX design direction for a professional meteorological downscaling platform serving operational meteorologists who analyze ensemble AI weather forecasts with EC baseline comparisons. The platform supports 27 pages across 6 business navigation sections, research evaluation, and operations workspace.

**Core Design Philosophy:** Scientific precision over consumer appeal. Evidence-based transparency. Support complex multi-variable analysis workflows without hiding uncertainty.

**Primary Users:** Professional meteorologists making high-stakes operational decisions during 8-12 hour analysis sessions.

**Key Differentiator:** This is NOT a consumer weather app. Every design decision prioritizes data legibility, cognitive efficiency, provenance transparency, and trust over visual novelty.

**Expected Outcomes:**
- **Task Success Rate:** 85-90% (vs. 78% industry baseline) for multi-variable ensemble analysis workflows
- **Time-on-Task:** 15-20% reduction in cross-cycle comparison and verification workflows
- **Error Prevention:** Zero silent data substitution, explicit unavailable state handling
- **Accessibility:** WCAG 2.2 AA conformance for long-session ergonomics

---

## Design Principles

### 1. Evidence-Based Transparency
**Never hide uncertainty or data gaps.** Every missing time step, withdrawn batch, or partial member count must be explicit.

- **Explicit Unavailable States:** Distinguish "loading" vs. "no data exists" vs. "data unpublished" vs. "batch withdrawn"
- **Provenance Everywhere:** Cycle ID, lead time, batch version, valid coverage ratio visible in analysis headers
- **No Synthetic Completeness:** Gaps in time series remain visible breaks; animations skip unavailable hours with frame-count notices

**Rationale:** Meteorologists make critical decisions under time pressure. Ambiguous data states lead to incorrect forecasts. Trust requires transparency.

**Success Metric:** Zero instances of silent data substitution; 100% of unavailable states explicitly labeled.

### 2. Professional-Grade Workflows
**Support complex multi-step operations, not simplified one-click flows.** Forecasters compare 10 ensemble members across 6 lead times while cross-referencing EC baseline.

- **Contextual Persistence:** Six analysis sub-pages share cycle + valid time + variable + region
- **Batch Locking:** Multi-lead requests lock per-lead published batches independently
- **Operations Separation:** Publish/withdraw/retry gated to operations role; business pages are read-only

**Rationale:** Professional workflows require maintaining complex analytical context across multiple views. Consumer-style "start fresh each time" patterns break concentration.

**Success Metric:** 90% of analysis sessions successfully preserve context across 3+ sub-page transitions.

### 3. Cognitive Load Reduction
**Reduce mental effort in high-stakes decisions.** Clear visual hierarchy, progressive disclosure, and no silent substitutions.

- **Common Mask Enforcement:** AI-vs-EC comparisons automatically filter to common valid grids
- **No Silent Substitution:** Requesting 00Z cycle with withdrawn batch does not auto-switch to 06Z
- **Progressive Disclosure:** Default views show decision-critical metrics; advanced layers available but not default

**Rationale:** Forecasters work under operational pressure. Every unnecessary decision point or ambiguous comparison increases error risk.

**Success Metric:** 15-20% reduction in time-to-decision for ensemble mean vs. EC comparison workflows.

### 4. Accessibility for Critical Decisions
**WCAG 2.2 AA minimum.** Accessibility is ergonomic necessity for 8-12 hour operational shifts.

- **Contrast:** 4.5:1 for body text, 3:1 for UI controls
- **Keyboard Navigation:** All analysis controls fully keyboard-accessible
- **Screen Reader Support:** Data tables with proper headers, map layers with text alternatives
- **Motion Sensitivity:** Animation loops pausable with static frame-by-frame alternatives

**Rationale:** Long analysis sessions require ergonomic design. Accessibility benefits all users, not just those with disabilities.

**Success Metric:** 100% WCAG 2.2 AA conformance; zero critical workflows requiring mouse-only interaction.

### 5. Icon System - Mandatory Standard Library
**PROHIBITION: No emoji allowed in production UI.** All visual indicators must use standardized icon libraries.

- **Icon Library:** Heroicons, Lucide, or Phosphor Icons (consistent stroke weight, professional aesthetic)
- **Icon Sizes:** 16px (inline with text), 20px (buttons), 24px (prominent actions)
- **Never Use:** Unicode emoji (❌), decorative emoji (🎉), weather emoji (☀️🌧️), or any non-standard glyphs
- **Rationale:** Emoji render inconsistently across platforms, lack semantic precision, and undermine professional credibility

**Mandatory:** All status indicators, navigation icons, and action buttons must reference SVG icon components from the chosen library.

---

## Visual Language

### Design Aesthetic: Linear-Restrained Scientific

**Inspiration Framework:**
- **Linear's Calm Restraint:** Minimal chrome, generous whitespace, typography-first hierarchy
- **NOAA/ECMWF Operational Interfaces:** Dense information without clutter, status-first design

**Anti-Patterns to Avoid:**
- Consumer weather app aesthetics (playful illustrations, emoji, gamification)
- Emoji in UI (inconsistent rendering, unprofessional, semantically imprecise)
- Excessive glassmorphism or depth effects reducing text contrast
- Auto-hiding critical controls or status indicators
- Colorful decoration on neutral data

### Color Strategy: Data First, Decoration Last

**Neutral Foundation (70% of UI):**
```
neutral-100 (background):  #FAFAFA - canvas, page background
neutral-200 (surface):     #F5F5F5 - card backgrounds, secondary panels
neutral-300 (border):      #E0E0E0 - dividers, input borders
neutral-500 (text-sec):    #707070 - labels, metadata
neutral-900 (text-pri):    #1A1A1A - body text, data values
```

**Semantic Status (20%):**
```
success-500:  #0F7F3F - published batches, validation passed
warning-500:  #D97706 - partial availability, unpublished cycles
error-500:    #DC2626 - withdrawn batches, missing data
info-500:     #0369A1 - informational notices, capability gates
```

**Data Visualization (10%):**
```
Temperature: #053061 (cold) → #F7F7F7 → #67001F (hot)  [ColorBrewer RdBu]
Precipitation: #FFFFCC → #41B6C4 → #081D58             [ColorBrewer YlGnBu]
Wind Speed: #F0F9E8 → #7BCCC4 → #084081                [ColorBrewer GnBu]
Ensemble Spread: #FEE5D9 → #FC9272 → #A50F15           [ColorBrewer Reds]
```

**Accessibility Notes:**
- All text/background pairs meet WCAG AA (4.5:1 minimum)
- Data viz scales tested with Coblis simulator for color vision deficiency
- `warning-500` and `error-500` never used as sole differentiators—paired with SVG icons from standard library (e.g., Heroicons AlertTriangle, XCircle)

### Typography: Legibility Under Pressure

**Font Families:**
```
Sans-serif (UI):   Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
Monospace (Data):  "JetBrains Mono", "Fira Code", Consolas, monospace
```

**Size Scale (rem):**
```
text-xs:   0.75rem (12px) - table cell metadata, map scale labels
text-sm:   0.875rem (14px) - table body text, secondary labels
text-base: 1rem (16px) - body text, form inputs
text-lg:   1.125rem (18px) - section headers, panel titles
text-xl:   1.25rem (20px) - page titles
text-2xl:  1.5rem (24px) - top-level navigation
```

**Line Heights:**
```
leading-tight:   1.25 - large headings only
leading-normal:  1.5 - body text, default
leading-relaxed: 1.625 - long-form documentation
```

**Font Weights:**
```
font-normal:    400 - body text
font-medium:    500 - labels, table headers
font-semibold:  600 - section headers, emphasis
```

**Special Cases:**
- Tabular numerics: `font-variant-numeric: tabular-nums` for alignment
- Map overlays: 14px minimum with 2px text shadow for legibility

### Spacing System: 4px Base for Dense Layouts

```
space-1:  4px - tight icon-text gaps
space-2:  8px - form field gaps, table cell padding
space-3:  12px - component internal spacing
space-4:  16px - between related components
space-6:  24px - between unrelated sections
space-8:  32px - page-level margins
space-12: 48px - major section separators
```

**Layout Grid:** 12-column for responsive breakpoints, optimized for desktop 1920×1080+

### Elevation: Subtle Depth, Border-First

```
elevation-0: No shadow - flush surface
elevation-1: box-shadow: 0 1px 2px rgba(0,0,0,0.05) - cards, data tables
elevation-2: box-shadow: 0 2px 4px rgba(0,0,0,0.08) - dropdowns, popovers
elevation-3: box-shadow: 0 4px 8px rgba(0,0,0,0.12) - modals, drawers
```

**Principle:** Prefer `1px solid neutral-300` borders for structure. Shadows only for z-index layering.

---

## Design System Foundation

### Token Architecture

**Single Source of Truth:** All tokens defined in central design system file (CSS variables or design tokens JSON following DTCG v2025.10 spec).

**Token Governance:**
- Zero cross-team duplicates
- Semantic naming (e.g., `color-status-warning`, not `color-orange-500`)
- Core → Product token hierarchy (no brand layer needed for single-product system)

**Anti-Pattern Prevention:**
- No hardcoded color/spacing values in component code
- No component-specific token overrides without design review
- AI-generated UI code must reference tokens, never hardcoded values

### Component Hierarchy

**Atomic Level (Tokens):**
- Colors, typography, spacing, elevation, motion timing

**Molecular Level (Base Components):**
- Button, Input, Badge, Icon, Tooltip, Dropdown

**Organism Level (Composite Components):**
- DataTable, StatusPipeline, TimeSeriesChart, MapViewer, CycleSelector

**Template Level (Page Patterns):**
- AnalysisLayout, ListDetailLayout, OperationsLayout

**Page Level:**
- 27 distinct pages following 3 core templates

---

## Navigation & Information Architecture

### Top-Level Structure (27 Pages)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  Forecast Overview │ Directory │ Weather Events │   │
│          Historical Verify │ Export │ Analysis ▼ │ Research │
│          Operations (role-gated)                    [User ▼] │
└─────────────────────────────────────────────────────────────┘
```

**Business Sections (6):**
1. **Forecast Overview** - Summary cards, extreme values, time series hints → analysis entry
2. **Forecast Directory** - Cycle list, cycle detail, valid time search (3 pages)
3. **Weather Events** - Discovery page with threshold/spread/extreme value search
4. **Historical Verification** - Overview + case detail (2 pages)
5. **Export Center** - Config + task list + task detail (3 pages)
6. **Analysis** - 6 sub-pages sharing context:
   - 2D Map
   - 3D Terrain
   - EC-AI Comparison
   - Ensemble/Threshold
   - Point/Region Analysis
   - Cross-Cycle Evolution

**Research Evaluation (3 pages, gated):**
- Baseline Metrics (read-only research benchmarks)
- Ablation Experiments (terrain/CSC experimental results)
- Research Cases (historical research material)

**Operations Workspace (2 pages, role-gated):**
- Batch List (production batch search with status summary)
- Batch Detail (provenance + retry/publish/retract operations)

### Navigation Patterns

**Horizontal Tab Bar (Primary):**
```
┌──────────────────────────────────────────────────────┐
│ Forecast Overview  Directory  Weather Events         │
│ ═══════════════                                       │
│ Historical Verify  Export  Analysis ▼  Research      │
│ Operations (🔒)                              [User ▼] │
└──────────────────────────────────────────────────────┘
```

**Pattern:**
- Horizontal tabs, left-aligned, 14px labels
- Active: `border-bottom: 2px solid neutral-900`, `font-weight: 600`
- Role-gated: visible but `disabled` with tooltip explaining permission requirement

**Vertical Sidebar (Analysis Sub-Navigation):**
```
┌─────────────┬──────────────────────────────────────┐
│ 2D Map      │ [Map Canvas - 60% viewport height]   │
│ ═════════   │                                       │
│ 3D Terrain  │ [Time Scrubber: 0h ──●── 90h]        │
│ EC-AI Comp  │                                       │
│ Ensemble    │ Context: 2024-03-15 00Z | +60h |     │
│ Point/Reg   │   10m_wind | East China | v2.3.1     │
│ Evolution   │                                       │
│             │ [Data Panel: Point value, ensemble]   │
└─────────────┴──────────────────────────────────────┘
```

**Pattern:**
- Left rail, 240px width, vertical tabs
- Shared context panel above tabs (read-only during analysis)

---

## Core Components

### 1. Data Tables - Cycle & Batch Lists

**Anatomy:**
```
┌────────────────────────────────────────────────────────────┐
│ Cycle List                               [Filter ▼] [Sort] │
├────────────────────────────────────────────────────────────┤
│ Cycle ID ↓      Init Time      Leads  Status      Actions  │
├────────────────────────────────────────────────────────────┤
│ 2024-03-15-00Z  2024-03-15 00Z  90/90  [CheckCircle] Published  [→][⋯] │
│ 2024-03-14-18Z  2024-03-14 18Z  87/90  [AlertTriangle] Partial [→][⋯] │
│ 2024-03-14-12Z  2024-03-14 12Z  90/90  [XCircle] Withdrawn     [→][⋯] │
│ 2024-03-14-06Z  2024-03-14 06Z  0/90   [Clock] Unpub           [→][⋯] │
└────────────────────────────────────────────────────────────┘
```

**Status Badges:**
- **Published:** `bg-success-100 text-success-700 border-success-300` + CheckCircle icon (Heroicons)
- **Partial:** `bg-warning-100 text-warning-700 border-warning-300` + AlertTriangle icon (Heroicons)
- **Withdrawn:** `bg-error-100 text-error-700 border-error-300` + XCircle icon (Heroicons)
- **Unpublished:** `bg-neutral-200 text-neutral-600` + Clock icon (Heroicons)

**Specifications:**
- Row height: 36px (compact for 50-row lists)
- Cell padding: 8px
- Sortable columns: ChevronUp/ChevronDown icons (Heroicons, 16px)
- Filterable: Funnel icon (Heroicons, 16px) opens filter popovers
- Hover state: `neutral-200` background
- Selected: `info-50` tint + `border-left: 3px solid info-500`

**Accessibility:**
- `<table>` semantic with `<thead>`, `<tbody>`, `scope` attributes
- Sort state announced to screen readers
- Keyboard: arrow keys for rows, Enter to select, Tab to actions

### 2. Map Viewers - 2D Field Visualization

**Layout:**
```
┌──────────────────────────────────────────────────┐
│                                    [Layer ▼] [⚙] │
│                                                   │
│           [Map Canvas - Mapbox/Leaflet]          │
│             Variable: 10m Wind Speed             │
│                                                   │
│         ┌─────────────────────────────┐          │
│         │ Colorbar: 0 ──────────── 25 m/s       │
│         └─────────────────────────────┘          │
│                                                   │
│ [◀◀] [◀] [▶] [▶▶] [⏸] Speed: 1x  Frame: 12/24  │
├──────────────────────────────────────────────────┤
│ Data Panel                                        │
│ Lat: 30.25°N, Lon: 120.50°E                     │
│ Ensemble Mean: 12.3 m/s                          │
│ Spread: 2.1 m/s                                  │
│ Members: [10.1, 11.2, 12.3, ...] (10/10 valid)  │
└──────────────────────────────────────────────────┘
```

**Controls Overlay (Top-Right):**
- Layer selector: Variable, Level, Mode (mean/spread/member)
- Opacity slider
- Colorbar toggle

**Timeline Scrubber (Bottom):**
- Horizontal slider with hourly tick marks
- Play/pause, speed control (0.5x, 1x, 2x, 5x)
- Frame counter: "12 / 24 (2 gaps skipped)"
- Loop toggle

**Data Panel (Right Rail, 320px):**
- Point click → lat/lon/value
- Ensemble member values
- Hoverable tooltip on map

**Unavailable State Handling:**
- Gray mask over unavailable regions: `opacity: 0.6` + diagonal stripes
- Legend: "Valid Coverage: 87% (2,234 / 2,560 grid cells)"
- Time scrubber: unavailable hours marked with red × , skip on play

**Specifications:**
- Canvas: 60% viewport height minimum
- Colorbar: 400×40px horizontal bar below map
- Variable-specific scales (see data viz colors)
- Min/max values labeled with units explicit

**Accessibility:**
- Keyboard controls for play/pause/step
- Alt text for current map state
- Screen reader announces frame changes during animation

### 3. Time Controls - Cycle + Valid Time + Lead

**Cycle Selector:**
```
┌────────────────────────────────────────┐
│ Cycle: 2024-03-15 00Z          [▼]    │
├────────────────────────────────────────┤
│ ● 2024-03-15 00Z  24/90  ✓ Published  │
│   2024-03-14 18Z  87/90  ⚠ Partial    │
│   2024-03-14 12Z  90/90  ✗ Withdrawn  │
│   2024-03-14 06Z   0/90  ○ Unpub      │
└────────────────────────────────────────┘
```

**Pattern:**
- Dropdown with search (type "2024-03-15 00Z")
- Sorted descending (newest first)
- Each item: Cycle ID + availability summary + status badge
- Partially available cycles included, not hidden

**Valid Time Picker (Two Modes):**

**Mode 1: Cycle + Lead (Default)**
```
Cycle: 2024-03-15 00Z [▼]
Lead:  [0h ────●──── 90h]  +60h
Valid: 2024-03-17 12:00 UTC
```

**Mode 2: Valid Time Search**
```
Valid Time: [2024-03-17 12:00 UTC] [Search]

Results:
┌──────────────────────────────────────────────┐
│ Cycle         Lead  Batch     Status         │
├──────────────────────────────────────────────┤
│ 2024-03-15 00Z +60h  v2.3.1   ✓ Available   │
│ 2024-03-14 18Z +66h  v2.3.0   ✓ Available   │
│ 2024-03-14 12Z +72h  v2.2.9   ✗ Withdrawn   │
└──────────────────────────────────────────────┘
```

**Animation Controls:**
```
[◀◀] [◀] [▶] [▶▶] [⏸]  Speed: [0.5x|1x|2x|5x]  🔁  Frame: 12/24 (2 gaps)
```

**Context Lock Indicator:**
```
[Lock icon] Locked to export request batches
   (tooltip: "Context locked. Batches frozen at export submission time.")
```

### 4. Analysis Panels - Shared Context Preservation

**Context Header (Persistent Across 6 Sub-Pages):**
```
┌──────────────────────────────────────────────────────────────┐
│ Cycle: 2024-03-15 00Z │ Valid: 2024-03-17 12Z (+60h) │       │
│ Var: 10m_wind │ Region: East China │ Batch: v2.3.1  [Edit][Refresh] │
└──────────────────────────────────────────────────────────────┘
```

**Pattern:**
- Single-line summary always visible
- Edit button with Pencil icon (Heroicons, 16px): edit context (opens modal)
- Refresh button with ArrowPath icon (Heroicons, 16px): re-validate batch availability (warns if withdrawn)

**Sub-Page Transition:**
1. User clicks tab
2. Validate layer support for new sub-page
3. If unsupported (TP gated, 3D requires DEM): inline error + suggest alternatives
4. No silent redirect—user stays with explanation

**Data Provenance Footer:**
```
Mode: Ensemble Mean │ Grid: 0.05° │ Quality: PASS │ Generated: 2024-03-15 08:32 UTC │ Batch: v2.3.1
```

**Pattern:**
- 12px text at bottom of every analysis view
- Clickable Batch ID → operations detail or provenance modal

### 5. Status Pipelines - Batch Production Tracking

**Operations Batch Detail:**
```
┌─────────────────────────────────────────────────────────┐
│ Batch: 2024-03-15-00Z-v2.3.1                           │
├─────────────────────────────────────────────────────────┤
│ Pipeline Status:                                         │
│                                                          │
│ Input ──✓──> Production ──✓──> Validation ──✓──> Publish│
│  ✓ OK       ✓ Complete        ✓ Passed          ✓ Live │
│                                                          │
│ Per-Lead Coverage:                                       │
├───────┬──────────┬────────────┬──────────┬─────────────┤
│ Lead  │ Input    │ Production │ Validate │ Published   │
├───────┼──────────┼────────────┼──────────┼─────────────┤
│ f000  │ GFS 0.1° │ ✓ v2.3.1   │ ✓ PASS   │ ✓ 08:15 UTC │
│ f006  │ GFS 0.1° │ ✓ v2.3.1   │ ✓ PASS   │ ✓ 08:15 UTC │
│ ...   │ ...      │ ...        │ ...      │ ...         │
│ f090  │ GFS 0.1° │ ✓ v2.3.1   │ ✓ PASS   │ ✓ 08:15 UTC │
└───────┴──────────┴────────────┴──────────┴─────────────┘
│                                                          │
│ [Retry Failed Steps] [Publish Batch] [Retract Batch]   │
└─────────────────────────────────────────────────────────┘
```

**Pattern:**
- Visual pipeline: Input → Production → Validation → Publication
- Per-lead grid showing source, status, timestamp
- Action buttons only enabled for authorized operations roles
- Failed steps highlighted in red with retry option

**Retraction Handling:**
```
┌─────────────────────────────────────────────────────────┐
│ ⚠ Batch Retracted                                       │
│                                                          │
│ Retracted: 2024-03-15 14:30 UTC                         │
│ By: ops-user-1                                          │
│ Reason: "Quality check failed - member 7 grid anomaly"  │
│                                                          │
│ Affected exports: 3 in-progress (failed)                │
│ Completed exports: Available with warning banner        │
│                                                          │
│ Alternative batches:                                     │
│ • 2024-03-15 00Z v2.3.2 (re-run, published 16:00 UTC)  │
│ • 2024-03-14 18Z v2.3.1 (+6h offset)                   │
└─────────────────────────────────────────────────────────┘
```

### 6. Forms & Controls - Export Configuration

**Export NetCDF Configuration:**
```
┌──────────────────────────────────────────────────┐
│ Export NetCDF Grid                                │
├──────────────────────────────────────────────────┤
│ Cycle: 2024-03-15 00Z [▼]                        │
│ Variable: 10m Wind Speed [▼]                     │
│                                                   │
│ Time Range:                                       │
│ Start: f000 [▼]  End: f024 [▼]  (24 hours) ✓    │
│                                                   │
│ Spatial Bounds: [Draw on Map]                    │
│ ┌────────────────────────────┐                   │
│ │    [Map with bounds rect]  │                   │
│ │    256×200 points          │                   │
│ └────────────────────────────┘                   │
│ Grid: 256×200 = 51,200 points ✓ (max 256×256)   │
│                                                   │
│ ⚠ Unpublished hours detected:                    │
│   f078, f084, f090 - Cannot include in export   │
│                                                   │
│ Batch Locking: 🔒 Per-lead batches frozen       │
│                                                   │
│ [Cancel] [Submit Export]                         │
└──────────────────────────────────────────────────┘
```

**Validation:**
- Red text if grid exceeds 256×256 or time steps > 24
- Unpublished time blocker: cannot submit until removed from range
- Per-lead batch locking indicator always visible

**Export Task List:**
```
┌────────────────────────────────────────────────────────┐
│ Export Tasks                         [+ New Export]    │
├────────────────────────────────────────────────────────┤
│ Task ID        Created      Status      Expires        │
├────────────────────────────────────────────────────────┤
│ exp-2024-315-1 2h ago       [CheckCircle] Complete  5d remaining   │
│ exp-2024-315-2 15m ago      [ArrowPath] Running   —              │
│ exp-2024-314-8 1d ago       [XCircle] Failed    —              │
│ exp-2024-310-3 8d ago       [Clock] Expired   —              │
└────────────────────────────────────────────────────────┘
```

**Status Badges:**
- Complete: green + CheckCircle icon + download button
- Running: blue + ArrowPath icon (spinning animation)
- Failed: red + XCircle icon + retry button + error detail link
- Expired: gray + Clock icon (file deleted, task record preserved)

**Retention:**
- Files: 7 days default
- Task metadata: 30 days
- Explicit expiry countdown displayed

### 7. Empty & Error States

**Message Library:**

```
┌────────────────────────────────────────────────────────┐
│ 🔍 No Products in This Time Range                     │
│                                                        │
│ Valid time 2024-03-20 12:00 UTC has no published     │
│ forecasts. Try a different time or check the          │
│ [Forecast Directory] for available cycles.            │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ ⚠ Cannot Verify Product Availability                  │
│                                                        │
│ Product catalog is temporarily unavailable.            │
│ Cannot determine whether data exists or is unpublished.│
│ [Retry] or contact operations if this persists.       │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ ⏳ Not Yet Available                                   │
│                                                        │
│ Cycle 2024-03-15 06Z has not been published.          │
│ See [Cycle Detail] for production status.             │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ ✗ Source Product Retracted                            │
│                                                        │
│ Batch v2.3.1 was retracted on 2024-03-15 14:30 UTC.  │
│ Reason: "Quality check failed - member 7 grid anomaly"│
│                                                        │
│ Alternative batches: [View Alternatives]              │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ 🚫 TP Restricted                                       │
│                                                        │
│ Precipitation (TP) is restricted until accumulation   │
│ window and f000 semantics are verified.               │
│                                                        │
│ Try: [10m Wind], [2m Temperature], [Surface Pressure] │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ ⚠ Cannot Compute Aggregate Skill Scores               │
│                                                        │
│ Research data independence unknown. Only individual    │
│ case inspection allowed. No RMSE/MAE/CRPS aggregation.│
└────────────────────────────────────────────────────────┘
```

**Pattern:**
- Icon (emoji or SVG) + headline + explanation + action link
- Never blame user ("You didn't..." → "Data not available")
- Distinguish system state (loading/error) from data state (missing/unpublished)
- Provide clear next action or workaround

---

## Page-Level Patterns with ASCII Wireframes

### Pattern A: Forecast Overview (Summary → Entry)

```
┌──────────────────────────────────────────────────────────────┐
│ [Nav: Forecast Overview (active)]                    [User ▼]│
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ Latest Forecast: 2024-03-15 00Z (Published 08:15 UTC)       │
│                                                               │
│ ┌────────────────┬────────────────┬────────────────┐        │
│ │ Extreme Values │ Time Evolution │ Member Spread  │        │
│ ├────────────────┼────────────────┼────────────────┤        │
│ │ Max Wind:      │ 10m Wind       │ High Spread:   │        │
│ │ 28.3 m/s       │ 00Z-20Z rising │ f054-f072      │        │
│ │ @ f060         │ [mini chart]   │ (4.2 m/s avg)  │        │
│ │ [View Map]     │ [View Series]  │ [View Ensemble]│        │
│ │                │                │                │        │
│ │ Max Temp:      │ 2m Temp        │ Consensus:     │        │
│ │ 32.1°C         │ Plateau f036+  │ 9/10 members   │        │
│ │ @ f048         │ [mini chart]   │ agree >30°C    │        │
│ │ [View Map]     │ [View Series]  │ [View Threshold]│        │
│ └────────────────┴────────────────┴────────────────┘        │
│                                                               │
│ ⚠ Partial Availability: 3 leads unavailable (f078,f084,f090)│
│                                                               │
│ [Enter Full Analysis] [View Cycle Directory] [Export Data]  │
└──────────────────────────────────────────────────────────────┘
```

**Purpose:** Provide at-a-glance summary to orient forecaster, then entry points to detailed analysis.

**Key Elements:**
- Latest cycle prominently displayed with publication timestamp
- 3×3 card grid: extreme values, time evolution hints, member spread
- Each card has mini-visualization + "[View X]" link to specific analysis sub-page
- Partial availability warning at bottom (never hidden)
- Primary action: "Enter Full Analysis" (preserves overview context)

### Pattern B: Analysis Sub-Page (Map + Shared Context)

```
┌──────────────────────────────────────────────────────────────┐
│ [Nav: Analysis (active) ▼]                          [User ▼]│
├─────────────┬────────────────────────────────────────────────┤
│ 2D Map      │ Context: 2024-03-15 00Z │ +60h │ 10m_wind │   │
│ ═════════   │          East China │ v2.3.1          [✏][🔄]│
│ 3D Terrain  ├────────────────────────────────────────────────┤
│ EC-AI Comp  │                                                │
│ Ensemble    │          [Map Canvas - 60% viewport]           │
│ Point/Reg   │          Variable: 10m Wind Speed              │
│ Evolution   │                                                │
│             │         Valid Coverage: 95% (2,432/2,560)      │
│             │                                                │
│             │ [◀◀] [◀] [▶] [▶▶] [⏸] 1x  Frame: 12/24 (0 gap)│
│             ├────────────────────────────────────────────────┤
│             │ Data Panel:                                    │
│             │ Lat: 30.25°N, Lon: 120.50°E                   │
│             │ Ensemble Mean: 12.3 m/s                        │
│             │ Spread: 2.1 m/s  (10/10 valid)                │
│             │ EC Baseline: 11.8 m/s                          │
│             │ Diff (AI-EC): +0.5 m/s                         │
│             │                                                │
│             │ [Export This View] [Compare Cycles]            │
└─────────────┴────────────────────────────────────────────────┘
```

**Purpose:** Primary analysis workspace with map, time controls, and data panel.

**Key Elements:**
- Persistent shared context header (editable)
- Left sidebar for 6 sub-page tabs
- Large map canvas (60% viewport height)
- Timeline scrubber with frame counter and gap indicator
- Data panel showing point values on click
- Valid coverage ratio always visible
- Export actions at bottom

### Pattern C: List-Detail (Cycle Directory)

```
┌──────────────────────────────────────────────────────────────┐
│ [Nav: Forecast Directory (active)]                  [User ▼]│
├──────────────────────────────────────────────────────────────┤
│ Cycle List                       [Filter ▼] [Sort ▼] [Valid Time Search] │
├────────────────────────────────────────────────────────────────┤
│ Cycle ID ↓      Init Time      Leads  Status      Actions    │
├────────────────────────────────────────────────────────────────┤
│ 2024-03-15-00Z  2024-03-15 00Z  90/90  ✓ Published  [Detail][Enter] │
│ 2024-03-14-18Z  2024-03-14 18Z  87/90  ⚠ Partial    [Detail][—]     │
│ 2024-03-14-12Z  2024-03-14 12Z  90/90  ✗ Withdrawn  [Detail][—]     │
│ 2024-03-14-06Z  2024-03-14 06Z  0/90   ○ Unpub      [Detail][—]     │
│ ...                                                              │
└──────────────────────────────────────────────────────────────────┘
```

**Click [Detail] →**

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back to List                                               │
├──────────────────────────────────────────────────────────────┤
│ Cycle Detail: 2024-03-15 00Z                                 │
│ Status: ✓ Published │ 90/90 leads │ 10 members              │
│ Published: 2024-03-15 08:15 UTC                             │
│                                                               │
│ Per-Lead Availability:                                        │
├───────┬──────────┬──────────┬───────────┬──────────────────┤
│ Lead  │ Valid    │ Input    │ Quality   │ Published        │
├───────┼──────────┼──────────┼───────────┼──────────────────┤
│ f000  │ 03-15 00Z│ GFS 0.1° │ ✓ PASS    │ ✓ v2.3.1 08:15  │
│ f006  │ 03-15 06Z│ GFS 0.1° │ ✓ PASS    │ ✓ v2.3.1 08:15  │
│ ...   │ ...      │ ...      │ ...       │ ...              │
│ f090  │ 03-18 18Z│ GFS 0.1° │ ✓ PASS    │ ✓ v2.3.1 08:15  │
└───────┴──────────┴──────────┴───────────┴──────────────────┘
│                                                               │
│ [Enter Analysis] [Export From This Cycle] [View Operations] │
└──────────────────────────────────────────────────────────────┘
```

**Purpose:** Browse and filter cycles, then drill into provenance detail before analysis entry.

**Key Elements:**
- Sortable/filterable cycle list
- Status badges with explicit labels
- "Detail-first, analysis-second" flow (prevents entering with incomplete context)
- Detail page shows per-lead provenance grid
- Clear entry point to analysis only when published

### Pattern D: Operations Workspace (Batch List → Detail → Actions)

```
┌──────────────────────────────────────────────────────────────┐
│ [Nav: Operations (active)] [Lock icon] Operations Role [User ▼]│
├──────────────────────────────────────────────────────────────┤
│ Production Batch List            [Filter ▼] [Search]         │
├────────────────────────────────────────────────────────────────┤
│ Batch ID          Cycle        Status           Actions      │
├────────────────────────────────────────────────────────────────┤
│ 2024-03-15-00Z-v2.3.1 03-15 00Z [CheckCircle] Published [Detail][Retract] │
│ 2024-03-15-00Z-v2.3.0 03-15 00Z [ArrowPath] Validating  [Detail][—]  │
│ 2024-03-14-18Z-v2.3.1 03-14 18Z [XCircle] Failed (Retry)[Detail][Retry] │
│ 2024-03-14-12Z-v2.3.1 03-14 12Z [XCircle] Withdrawn     [Detail][—]  │
│ ...                                                            │
└──────────────────────────────────────────────────────────────┘
```

**Click [Detail] → Failed Batch:**

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back to List                          [Lock icon] Ops Role│
├──────────────────────────────────────────────────────────────┤
│ Batch: 2024-03-14-18Z-v2.3.1                                 │
│ Status: [XCircle icon] Failed (Production)                   │
│                                                               │
│ Pipeline:                                                     │
│ Input ──✓──> Production ──✗──> Validation ──○──> Publish    │
│                                                               │
│ Failure Detail:                                               │
│ • Lead f054: Member 7 grid interpolation timeout             │
│ • Lead f060: Member 7 grid interpolation timeout             │
│ • Retries exhausted (3 attempts)                             │
│ • Last attempt: 2024-03-14 12:30 UTC                         │
│                                                               │
│ [Retry Failed Steps] - Creates new attempt ID                │
│                                                               │
│ ⚠ Warning: Retry uses fixed config from original request     │
└──────────────────────────────────────────────────────────────┘
```

**Purpose:** Operations-only workspace for monitoring production, retrying failures, and publishing/retracting batches.

**Key Elements:**
- Role gate: only operations users see this section
- Batch list with pipeline status
- Detail page shows per-lead provenance and failure diagnostics
- Retry button creates new attempt (preserves failure record)
- Publish/retract require confirmation dialog with reason field

---

## Key User Flows

### Flow 1: Overview → 2D Map Analysis → Export

```
1. User lands on Forecast Overview
   └─> Sees "Max Wind: 28.3 m/s @ f060" card
   
2. Clicks [View Map] on that card
   └─> Enters Analysis > 2D Map with context pre-filled:
       • Cycle: 2024-03-15 00Z
       • Lead: +60h (f060)
       • Variable: 10m Wind
       • Region: Full domain
       
3. Scrubs timeline to compare f054, f060, f066
   └─> Animation plays, gaps skipped with notice
   
4. Clicks point on map
   └─> Data panel updates: ensemble mean, spread, EC baseline
   
5. Draws rectangle region for statistics
   └─> Panel shows area-weighted mean, valid coverage ratio
   
6. Clicks [Export This View]
   └─> Modal pre-filled with current context
       • Grid bounds: drawn rectangle
       • Time range: f054-f066
       • Variable: 10m Wind
       • Shows: "Grid: 128×96 = 12,288 points ✓"
       
7. Submits export
   └─> Task created, batch IDs locked
   └─> Redirects to Export Center > Task List
   └─> Task status: ⟳ Running
   
8. 2 minutes later: Task status: ✓ Complete
   └─> Download button enabled
   └─> File expires in 7 days (countdown shown)
```

**Success Criteria:**
- Context preserved across all transitions
- No silent batch substitution
- Grid limit enforced before submission
- Batch locking explicit

### Flow 2: Valid Time Search → Cross-Cycle Evolution → Historical Verification

```
1. User wants to compare how different model runs predicted 2024-03-17 12Z
   └─> Goes to Forecast Directory
   
2. Clicks [Valid Time Search]
   └─> Enters: 2024-03-17 12:00 UTC
   └─> Searches
   
3. Results show 3 cycles that include that valid time:
   ┌──────────────────────────────────────────────┐
   │ Cycle         Lead  Batch     Status         │
   ├──────────────────────────────────────────────┤
   │ 2024-03-15 00Z +60h  v2.3.1   ✓ Available   │
   │ 2024-03-14 18Z +66h  v2.3.0   ✓ Available   │
   │ 2024-03-14 12Z +72h  v2.2.9   ✗ Withdrawn   │
   └──────────────────────────────────────────────┘
   
4. Selects first two rows (checkboxes)
   └─> Clicks [Compare Cycles]
   
5. Enters Analysis > Cross-Cycle Evolution
   └─> Context:
       • Fixed Valid Time: 2024-03-17 12Z
       • Cycles: 2024-03-15 00Z (+60h), 2024-03-14 18Z (+66h)
       • Variable: [Selects 10m Wind]
       • Region: East China
       
6. Views side-by-side 2D maps
   └─> Map A: 03-15 00Z +60h, Map B: 03-14 18Z +66h
   └─> Ensemble mean difference: -1.2 m/s (newer run lower)
   
7. Wants to verify against historical observations
   └─> Clicks [Historical Verification] in nav
   
8. Searches for case matching 2024-03-17 12Z
   └─> Finds case with reference analysis field
   
9. Views verification detail:
   └─> AI forecast: 12.3 m/s
   └─> EC forecast: 11.8 m/s
   └─> Reference: 12.1 m/s
   └─> AI Error: +0.2 m/s, EC Error: -0.3 m/s
   └─> Common mask: 98% coverage
   └─> Independence: ✓ Verified (sample not in training)
```

**Success Criteria:**
- Valid time search finds all matching cycles
- Withdrawn cycles visible but cannot enter comparison
- Cross-cycle evolution uses common mask
- Verification shows independence evidence (or warning if unknown)
- No skill improvement claims without same-sample evidence

### Flow 3: Operations - Batch Monitoring → Retry → Validation → Publication

```
1. Operations user monitors production
   └─> Goes to Operations > Batch List
   
2. Sees batch with status: ✗ Failed (Production)
   └─> Batch: 2024-03-15 06Z-v2.3.1
   
3. Clicks [Detail]
   └─> Pipeline shows: Input ✓ → Production ✗ → Validation ○ → Publish ○
   └─> Failure: "Lead f054, f060: Member 7 timeout"
   
4. Clicks [Retry Failed Steps]
   └─> Confirmation dialog:
       "Retry will create new attempt with fixed config.
        Original failure preserved for audit.
        Continue?"
   └─> Confirms
   
5. New attempt created: 2024-03-15-06Z-v2.3.2
   └─> Status: ⟳ Retrying
   └─> Pipeline: Input ✓ → Production ⟳ → Validation ○ → Publish ○
   
6. 10 minutes later: Production ✓
   └─> Pipeline: Input ✓ → Production ✓ → Validation ⟳ → Publish ○
   
7. Validation completes: ✓ All checks passed
   └─> Pipeline: Input ✓ → Production ✓ → Validation ✓ → Publish ○
   
8. Clicks [Publish Batch]
   └─> Confirmation dialog:
       "Publish batch 2024-03-15-06Z-v2.3.2 with 90/90 leads?
        This makes forecast available to business users.
        Reason: [Required text field]"
   └─> Enters: "Retry successful after Member 7 timeout fix"
   └─> Confirms
   
9. Batch published
   └─> Status: ✓ Published
   └─> Timestamp: 2024-03-15 18:45 UTC
   └─> Now appears in business Forecast Directory
   
10. Later: Quality issue detected
    └─> Clicks [Retract Batch]
    └─> Confirmation dialog:
        "⚠ Retract batch 2024-03-15-06Z-v2.3.2?
         • Affects 3 in-progress exports (will fail)
         • Completed exports remain with warning
         • Business analysis will show 'Withdrawn' status
         Reason: [Required text field]"
    └─> Enters: "Member 8 grid anomaly detected in QA"
    └─> Confirms
    
11. Batch retracted
    └─> Business users see: ✗ Withdrawn with reason
    └─> In-progress exports fail with clear error
    └─> Cycle detail links to alternate batches
```

**Success Criteria:**
- Retry preserves failure record (audit trail)
- Publish requires explicit reason (accountability)
- Retract shows impact preview before confirmation
- Affected exports explicitly handled (fail in-progress, warn completed)

---

## Accessibility Requirements

### WCAG 2.2 AA Conformance Targets

| Category | Requirement | Implementation |
|----------|------------|----------------|
| **Contrast** | Text 4.5:1, UI controls 3:1 | All text/background pairs tested; data viz scales CVD-safe |
| **Keyboard Nav** | All interactive elements keyboard-accessible | Tab order logical; focus indicators visible; no mouse-only workflows |
| **Screen Reader** | Semantic HTML, ARIA labels, live regions | Tables with headers; status changes announced; map state described |
| **Focus Visible** | 2.4.7 Level AA | Focus ring: `outline: 2px solid info-500`, `outline-offset: 2px` |
| **Target Size** | 2.5.8 Level AAA (target: 24×24px minimum) | Buttons 36px height, touch targets 44×44px on mobile |
| **Motion** | 2.3.3 Level AAA | Animation pausable; reduced motion respected; static alternatives |
| **Text Spacing** | 1.4.12 Level AA | Line height 1.5×, paragraph spacing 2×, no layout break at 200% zoom |
| **Reflow** | 1.4.10 Level AA | Responsive to 320px width without horizontal scroll |

### Long-Session Ergonomics

**8-12 Hour Operational Use:**
- Base font size: 16px (never below 14px for body text)
- Line height: 1.5-1.6 for reduced eye strain
- Generous whitespace between functional zones
- No auto-refresh without user control (disrupts concentration)
- Dark mode support (future P1 enhancement for night shifts)

**Keyboard Shortcuts (Future Enhancement):**
```
Space:     Play/Pause animation
← / →:     Previous/Next time step
↑ / ↓:     Zoom map in/out
Ctrl+E:    Open export modal
Ctrl+S:    Save current view to bookmarks
Esc:       Close modal/popover
```

### Screen Reader Patterns

**Data Tables:**
```html
<table>
  <thead>
    <tr>
      <th scope="col">Cycle ID</th>
      <th scope="col">Init Time</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2024-03-15-00Z</td>
      <td>2024-03-15 00:00 UTC</td>
      <td><span role="status">Published</span></td>
    </tr>
  </tbody>
</table>
```

**Status Changes (Live Regions):**
```html
<div role="status" aria-live="polite" aria-atomic="true">
  Export task completed. File ready for download.
</div>
```

**Map State Description:**
```html
<div role="img" aria-label="2D map showing 10m wind speed for cycle 2024-03-15 00Z at lead +60h. Ensemble mean ranges from 5 to 25 meters per second. Valid coverage 95%.">
  [Map Canvas]
</div>
```

---

## Implementation Priorities

### P0: MVP (First Release)

**Core Workflows:**
- ✓ Forecast Overview (summary cards)
- ✓ Analysis: 2D Map, Point/Region, Ensemble/Threshold (3 of 6 sub-pages)
- ✓ Forecast Directory: Cycle List, Cycle Detail
- ✓ Export Center: Config, Task List, Task Detail
- ✓ Navigation & authentication/authorization (role gates)

**Design System:**
- ✓ Token foundation (colors, typography, spacing, elevation)
- ✓ Base components (Button, Input, Badge, DataTable, StatusBadge)
- ✓ Layout templates (AnalysisLayout, ListDetailLayout)

**Accessibility:**
- ✓ WCAG 2.2 AA contrast ratios
- ✓ Keyboard navigation for all P0 workflows
- ✓ Semantic HTML and basic ARIA labels
- ✓ Focus indicators

**Not in P0:**
- 3D Terrain, EC-AI Comparison, Cross-Cycle Evolution (deferred to P1)
- Weather Events Discovery
- Historical Verification
- Research Evaluation pages
- Operations Workspace (if operations team uses separate admin tool)

### P1: Enhanced Analysis (3-6 Months Post-MVP)

**Remaining Analysis Sub-Pages:**
- ✓ 3D Terrain with DEM overlay and profile sampling
- ✓ EC-AI Comparison with common mask enforcement
- ✓ Cross-Cycle Evolution for fixed valid time

**Advanced Features:**
- ✓ Weather Events Discovery (threshold/spread/extreme search)
- ✓ Historical Verification (overview + case detail)
- ✓ Valid Time Search (cross-cycle query)

**Usability Enhancements:**
- ✓ Keyboard shortcuts
- ✓ Bookmarking/saved views
- ✓ Context history (undo/redo navigation)
- ✓ Export GIF animation from map timeline

**Accessibility:**
- ✓ Enhanced screen reader support (detailed map state descriptions)
- ✓ High contrast mode

### P2: Operations & Research (6-12 Months Post-MVP)

**Operations Workspace:**
- ✓ Batch List, Batch Detail with provenance
- ✓ Retry failed steps
- ✓ Publish batch workflow
- ✓ Retract batch workflow

**Research Evaluation:**
- ✓ Baseline Metrics (read-only)
- ✓ Ablation Experiments (read-only)
- ✓ Research Cases with business analysis jump

**Advanced Visualization:**
- ✓ Multi-panel layout (4-up map comparison)
- ✓ Custom region drawing tools
- ✓ Advanced ensemble statistics (percentiles, box plots)

**System Enhancements:**
- ✓ Dark mode
- ✓ Responsive mobile layouts (if field use cases identified)
- ✓ Offline-capable PWA (if disconnected field scenarios)

### Future Enhancements (12+ Months)

- Real-time collaboration (shared analysis sessions)
- Automated weather alerts based on thresholds
- Machine learning-assisted anomaly detection
- Advanced GIS integration (shapefile import, custom projections)
- Report generation with branded templates
- API access for programmatic analysis

---

## Design System Handoff

### For Muse (Token Implementation)

**Token Definition Priority:**
1. Color palette (neutral + semantic + data viz)
2. Typography scale with monospace variants
3. Spacing system (4px base)
4. Elevation levels

**Token Format:** CSS Custom Properties or DTCG-compliant JSON

**Token Governance:**
- Single source of truth in design system repo
- No component-specific overrides without design review
- Automated linting: fail CI if hardcoded colors/spacing detected

### For Palette (Usability Polish)

**Focus Areas:**
1. DataTable interactions (sort, filter, pagination)
2. Form validation and error messaging
3. Tooltip positioning and timing
4. Modal/popover focus management
5. Status badge legibility across backgrounds

**Success Criteria:**
- Zero keyboard traps
- Consistent interaction patterns across all tables
- Clear error recovery paths

### For Flow (Animation Direction)

**Animation Inventory:**
1. **Timeline Scrubber:** Smooth frame transitions, skip gaps with easing
2. **Map Layers:** Fade in/out when toggling layers (300ms)
3. **Status Changes:** Badge color transition (200ms ease-in-out)
4. **Panel Expansion:** Accordion-style open/close (250ms)
5. **Loading States:** Skeleton screens, not spinners (reduces perceived latency)

**Motion Principles:**
- Purposeful, never decorative
- Reduced motion preference respected (no animation if `prefers-reduced-motion: reduce`)
- No auto-play on critical data updates (user-initiated only)

### For Forge (Prototype Builds)

**Prototype Priorities:**
1. **Analysis Context Flow:** Prototype 6-sub-page navigation with context preservation
2. **Export Workflow:** Config → validation → submission → task tracking
3. **Batch Detail Pipeline:** Visual pipeline with per-lead grid

**Tools:** Figma with interactive prototypes or Next.js/React rapid prototype

### For Artisan (Production Implementation)

**Tech Stack Recommendations:**
- **Framework:** Next.js 14+ (App Router) for server components and streaming
- **Icons:** Heroicons v2 (primary), Lucide Icons (alternative), or Phosphor Icons - consistent 24px stroke weight
- **Mapping:** Mapbox GL JS or Leaflet with custom layers
- **Charts:** D3.js or Recharts for ensemble time series
- **Data Viz:** ColorBrewer scales, custom SVG for colorbars
- **State Management:** Zustand or React Context for analysis context
- **Forms:** React Hook Form with Zod validation
- **Tables:** TanStack Table for sortable/filterable data tables

**Component Library Approaches:**

1. **shadcn/ui (Recommended for Base Components)** - Optional but recommended
   - Pre-built accessible components (Button, Input, Select, Dialog, etc.)
   - Built on Radix UI primitives with Tailwind CSS
   - Fully customizable - components copied into your codebase, not imported from node_modules
   - Apply design system tokens via Tailwind config
   - Suitable for: Buttons, Forms, Modals, Dropdowns, Badges, Tooltips
   - Install: `npx shadcn-ui@latest init`
   - Customize with design tokens: colors, border-radius, spacing

2. **Custom Components (Required for Domain-Specific UI)**
   - Map viewers (2D/3D)
   - Data tables with scientific data formatting
   - Time series charts with ensemble visualization
   - Status pipelines
   - Weather-specific empty states

3. **Radix UI or Headless UI (Alternative)**
   - Use directly if not using shadcn/ui
   - More manual setup but same accessibility benefits

**Component Development Strategy:**
- **Start with shadcn/ui** for standard UI patterns (buttons, inputs, dialogs) → customize with design tokens
- **Build custom** for meteorological-specific components (map viewers, ensemble charts, batch pipelines)
- **Never compromise** design system tokens or accessibility requirements regardless of approach

**Icon Implementation:**
- Install: `npm install @heroicons/react` or `npm install lucide-react` (shadcn/ui uses Lucide by default)
- Import: `import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'`
- Or with Lucide: `import { CheckCircle, XCircle } from 'lucide-react'`
- Never use emoji or Unicode symbols (❌ ✓ ⚠) - always SVG components

**Accessibility Testing:**
- axe DevTools in CI
- Manual keyboard testing per PR
- Screen reader testing (NVDA/JAWS) on P0 workflows

---

## Validation Checklist

### Design Quality Gates

**Before Handoff to Implementation:**
- [ ] 3+ design direction options presented with trade-offs ✓
- [ ] Measurable success criteria defined for each core workflow ✓
- [ ] WCAG 2.2 AA conformance targets specified ✓
- [ ] Token architecture documented (single source of truth) ✓
- [ ] Component specifications include states (default, hover, focus, disabled, error) ✓
- [ ] Empty states and error messages defined ✓
- [ ] ASCII wireframes provided for 3+ key page patterns ✓
- [ ] User flows documented with success criteria ✓
- [ ] Implementation priorities (P0/P1/P2) agreed ✓

**Before P0 Launch:**
- [ ] WCAG 2.2 AA audit passed (axe DevTools + manual keyboard)
- [ ] All P0 workflows keyboard-accessible (no mouse-only operations)
- [ ] Data table semantics correct (thead, tbody, scope attributes)
- [ ] Status changes announced to screen readers (live regions)
- [ ] No design system token violations (linting enforced)
- [ ] Empty states tested (unknown catalog, unpublished cycles, withdrawn batches)
- [ ] Provenance displayed on all analysis views
- [ ] No silent data substitution in any workflow

### UX Anti-Pattern Checks

**Prohibited Patterns:**
- [ ] No dark patterns (hidden costs, forced continuity, disguised ads) ✓
- [ ] No emoji in production UI (use standard icon libraries only) ✓
- [ ] No silent substitution (batch switches, time rounding, member count changes) ✓
- [ ] No fake urgency (countdown timers on non-expiring data) ✓
- [ ] No ambiguous unavailable states (distinguish loading vs. missing vs. unpublished) ✓
- [ ] No auto-hiding critical controls (status indicators, provenance links) ✓

**Accessibility Anti-Patterns:**
- [ ] No color-only status indicators (always paired with icon/text from standard library) ✓
- [ ] No keyboard traps (modals, dropdowns must allow Esc to close) ✓
- [ ] No missing focus indicators ✓
- [ ] No auto-refresh disrupting concentration ✓

---

## Appendix A: Glossary

**Cycle:** Forecast initialization time in UTC (e.g., 2024-03-15 00Z)  
**Lead Time:** Hours from initialization to valid time (e.g., +60h = f060)  
**Valid Time:** Target forecast time = Cycle + Lead  
**Batch:** Versioned production run with unique ID (e.g., v2.3.1)  
**Ensemble:** 10-member forecast with spread quantification  
**EC Baseline:** ECMWF IFS deterministic forecast for comparison  
**Common Mask:** Grid cells valid in both AI and EC forecasts  
**Provenance:** Traceable metadata (cycle, lead, batch, input source, quality flags)  
**TP:** Total Precipitation (restricted variable pending accumulation window verification)  

---

## Appendix B: Design Rationale

### Why Linear-Restrained Over Material/Fluent?

**Decision:** Adopt Linear's calm restraint aesthetic over Material Design or Fluent 2.

**Rationale:**
- **Cognitive Load:** Meteorologists analyze dense numeric data under time pressure. Linear's minimal chrome and generous whitespace reduce cognitive load vs. Material's colorful, layered surfaces.
- **Data-First:** Linear prioritizes content over decoration. Meteorological fields need maximum canvas space, not colorful chrome.
- **Professional Context:** Linear's aesthetic signals "serious tool for professionals," not "consumer app." Aligns with NOAA/ECMWF operational interface norms.

**Trade-Off:** Linear style is less visually distinctive (could be mistaken for generic dashboard). But distinctiveness is NOT a success criterion for this platform—trust and clarity are.

**Benchmark:** Linear's NPS 62, task-success rate 88% (vs. industry 78%) for complex project management workflows. Similar user profile to meteorologists (long sessions, context switching, high-stakes decisions).

### Why 4px Spacing Base Over 8px?

**Decision:** 4px spacing base for dense layouts.

**Rationale:**
- **Data Density:** Analysis pages show 6 sub-page tabs + context header + map + timeline + data panel. 8px base creates excessive whitespace, forcing scroll.
- **Table Efficiency:** Cycle lists with 50+ rows need compact row height (36px). 8px padding = 52px rows = only 18 rows visible at 1080p.
- **Professional Precedent:** NOAA/ECMWF operational interfaces use dense layouts (4-6px spacing) for information-rich dashboards.

**Trade-Off:** 4px base is less forgiving for touch targets. Mitigation: buttons still 36px height minimum (9×base), touch targets 44×44px on mobile.

**Accessibility:** WCAG 2.5.8 Level AAA recommends 24×24px target size. 36px button height exceeds this. 4px base does not compromise accessibility.

### Why No Auto-Refresh?

**Decision:** No auto-refresh of data without explicit user control.

**Rationale:**
- **Concentration Disruption:** Forecasters spend 15-30 minutes analyzing a single cycle. Auto-refresh resets context mid-analysis.
- **Batch Consistency:** Analysis must lock batch IDs to prevent comparing different data mid-session. Auto-refresh would violate this.
- **Cognitive Load:** Unexpected data changes force re-verification ("Did I already check this?"). Increases error risk.

**Trade-Off:** Users must manually refresh to see new cycles. Mitigation: prominent "Refresh" button with last-updated timestamp. Future enhancement: notification banner "New cycle available" without auto-loading.

**Benchmark:** NOAA Aviation Weather Center uses manual refresh only. Auto-refresh considered harmful in operational forecasting contexts.

---

**Document Status:** Design Direction Complete — Ready for Token Definition (Muse) and Implementation (Artisan)

**Next Steps:**
1. Review with stakeholders (meteorologists, product owner, engineering lead)
2. Validate with 3-5 target users via interactive prototype (Forge)
3. Define tokens and component library (Muse)
4. Build P0 MVP (Artisan)
5. WCAG 2.2 AA audit before launch

**Contact:** Design lead for questions/clarifications

---

*Every design direction you set shapes the experience users will live in—make it intentional, inclusive, and evidence-based.*
