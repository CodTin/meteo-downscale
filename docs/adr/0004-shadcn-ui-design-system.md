# shadcn/ui + Radix UI Design System

We chose **shadcn/ui + Radix UI primitives** with **Heroicons** for the component system. The copy-paste architecture (no npm dependency lock-in) provides flexibility to customize meteorological components while Radix primitives deliver WCAG 2.2 AA accessibility out of the box. Tailwind 4 native integration with design token customization ensures visual consistency. We explicitly chose Heroicons over Lucide to maintain icon consistency across the 38 shadcn components and 11 custom meteorological components we'll build.

## Considered Options

- **Ant Design / Material UI**: Rejected due to heavy bundle size, opinionated styling difficult to override, and weaker Tailwind integration
- **Headless UI**: Rejected because shadcn/ui already wraps Radix (better accessibility) and provides more complete component coverage
