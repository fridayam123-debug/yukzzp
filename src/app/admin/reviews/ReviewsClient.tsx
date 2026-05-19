'use client'

import { useState, useTransition } from 'react'
import { importReviews, deleteReview, toggleReviewVisible, updateReview, type ReviewRow, type ReviewRecord } from './actions'

type LocationSlug = 'yangjae' | 'euljiro'

const LOCATION_LABELS: Record<LocationSlug, string> = {
  yangjae: '양재역본점',
  euljiro: '더룸 을지로동대문점',
}

function parseCsv(raw: string, locationSlug: LocationSlug): ReviewRow[] {
  const lines = raw.trim().split('\n').filter(l => l.trim())
  if (lines.length === 0) return []
  const firstLine = lines[0].toLowerCase()
  const hasHeader = firstLine.includes('author') || firstLine.includes('text') || firstLine.includes('작성자')
  const dataLines = hasHeader ? lines.slice(1) : lines
  return dataLines.map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
    const [author = '', text = '', ratingStr = '', recStr = '', visitedAt = '', sourceId = ''] = cols
    return {
      location_slug: locationSlug,
      author: author || '익명',
      text,
      rating: ratingStr ? parseInt(ratingStr, 10) : null,
      rec_count: recStr ? parseInt(recStr, 10) : 0,
      visited_at: visitedAt || null,
      source: 'naver',
      source_id: sourceId || null,
    }
  }).filter(r => r.text.length > 0)
}

