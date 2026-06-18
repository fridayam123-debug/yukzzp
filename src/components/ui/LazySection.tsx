'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'

export function LazySection({
  children,
  minH = '300px',
  rootMargin = '600px 0px',
}: {
  children: ReactNode
  minH?: string
  rootMargin?: string
}) {
  const [ready, setReady] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) { setReady(true); return }

    if (!('IntersectionObserver' in window)) {
      setReady(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true)
          io.disconnect()
        }
      },
      { rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} style={{ minHeight: ready ? undefined : minH }}>
      {ready ? children : null}
    </div>
  )
}
