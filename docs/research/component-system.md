# Component System Research

## Recommended Choice: shadcn/ui

**Rationale**: shadcn/ui is the recommended choice for this Next.js 16 + React 19 + Tailwind 4 project. It provides accessible, customizable components built on Radix UI primitives, with copy-paste implementation that gives full ownership and eliminates dependency lock-in. The project's existing `SHADCN_COMPONENT_MAPPING.md` confirms this architectural decision.

---

## Next 16 + React 19 Compatibility

### shadcn/ui
- **Status**: ✅ Fully compatible with Next.js 16 and React 19
- **Tailwind 4 Support**: ✅ Compatible with Tailwind CSS v4
- **Production Usage**: Verified in production boilerplates (Next.js 16 + React 19 + Tailwind 4 + shadcn/ui)
- **Source**: [GitHub: next-ts-shadcn-ui Boilerplate](https://github.com/doinel1a/next-ts-shadcn-ui)

### Implementation Approach
- **Architecture**: Copy components into project source code (not npm package)
- **Customization**: Full ownership of component code, modify as needed
- **No Lock-in**: Zero package dependency lock-in after installation
- **Source**: [AdminLTE Next.js 16 shadcn/ui Analysis](https://adminlte.io/blog/nextjs-admin-dashboards-shadcn/)

---

## Maintenance Activity

### shadcn/ui
- **Status**: Actively maintained, open-source
- **Community**: Large and growing adoption in Next.js ecosystem
- **Updates**: Regular component additions and improvements
- **Ecosystem**: Strong integration with Next.js, React, and Tailwind CSS
- **Source**: [shadcn/ui Official Site](https://ui.shadcn.com/)

### Radix UI (Foundation)
- **Maintainer**: WorkOS (enterprise-backed)
- **Status**: Production-ready, actively maintained
- **Focus**: Accessibility, customization, developer experience
- **Testing**: Individual components tested for maximum accessibility
- **Source**: [Radix Primitives Official](https://www.radix-ui.com/primitives), [Radix GitHub](https://github.com/radix-ui/)

### Component Coverage
Based on project's `SHADCN_COMPONENT_MAPPING.md`, the platform requires:

#### ✅ Available from shadcn/ui (38 components)
- **Form Controls**: Button, Input, Select, Checkbox, Radio Group, Switch, Slider
- **Feedback**: Badge, Alert, Tooltip, Skeleton, Progress
- **Layout**: Card, Tabs, Separator, Scroll Area, Accordion
- **Overlays**: Dialog, Popover, Dropdown Menu
- **Data Display**: Table (base for TanStack Table integration)
- **Navigation**: Breadcrumb

#### ❌ Custom Implementation Required (11 components)
- **Meteorological**: 2D Map Viewer, 3D Terrain Viewer
- **Data Visualization**: Time Series Charts, Ensemble Spread Chart, Colorbar
- **Domain-Specific**: Timeline Scrubber, Status Pipeline, Batch Detail Grid, Context Header, Export Grid Bounds Selector, Data Panel

**Source**: [Project SHADCN_COMPONENT_MAPPING.md](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md)

---

## Bundle Size Impact

### shadcn/ui Architecture
- **Delivery Model**: Copy-paste, not npm package
- **Tree-Shaking**: Only components you install are included
- **Bundle Impact**: Depends on components used, typically small per-component overhead
- **Dependencies**: Radix UI primitives (headless, minimal styling overhead)

### Radix UI Primitives
- **Architecture**: Headless components (no built-in styles)
- **Size**: Small per-primitive footprint
- **Granular**: Import only what you need (e.g., `@radix-ui/react-dialog`, `@radix-ui/react-select`)
- **Source**: [npm radix-ui package](https://www.npmjs.com/package/radix-ui)

### Tailwind CSS v4 Integration
- **JIT Compilation**: Only used utility classes are included
- **Custom Tokens**: Project-specific design tokens in `app/globals.css`
- **Optimization**: Minimal overhead when using semantic tokens
- **Source**: [Project SHADCN_COMPONENT_MAPPING.md Phase 2](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md#phase-2-customize-design-tokens-day-1-2)

---

## License Information

### shadcn/ui
- **License**: MIT (open-source)
- **Usage**: Free for commercial and non-commercial use
- **Ownership**: Code is copied into your project, you own it

### Radix UI Primitives
- **License**: MIT
- **Source**: [Radix UI GitHub License](https://github.com/radix-ui/primitives/blob/main/LICENSE)

---

## Architecture & Philosophy

### shadcn/ui Approach
1. **Not a Component Library**: Collection of reusable components you copy into your project
2. **Not an NPM Package**: Components live in your codebase (`components/ui/`)
3. **Full Control**: Modify styling, behavior, and structure as needed
4. **Accessibility Built-in**: Radix UI primitives provide WCAG 2.2 AA baseline
5. **Tailwind-First**: Styled with Tailwind utility classes, customizable via design tokens

**Source**: [shadcn/ui Documentation](https://ui.shadcn.com/docs)

### Radix UI Foundation
- **Headless Components**: No built-in styling, complete design freedom
- **Accessibility-First**: Keyboard navigation, ARIA attributes, focus management
- **Unstyled Primitives**: Ship state via `data-*` attributes
- **Developer Experience**: Intuitive APIs, TypeScript support

**Source**: [Radix Primitives Philosophy](https://github.com/radix-ui/primitives/blob/main/philosophy.md)

---

## Accessibility

### Built-in Features
- ✅ Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- ✅ Focus indicators and focus trapping (modals)
- ✅ ARIA labels, roles, and live regions
- ✅ Screen reader announcements
- ✅ Proper semantic HTML

### WCAG 2.2 AA Compliance
- **Baseline**: Radix UI components tested for maximum accessibility
- **Application Context**: Developer responsible for app-level accessibility patterns
- **Guidance**: Radix provides supporting materials for building fully accessible apps

**Source**: [Radix Philosophy - Accessibility](https://github.com/radix-ui/primitives/blob/main/philosophy.md)

### Project-Specific Requirements
Per `SHADCN_COMPONENT_MAPPING.md`, additional accessibility requirements for meteorological platform:

- Long-session ergonomics (1.5 line-height, 16px base font)
- No auto-refresh (disrupts concentration)
- Explicit unavailable states (never silent failures)
- Data table semantics (`<thead>`, `<tbody>`, `scope` attributes)
- 4.5:1 contrast ratio for all text/background pairs

**Source**: [Project SHADCN_COMPONENT_MAPPING.md - Accessibility](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md#accessibility-considerations)

---

## Implementation Strategy

### Phase 1: Initialize shadcn/ui

```bash
# Initialize with Nova preset (Linear-restrained aesthetic)
npx shadcn@latest init --preset nova

# Add required base components
npx shadcn@latest add button input select badge dialog tooltip \
  tabs card separator skeleton alert progress checkbox \
  radio-group switch slider scroll-area popover table \
  dropdown-menu combobox accordion label
```

### Phase 2: Customize Design Tokens

Edit `app/globals.css` to apply project color palette:

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

  /* Map to shadcn tokens */
  --color-background: var(--color-neutral-100);
  --color-foreground: var(--color-neutral-900);
  --color-border: var(--color-neutral-300);
  --color-success: var(--color-success-500);
  --color-destructive: var(--color-error-500);
}
```

**Source**: [Project SHADCN_COMPONENT_MAPPING.md - Phase 2](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md#phase-2-customize-design-tokens-day-1-2)

### Phase 3: Extend with Custom Variants

Example: Status badges for meteorological data

```tsx
// components/ui/badge.tsx
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 ...",
  {
    variants: {
      variant: {
        published: "bg-success-100 text-success-700 border-success-300",
        partial: "bg-warning-100 text-warning-700 border-warning-300",
        withdrawn: "bg-error-100 text-error-700 border-error-300",
        unpublished: "bg-neutral-200 text-neutral-600",
      },
    },
  }
)
```

**Source**: [Project SHADCN_COMPONENT_MAPPING.md - Phase 3](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md#phase-3-customize-status-badges-day-2)

### Phase 4: Integrate with TanStack Table

Compose shadcn `Table` component with TanStack Table for data grid functionality:

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { useReactTable, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'

function CycleListTable() {
  const table = useReactTable({
    data: cycles,
    columns: [...],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  
  return (
    <ScrollArea className="h-[600px]">
      <Table>
        {/* Render with shadcn Table primitives */}
      </Table>
    </ScrollArea>
  )
}
```

**Source**: [Project SHADCN_COMPONENT_MAPPING.md - Phase 4](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md#phase-4-customize-data-table-week-1)

---

## Icon Integration

### Project Standard: Heroicons

The project uses **Heroicons** (not shadcn's default Lucide Icons):

```tsx
// ✅ Correct: Use Heroicons
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'

// ❌ Wrong: Don't use Lucide (shadcn default)
import { Check, AlertTriangle, X, Clock } from 'lucide-react'
```

**Consistency Rule**: All icons must be from Heroicons (24px outline style). Never mix icon libraries.

**Source**: [Project SHADCN_COMPONENT_MAPPING.md - Icon Implementation](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md#icon-implementation-with-shadcn)

---

## Alternatives Considered

### Material UI (MUI)
- **Pros**: Comprehensive component library, mature ecosystem
- **Cons**: Heavy bundle size, opinionated styling, harder to customize deeply
- **Verdict**: Not recommended due to bundle overhead and customization constraints

### Ant Design
- **Pros**: Enterprise-ready, extensive component catalog
- **Cons**: Heavy bundle, Chinese-first design language, less Tailwind-friendly
- **Verdict**: Not recommended due to bundle size and Tailwind integration challenges

### Chakra UI
- **Pros**: Accessible, good DX, theme-based
- **Cons**: CSS-in-JS overhead, less compatible with Tailwind CSS workflow
- **Verdict**: Not recommended due to incompatibility with Tailwind 4 approach

### Headless UI (Tailwind Labs)
- **Pros**: Official Tailwind companion, fully headless
- **Cons**: Limited component set, no pre-built styles to start from
- **Verdict**: Good alternative but requires more initial implementation effort

### Why shadcn/ui Wins
1. **Tailwind-Native**: Designed for Tailwind CSS v4
2. **Copy-Paste Model**: No runtime dependency, full code ownership
3. **Radix Foundation**: Accessibility built-in from low-level primitives
4. **Next.js Optimized**: Official Next.js examples and documentation
5. **Flexibility**: Easy to extend with domain-specific requirements (status badges, data tables)
6. **Zero Lock-in**: Components are yours to modify, no migration needed

---

## Testing & Quality Assurance

### Testing Checklist (from project docs)

After implementing shadcn/ui components:

- [ ] All status badges have correct colors and icons
- [ ] Data tables are sortable and keyboard-accessible
- [ ] Forms show validation errors with `data-invalid` + `aria-invalid`
- [ ] Modals have `DialogTitle` for accessibility
- [ ] No emoji in production UI (only Heroicons)
- [ ] All text/background pairs meet 4.5:1 contrast ratio
- [ ] Focus indicators visible on all interactive elements
- [ ] Components use semantic color tokens, not raw Tailwind values

**Source**: [Project SHADCN_COMPONENT_MAPPING.md - Testing Checklist](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md#testing-checklist)

---

## Integration with Project Architecture

### Component Categories

#### 1. Standard UI (shadcn/ui)
Use shadcn/ui directly with token customization:
- Buttons, inputs, forms, modals
- Navigation (tabs, breadcrumbs)
- Feedback (badges, alerts, tooltips)
- Layout (cards, separators)

#### 2. Data-Heavy UI (shadcn + TanStack)
Compose shadcn base with specialized libraries:
- Data tables: shadcn `Table` + TanStack Table
- Variable selector: shadcn `Combobox` + search/filtering

#### 3. Domain-Specific (Custom)
Build custom components for meteorological requirements:
- 2D/3D map viewers (Mapbox GL JS)
- Time series charts (Recharts/D3.js)
- Timeline scrubber with play/pause
- Colorbar with scientific scales

**Source**: [Project SHADCN_COMPONENT_MAPPING.md - Component Reuse Guidelines](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md#component-reuse-guidelines)

---

## State Management Integration

For the 6 analysis sub-pages requiring shared state (周期/时刻/变量/位置/逐时效批次):

### Context Header Component
- **Base**: Custom component (not shadcn)
- **State**: Zustand or TanStack Query (see State Management research)
- **UI Elements**: shadcn `Badge`, `Separator` for displaying current selection

### Analysis Navigation
- **Base**: shadcn `Tabs` component
- **Customization**: Persist active tab to shared state
- **Integration**: Sync with URL query parameters

**Source**: [Project SHADCN_COMPONENT_MAPPING.md - Context Header](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md#-fully-custom-required)

---

## Primary Sources

### Official Documentation
- [shadcn/ui Official Documentation](https://ui.shadcn.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Radix UI GitHub Repository](https://github.com/radix-ui/)
- [Radix UI Philosophy](https://github.com/radix-ui/primitives/blob/main/philosophy.md)
- [Radix UI npm Package](https://www.npmjs.com/package/radix-ui)

### Next.js 16 + React 19 Integration
- [GitHub: next-ts-shadcn-ui Boilerplate](https://github.com/doinel1a/next-ts-shadcn-ui)
- [AdminLTE: Next.js 16 shadcn/ui Dashboards](https://adminlte.io/blog/nextjs-admin-dashboards-shadcn/)
- [OpenReplay: How to Integrate ShadCN with Next.js](https://blog.openreplay.com/integrate-shadcn-nextjs/)

### Component Implementation Guides
- [shadcn/ui Data Table Guide](https://ui.shadcn.com/docs/components/radix/data-table)
- [Dev.to: ShadCN UI for Modern React Apps](https://dev.to/sandip_shrest/shadcn-ui-the-ultimate-component-library-for-modern-react-apps-5g5g)

### Project-Specific Documentation
- [Project SHADCN_COMPONENT_MAPPING.md](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md)
