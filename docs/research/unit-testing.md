# Unit Testing Research

## Recommended Choice: Vitest

**Rationale**: Vitest is the recommended choice for unit testing in this Next.js 16 + React 19 project due to superior performance (~4x faster than Jest), native ESM and TypeScript support, minimal configuration requirements, and official Next.js documentation support.

---

## Next 16 + React 19 Compatibility

### Vitest
- **Status**: ✅ Compatible with React 19 and Next.js 16
- **Server Components**: ⚠️ Does not support async Server Components (Next.js official limitation)
- **Client Components**: ✅ Full support for synchronous Server and Client Components
- **Recommendation**: Use E2E tests for async Server Components, Vitest for synchronous components
- **Source**: [Next.js Official Vitest Documentation](https://nextjs.org/docs/app/building-your-application/testing/vitest)

### Jest
- **Status**: ✅ Compatible with React 19 and Next.js 16
- **Server Components**: ⚠️ Does not support async Server Components (same limitation as Vitest)
- **Configuration**: Requires more setup for ESM and TypeScript
- **Source**: [Next.js Official Jest Documentation](https://nextjs.org/docs/app/building-your-application/testing/jest)

### Production Usage
- Real-world boilerplate demonstrates Vitest + Playwright + Next.js 16 + React 19 stack achieving 100% Lighthouse Performance
- **Source**: [Production-ready Next.js 16 & React 19 Boilerplate](https://github.com/Faizanahmedsy/best-nextjs-16-react-19-boilerplate)

---

## Maintenance Activity

### Vitest
- **Weekly Downloads**: 73.8M+ (as of 2026)
- **Monthly Downloads**: 370.8M+
- **Growth**: +425% year-over-year
- **GitHub Stars**: 16,992
- **Last Updated**: Active (monthly releases)
- **Adoption**: 45.1% among QA professionals with 94% retention rate
- **Source**: [npm-compare Vitest Stats](https://npm-compare.com/vitest), [javascripts.com Vitest](https://javascripts.com/packages/vitest/)

### Jest
- **Status**: Mature and widely adopted
- **Ecosystem**: Larger ecosystem of plugins and integrations
- **Industry Position**: Long-standing default since 2014
- **Trend**: Stable adoption, slower growth compared to Vitest
- **Source**: [Tech Insider Vitest vs Jest 2026](https://tech-insider.org/vitest-vs-jest-2026/)

---

## Performance Comparison

### Speed
- **Vitest**: ~4x faster than Jest (measured 2026)
- **Reason**: Native ESM support, Vite's fast HMR, parallel execution by default
- **Source**: [Vitest vs Jest for Next.js Comparison](https://www.wisp.blog/blog/vitest-vs-jest-nextjs-comparison)

### Developer Experience
- **Vitest**: Out-of-the-box TypeScript and ESM support, minimal configuration
- **Jest**: Requires additional configuration for modern JS features
- **API Compatibility**: Vitest is Jest-compatible (same `describe`, `it`, `expect` API)
- **Source**: [Dev.to Vitest vs Jest 2026](https://dev.to/whoffagents/vitest-vs-jest-for-nextjs-in-2026-setup-speed-and-when-to-switch-224a)

---

## Bundle Size Impact

### Vitest
- **Unpacked Size**: 1.91 MB
- **Runtime**: Development-only dependency (no production bundle impact)
- **Source**: [npm-compare Vitest](https://npm-compare.com/vitest)

### Jest
- **Size**: Comparable to Vitest (development-only)
- **Dependencies**: More dependencies for full ESM support

---

## License Information

### Vitest
- **License**: MIT
- **Source**: [npm vitest package](https://www.npmjs.com/package/vitest)

### Jest
- **License**: MIT
- **Maintainer**: Meta (Facebook)

---

## Testing Strategy for Next.js 16 + React 19

### Three-Tier Approach
1. **Unit Tests** (Vitest): Extracted business logic, synchronous components
2. **Integration Tests** (Vitest): Server Components with mocked boundaries (database, fetch, filesystem)
3. **E2E Tests** (Playwright): Async Server Components, hydration, browser-dependent behavior

**Source**: [SitePoint Vitest RSC Testing Patterns](https://www.sitepoint.com/testing-react-server-components-vitest-async-boundaries-mock/)

### React Testing Library Integration
- Both Vitest and Jest work seamlessly with React Testing Library
- Standard 2026 setup: Vitest/Jest as test runner + React Testing Library for component rendering
- **Source**: [LambdaTest React Testing Tutorial](https://www.lambdatest.com/blog/react-testing-tutorial/)

---

## Alternatives Considered

### Why Not Jest?
- Slower execution (4x slower than Vitest)
- More configuration required for modern features
- Still viable for teams with existing Jest infrastructure
- **When to use**: Large teams with existing Jest setups, need for time-travel debugging

### Other Alternatives
- **Testing Library standalone**: Not a test runner, needs Vitest or Jest
- **uvu**: Minimal but lacks ecosystem
- **Node's native test runner**: Too new, limited ecosystem

---

## Implementation Recommendations

1. **Install Vitest**: `bun add -D vitest @vitejs/plugin-react`
2. **Add React Testing Library**: `bun add -D @testing-library/react @testing-library/jest-dom`
3. **Configure**: Follow Next.js official Vitest setup guide
4. **Test Structure**:
   - Unit tests for utilities and hooks
   - Component tests for Client Components
   - E2E tests (Playwright) for Server Components and full flows

---

## Primary Sources

- [Next.js Official Vitest Guide](https://nextjs.org/docs/app/building-your-application/testing/vitest)
- [Next.js Official Jest Guide](https://nextjs.org/docs/app/building-your-application/testing/jest)
- [Vitest npm Package](https://www.npmjs.com/package/vitest)
- [Vitest vs Jest Performance Analysis 2026](https://tech-insider.org/vitest-vs-jest-2026/)
- [Next.js Testing Strategies Comparison](https://blog.logrocket.com/comparing-next-js-testing-tools-strategies/)
- [React Testing Library Documentation](https://www.lambdatest.com/blog/react-testing-tutorial/)
- [Vitest RSC Testing Patterns](https://www.sitepoint.com/testing-react-server-components-vitest-async-boundaries-mock/)
