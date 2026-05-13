'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Ingredient } from './types'

interface Props {
  ingredient: Ingredient
  onClose: () => void
  onSaved: () => void
}

export function BrandChangeModal({ ingredient, onClose, onSaved }: Props) {
  const [brand, setBrand] = useState(ingredient.brand ?? '')
  const [vendor, setVendor] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('ingredient_profile').upsert(
      {
        ingredient_name: ingredient.name,
        custom_brand: brand || null,
        vendor: vendor || null,
        custom_note: note || null,
        catalog_id: ingredient.catalog_id ?? null,
        is_active: true,
      },
      { onConflict: 'ingredient_name' },
    )
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[16px] w-full max-w-sm p-6 space-y-4">
        <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">브랜드 지정</h2>
        <p className="text-[13px] text-[var(--color-body)]">
          <span className="font-medium">{ingredient.name}</span>에 사용하는 브랜드·거래처를 입력하면
          다음 레시피부터 자동 반영됩니다.
        </p>
        <input
          type="text"
          placeholder="브랜드·제품명 (예: 샘표 양조간장 501호)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--color-hairline)] rounded-[8px] text-[14px] outline-none focus:border-[var(--color-espresso)]"
        />
        <input
          type="text"
          placeholder="거래처 (예: A식자재유통)"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--color-hairline)] rounded-[8px] text-[14px] outline-none focus:border-[var(--color-espresso)]"
        />
        <input
          type="text"
          placeholder="비고 (예: 양재점 전용)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--color-hairline)] rounded-[8px] text-[14px] outline-none focus:border-[var(--color-espresso)]"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[var(--color-hairline)] text-[14px] rounded-[8px] text-[var(--color-ink)]"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !brand}
            className="flex-1 py-3 bg-[var(--color-espresso)] text-white text-[14px] rounded-[8px] disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
