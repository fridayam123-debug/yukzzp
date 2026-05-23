'use client'

import { useState, useTransition } from 'react'
import { addReel, deleteReel, toggleVisible } from './actions'

interface Reel {
  id: string
  reel_id: string
  caption: string | null
  sort_order: number
  visible: boolean
}

export function InstagramClient({ initialReels }: { initialReels: Reel[] }) {
  const [reels, setReels] = useState(initialReels)
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [isPending, startTransition] = useTransition()

  function extractReelId(input: string) {
    const m = input.match(/reel\/([A-Za-z0-9_-]+)/)
    return m ? m[1] : input.trim()
  }

  function handleAdd() {
    const reelId = extractReelId(url)
    if (!reelId) return
    startTransition(async () => {
      await addReel(reelId, caption)
      setUrl('')
      setCaption('')
      window.location.reload()
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteReel(id)
      setReels(prev => prev.filter(r => r.id !== id))
    })
  }

  function handleToggle(id: string, visible: boolean) {
    startTransition(async () => {
      await toggleVisible(id, !visible)
      setReels(prev => prev.map(r => r.id === id ? { ...r, visible: !visible } : r))
    })
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-[22px] font-semibold text-[var(--color-ink)] mb-8">인스타그램 릴스 관리</h1>

      {/* 추가 폼 */}
      <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-6 mb-8">
        <h2 className="text-[14px] font-semibold text-[var(--color-ink)] mb-4">릴스 추가</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Instagram 릴스 URL 또는 ID (예: DXEvvciko5j)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="border border-[var(--color-hairline)] rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[var(--color-ink)]"
          />
          <input
            type="text"
            placeholder="캡션 (선택)"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            className="border border-[var(--color-hairline)] rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[var(--color-ink)]"
          />
          <button
            onClick={handleAdd}
            disabled={!url || isPending}
            className="self-start bg-[var(--color-ink)] text-white px-6 py-2.5 rounded-lg text-[13px] font-medium disabled:opacity-40"
          >
            추가
          </button>
        </div>
      </div>

      {/* 목록 */}
      <div className="flex flex-col gap-3">
        {reels.map((reel, i) => (
          <div key={reel.id} className="bg-white border border-[var(--color-hairline)] rounded-xl p-4 flex items-start gap-4">
            {/* 미리보기 */}
            <div className="w-[72px] aspect-[9/16] rounded-lg overflow-hidden bg-[var(--color-canvas-soft)] shrink-0 relative">
              <div className="absolute inset-0" style={{ marginTop: '-72px', height: 'calc(100% + 72px)' }}>
                <iframe
                  src={`https://www.instagram.com/reel/${reel.reel_id}/embed/`}
                  className="w-full h-full border-0"
                  scrolling="no"
                  title={`reel-${reel.reel_id}`}
                />
              </div>
            </div>
            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-mono text-[var(--color-body)] mb-1">#{i + 1} · sort_order {reel.sort_order}</div>
              <div className="text-[13px] font-medium text-[var(--color-ink)] truncate">{reel.reel_id}</div>
              {reel.caption && <div className="text-[12px] text-[var(--color-body)] mt-1 line-clamp-2">{reel.caption}</div>}
            </div>
            {/* 액션 */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => handleToggle(reel.id, reel.visible)}
                disabled={isPending}
                className={`text-[12px] px-3 py-1 rounded-full border ${reel.visible ? 'border-green-500 text-green-600' : 'border-[var(--color-hairline)] text-[var(--color-body)]'}`}
              >
                {reel.visible ? '노출 중' : '숨김'}
              </button>
              <button
                onClick={() => handleDelete(reel.id)}
                disabled={isPending}
                className="text-[12px] px-3 py-1 rounded-full border border-red-200 text-red-500"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
        {reels.length === 0 && (
          <p className="text-[14px] text-[var(--color-body)]">등록된 릴스가 없습니다.</p>
        )}
      </div>
      <p className="text-[12px] text-[var(--color-body)] mt-6">최대 4개까지 메인 화면에 노출됩니다. sort_order 순으로 표시됩니다.</p>
    </div>
  )
}
