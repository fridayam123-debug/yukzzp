import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              slug: 'yangjae',
              name_ko: '육즙관리소 양재역점',
              category_ko: '돼지고기구이',
            },
            error: null,
          }),
        }),
        order: async () => ({
          data: [
            { slug: 'euljiro', name_ko: '육즙관리소 더룸 을지로동대문점' },
            { slug: 'yangjae', name_ko: '육즙관리소 양재역점' },
          ],
          error: null,
        }),
      }),
    }),
  }),
}))

vi.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
}))

const { getLocations, getLocationBySlug } = await import('@/lib/fetchers/locations')

describe('locations fetchers', () => {
  it('getLocationBySlug returns the location for a slug', async () => {
    const loc = await getLocationBySlug('yangjae')
    expect(loc?.name_ko).toBe('육즙관리소 양재역점')
    expect(loc?.category_ko).toBe('돼지고기구이')
  })

  it('getLocations returns all locations', async () => {
    const list = await getLocations()
    expect(list).toHaveLength(2)
    expect(list.map((l: any) => l.slug)).toContain('yangjae')
    expect(list.map((l: any) => l.slug)).toContain('euljiro')
  })
})