/* ─── 리뷰 목록 탭 ─── */
function ReviewListTab({ initialReviews }: { initialReviews: ReviewRecord[] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [filterSlug, setFilterSlug] = useState<'all' | LocationSlug>('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editAuthor, setEditAuthor] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = reviews.filter(r => {
    if (filterSlug !== 'all' && r.location_slug !== filterSlug) return false
    if (search && !r.text.includes(search) && !r.author.includes(search)) return false
    return true
  })

  function startEdit(r: ReviewRecord) {
    setEditingId(r.id)
    setEditText(r.text)
    setEditAuthor(r.author)
  }

  function handleSave(id: string) {
    startTransition(async () => {
      await updateReview(id, { text: editText, author: editAuthor })
      setReviews(prev => prev.map(r => r.id === id ? { ...r, text: editText, author: editAuthor } : r))
      setEditingId(null)
    })
  }

  function handleToggle(id: string, visible: boolean) {
    startTransition(async () => {
      await toggleReviewVisible(id, !visible)
      setReviews(prev => prev.map(r => r.id === id ? { ...r, visible: !visible } : r))
    })
  }

  function handleDelete(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    startTransition(async () => {
      await deleteReview(id)
      setReviews(prev => prev.filter(r => r.id !== id))
    })
  }

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {(['all', 'yangjae', 'euljiro'] as const).map(slug => (
            <button
              key={slug}
              onClick={() => setFilterSlug(slug)}
              className={`px-3 py-1.5 rounded text-[12px] border transition-colors ${filterSlug === slug ? 'bg-[var(--color-espresso)] text-white border-[var(--color-espresso)]' : 'border-[var(--color-hairline)] text-[var(--color-body)] hover:border-[var(--color-espresso)]'}`}
            >
              {slug === 'all' ? `전체 (${reviews.length})` : `${LOCATION_LABELS[slug]} (${reviews.filter(r => r.location_slug === slug).length})`}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="작성자 또는 내용 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[var(--color-hairline)] rounded px-3 py-1.5 text-[12px] outline-none focus:border-[var(--color-espresso)] w-56"
        />
        <span className="text-[12px] text-[var(--color-body)] ml-auto">{filtered.length}개</span>
      </div>

      {/* 목록 */}
      <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
        {filtered.map(r => (
          <div
            key={r.id}
            className={`bg-white border rounded-xl p-4 transition-opacity ${r.visible ? 'border-[var(--color-hairline)]' : 'border-[var(--color-hairline)] opacity-50'}`}
          >
            {editingId === r.id ? (
              <div className="space-y-2">
                <input
                  value={editAuthor}
                  onChange={e => setEditAuthor(e.target.value)}
                  className="w-full border border-[var(--color-hairline)] rounded px-3 py-1.5 text-[13px] outline-none focus:border-[var(--color-espresso)]"
                  placeholder="작성자"
                />
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  rows={4}
                  className="w-full border border-[var(--color-hairline)] rounded px-3 py-2 text-[13px] outline-none focus:border-[var(--color-espresso)] resize-y"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(r.id)}
                    disabled={isPending}
                    className="px-4 py-1.5 text-[12px] bg-[var(--color-espresso)] text-white rounded disabled:opacity-40"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-1.5 text-[12px] border border-[var(--color-hairline)] rounded text-[var(--color-body)]"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${r.location_slug === 'yangjae' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {r.location_slug === 'yangjae' ? '양재' : '을지로'}
                    </span>
                    <span className="text-[13px] font-medium text-[var(--color-ink)]">{r.author}</span>
                    <span className="text-[11px] text-[var(--color-body)]">추천 {r.rec_count}</span>
                  </div>
                  <p className="text-[12px] text-[var(--color-body)] leading-relaxed line-clamp-3">{r.text}</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => startEdit(r)}
                    className="text-[11px] px-3 py-1 rounded border border-[var(--color-hairline)] text-[var(--color-body)] hover:border-[var(--color-espresso)] hover:text-[var(--color-espresso)]"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleToggle(r.id, r.visible)}
                    disabled={isPending}
                    className={`text-[11px] px-3 py-1 rounded border ${r.visible ? 'border-green-300 text-green-600' : 'border-[var(--color-hairline)] text-[var(--color-body)]'}`}
                  >
                    {r.visible ? '노출' : '숨김'}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={isPending}
                    className="text-[11px] px-3 py-1 rounded border border-red-200 text-red-400 hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-[13px] text-[var(--color-body)] py-4">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  )
}

/* ─── CSV 등록 탭 ─── */
function ImportTab({ stats }: { stats: { yangjae: number; euljiro: number } }) {
  const [location, setLocation] = useState<LocationSlug>('yangjae')
  const [csv, setCsv] = useState('')
  const [preview, setPreview] = useState<ReviewRow[]>([])
  const [result, setResult] = useState<{ inserted: number; error?: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handlePreview() {
    setPreview(parseCsv(csv, location))
    setResult(null)
  }

  function handleImport() {
    if (preview.length === 0) return
    startTransition(async () => {
      const res = await importReviews(preview)
      setResult(res)
      if (!res.error) { setCsv(''); setPreview([]) }
    })
  }

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-[var(--color-body)]">
        현재: 양재역본점 <strong>{stats.yangjae}</strong>개 · 을지로동대문점 <strong>{stats.euljiro}</strong>개
      </p>

      <div className="bg-white rounded-xl border border-[var(--color-hairline)] p-6 space-y-4">
        <div className="text-[12px] text-[var(--color-body)] bg-[var(--color-canvas)] rounded p-3 font-mono leading-relaxed">
          형식: author, text, rating(1-5), rec_count(추천수), visited_at(YYYY-MM-DD), source_id
        </div>

        <div className="flex gap-3">
          {(['yangjae', 'euljiro'] as LocationSlug[]).map(slug => (
            <button
              key={slug}
              onClick={() => setLocation(slug)}
              className={`px-4 py-2 rounded text-[13px] border transition-colors ${location === slug ? 'bg-[var(--color-espresso)] text-white border-[var(--color-espresso)]' : 'border-[var(--color-hairline)] text-[var(--color-body)] hover:border-[var(--color-espresso)]'}`}
            >
              {LOCATION_LABELS[slug]}
            </button>
          ))}
        </div>

        <textarea
          value={csv}
          onChange={e => setCsv(e.target.value)}
          placeholder="CSV 데이터를 붙여넣기하세요"
          className="w-full h-48 text-[12px] font-mono border border-[var(--color-hairline)] rounded p-3 resize-y focus:outline-none focus:border-[var(--color-espresso)]"
        />

        <div className="flex gap-3">
          <button onClick={handlePreview} disabled={!csv.trim()} className="px-5 py-2.5 text-[13px] border border-[var(--color-espresso)] text-[var(--color-espresso)] rounded hover:bg-[var(--color-espresso)] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            미리보기
          </button>
          {preview.length > 0 && (
            <button onClick={handleImport} disabled={isPending} className="px-5 py-2.5 text-[13px] bg-[var(--color-espresso)] text-white rounded hover:opacity-80 transition-opacity disabled:opacity-40">
              {isPending ? '등록 중…' : `${preview.length}개 등록`}
            </button>
          )}
        </div>

        {result && (
          <div className={`text-[13px] px-4 py-3 rounded ${result.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {result.error ? `오류: ${result.error}` : `${result.inserted}개 등록 완료`}
          </div>
        )}
      </div>

      {preview.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--color-hairline)] p-6 space-y-3">
          <h2 className="text-[15px] font-medium text-[var(--color-ink)]">미리보기 — {preview.length}개</h2>
          <div className="overflow-auto max-h-80">
            <table className="w-full text-[12px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-hairline)]">
                  <th className="py-2 pr-3 font-medium text-[var(--color-body)] w-24">작성자</th>
                  <th className="py-2 pr-3 font-medium text-[var(--color-body)]">리뷰</th>
                  <th className="py-2 pr-3 font-medium text-[var(--color-body)] w-12 text-right">추천</th>
                  <th className="py-2 font-medium text-[var(--color-body)] w-12 text-right">별점</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i} className="border-b border-[var(--color-hairline)] last:border-0">
                    <td className="py-2 pr-3 text-[var(--color-ink)] font-medium">{r.author}</td>
                    <td className="py-2 pr-3 text-[var(--color-body)] leading-relaxed">{r.text.slice(0, 80)}{r.text.length > 80 ? '…' : ''}</td>
                    <td className="py-2 pr-3 text-right">{r.rec_count}</td>
                    <td className="py-2 text-right">{r.rating ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── 메인 컴포넌트 ─── */
export function ReviewsClient({
  stats,
  allReviews,
}: {
  stats: { yangjae: number; euljiro: number }
  allReviews: ReviewRecord[]
}) {
  const [tab, setTab] = useState<'list' | 'import'>('list')

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-[22px] font-semibold text-[var(--color-ink)]">리뷰 관리</h1>

      {/* 탭 */}
      <div className="flex gap-1 border-b border-[var(--color-hairline)]">
        {([['list', '리뷰 목록'], ['import', 'CSV 등록']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-[13px] border-b-2 transition-colors -mb-px ${tab === key ? 'border-[var(--color-espresso)] text-[var(--color-ink)] font-medium' : 'border-transparent text-[var(--color-body)] hover:text-[var(--color-ink)]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'list' ? (
        <ReviewListTab initialReviews={allReviews} />
      ) : (
        <ImportTab stats={stats} />
      )}
    </div>
  )
}
