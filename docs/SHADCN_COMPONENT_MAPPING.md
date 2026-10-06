# shadcn/ui Component Mapping for Meteorological Platform

**Purpose:** This document maps design system components from DESIGN.md to shadcn/ui components, identifying which can be customized from shadcn and which require full custom implementation.

---

## shadcn/ui Base Components (Recommended for Reuse)

These standard UI components can be added from shadcn/ui and customized with design tokens:

### ✅ Can Use shadcn/ui Directly (with token customization)

| Design Component | shadcn Component | Customization Needed | Command |
|-----------------|------------------|----------------------|---------|
| **Button** | `Button` | Apply design tokens: colors, spacing, hover states | `npx shadcn@latest add button` |
| **Input Fields** | `Input` | Typography (monospace for data), spacing | `npx shadcn@latest add input` |
| **Select/Dropdown** | `Select` | Status badges, icon integration | `npx shadcn@latest add select` |
| **Badge (Status)** | `Badge` | Custom variants: published/partial/withdrawn/unpublished | `npx shadcn@latest add badge` |
| **Dialog/Modal** | `Dialog` | Confirmation dialogs, export config modal | `npx shadcn@latest add dialog` |
| **Tooltip** | `Tooltip` | Context help, provenance details | `npx shadcn@latest add tooltip` |
| **Tabs** | `Tabs` | Navigation (6 analysis sub-pages), top-level nav | `npx shadcn@latest add tabs` |
| **Card** | `Card` | Forecast overview summary cards | `npx shadcn@latest add card` |
| **Separator** | `Separator` | Section dividers | `npx shadcn@latest add separator` |
| **Skeleton** | `Skeleton` | Loading states (prefer over spinners) | `npx shadcn@latest add skeleton` |
| **Alert** | `Alert` | Empty states, error messages | `npx shadcn@latest add alert` |
| **Progress** | `Progress` | Export task progress | `npx shadcn@latest add progress` |
| **Checkbox** | `Checkbox` | Multi-select in cycle comparison | `npx shadcn@latest add checkbox` |
| **Radio Group** | `RadioGroup` | Cycle+Lead vs Valid Time Search toggle | `npx shadcn@latest add radio-group` |
| **Switch** | `Switch` | Feature toggles (loop animation, include unpublished) | `npx shadcn@latest add switch` |
| **Slider** | `Slider` | Lead time selector (0-90h), opacity controls | `npx shadcn@latest add slider` |
| **Scroll Area** | `ScrollArea` | Cycle lists, batch lists (50+ rows) | `npx shadcn@latest add scroll-area` |
| **Popover** | `Popover` | Filter popovers, context menus | `npx shadcn@latest add popover` |
| **Breadcrumb** | `Breadcrumb` | Page navigation (future P1) | `npx shadcn@latest add breadcrumb` |

### 🔧 Requires Moderate Customization

| Design Component | shadcn Base | Customization Required |
|-----------------|-------------|------------------------|
| **Data Table** | `Table` | Add TanStack Table, sortable columns, status badges, row selection | `npx shadcn@latest add table` |
| **Form Controls** | `Input` + `Label` + `FieldGroup` | Add validation states (`data-invalid`), grid limit warnings, unpublished time blockers | `npx shadcn@latest add input label` |
| **Dropdown Menu** | `DropdownMenu` | Add Cycle selector with search, status badges per item | `npx shadcn@latest add dropdown-menu` |
| **Combobox** | `Combobox` | Variable selector with categories (surface/pressure/derived) | `npx shadcn@latest add combobox` |
| **Accordion** | `Accordion` | Per-lead coverage grid (expand/collapse), provenance details | `npx shadcn@latest add accordion` |

---

## Custom Components (Cannot Use shadcn/ui)

These domain-specific components require full custom implementation:

### ❌ Fully Custom Required

