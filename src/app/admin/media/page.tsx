import { getSiteConfig } from '@/lib/fetchers/config'
import { saveVideoUrl } from './actions'

export default async function MediaPage() {
  const config = await getSiteConfig()
  const currentVideoUrl = config['chef_video_url'] ?? ''

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-[22px] font-medium text-[var(--color-ink)] mb-6">미디어 관리</h1>

      <div className="bg-white rounded-xl border border-[var(--color-hairline)] p-6">
        <h2 className="text-[16px] font-medium text-[var(--color-ink)] mb-2">셰프 추천 영상 URL</h2>
        <p className="text-[13px] text-[var(--color-body)] mb-4">
          YouTube Shorts URL을 입력하세요. 변경 즉시 메인 페이지에 반영됩니다.
        </p>

        {currentVideoUrl && (
          <div className="mb-4 p-3 bg-[var(--color-canvas-soft)] rounded-lg">
            <p className="text-[11px] font-mono text-[var(--color-body)] mb-1">현재 URL</p>
            <p className="text-[13px] text-[var(--color-ink)] break-all">{currentVideoUrl}</p>
          </div>
        )}

        <form action={async (fd) => { await saveVideoUrl(fd) }} className="flex gap-3">
          <input
            name="chef_video_url"
            type="url"
            defaultValue={currentVideoUrl}
            placeholder="https://www.youtube.com/shorts/..."
            required
            className="flex-1 border border-[var(--color-hairline)] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-[var(--color-forest-mid)]"
          />
          <button
            type="submit"
            className="bg-[var(--color-forest)] text-white px-6 py-3 rounded-lg text-[14px] font-medium shrink-0 hover:opacity-90 transition-opacity"
          >
            저장
          </button>
        </form>
      </div>
    </div>
  )
}
