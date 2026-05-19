'use client'
import { useEffect, useRef, useState } from 'react'

export function LocalReelCard({ src, href }: { src: string; href: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [muted, setMuted] = useState(true)

  // Mount 시 강제 음소거 + 외부에서 .muted 직접 변경 시 React state 동기화
  // (브라우저가 이전 세션의 unmute 상태를 캐싱하는 케이스 방어)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    setMuted(true)
    const sync = () => setMuted(v.muted)
    v.addEventListener('volumechange', sync)
    return () => v.removeEventListener('volumechange', sync)
  }, [])

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    const next = !v.muted
    // 한 번에 하나만 들리도록: 음소거 해제하기 직전에 다른 모든 로컬 영상 음소거
    // (각 카드의 volumechange 리스너가 React state를 자동 동기화)
    if (!next) {
      document.querySelectorAll('video[data-local-reel="true"]').forEach((other) => {
        if (other !== v) (other as HTMLVideoElement).muted = true
      })
    }
    v.muted = next
    setMuted(next)
    // 사용자 제스처 이후 재생 보장
    if (v.paused) v.play().catch(() => {})
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="aspect-[9/16] rounded-[var(--radius-card)] overflow-hidden bg-black relative block group"
      aria-label="인스타그램 릴스 보기"
    >
      <video
        ref={videoRef}
        src={src}
        data-local-reel="true"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? '음소거 해제' : '음소거'}
        className="absolute bottom-2.5 right-2.5 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/55 backdrop-blur-sm hover:bg-black/75 transition-colors text-[var(--color-canvas)]"
      >
        {muted ? (
          // 음소거 (소리 꺼짐) 아이콘
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          // 소리 켜짐 아이콘
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </a>
  )
}
