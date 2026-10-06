# Implementation Spec: Context Header Component

**Status:** Ready for Agent  
**Created:** 2024-10-06  
**Related Linear Tickets:** YU-320

---

## Problem Statement

Users navigating between the 6 analysis sub-pages need continuous awareness of which forecast data they're viewing (cycle, valid time, variable, region, batch). Without a persistent context header, users risk:

- Analyzing the wrong cycle or variable without realizing it
- Losing track of which batch version they're viewing
- Having to navigate away to change context parameters
- Not knowing if their current batch has been withdrawn or replaced

## Solution

Implement a persistent **Context Header Component** that displays current analysis parameters and provides quick actions:

- Single-line compact display: Cycle, Valid time (+offset), Variable, Region, Batch version
- Edit button to open modal for changing any parameter
- Refresh button to re-validate batch availability
- Warning display when batch is withdrawn with suggested alternatives
- Integration with existing Zustand store and useAnalysisContext() hook

## Component Structure

### ContextHeader Component

**Location:** `components/analysis/ContextHeader.tsx`

**Props:**
```typescript
interface ContextHeaderProps {
  className?: string;
}
```

**Behavior:**
- Reads state from `useAnalysisContext()` hook
- Displays formatted context string with pipe separators
- Renders Edit and Refresh action buttons
- Conditionally shows warning badge when batch issues detected

### EditContextModal Component

**Location:** `components/analysis/EditContextModal.tsx`

**Props:**
```typescript
interface EditContextModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Behavior:**
- Form fields for: cycle (datetime), valid time (datetime), variable (select), region (select), batch (select)
- Validates selections before save
- Updates Zustand store on successful save
- Closes modal after save

## Display Format

Single-line format:
```
Cycle: 2024-03-15 00Z | Valid: 2024-03-17 12Z (+60h) | Var: 10m_wind | Region: East China | Batch: v2.3.1
```

With warning:
```
Cycle: 2024-03-15 00Z | Valid: 2024-03-17 12Z (+60h) | Var: 10m_wind | Region: East China | Batch: v2.3.1 [⚠ Withdrawn]
```

## State Integration

### Reading State

Uses `useAnalysisContext()` hook which returns:
```typescript
{
  cycle: Date;
  validTime: Date;
  variable: string;
  region: string;
  batch: string;
  batchStatus?: 'active' | 'withdrawn' | 'replaced';
  alternativeBatches?: string[];
}
```

### Updating State

Uses Zustand store action:
```typescript
updateAnalysisContext({
  cycle?: Date;
  validTime?: Date;
  variable?: string;
  region?: string;
  batch?: string;
})
```

## UI Components

### shadcn/ui Components Used

- `Badge` - for batch status warnings
- `Separator` - for pipe dividers (or use literal "|")
- `Dialog` - for edit modal
- `Button` - for Edit and Refresh actions
- `Select` - for dropdown fields in modal
- `Label` - for form field labels

### Icons (Heroicons)

- `PencilIcon` (16px) - Edit button
- `ArrowPathIcon` (16px) - Refresh button
- `ExclamationTriangleIcon` (optional) - Warning indicator

## Styling

Per DESIGN.md:
- Font size: 14px for labels
- Color: neutral-500 for metadata text
- Spacing: compact single-line layout
- Alignment: left-aligned within container

## Refresh Logic

When Refresh clicked:
1. Call batch validation API (assume endpoint exists)
2. If batch withdrawn:
   - Update Zustand store with new status
   - Display warning badge
   - Show alternatives in a toast or inline message
3. If batch still active:
   - Show success feedback (toast or brief highlight)

## File Structure

```
components/
  analysis/
    ContextHeader.tsx          # Main header component
    EditContextModal.tsx       # Edit modal component
```

## Acceptance Criteria

1. Header displays formatted string with all 5 context parameters
2. Edit button opens modal with form fields
3. Modal save updates Zustand store
4. Refresh button validates batch status
5. Warning badge shows when batch withdrawn
6. Component persists across navigation between analysis sub-pages
7. Typography matches DESIGN.md specifications
8. Uses correct Heroicons at 16px size

## Testing

- Unit tests: component renders with mock context
- Integration tests: Edit modal updates store correctly
- Integration tests: Refresh validates batch and shows warnings
- Visual tests: typography and layout match DESIGN.md
- Navigation tests: header persists across sub-page navigation

## Dependencies

- Existing: `stores/analysisContext.ts` (Zustand store)
- Existing: `lib/stateResolution.ts` (state initialization)
- Existing: shadcn/ui components
- Existing: Heroicons package
- TBD: Batch validation API endpoint
