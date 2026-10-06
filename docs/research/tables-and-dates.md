# Tables & Date Libraries Research

## Recommended Choices

1. **Data Tables**: TanStack Table
2. **Date Manipulation**: date-fns

**Rationale**: TanStack Table is the industry-standard headless table library with React 19 compatibility, extensive features (sorting, filtering, pagination), and proven integration with shadcn/ui components. date-fns offers the best balance of features, bundle size, and tree-shaking for date operations, with modular imports reducing final bundle size significantly compared to Luxon.

---

## TanStack Table: Data Tables

### Next 16 + React 19 Compatibility

- **Status**: ✅ Fully compatible with React 16.8, React 17, React 18, and React 19
- **Official Support**: Works with Next.js 16 App Router
- **Version**: v8 (stable)
- **Source**: [TanStack Table v8 Installation](https://tanstack.com/table/v8/docs/installation)

### Maintenance Activity

- **Weekly Downloads**: 29.5M
- **Total Downloads**: 1.3B+
- **GitHub Stars**: 28,474
- **Status**: Actively maintained by TanStack (Tanner Linsley)
- **Ecosystem**: Framework-agnostic (React, Vue, Solid, Svelte, Qwik adapters)
- **Source**: [TanStack Table Official Site](https://tanstack.com/table/v8), [npm-compare @tanstack/react-table](https://npm-compare.com/@tanstack/react-table)

### Bundle Size Impact

- **Architecture**: Headless (no built-in UI components or styles)
- **Core Logic Only**: Table state management, sorting, filtering algorithms
- **Tree-Shakable**: Import only features you use
- **Typical Size**: Small overhead when using core features only
- **No CSS Overhead**: Bring your own markup and styles

**Source**: [TanStack Table Documentation](https://tanstack.com/table/v8)

### License

- **License**: MIT
- **Source**: [TanStack Table GitHub License](https://github.com/TanStack/table/blob/beta/LICENSE)

### Key Features

1. **Sorting**: Multi-column sorting, custom sort functions
2. **Filtering**: Column filters, global search, faceted filters
3. **Pagination**: Client-side and server-side pagination
4. **Row Selection**: Single/multi-row selection with checkboxes
5. **Column Visibility**: Show/hide columns dynamically
6. **Column Resizing**: Interactive column width adjustment
7. **Column Ordering**: Drag-and-drop column reordering
8. **Row Expansion**: Expandable rows for nested data
9. **Grouping & Aggregation**: Group rows and calculate aggregates
10. **Virtualization**: Integrate with react-virtual for large datasets

**Source**: [TanStack Table Official Site](https://tanstack.com/table/v8)

### Integration with shadcn/ui

Per project's `SHADCN_COMPONENT_MAPPING.md`, TanStack Table is the recommended approach:

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
                <TableHead 
                  key={header.id} 
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer"
                >
                  {/* Render header with sort indicators */}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
```

**Source**: [Project SHADCN_COMPONENT_MAPPING.md - Phase 4](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md#phase-4-customize-data-table-week-1), [shadcn/ui Data Table Guide](https://ui.shadcn.com/docs/components/radix/data-table)

### Use Cases for meteo-downscale

1. **Cycle List Table**: Sortable, filterable list of forecast cycles with status badges
2. **Batch Detail Grid**: Per-lead/coverage provenance table with inline status
3. **Variable Selection Table**: Categorized variables (surface/pressure/derived)
4. **Ensemble Member Table**: List of ensemble members with selection
5. **Export History Table**: Past exports with status, timestamps, download links

### Alternatives Considered

#### react-table (legacy)
- **Status**: Deprecated (TanStack Table is the successor)
- **Verdict**: Use TanStack Table instead

#### AG Grid
- **Pros**: Enterprise features, extremely comprehensive
- **Cons**: Heavy bundle (300KB+), paid license for enterprise features
- **Verdict**: Overkill for this project's requirements

#### Material-Table / MUI DataGrid
- **Pros**: Full-featured, good documentation
- **Cons**: Tied to Material UI styling, heavier bundle
- **Verdict**: Not compatible with Tailwind-first approach

#### React Data Grid (Adazzle)
- **Pros**: Excel-like experience
- **Cons**: Less flexible styling, smaller ecosystem
- **Verdict**: TanStack Table more flexible

---

## Date Libraries: date-fns vs Luxon vs Day.js

### Recommended: date-fns

#### Next 16 + React 19 Compatibility

- **Status**: ✅ Fully compatible with React 19 and Next.js 16
- **Runtime**: JavaScript library, framework-agnostic
- **Version**: v4 (latest, with timezone support via `date-fns-tz`)

#### Maintenance Activity

- **Weekly Downloads**: 72.4M
- **Monthly Downloads**: 334.5M
- **Growth**: +129% year-over-year
- **Unpacked Size**: 10.9 MB (includes all functions)
- **Status**: Actively maintained, large community
- **Source**: [javascripts.com date-fns](https://javascripts.com/packages/date-fns/), [npm-compare date-fns](https://npm-compare.com/date-fns)

#### Bundle Size Impact

- **Modular Design**: Each function is a separate module
- **Tree-Shaking**: ✅ Import only functions you use
- **Typical Bundle**: 5-15KB for common date operations
- **Example**: `import { format, parseISO } from 'date-fns'` → only those functions bundled
- **Unpacked vs Bundled**: 10.9MB unpacked ≠ final bundle (tree-shaking dramatically reduces size)

**Source**: [npm-compare date-fns](https://npm-compare.com/date-fns), [shadcn/ui Discussion: date-fns vs dayjs](https://github.com/shadcn-ui/ui/discussions/4817)

#### License

- **License**: MIT
- **Source**: date-fns official repository

#### Key Advantages

1. **Pure Functions**: Immutable, predictable behavior
2. **Native Date Objects**: Uses JavaScript `Date`, no custom classes
3. **Tree-Shakable**: Import only what you need
4. **TypeScript Support**: Excellent TypeScript definitions
5. **Comprehensive**: 200+ functions for all date operations
6. **Functional Programming**: Chainable with functional utilities

#### Timezone Support

- **Package**: `date-fns-tz` (separate package)
- **Approach**: Uses browser's native `Intl` API (no timezone data files)
- **Bundle Impact**: Minimal (no bundled timezone databases)
- **Source**: [npm date-fns-tz](https://www.npmjs.com/package/date-fns-tz)

#### Common Use Cases for meteo-downscale

```typescript
import { format, parseISO, addHours, differenceInHours } from 'date-fns'
import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

// Format forecast initialization time
const initTime = parseISO('2026-10-05T00:00:00Z')
const formatted = format(initTime, 'yyyy-MM-dd HH:mm') // "2026-10-05 00:00"

// Calculate valid time (init time + lead time)
const leadTime = 24 // hours
const validTime = addHours(initTime, leadTime)

// Calculate lead time from two dates
const lead = differenceInHours(validTime, initTime) // 24

// Format in specific timezone (for display)
const localTime = formatInTimeZone(
  initTime,
  'Asia/Shanghai',
  'yyyy-MM-dd HH:mm zzz'
) // "2026-10-05 08:00 GMT+8"

// Timeline labels (hourly ticks)
const timeLabels = Array.from({ length: 91 }, (_, i) => 
  format(addHours(initTime, i), 'HH:mm')
)
```

---

### Alternative: Day.js

#### Compatibility & Maintenance

- **Status**: ✅ Compatible with React 19 and Next.js 16
- **Weekly Downloads**: 51.5M
- **Monthly Downloads**: 231.6M
- **Growth**: +95% year-over-year
- **Source**: [javascripts.com dayjs](https://javascripts.com/packages/dayjs/)

#### Bundle Size

- **Size**: 2KB minified + gzipped (base library)
- **Unpacked**: 682 KB (vs 10.9 MB for date-fns)
- **Plugins**: Additional features as plugins (~1-3KB each)
- **Source**: [npm-compare dayjs](https://npm-compare.com/dayjs), [npm dayjs](https://www.npmjs.org/package/dayjs)

#### License

- **License**: MIT

#### Pros

- **Smallest Bundle**: 2KB base library
- **Moment.js API Compatible**: Easy migration from Moment.js
- **Chainable API**: `dayjs().add(1, 'day').format('YYYY-MM-DD')`
- **Plugin System**: Modular feature loading

#### Cons

- **Less Tree-Shakable**: Plugin-based architecture less optimal than date-fns's per-function modules
- **Smaller Ecosystem**: Fewer integrations and community resources than date-fns
- **Mutable Wrapper**: Wraps native Date in mutable object (less functional)

**Source**: [Reintech: date-fns vs dayjs vs Luxon 2026](https://reintech.io/blog/date-fns-vs-dayjs-vs-luxon-comparison-2026)

#### When to Choose Day.js

- Bundle size is the absolute highest priority
- Migrating from Moment.js (API compatibility)
- Prefer chainable API over functional style

---

### Alternative: Luxon

#### Compatibility & Maintenance

- **Status**: ✅ Compatible with React 19 and Next.js 16
- **Maintainer**: Moment.js team (successor to Moment.js)
- **Weekly Downloads**: Lower than date-fns and Day.js

#### Bundle Size

- **Size**: ~17KB minified + gzipped (base library)
- **Comparison**: ~8.5x larger than Day.js, but smaller unpacked than date-fns
- **Timezone Data**: Uses native `Intl` API (no bundled data)
- **Source**: [npm-compare luxon](https://npm-compare.com/dayjs,luxon)

#### License

- **License**: MIT
- **Source**: [luxon npm](https://www.npmjs.com/package/luxon)

#### Pros

1. **Rich DateTime API**: Immutable `DateTime` objects with extensive methods
2. **Native Timezone Support**: Built-in timezone handling via `Intl`
3. **Intervals & Durations**: First-class support for time intervals
4. **Internationalization**: Built-in i18n via `Intl`
5. **Moment.js Team**: Successor to Moment.js with modern approach

**Source**: [npm-compare date-fns vs luxon](https://npm-compare.com/date-fns,intl,luxon,react-intl)

#### Cons

1. **Larger Bundle**: ~17KB (vs 2KB Day.js, ~5-15KB date-fns with tree-shaking)
2. **Custom DateTime Class**: Not using native `Date` (learning curve)
3. **Less Tree-Shakable**: Object-oriented API harder to tree-shake
4. **Browser Requirement**: Relies on modern `Intl` API (IE11 incompatible)

**Source**: [npm-compare dayjs vs luxon](https://npm-compare.com/dayjs,luxon), [GitHub Luxon Tree-Shaking Issue](https://github.com/moment/luxon/issues/854)

#### When to Choose Luxon

- Need rich timezone operations (multi-timezone conversions)
- Prefer object-oriented API over functional style
- Need built-in intervals and durations
- Bundle size less critical than API richness

---

## Comparison Matrix

### Bundle Size (Minified + Gzipped)

| Library | Base Size | With Tree-Shaking | Timezone Support |
|---------|-----------|-------------------|------------------|
| Day.js | 2KB | 2-6KB (plugins) | Plugin (~3KB) |
| date-fns | N/A | 5-15KB (typical) | date-fns-tz (~minimal) |
| Luxon | 17KB | 17KB+ | Built-in (Intl API) |

**Source**: [npm-compare date-fns vs dayjs vs luxon](https://npm-compare.com/it-IT/date-fns,dayjs,luxon), [Dev.to Day.js Size Impact](https://dev.to/marcinwosinek/what-is-the-size-impact-of-importing-day-js-58fm)

### Features Comparison

| Feature | date-fns | Day.js | Luxon |
|---------|----------|--------|-------|
| Tree-Shaking | ✅ Excellent | ⚠️ Plugin-based | ❌ Limited |
| TypeScript | ✅ Excellent | ✅ Good | ✅ Excellent |
| Immutability | ✅ Pure functions | ✅ Immutable wrapper | ✅ Immutable DateTime |
| API Style | Functional | Chainable | Object-oriented |
| Native Date | ✅ Uses `Date` | ✅ Wraps `Date` | ❌ Custom `DateTime` |
| Timezone Support | date-fns-tz + Intl | Plugin + Intl | Built-in + Intl |
| i18n | Locale files | Plugin | Built-in Intl |
| Intervals/Durations | Manual calculation | Plugin | Built-in |

### Adoption Metrics (Weekly Downloads)

| Library | Weekly Downloads | Growth (YoY) |
|---------|------------------|--------------|
| date-fns | 72.4M | +129% |
| Day.js | 51.5M | +95% |
| Luxon | Lower | Stable |

**Source**: [javascripts.com date-fns](https://javascripts.com/packages/date-fns/), [javascripts.com dayjs](https://javascripts.com/packages/dayjs/), [npm-compare luxon](https://npm-compare.com/date-fns,intl,luxon,react-intl)

---

## Decision Rationale

### Why date-fns for meteo-downscale?

1. **Tree-Shaking**: Only bundle functions you use (5-15KB typical vs 17KB Luxon)
2. **Functional Style**: Aligns with React functional components and hooks
3. **Native Date**: No custom classes to learn, works with existing JavaScript `Date`
4. **Ecosystem**: Largest ecosystem and community support
5. **TypeScript**: Excellent type definitions
6. **Meteorological Use Cases**: Simple date arithmetic (init time + lead time = valid time)

### Project-Specific Requirements

For meteo-downscale, date operations include:

1. **Cycle Time Formatting**: `format(initTime, 'yyyy-MM-dd HH:mm')`
2. **Valid Time Calculation**: `addHours(initTime, leadTime)`
3. **Lead Time Calculation**: `differenceInHours(validTime, initTime)`
4. **Timeline Generation**: `Array.from().map(i => addHours(initTime, i))`
5. **Timezone Display**: `formatInTimeZone(time, 'Asia/Shanghai', 'yyyy-MM-dd HH:mm zzz')`

These are all well-supported by date-fns with minimal bundle overhead.

### When to Reconsider

- **Day.js**: If bundle size becomes critical bottleneck (save ~5-10KB)
- **Luxon**: If complex multi-timezone operations become dominant use case
- **Temporal API**: If browser support reaches 90%+ (future standard)

**Source**: [W3Tweaks: JavaScript Temporal API](https://www.w3tweaks.com/javascript/javascript-temporal-api/)

---

## Implementation Recommendations

### TanStack Table Setup

```bash
# Install TanStack Table
bun add @tanstack/react-table

# shadcn/ui Table component (if not already added)
npx shadcn@latest add table
```

### date-fns Setup

```bash
# Install date-fns
bun add date-fns

# Optional: Timezone support
bun add date-fns-tz
```

### Project Structure

```
src/
├── components/
│   ├── ui/
│   │   └── table.tsx                    # shadcn/ui Table primitives
│   ├── tables/
│   │   ├── CycleListTable.tsx           # TanStack Table for cycles
│   │   ├── BatchDetailTable.tsx         # TanStack Table for batches
│   │   └── VariableSelectionTable.tsx   # TanStack Table for variables
│   └── timeline/
│       └── TimelineScrubber.tsx         # date-fns for time calculations
├── lib/
│   └── dateUtils.ts                     # date-fns utility functions
└── types/
    └── table.ts                         # TanStack Table type definitions
```

### Utility Functions (date-fns)

```typescript
// lib/dateUtils.ts
import { format, parseISO, addHours, differenceInHours } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

export function formatCycleTime(isoString: string): string {
  return format(parseISO(isoString), 'yyyy-MM-dd HH:mm')
}

export function calculateValidTime(initTime: Date, leadHours: number): Date {
  return addHours(initTime, leadHours)
}

export function calculateLeadTime(initTime: Date, validTime: Date): number {
  return differenceInHours(validTime, initTime)
}

export function generateTimelineLabels(
  initTime: Date,
  maxLeadHours: number
): string[] {
  return Array.from({ length: maxLeadHours + 1 }, (_, i) =>
    format(addHours(initTime, i), 'HH:mm')
  )
}

export function formatInLocalTimezone(
  date: Date,
  timezone: string = 'Asia/Shanghai'
): string {
  return formatInTimeZone(date, timezone, 'yyyy-MM-dd HH:mm zzz')
}
```

---

## Testing Strategies

### TanStack Table Testing

```typescript
import { renderHook } from '@testing-library/react'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

test('table sorts data correctly', () => {
  const data = [
    { id: 1, name: 'Cycle A', initTime: '2026-10-05T00:00:00Z' },
    { id: 2, name: 'Cycle B', initTime: '2026-10-04T12:00:00Z' },
  ]
  
  const { result } = renderHook(() =>
    useReactTable({
      data,
      columns: [{ accessorKey: 'initTime' }],
      getCoreRowModel: getCoreRowModel(),
    })
  )
  
  expect(result.current.getRowModel().rows).toHaveLength(2)
})
```

### date-fns Testing

```typescript
import { formatCycleTime, calculateValidTime } from '@/lib/dateUtils'

test('formats cycle time correctly', () => {
  const result = formatCycleTime('2026-10-05T00:00:00Z')
  expect(result).toBe('2026-10-05 00:00')
})

test('calculates valid time correctly', () => {
  const initTime = new Date('2026-10-05T00:00:00Z')
  const validTime = calculateValidTime(initTime, 24)
  expect(validTime.toISOString()).toBe('2026-10-06T00:00:00.000Z')
})
```

---

## Primary Sources

### TanStack Table
- [TanStack Table Official Documentation](https://tanstack.com/table/v8)
- [TanStack Table v8 Installation](https://tanstack.com/table/v8/docs/installation)
- [TanStack Table GitHub](https://github.com/TanStack/table)
- [TanStack Table GitHub License](https://github.com/TanStack/table/blob/beta/LICENSE)
- [npm-compare @tanstack/react-table](https://npm-compare.com/@tanstack/react-table)
- [shadcn/ui Data Table Guide](https://ui.shadcn.com/docs/components/radix/data-table)

### date-fns
- [date-fns Official Documentation](https://date-fns.org/)
- [javascripts.com date-fns Stats](https://javascripts.com/packages/date-fns/)
- [npm-compare date-fns](https://npm-compare.com/date-fns)
- [npm date-fns-tz](https://www.npmjs.com/package/date-fns-tz)
- [shadcn/ui Discussion: date-fns vs dayjs](https://github.com/shadcn-ui/ui/discussions/4817)

### Day.js
- [Day.js Official Documentation](https://day.js.org/)
- [javascripts.com dayjs Stats](https://javascripts.com/packages/dayjs/)
- [npm dayjs](https://www.npmjs.org/package/dayjs)
- [npm-compare dayjs](https://npm-compare.com/dayjs)
- [Dev.to: Day.js Size Impact](https://dev.to/marcinwosinek/what-is-the-size-impact-of-importing-day-js-58fm)

### Luxon
- [Luxon Official Documentation](https://moment.github.io/luxon/)
- [npm luxon](https://www.npmjs.com/package/luxon)
- [npm-compare luxon](https://npm-compare.com/dayjs,luxon)
- [GitHub Luxon Zones Documentation](https://github.com/moment/luxon/blob/master/docs/zones.md)
- [GitHub Luxon Tree-Shaking Discussion](https://github.com/moment/luxon/issues/854)

### Comparisons
- [Reintech: date-fns vs dayjs vs Luxon 2026](https://reintech.io/blog/date-fns-vs-dayjs-vs-luxon-comparison-2026)
- [npm-compare: date-fns vs dayjs vs luxon](https://npm-compare.com/it-IT/date-fns,dayjs,luxon)
- [npm-compare: Date Libraries Comparison](https://npm-compare.com/date-fns,intl,luxon,react-intl)
- [W3Tweaks: JavaScript Temporal API](https://www.w3tweaks.com/javascript/javascript-temporal-api/)

### Project Documentation
- [Project SHADCN_COMPONENT_MAPPING.md](file:///Users/xiaoyu/Projects/meteo-downscale/docs/SHADCN_COMPONENT_MAPPING.md)
