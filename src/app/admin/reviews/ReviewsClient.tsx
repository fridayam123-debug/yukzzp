'use client'

import { useState, useTransition } from 'react'
import { importReviews, type ReviewRow } from './actions'

type LocationSlug = 'yangjae' | 'euljiro'

const LOCATION_LABELS: Record<LocationSlug, string> = {
  yangjae: '양재역본점',
  euljiro: '더룸 을지로동대문점',
}

/*
 * CSV 형식 (헤더 선택):
 * author,text,rating,rec_count,visited_at,source_id
 * 또는 헤더 없이 같은 순서로
 */
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

export function ReviewsClient({ stats }: { stats: { yangjae: number; euljiro: number } }) {
  const [location, setLocation] = useState<LocationSlug>('yangjae')
  const [csv, setCsv] = useState('')
  const [preview, setPreview] = useState<ReviewRow[]>([])
  const [result, setResult] = useState<{ inserted: number; error?: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handlePreview() {
    const rows = parseCsv(csv, location)
    setPreview(rows)
    setResult(null)
  }

  function handleImport() {
    if (preview.length === 0) return
    startTransition(async () => {
      const res = await importReviews(preview)
      setResult(res)
      if (!res.error) {
        setCsv('')
        setPreview([])
      }
    })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-[22px] font-semibold text-[var(--color-ink)] mb-1">리뷰 관리</h1>
        <p className="text-[13px] text-[var(--color-body)]">
          현재: 양재역본점 <strong>{stats.yangjae}</strong>개 · 을지로동대문점 <strong>{stats.euljiro}</strong>개
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-hairline)] p-6 space-y-4">
        <h2 className="text-[15px] font-medium text-[var(--color-ink)]">CSV 일괄 등록</h2>

        <div className="text-[12px] text-[var(--color-body)] bg-[var(--color-canvas)] rounded p-3 font-mono leading-relaxed">
          형식: author, text, rating(1-5), rec_count(추천수), visited_at(YYYY-MM-DD), source_id<br />
          예시: 홍길동, 고기가 맛있어요, 5, 127, 2024-12-01, naver_abc123
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
          placeholder="CSV 데이터를 붙여넣기하세요 (헤더 있어도 없어도 됩니다)"
          className="w-full h-48 text-[12px] font-mono border border-[var(--color-hairline)] rounded p-3 resize-y focus:outline-none focus:border-[var(--color-espresso)]"
        />

        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            disabled={!csv.trim()}
            className="px-5 py-2.5 text-[13px] border border-[var(--color-espresso)] text-[var(--color-espresso)] rounded hover:bg-[var(--color-espresso)] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            미리보기
          </button>
          {preview.length > 0 && (
            <button
              onClick={handleImport}
              disabled={isPending}
              className="px-5 py-2.5 text-[13px] bg-[var(--color-espresso)] text-white rounded hover:opacity-80 transition-opacity disabled:opacity-40"
            >
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
          <h2 className="text-[15px] font-medium text-[var(--color-ink)]">미리보기 — {preview.length}개 ({LOCATION_LABELS[location]})</h2>
          <div className="overflow-auto max-h-96">
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
                    <td className="py-2 pr-3 text-right text-[var(--color-body)]">{r.rec_count}</td>
                    <td className="py-2 text-right text-[var(--color-body)]">{r.rating ?? '-'}</td>
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
