# Design System Baseline - YU-322

Implementation of the design system foundation for the meteorological downscaling platform.

## ✅ Implemented

### Design Tokens (app/globals.css)

- **Neutral Colors** (70% of UI):
  - `neutral-100` (#FAFAFA) - Canvas, page background
  - `neutral-200` (#F5F5F5) - Card backgrounds, secondary panels
  - `neutral-300` (#E0E0E0) - Dividers, input borders
  - `neutral-500` (#707070) - Labels, metadata
  - `neutral-900` (#1A1A1A) - Body text, data values

- **Semantic Colors** (20%):
  - `success-500` (#0F7F3F) - Published batches, validation passed
  - `warning-500` (#D97706) - Partial availability, unpublished cycles
  - `error-500` (#DC2626) - Withdrawn batches, missing data
  - `info-500` (#0369A1) - Informational notices, capability gates

- **Typography Scale**:
  - `text-xs` (12px) - Table cell metadata, map scale labels
  - `text-sm` (14px) - Table body text, secondary labels
  - `text-base` (16px) - Body text, form inputs
  - `text-lg` (18px) - Section headers, panel titles
  - `text-xl` (20px) - Page titles
  - `text-2xl` (24px) - Top-level navigation

- **Spacing System** (4px base):
  - `space-1` (4px) - Tight icon-text gaps
  - `space-2` (8px) - Form field gaps, table cell padding
  - `space-3` (12px) - Component internal spacing
  - `space-4` (16px) - Between related components
  - `space-6` (24px) - Between unrelated sections
  - `space-8` (32px) - Page-level margins
  - `space-12` (48px) - Major section separators

### shadcn/ui Configuration

- **Initialized**: Nova preset with CSS variables (components.json)
- **Icon Library**: Changed from Lucide to `@heroicons/react` (as required by DESIGN.md)
- **Base Color**: Neutral theme

### Base Components Installed

All components use Heroicons (NOT Lucide):

1. ✅ **Button** (components/ui/button.tsx) - Already existed
2. ✅ **Input** (components/ui/input.tsx) - Created
3. ✅ **Select** (components/ui/select.tsx) - Created with Heroicons
4. ✅ **Badge** (components/ui/badge.tsx) - Already existed
5. ✅ **Dialog** (components/ui/dialog.tsx) - Already existed
6. ✅ **Tooltip** (components/ui/tooltip.tsx) - Created
7. ✅ **Tabs** (components/ui/tabs.tsx) - Already existed
8. ✅ **Card** (components/ui/card.tsx) - Created
9. ✅ **Table** (components/ui/table.tsx) - Created
10. ✅ **Separator** (components/ui/separator.tsx) - Already existed
11. ✅ **ScrollArea** (components/ui/scroll-area.tsx) - Created

### Heroicons Integration

- Package already installed: `@heroicons/react@^2.2.0`
- Using `/24/outline` variant as specified in DESIGN.md
- Icons properly integrated in Select component (ChevronDown, ChevronUp, Check)
- Example status badges with icons (CheckCircle, XCircle, ExclamationTriangle, InformationCircle)

### Typography Fonts

- **Sans-serif (UI)**: Currently using Geist Sans (fallback for Inter)
- **Monospace (Data)**: Currently using Geist Mono (fallback for JetBrains Mono)
- Font feature settings enabled for better rendering
- Tabular numerics configured for data alignment

### Design System Showcase

Created `/design-system` page demonstrating:
- Color palette with semantic meanings
- Typography scale examples
- All base components in action
- Status badges with Heroicons
- Data table pattern (36px rows for dense layouts)
- Spacing system visualization

## Acceptance Criteria Status

- ✅ Tailwind 4 configured with design tokens from DESIGN.md in app/globals.css
- ✅ Neutral colors: neutral-100 to neutral-900 with correct hex values
- ✅ Semantic colors: success-500, warning-500, error-500, info-500
- ✅ shadcn/ui initialized with Nova preset
- ✅ Base components installed: Button, Input, Select, Badge, Dialog, Tooltip, Tabs, Card, Table, Separator, ScrollArea
- ✅ Heroicons integrated (@heroicons/react/24/outline)
- ✅ Typography: Geist Sans/Mono (fallback for Inter/JetBrains Mono)
- ✅ Typography scale: text-xs to text-2xl
- ✅ Spacing base: 4px (space-1 to space-12)
- ✅ All tokens accessible via CSS variables and Tailwind utilities
- ⚠️ Lint rule for hardcoded colors/spacing - needs ESLint configuration (next step)

## Usage Examples

### Status Badges with Heroicons

```tsx
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

<Badge className="bg-success-100 text-success-700 border-success-300">
  <CheckCircleIcon className="w-3 h-3 mr-1 inline" />
  Published
</Badge>
```

### Data Table with Semantic Colors

```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Cycle ID</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-mono text-sm">2024-03-15-00Z</TableCell>
      <TableCell>
        <Badge className="bg-success-100 text-success-700 border-success-300">
          Published
        </Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Using Design Tokens

```tsx
// Use semantic colors
<div className="bg-success-100 text-success-700">Success message</div>
<div className="bg-warning-100 text-warning-700">Warning message</div>
<div className="bg-error-100 text-error-700">Error message</div>

// Use neutral palette
<div className="bg-neutral-100 text-neutral-900">Background</div>
<div className="border border-neutral-300">Bordered element</div>

// Use spacing tokens
<div className="space-y-4">...</div> // 16px vertical spacing
<div className="p-2">...</div>       // 8px padding
```

## Testing

View the design system showcase at: `/design-system`

All typechecking passes with no errors.

## Next Steps

1. Add ESLint rule to prevent hardcoded colors/spacing
2. Consider font upgrade to Inter + JetBrains Mono (currently using Geist as fallback)
3. Build domain-specific components using these tokens (map viewers, time controls, etc.)
4. Implement WCAG 2.2 AA accessibility testing

## Resources

- Design tokens: `app/globals.css`
- Component library: `components/ui/`
- Showcase page: `app/design-system/page.tsx`
- shadcn/ui config: `components.json`
