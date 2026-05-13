'use client'
import { useState, useEffect } from 'react'
import type { RecipeHistoryItem } from './types'

const HISTORY_KEY = 'yukzzp_recipe_history'

export function RecipeHistory() {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<RecipeHistoryItem[]>([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
      setCount(Array.isArray(items) ? items.length : 0)
    } catch {
      setCount(0)
    }
  }, [])

  useEffect(() => {
    if (open) {
      try {
        setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]'))
      } catch {
        setHistory([])
      }
    }
  }, [open])

  if (count === 0 && !open) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[12px] text-[var(--color-body)] hover:text-[var(--color-ink)] border border-[var(--color-hairline)] px-3 py-1.5 rounded-[8px]"
      >
        기록 ({count})
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-end z-50 p-4">
          <div className="bg-white rounded-[16px] w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-hairline)]">
              <p className="text-[15px] font-semibold text-[var(--color-ink)]">최근 분석 기록</p>
              <button
                onClick={() => setOpen(false)}
                className="text-[var(--color-body)] hover:text-[var(--color-ink)] text-[20px]"
              >
                ×
              </button>
            </div>
            {history.length === 0 ? (
              <p className="p-5 text-[13px] text-[var(--color-body)]">기록이 없습니다</p>
            ) : (
              <ul className="divide-y divide-[var(--color-hairline)]">
                {history.map((item) => (
                  <li key={item.id} className="p-4">
                    <p className="text-[14px] font-medium text-[var(--color-ink)]">{item.dish_name}</p>
                    <p className="text-[12px] text-[var(--color-body)] mt-0.5">
                      {new Date(item.created_at).toLocaleDateString('ko-KR', {
                        month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  )
}
