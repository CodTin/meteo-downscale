# Vitest for Unit Testing

We chose **Vitest** over Jest as the unit test runner for ~4x faster execution, native ESM and TypeScript support, and Jest-compatible API that minimizes migration friction. React 19 compatibility is verified. The trade-off is that Vitest cannot test async Server Components (which will be covered by Playwright E2E tests instead). The speed gains and modern tooling justify this limitation for a Next.js 16 + React 19 project targeting sub-second test feedback.
