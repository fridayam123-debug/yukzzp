'use client'

import { useState, useTransition, useMemo } from 'react'
import { createFaq, updateFaq, deleteFaq, type FaqRow, type FaqInput } from './actions'

type Store = { value: string; label: string }

const EMPTY: FaqInput = {
  category: 'yangjae',
  slug: '',
  sort_order: 0,
  question_ko: '', answer_ko: '',
  question_en: '', answer_en: '',
  question_ja: '', answer_ja: '',
  question_vi: '', answer_vi: '',
  question_zh_hans: '', answer_zh_hans: '',
  question_zh_hant: '', answer_zh_hant: '',
}

const LANGS = [
  { suffix: 'en', label: 'English' },
  { suffix: 'ja', label: '日本語' },
  { suffix: 'vi', label: 'Tiếng Việt' },
  { suffix: 'zh_hans', label: '简体中文' },
  { suffix: 'zh_hant', label: '繁體中文' },
] as const

const NEW_STORE = '__new__'

export function FaqsClient({ initialFaqs, stores }: { initialFaqs: FaqRow[]; stores: Store[] }) {
  const [faqs, setFaqs] = useState<FaqRow[]>(initialFaqs)
  const [editing, setEditing] = useState<FaqRow | null>(null)
  const [form, setForm] = useState<FaqInput>(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [showLangs, setShowLangs] = useState(false)
  const [newStoreKey, setNewStoreKey] = useState('')
  const [isPending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')

  // 매장 라벨 매핑 (목록 그룹 헤딩용)
  const labelOf = useMemo(() => {
    const m = new Map(stores.map((s) => [s.value, s.label]))
    return (cat: string) => m.get(cat) ?? cat
  }, [stores])

  // 카테고리별 그룹
  const grouped = useMemo(() => {
    const groups = new Map<string, FaqRow[]>()
    for (const f of faqs) {
      const cat = f.category ?? 'general'
      if (!groups.has(cat)) groups.set(cat, [])
      groups.get(cat)!.push(f)
    }
    // 매장 순서 우선, 나머지(공통 포함) 뒤
    const order = stores.map((s) => s.value)
    return [...groups.entries()].sort(
      ([a], [b]) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999),
    )
  }, [faqs, stores])

  const set = (patch: Partial<FaqInput>) => setForm((f) => ({ ...f, ...patch }))

  function openNew() {
    setEditing(null)
    setForm({ ...EMPTY, category: stores[0]?.value ?? 'yangjae' })
    setNewStoreKey('')
    setShowForm(true)
    setShowLangs(false)
    setMsg('')
  }

  function openEdit(f: FaqRow) {
    setEditing(f)
    setForm({
      category: f.category ?? 'general',
      slug: f.slug,
      sort_order: f.sort_order ?? 0,
      question_ko: f.question_ko ?? '', answer_ko: f.answer_ko ?? '',
      question_en: f.question_en ?? '', answer_en: f.answer_en ?? '',
      question_ja: f.question_ja ?? '', answer_ja: f.answer_ja ?? '',
      question_vi: f.question_vi ?? '', answer_vi: f.answer_vi ?? '',
      question_zh_hans: f.question_zh_hans ?? '', answer_zh_hans: f.answer_zh_hans ?? '',
      question_zh_hant: f.question_zh_hant ?? '', answer_zh_hant: f.answer_zh_hant ?? '',
    })
    setNewStoreKey('')
    setShowForm(true)
    setShowLangs(false)
    setMsg('')
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
    setMsg('')
  }

  function handleSave() {
    // 새 매장 직접 입력 처리
    const payload: FaqInput = { ...form }
    if (form.category === NEW_STORE) {
      const key = newStoreKey.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
      if (!key) { setMsg('새 매장 식별자(영문 slug)를 입력하세요'); return }
      payload.category = key
    }
    startTransition(async () => {
      try {
        if (editing) {
          const updated = (await updateFaq(editing.id, payload)) as FaqRow
          setFaqs((prev) => prev.map((p) => (p.id === editing.id ? updated : p)))
          setMsg('저장되었습니다')
        } else {
          const created = (await createFaq(payload)) as FaqRow
          setFaqs((prev) => [...prev, created])
          setMsg('등록되었습니다')
        }
        closeForm()
      } catch (e) {
        setMsg((e as Error).message)
      }
    })
  }

  function handleDelete(id: string) {
    if (!confirm('이 FAQ를 삭제하시겠습니까?')) return
    startTransition(async () => {
      await deleteFaq(id)
      setFaqs((prev) => prev.filter((p) => p.id !== id))
    })
  }

  const inputCls =
    'w-full border border-[var(--color-hairline)] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[var(--color-espresso)]'

  return (
    <div className="p-8 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[18px] font-semibold text-[var(--color-ink)] tracking-[0.05em]">
          FAQ 관리 (NOTICE Q&A)
        </h1>
        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-[var(--color-espresso)] text-white text-[12px] tracking-[0.1em] hover:opacity-80 transition-opacity"
        >
          + 새 FAQ
        </button>
      </div>
      <p className="text-[12px] text-[var(--color-body)] opacity-70 mb-6">
        매장별로 Q&A를 등록합니다. 추후 직영점이 늘어나면 폼의 매장 선택에서 「+ 새 매장 직접 입력」으로 매장을 추가할 수 있습니다.
      </p>

      {msg && (
        <div className="mb-4 px-4 py-3 bg-[var(--color-stone)] text-[13px] text-[var(--color-body)]">
          {msg}
        </div>
      )}

      {/* 폼 */}
      {showForm && (
        <div className="mb-8 border border-[var(--color-hairline)] bg-white p-6">
          <h2 className="text-[14px] font-semibold mb-5 tracking-[0.05em]">
            {editing ? 'FAQ 수정' : '새 FAQ 등록'}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* 매장 */}
            <div>
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">매장 *</label>
              <select
                value={form.category}
                onChange={(e) => set({ category: e.target.value })}
                className={inputCls}
              >
                {stores.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
                <option value={NEW_STORE}>+ 새 매장 직접 입력</option>
              </select>
              {form.category === NEW_STORE && (
                <input
                  value={newStoreKey}
                  onChange={(e) => setNewStoreKey(e.target.value)}
                  className={`${inputCls} mt-2`}
                  placeholder="새 매장 식별자 (영문 slug, 예: hongdae)"
                />
              )}
            </div>
            {/* 정렬 순서 */}
            <div>
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">정렬 순서</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => set({ sort_order: Number(e.target.value) || 0 })}
                className={inputCls}
              />
            </div>
            {/* slug */}
            <div className="col-span-2">
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">슬러그 (선택 · 비우면 자동 생성)</label>
              <input
                value={form.slug}
                onChange={(e) => set({ slug: e.target.value })}
                className={inputCls}
                placeholder="예: yangjae-matjip-rec"
              />
            </div>

            {/* 한국어 (필수) */}
            <div className="col-span-2">
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">질문 (한국어) *</label>
              <input
                value={form.question_ko}
                onChange={(e) => set({ question_ko: e.target.value })}
                className={inputCls}
                placeholder="양재역 맛집으로 추천할 만한가요?"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">답변 (한국어) *</label>
              <textarea
                value={form.answer_ko}
                onChange={(e) => set({ answer_ko: e.target.value })}
                rows={5}
                className={`${inputCls} resize-y`}
                placeholder="네. 육즙관리소 양재역점은..."
              />
            </div>
          </div>

          {/* 다국어 (선택) */}
          <button
            type="button"
            onClick={() => setShowLangs((v) => !v)}
            className="text-[12px] text-[var(--color-espresso)] mb-3 hover:opacity-60"
          >
            {showLangs ? '− 다국어 접기' : '+ 다국어 입력 (영어·일본어·베트남어·중국어 간체/번체)'}
          </button>

          {showLangs && (
            <div className="space-y-5 mb-4 border-t border-[var(--color-hairline)] pt-5">
              {LANGS.map(({ suffix, label }) => {
                const qk = `question_${suffix}` as keyof FaqInput
                const ak = `answer_${suffix}` as keyof FaqInput
                return (
                  <div key={label}>
                    <div className="text-[11px] tracking-[0.15em] text-[var(--color-espresso)] font-semibold mb-2">{label}</div>
                    <input
                      value={form[qk] as string}
                      onChange={(e) => set({ [qk]: e.target.value } as Partial<FaqInput>)}
                      className={`${inputCls} mb-2`}
                      placeholder={`질문 (${label})`}
                    />
                    <textarea
                      value={form[ak] as string}
                      onChange={(e) => set({ [ak]: e.target.value } as Partial<FaqInput>)}
                      rows={3}
                      className={`${inputCls} resize-y`}
                      placeholder={`답변 (${label})`}
                    />
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isPending || !form.question_ko || !form.answer_ko}
              className="px-6 py-2.5 bg-[var(--color-espresso)] text-white text-[12px] tracking-[0.1em] hover:opacity-80 disabled:opacity-40 transition-opacity"
            >
              {isPending ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={closeForm}
              className="px-6 py-2.5 border border-[var(--color-hairline)] text-[12px] tracking-[0.1em] hover:bg-[var(--color-stone)] transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 목록 — 매장별 그룹 */}
      {grouped.length === 0 ? (
        <div className="border border-[var(--color-hairline)] px-4 py-10 text-center text-[var(--color-body)] opacity-50 text-[13px]">
          아직 등록된 FAQ가 없습니다
        </div>
      ) : (
        grouped.map(([cat, list]) => (
          <div key={cat} className="mb-8">
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-[13px] font-semibold tracking-[0.1em] text-[var(--color-espresso)]">
                {labelOf(cat)}
              </h3>
              <span className="text-[11px] text-[var(--color-body)] opacity-50">{list.length}개</span>
            </div>
            <div className="border border-[var(--color-hairline)] overflow-hidden">
              <table className="w-full text-[13px]">
                <tbody>
                  {list.map((f, i) => (
                    <tr
                      key={f.id}
                      className={`border-b border-[var(--color-hairline)] last:border-0 ${i % 2 ? 'bg-[var(--color-canvas)]' : ''} hover:bg-[var(--color-stone)]/40 transition-colors`}
                    >
                      <td className="px-3 py-3 w-[44px] text-center text-[11px] text-[var(--color-body)] opacity-50">
                        {f.sort_order ?? 0}
                      </td>
                      <td className="px-3 py-3 text-[var(--color-ink)] font-medium [word-break:keep-all]">
                        {f.question_ko}
                      </td>
                      <td className="px-3 py-3 w-[90px]">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEdit(f)}
                            className="text-[11px] text-[var(--color-espresso)] hover:opacity-60"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(f.id)}
                            className="text-[11px] text-red-400 hover:opacity-60"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
