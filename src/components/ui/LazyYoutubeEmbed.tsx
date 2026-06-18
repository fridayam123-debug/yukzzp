'use client'
import { useEffect, useRef, useState } from 'react'

export function LazyYoutubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [load, setLoad] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setLoad(true); return }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLoad(true); io.disconnect() } },
      { rootMargin: '400px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="aspect-video rounded-[var(--radius-card)] overflow-hidden bg-black relative order-2">
      {load ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1&controls=1`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      ) : (
        <div className="w-full h-full bg-black" />
      )}
    </div>
  )
}
