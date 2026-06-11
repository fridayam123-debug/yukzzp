'use client'

import { useRef, useEffect } from 'react'

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // 화면에 들어오면 재생, 나가면 정지 (배터리 절약)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="w-full bg-[var(--color-ink)] overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: '16/9', maxHeight: '720px' }}>
        <video
          ref={videoRef}
          src="/videos/restaurant-intro.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ display: 'block' }}
        />
        {/* 하단 그라데이션 — 다음 섹션으로 자연스럽게 연결 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-ink)] to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