| Component | Reason | Tech Stack |
|-----------|--------|------------|
| **2D Map Viewer** | Meteorological field visualization, Mapbox/Leaflet integration | Mapbox GL JS or Leaflet |
| **3D Terrain Viewer** | DEM overlay, profile sampling, camera controls | Three.js or Mapbox 3D |
| **Time Series Charts** | Ensemble spread, member lines, EC-AI comparison | Recharts or D3.js |
| **Ensemble Spread Chart** | Mean ± spread visualization, threshold exceedance | Recharts or D3.js |
| **Timeline Scrubber** | Hourly ticks, play/pause, gap indicators, frame counter | Custom React component |
| **Colorbar** | Variable-specific scales (ColorBrewer), min/max labels, toggle | Custom SVG component |
| **Status Pipeline** | Input → Production → Validation → Publication flow diagram | Custom SVG or React Flow |
| **Batch Detail Grid** | Per-lead/coverage provenance table with inline status | Custom table component |
| **Context Header** | Shared analysis state (cycle, time, variable, region, batch) | Custom component with state management |
| **Export Grid Bounds Selector** | Map-based rectangle drawing, dimension calculator | Mapbox Draw or custom |
| **Data Panel** | Point click values, ensemble member display, EC baseline | Custom panel component |

---

## Implementation Strategy

### Phase 1: Setup shadcn/ui (Day 1)

```bash
# Initialize with Nova preset (Linear-restrained aesthetic)
npx shadcn@latest init --preset nova

# Add base components
npx shadcn@latest add button input select badge dialog tooltip \
  tabs card separator skeleton alert progress checkbox \
  radio-group switch slider scroll-area popover table \
  dropdown-menu combobox accordion label
```

### Phase 2: Customize Design Tokens (Day 1-2)

Edit `app/globals.css` to apply DESIGN.md color palette:

```css
@theme inline {
  /* Neutral Foundation */
  --color-neutral-100: #FAFAFA;
  --color-neutral-200: #F5F5F5;
  --color-neutral-300: #E0E0E0;
  --color-neutral-500: #707070;
  --color-neutral-900: #1A1A1A;

  /* Semantic Status */
  --color-success-500: #0F7F3F;
  --color-warning-500: #D97706;
  --color-error-500: #DC2626;
  --color-info-500: #0369A1;

  /* Data Visualization (ColorBrewer scales) */
  --color-temp-cold: #053061;
  --color-temp-hot: #67001F;
  --color-precip-light: #FFFFCC;
  --color-precip-heavy: #081D58;
  --color-wind-light: #F0F9E8;
  --color-wind-heavy: #084081;
  --color-spread-low: #FEE5D9;
  --color-spread-high: #A50F15;
}
```

Map to shadcn semantic tokens:

```css
@theme inline {
  --color-background: var(--color-neutral-100);
  --color-foreground: var(--color-neutral-900);
  --color-card: var(--color-neutral-200);
  --color-muted: var(--color-neutral-500);
  --color-border: var(--color-neutral-300);
  
  /* Status colors */
  --color-success: var(--color-success-500);
  --color-warning: var(--color-warning-500);
  --color-destructive: var(--color-error-500);
  --color-info: var(--color-info-500);
}
```

### Phase 3: Customize Status Badges (Day 2)

Extend `Badge` component with custom variants:

```tsx
// components/ui/badge.tsx
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 ...",
  {
    variants: {
      variant: {
        // ... existing variants
        published: "bg-success-100 text-success-700 border-success-300",
        partial: "bg-warning-100 text-warning-700 border-warning-300",
        withdrawn: "bg-error-100 text-error-700 border-error-300",
        unpublished: "bg-neutral-200 text-neutral-600",
      },
    },
  }
)

// Usage with Heroicons
import { CheckCircleIcon, AlertTriangleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

<Badge variant="published">
  <CheckCircleIcon className="size-4" />
  Published
</Badge>
```

### Phase 4: Customize Data Table (Week 1)

Compose shadcn `Table` + TanStack Table + custom features:

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useReactTable, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'

