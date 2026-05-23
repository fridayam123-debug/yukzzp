'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { uploadLocationPhoto } from './actions'

interface Props {
  slug: string
  currentUrl: string | null
  label: string
}

export function LocationPhotoUploader({ slug, currentUrl, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setError(null)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('slug', slug)

    startTransition(async () => {
      const result = await uploadLocationPhoto(fd)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="relative group w-full aspect-video bg-[#f0ece6] overflow-hidden rounded-[12px] border border-[#e0d8d0] hover:border-[#a09080] transition-colors"
      >
        {preview ? (
          <Image
            src={preview}
            alt={label}
            fill
            className="object-cover"
            sizes="600px"
            unoptimized={preview.startsWith('blob:')}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] text-[#a09080]">사진 없음</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-[13px] font-medium">
            {isPending ? '업로드 중…' : '사진 변경'}
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

      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  )
}
