'use client'
import { useRef, useState } from 'react'
import { RecipeHistory } from './RecipeHistory'

interface Props {
  onAnalyze: (imageDataUrl: string, dishHint?: string) => Promise<void>
  error: string | null
}

export function UploadScreen({ onAnalyze, error }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [hint, setHint] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기가 10MB를 초과합니다')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!preview) return
    setLoading(true)
    await onAnalyze(preview, hint || undefined)
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-[640px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-medium text-[var(--color-ink)] tracking-tight">
            AI 메뉴 개발
          </h1>
          <p className="text-[13px] text-[var(--color-body)] mt-1">
            음식 사진 1장 → 10인분 정밀 레시피 + 브랜드 명시
          </p>
        </div>
        <RecipeHistory />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px] text-[13px] text-red-700">
          {error}
        </div>
      )}

      <div
        className="border-2 border-dashed border-[var(--color-hairline)] rounded-[12px] p-12 text-center cursor-pointer hover:border-[var(--color-espresso)] transition-colors"
        onClick={() => fileRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt="선택된 사진" className="max-h-[240px] mx-auto rounded-[8px] object-contain" />
        ) : (
          <div className="space-y-2">
            <p className="text-[15px] text-[var(--color-ink)]">사진을 여기에 끌어다 놓거나</p>
            <p className="text-[13px] text-[var(--color-body)]">클릭하여 선택 (JPEG · PNG · WebP · 최대 10MB)</p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {preview && (
        <div className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="음식명 힌트 (선택) — 예: 냉면, 돌솥비빔밥"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-hairline)] rounded-[8px] text-[14px] outline-none focus:border-[var(--color-espresso)]"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-[var(--color-espresso)] text-white text-[14px] font-medium rounded-[8px] disabled:opacity-50"
          >
            AI 분석 시작 →
          </button>
          <button
            onClick={() => setPreview(null)}
            className="w-full py-2 text-[13px] text-[var(--color-body)] hover:text-[var(--color-ink)]"
          >
            다시 선택
          </button>
        </div>
      )}
    </div>
  )
}
