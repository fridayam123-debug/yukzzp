import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { saveVideoUrl } from '@/app/admin/media/actions'

const mockUpsert = vi.fn().mockResolvedValue({ error: null })
const mockClient = {
  from: vi.fn().mockReturnValue({ upsert: mockUpsert }),
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(createClient).mockResolvedValue(mockClient as never)
})

describe('saveVideoUrl', () => {
  it('upserts chef_video_url and revalidates site_config tag', async () => {
    const formData = new FormData()
    formData.set('chef_video_url', 'https://www.youtube.com/shorts/newId')

    await saveVideoUrl(formData)

    expect(mockUpsert).toHaveBeenCalledWith(
      [expect.objectContaining({ key: 'chef_video_url', value: 'https://www.youtube.com/shorts/newId' })],
      { onConflict: 'key' },
    )
    expect(revalidateTag).toHaveBeenCalledWith('site_config')
  })

  it('returns error object when DB fails', async () => {
    mockUpsert.mockResolvedValueOnce({ error: { message: 'DB error' } })
    const formData = new FormData()
    formData.set('chef_video_url', 'https://example.com')

    const result = await saveVideoUrl(formData)
    expect(result).toEqual({ error: 'DB error' })
    expect(revalidateTag).not.toHaveBeenCalled()
  })
})
