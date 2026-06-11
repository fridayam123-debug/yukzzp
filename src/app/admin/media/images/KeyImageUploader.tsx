'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { uploadKeyImage } from './actions'

interface Props {
  imageKey: string
  label: string
  description: string
  currentUrl: string
  fallbackPath: string
}

export function KeyImageUploader({ imageKey, label, description, currentUrl, fallbackPath }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setError(null)
    setSaved(false)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('imageKey', imageKey)

    startTransition(async () => {
      const result = await uploadKeyImage(fd)
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
      }
    })
  }

  const displaySrc = preview || fallbackPath

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[13px] font-medium text-[var(--color-ink)]">{label}</p>
        <p className="text-[11px] text-[var(--color-body)] mt-0.5">{description}</p>
        <p className="text-[10px] font-mono text-[var(--color-body)]/60 mt-0.5">{imageKey}</p>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="relative group w-full aspect-video bg-[#f0ece6] overflow-hidden rounded-[12px] border border-[#e0d8d0] hover:border-[#a09080] transition-colors"
      >
        <Image
          src={displaySrc}
          alt={label}
          fill
          className="object-cover"
          sizes="600px"
          unoptimized={displaySrc.startsWith('blob:')}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-[13px] font-medium">
            {isPending ? '업로드 중…' : '이미지 변경'}
          </span>
        </div>
        {isPending && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      {saved && <p className="text-[12px] text-green-600">✓ 저장됨</p>}
      {error && <p className="text-[12px] text-red-500">{error}</p>}

      {currentUrl && (
        <p className="text-[10px] font-mono text-[var(--color-body)]/60 break-all">{currentUrl}</p>
      )}
    </div>
  )
}
