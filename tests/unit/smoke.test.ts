import { describe, it, expect } from 'vitest'

describe('Smoke test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })

  it('should have date-fns available', async () => {
    const { addHours } = await import('date-fns')
    const date = new Date('2025-01-15T00:00:00Z')
    const result = addHours(date, 72)
    expect(result.toISOString()).toBe('2025-01-18T00:00:00.000Z')
  })
})
