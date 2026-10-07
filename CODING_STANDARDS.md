# Coding Standards

## UI Components

**Always use shadcn/ui CLI for adding components:**

```bash
bunx shadcn@latest add <component-name>
```

Never hand-write UI components from scratch. If a component needs customization:
1. Add via CLI first
2. Customize the generated file

**Check before implementing:** Run `ls components/ui/` to see what's already available.

Currently installed shadcn/ui components:
- `badge`
- `button`
- `dialog`
- `separator`
- `tabs`
- `toast`

## Testing Components with React Query

Use `renderWithQueryClient()` from `tests/utils/test-utils.tsx` for any component that uses TanStack Query hooks:

```typescript
import { renderWithQueryClient } from "@/tests/utils/test-utils";

it("renders with query", () => {
  renderWithQueryClient(<MyComponent />);
  // assertions...
});
```

## Mocking Custom Hooks

For hooks that use TanStack Query internally, mock at the hook level, not the query level:

```typescript
vi.mock("@/hooks/useBatchMonitoring", () => ({
  useBatchMonitoring: vi.fn(() => ({
    isWithdrawn: false,
    withdrawal: null,
    newBatchAvailable: null,
    dismissNewBatchNotification: vi.fn(),
    isValidating: false,
  })),
}));
```

Place hook mocks before component imports to avoid hoisting issues.

## Discovering Library APIs

When using a new library for the first time:

1. **Check official docs first** (prefer over type definitions)
2. **Look for existing usage** in the codebase: `grep -r "import.*from '@package'" .`
3. **Check type definitions** as last resort: 
   ```bash
   find node_modules/@package -name "*.d.ts" | xargs grep -l "interface"
   ```

**For shadcn/ui components:** Always reference [shadcn/ui documentation](https://ui.shadcn.com/) for usage patterns.