function CycleListTable() {
  const table = useReactTable({
    data: cycles,
    columns: [
      { accessorKey: 'cycleId', header: 'Cycle ID' },
      { accessorKey: 'initTime', header: 'Init Time' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={getStatusVariant(row.original.status)}>
            {getStatusIcon(row.original.status)}
            {row.original.status}
          </Badge>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  
  return (
    <ScrollArea className="h-[600px]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {/* Render header with ChevronUp/ChevronDown icons */}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {/* Render rows with hover states, selection */}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
```

### Phase 5: Custom Domain Components (Week 1-2)

Build meteorological-specific components:

1. **Map Viewer:** Mapbox GL JS wrapper with layer controls
2. **Time Series Chart:** Recharts with ensemble spread visualization
3. **Timeline Scrubber:** Custom React component with play/pause
4. **Status Pipeline:** Custom SVG pipeline diagram
5. **Context Header:** Shared state component with Zustand

---

## Component Reuse Guidelines

### ✅ DO: Use shadcn for Standard UI Patterns

- Buttons, inputs, dropdowns, modals, tooltips
- Form layouts with `FieldGroup` + `Field`
- Status badges with custom variants
- Loading states with `Skeleton`
- Navigation with `Tabs`
- Cards for summary layouts

### ❌ DON'T: Force shadcn for Domain-Specific UI

- Weather maps (use Mapbox/Leaflet)
- Scientific charts (use Recharts/D3.js)
- Timeline controls (custom component)
- Production pipelines (custom SVG)
- Colorbar legends (custom SVG)

### 🔧 CUSTOMIZE: Extend shadcn with Domain Logic

- Data tables: shadcn `Table` + TanStack Table + sorting/filtering
- Cycle selector: shadcn `DropdownMenu` + search + status badges
- Export forms: shadcn `Input` + custom validation (grid limits, unpublished blockers)
- Provenance panels: shadcn `Accordion` + custom per-lead grids

---

## Icon Implementation with shadcn

shadcn uses **Lucide Icons** by default, but the project uses **Heroicons**. After adding components, replace icon imports:

```tsx
// ❌ shadcn default (Lucide)
import { Check, AlertTriangle, X, Clock } from 'lucide-react'

// ✅ Replace with Heroicons
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'
```

**Consistency:** All icons must be from Heroicons (24px outline style). Never mix Lucide and Heroicons.

---

## Accessibility Considerations

shadcn components include WCAG 2.2 AA accessibility by default:

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators
- ✅ ARIA labels and roles
- ✅ Screen reader announcements

**Additional Requirements for Meteorological Platform:**

- Long-session ergonomics (1.5 line-height, 16px base font)
- No auto-refresh (disrupts concentration)
- Explicit unavailable states (never silent failures)
- Data table semantics (`<thead>`, `<tbody>`, `scope` attributes)

---

## Testing Checklist

After customizing shadcn components:

- [ ] All status badges have correct colors and icons (CheckCircle, AlertTriangle, XCircle, Clock)
- [ ] Data tables are sortable and keyboard-accessible
- [ ] Forms show validation errors with `data-invalid` + `aria-invalid`
- [ ] Modals have `DialogTitle` for accessibility
- [ ] No emoji in production UI (only Heroicons)
- [ ] All text/background pairs meet 4.5:1 contrast ratio
- [ ] Focus indicators visible on all interactive elements
- [ ] Components use semantic color tokens (`bg-background`, `text-muted-foreground`), not raw Tailwind values

---

## Next Steps

1. **Initialize shadcn:** `npx shadcn@latest init --preset nova`
2. **Add base components:** Run commands from Phase 1 above
3. **Customize tokens:** Edit `app/globals.css` with DESIGN.md colors
4. **Replace Lucide with Heroicons:** Update all icon imports
5. **Build custom components:** Map viewer, charts, timeline scrubber
6. **Test accessibility:** Run axe DevTools, manual keyboard testing

---

**References:**
- [DESIGN.md](../DESIGN.md) - Complete design system foundation
- [shadcn/ui Docs](https://ui.shadcn.com/docs) - Official component documentation
- [Heroicons](https://heroicons.com/) - Icon library (24px outline)
- [ColorBrewer](https://colorbrewer2.org/) - Scientific color scales for data visualization
