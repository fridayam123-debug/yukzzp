import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/service', () => ({
  createPublicClient: vi.fn(),
}))

vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}))

import { createPublicClient } from '@/lib/supabase/service'
import { getSiteConfig, getSiteConfigValue } from '@/lib/fetchers/config'

const mockClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(createPublicClient).mockReturnValue(mockClient as never)
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
})

describe('getSiteConfig', () => {
  it('returns record map from DB', async () => {
    mockClient.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [
          { key: 'chef_video_url', value: 'https://www.youtube.com/shorts/abc', updated_at: null },
          { key: 'hero_h1', value: '테스트 제목', updated_at: null },
        ],
        error: null,
      }),
    })

    const result = await getSiteConfig()

    expect(result).toEqual({
      chef_video_url: 'https://www.youtube.com/shorts/abc',
      hero_h1: '테스트 제목',
    })
  })

  it('returns empty object when env var missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    const result = await getSiteConfig()
    expect(result).toEqual({})
  })
})

describe('getSiteConfigValue', () => {
  it('returns value for existing key', async () => {
    mockClient.single.mockResolvedValue({
      data: { key: 'chef_video_url', value: 'https://www.youtube.com/shorts/abc', updated_at: null },
      error: null,
    })

    const result = await getSiteConfigValue('chef_video_url')
    expect(result).toBe('https://www.youtube.com/shorts/abc')
  })

  it('returns null for missing key', async () => {
    mockClient.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
    const result = await getSiteConfigValue('nonexistent')
    expect(result).toBeNull()
  })
})
