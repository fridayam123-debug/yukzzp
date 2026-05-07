import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/service', () => ({
  createPublicClient: vi.fn(),
}))

vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}))

import { createPublicClient } from '@/lib/supabase/service'
import { getSiteConfig, getSiteConfigValue } from '@/lib/fetchers/config'

const mockSelect = vi.fn()
const mockClient = {
  from: vi.fn(() => ({ select: mockSelect })),
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(createPublicClient).mockReturnValue(mockClient as never)
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
})

describe('getSiteConfig', () => {
  it('returns record map from DB', async () => {
    mockSelect.mockResolvedValue({
      data: [
        { key: 'chef_video_url', value: 'https://www.youtube.com/shorts/abc' },
        { key: 'hero_h1', value: '테스트 제목' },
      ],
      error: null,
    })

    const result = await getSiteConfig()

    expect(result).toEqual({
      chef_video_url: 'https://www.youtube.com/shorts/abc',
      hero_h1: '테스트 제목',
    })
  })

  it('throws when DB returns error', async () => {
    mockSelect.mockResolvedValue({ data: null, error: { message: 'DB error', code: '500' } })
    await expect(getSiteConfig()).rejects.toMatchObject({ message: 'DB error' })
  })

  it('returns empty object when env var missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    const result = await getSiteConfig()
    expect(result).toEqual({})
  })
})

describe('getSiteConfigValue', () => {
  it('returns value for existing key', async () => {
    mockSelect.mockResolvedValue({
      data: [
        { key: 'chef_video_url', value: 'https://www.youtube.com/shorts/abc' },
      ],
      error: null,
    })

    const result = await getSiteConfigValue('chef_video_url')
    expect(result).toBe('https://www.youtube.com/shorts/abc')
  })

  it('returns null for missing key', async () => {
    mockSelect.mockResolvedValue({ data: [], error: null })
    const result = await getSiteConfigValue('nonexistent')
    expect(result).toBeNull()
  })
})
