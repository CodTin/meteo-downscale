# Outcome

A persistent Context Header component that displays current analysis parameters (cycle/valid time/variable/region/batch) across all 6 analysis sub-pages, with Edit and Refresh actions. This keeps users aware of what data they're viewing, prevents accidental analysis of wrong cycles, and provides quick access to change parameters or validate batch availability.

# Scope

- Single-line header component showing: Cycle, Valid time (+offset), Variable, Region, Batch version
- Edit button that opens modal to change context parameters
- Refresh button that re-validates batch availability and warns if batch withdrawn
- Integration with useAnalysisContext() hook for state
- Integration with Zustand store for state updates
- Modal component for editing context parameters
- shadcn/ui Badge and Separator components for styling

# Non-goals

- Implementing the actual analysis pages themselves (only the header)
- Batch validation logic (assume it exists)
- Alternative batch suggestion logic (only display warnings)
- State management implementation (already exists via Zustand store)

# Acceptance examples

1. Header displays: "Cycle: 2024-03-15 00Z | Valid: 2024-03-17 12Z (+60h) | Var: 10m_wind | Region: East China | Batch: v2.3.1"
2. Clicking Edit button (Heroicons PencilIcon, 16px) opens modal
3. Clicking Refresh button (Heroicons ArrowPathIcon, 16px) re-validates batch
4. If batch withdrawn after refresh, show warning with alternatives
5. Header persists across navigation between analysis sub-pages
6. Modal save updates Zustand store successfully

## Acceptance

- [ ] Header renders single-line summary with all 5 parameters (cycle, valid time, variable, region, batch)
- [ ] Edit button with PencilIcon (16px) opens modal successfully
- [ ] Refresh button with ArrowPathIcon (16px) triggers batch validation
- [ ] Warning badge displays when batch is withdrawn after refresh
- [ ] Component uses shadcn/ui Badge and Separator components
- [ ] Component reads state from useAnalysisContext() hook correctly
- [ ] Modal form updates Zustand store on save
- [ ] Typography follows DESIGN.md: 14px labels, neutral-500 for metadata
- [ ] Header persists across all 6 analysis sub-pages during navigation

# Constraints and invariants

- Typography must follow DESIGN.md: 14px labels, neutral-500 for metadata
- Must use Heroicons: PencilIcon and ArrowPathIcon at 16px
- Must use shadcn/ui Badge for status indicators
- Must use shadcn/ui Separator for dividers
- Must read state from useAnalysisContext() hook
- Modal must update Zustand store on save
- Component must persist across all 6 analysis sub-pages

# Decisions

- Use single-line layout to save vertical space
- Use modal pattern for editing (not inline editing)
- Show relative time offset (+60h) alongside absolute time
- Use pipe separators between context items

# Open questions

None - requirements are clear and dependencies are resolved.

# Verification expectations

- Visual inspection: header renders correctly with proper styling and layout
- Interaction testing: Edit and Refresh buttons work as expected
- State integration: component reads from useAnalysisContext() correctly
- Store updates: modal saves update Zustand store
- Navigation persistence: header maintains state across sub-page navigation
- Typography compliance: verify 14px labels and neutral-500 colors per DESIGN.md
