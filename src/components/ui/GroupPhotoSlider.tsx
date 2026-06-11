'use client'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

const PHOTOS = Array.from({ length: 26 }, (_, i) => ({
  src: `/photos/group/grp-${i + 1}.jpg`,
  alt: `육즙관리소 단체 룸 — 프라이빗 다이닝 공간 ${i + 1}`,
}))

const INTERVAL = 4000

export function GroupPhotoSlider() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % PHOTOS.length)
    }, INTERVAL)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  const goNext = useCallback(() => {
    setCurrent(c => (c + 1) % PHOTOS.length)
    startTimer() // 타이머 리셋
  }, [startTimer])

  const goPrev = useCallback(() => {
    setCurrent(c => (c - 1 + PHOTOS.length) % PHOTOS.length)
    startTimer()
  }, [startTimer])

  return (
    <div
      className="aspect-[4/3] md:aspect-[3/2] rounded-[var(--radius-card)] overflow-hidden md:sticky md:top-[calc(50vh-200px)] relative select-none"
      aria-label="단체 회식 공간"
    >
      {/* 사진 레이어 */}
      {PHOTOS.map((photo, i) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 1440px) 50vw, 720px"
          className="object-cover transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
          priority={i === 0}
        />
      ))}

      {/* 클릭 영역: 좌 절반 → 이전, 우 절반 → 다음 */}
      <button
        onClick={goPrev}
        aria-label="이전 사진"
        className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-w-resize"
      />
      <button
        onClick={goNext}
        aria-label="다음 사진"
        className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-e-resize"
      />

      {/* 하단 인디케이터 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1 z-20 max-w-[200px]">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); startTimer() }}
            aria-label={`사진 ${i + 1}`}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300 shrink-0"
            style={{
              background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.30)',
              transform: i === current ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* 카운터 */}
      <div className="absolute top-3 right-3 z-20 text-[10px] font-mono tracking-[0.1em] text-white/60">
        {String(current + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
      </div>
    </div>
  )
}
