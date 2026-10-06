# E2E Testing & API Mocking Research

## Recommended Choices

1. **E2E Testing**: Playwright
2. **API Mocking**: MSW (Mock Service Worker)

**Rationale**: Playwright offers superior multi-browser support, built-in parallelization, and active growth momentum. MSW provides network-level mocking that works across testing environments and development, with framework-agnostic implementation.

---

## E2E Testing: Playwright vs Cypress

### Recommended: Playwright

#### Next 16 + React 19 Compatibility
- **Status**: ✅ Fully compatible with Next.js 16 and React 19
- **Production Usage**: Verified in production boilerplate with Next.js 16 + React 19
- **Source**: [Next.js 16 React 19 Boilerplate](https://github.com/Faizanahmedsy/best-nextjs-16-react-19-boilerplate)

#### Maintenance Activity
- **Adoption Rate**: 45.1% among QA professionals with 94% retention rate
- **Market Trend**: Meteoric growth since 2020 Microsoft launch
- **Downloads**: 5x download gap over Cypress as of 2026
- **Maintainer**: Microsoft (active development)
- **Source**: [Medium E2E Testing Comparison](https://navanathjadhav.medium.com/end-to-end-testing-playwright-vs-cypress-in-real-projects-07b3790e5ab3)

#### Key Advantages
1. **Multi-Browser Support**: Chromium, Firefox, and WebKit (Safari) out of the box
2. **Parallelization**: Free built-in parallel execution (no cloud service required)
3. **Multi-Language**: JavaScript, TypeScript, Python, Java, C#
4. **Multi-Tab/Context**: Native support for multiple pages and contexts in one test
5. **Architecture**: Drives browser from separate Node process over CDP (Chrome DevTools Protocol)
6. **Source**: [LambdaTest Cypress vs Playwright](https://www.lambdatest.com/blog/cypress-vs-playwright/)

#### Bundle Size Impact
- **Runtime**: Test-only dependency (no production bundle impact)
- **CI Cost**: Lower CI costs due to free parallelization

#### License
- **License**: Apache 2.0
- **Maintainer**: Microsoft

---

### Alternative: Cypress

#### Next 16 + React 19 Compatibility
- **Status**: ✅ Compatible with Next.js 16 and React 19
- **Component Testing**: Strong support for component-level testing

#### Maintenance Activity
- **Adoption Rate**: ~14% market share (stabilized as of 2026)
- **Status**: Mature ecosystem, previously most downloaded until early 2024
- **Trend**: Adoption has stabilized while Playwright grows
- **Source**: [Tech Insider Cypress vs Playwright 2026](https://tech-insider.org/cypress-vs-playwright-2026/)

#### Key Characteristics
1. **Architecture**: Runs test code inside browser, same event loop as application
2. **Browser Support**: Primarily Chromium-focused (WebKit support limited)
3. **Visual Debugging**: Excellent interactive runner with time-travel debugging
4. **Component Testing**: Mature component-testing workflow
5. **Parallelization**: Requires Cypress Cloud (paid) or self-hosted orchestration
6. **Source**: [Deviqa Playwright vs Cypress](https://www.deviqa.com/blog/playwright-vs-cypress/)

#### When to Choose Cypress
- Single-domain SPAs where visual debugging is critical
- Teams that value tight in-browser feedback
- Component tests and E2E tests in the same tool
- Willing to pay for Cypress Cloud or self-host orchestration
- **Source**: [Qable.io Playwright vs Cypress](https://www.qable.io/knowledge-hub/comparisons/playwright-vs-cypress)

#### License
- **License**: MIT

---

## Decision Matrix: Playwright vs Cypress

| Factor | Playwright | Cypress |
|--------|-----------|---------|
| Multi-browser (WebKit/Safari) | ✅ Built-in | ❌ Limited |
| Free parallelization | ✅ Built-in | ❌ Requires paid service |
| Multi-tab/context support | ✅ Native | ❌ Limited |
| Visual debugging | ⚠️ Good | ✅ Excellent |
| Component testing | ⚠️ Available | ✅ Mature |
| CI cost | Lower | Higher (needs Cypress Cloud) |
| Language support | Multi-language | JavaScript/TypeScript |
| 2026 trend | ↗️ Growing | → Stable |

**Source**: [Bug0 Playwright vs Cypress 2026](https://bug0.com/knowledge-base/playwright-vs-cypress)

---

## API Mocking: MSW (Mock Service Worker)

### Recommended: MSW

#### React 19 Compatibility
- **Status**: ✅ Compatible with React 19
- **Next.js Support**: Works seamlessly with Next.js 16 App Router and Server Components
- **TypeScript**: Requires TypeScript 4.7+ (fully compatible with modern TypeScript)
- **Source**: [MSW Migration Guide](https://mswjs.io/docs/migrations/1.x-to-2.x/)

#### Maintenance Activity
- **Current Version**: 3.0 (major release with improvements)
- **Status**: Actively maintained, industry standard for API mocking
- **Ecosystem**: Growing integration ecosystem (Playwright, Vitest, Jest, Storybook)
- **Source**: [MSW Official Site](https://mswjs.io/)

#### Key Advantages
1. **Network-Level Mocking**: Intercepts requests at the Service Worker level (browser) or http/https modules (Node.js)
2. **Client-Agnostic**: Works with any HTTP client (fetch, Axios, React Query, etc.)
3. **Reusable**: Same mocks work across development, testing, and Storybook
4. **Framework-Agnostic**: Works with any framework
5. **Real Requests**: Application makes real network requests, MSW intercepts and responds
6. **Source**: [MSW Documentation](https://mswjs.io/)

#### Bundle Size Impact
- **Version 2.x**: 5.8 MB unpacked (includes browser and Node handlers)
- **Version 3.0**: Improved tree-shaking to reduce bundle bloat
- **Production**: Development/test dependency only (Service Worker not deployed to production)
- **Source**: [MSW Blog - Introducing MSW 3.0](https://mswjs.io/blog/introducing-msw-3.0), [javascripts.com MSW size](https://javascripts.com/compare/msw-vs-json-server/)

#### Architecture
```
Application → HTTP Request → Service Worker (MSW) → Mock Response
                                ↓ (or)
                           Real API Server
```

- **Browser**: Uses Service Worker API to intercept requests
- **Node.js**: Uses http/https module interception
- **Source**: [MSW GitHub](https://github.com/mswjs/msw)

#### License
- **License**: MIT
- **Source**: [MSW npm Package](https://www.npmjs.com/package/msw)

---

## MSW Integration Patterns

### Development Environment
```javascript
// Start MSW for development API mocking
if (process.env.NODE_ENV === 'development') {
  worker.start()
}
```

### Testing Environment
```javascript
// Vitest/Jest setup
import { server } from './mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### With Playwright
- **Integration**: `playwright-msw` package available
- **Use case**: Mock APIs during E2E tests
- **Source**: [playwright-msw npm](https://www.npmjs.com/package/playwright-msw)

---

## Alternative API Mocking Solutions

### Fetch/Axios Mocks
- **Approach**: Mock HTTP client directly
- **Limitation**: Tightly coupled to specific client implementation
- **Not Recommended**: Breaks when switching HTTP clients

### JSON Server
- **Approach**: Real HTTP server with JSON file as database
- **Bundle Size**: 38 kB (155x smaller than MSW)
- **Limitation**: Requires running separate server process
- **Use case**: Quick prototyping, not recommended for comprehensive testing
- **Source**: [javascripts.com msw vs json-server](https://javascripts.com/compare/msw-vs-json-server/)

### Manual Fetch Stubbing
- **Approach**: Global fetch override
- **Limitation**: Difficult to maintain, error-prone, non-reusable

---

## Implementation Recommendations

### E2E Testing Setup
1. **Install Playwright**: `bun add -D @playwright/test`
2. **Initialize**: `bunx playwright install`
3. **Configure**: Create `playwright.config.ts` for Next.js
4. **Async Server Components**: Use Playwright for testing (Vitest limitation)

### API Mocking Setup
1. **Install MSW**: `bun add -D msw`
2. **Initialize**: `bunx msw init public/` (for browser mocking)
3. **Create handlers**: Define REST/GraphQL mock handlers
4. **Integration**: Use in development, tests, and Storybook

---

## Testing Strategy for meteo-downscale

Given the project requirements (6 analysis sub-pages with shared state for 周期/时刻/变量/位置/逐时效批次):

1. **Unit Tests** (Vitest): Pure functions, hooks, utilities
2. **Component Tests** (Vitest + MSW): Client components with mocked API calls
3. **E2E Tests** (Playwright + MSW): Full user flows including:
   - Navigation across 6 analysis sub-pages
   - Shared state persistence (周期/时刻/变量/位置/逐时效批次)
   - Data table interactions
   - API error scenarios

---

## Primary Sources

### Playwright
- [Playwright Official Documentation](https://playwright.dev/)
- [Next.js 16 React 19 Boilerplate (Playwright)](https://github.com/Faizanahmedsy/best-nextjs-16-react-19-boilerplate)
- [Playwright vs Cypress 2026 Analysis](https://tech-insider.org/cypress-vs-playwright-2026/)
- [LambdaTest Cypress vs Playwright](https://www.lambdatest.com/blog/cypress-vs-playwright/)
- [Medium E2E Testing Comparison](https://navanathjadhav.medium.com/end-to-end-testing-playwright-vs-cypress-in-real-projects-07b3790e5ab3)
- [Deviqa Framework Comparison](https://www.deviqa.com/blog/playwright-vs-cypress/)

### MSW (Mock Service Worker)
- [MSW Official Documentation](https://mswjs.io/)
- [MSW npm Package](https://www.npmjs.com/package/msw)
- [MSW 3.0 Release Blog](https://mswjs.io/blog/introducing-msw-3.0)
- [MSW Migration Guide](https://mswjs.io/docs/migrations/1.x-to-2.x/)
- [MSW GitHub Repository](https://github.com/mswjs/msw)
- [playwright-msw Integration](https://www.npmjs.com/package/playwright-msw)
