import { BRAND } from '@/lib/constants/brand'
import { getInstagramReels } from '@/lib/fetchers/instagram'
import { getSiteCopy } from '@/lib/fetchers/copy'
import { getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/fetchers/copy'
import { LocalReelCard } from './LocalReelCard'

// 로컬에 직접 업로드한 릴스 영상 (Instagram embed 대신 사용 — chrome 없는 깨끗한 9:16)
const LOCAL_REELS: { src: string; href: string }[] = [
  { src: '/instagram/reel-01v2.mp4', href: BRAND.instagramUrl },
  { src: '/instagram/reel-02.mp4', href: BRAND.instagramUrl },
  { src: '/instagram/reel-03v2.mp4', href: BRAND.instagramUrl },
  { src: '/instagram/reel-04.mp4', href: BRAND.instagramUrl },
]

export async function InstagramStrip() {
  const locale = await getLocale() as Locale
  const [, copy] = await Promise.all([
    getInstagramReels(),
    getSiteCopy(locale),
  ])

  const eyebrow = copy['instagram.eyebrow'] || 'INSTAGRAM'
  const followLabel = copy['instagram.follow'] || `@${BRAND.instagramHandle} 팔로우 →`
  const remainingSlots = Math.max(0, 4 - LOCAL_REELS.length)

  return (
    <section id="instagram" className="bg-[var(--color-canvas)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-body)]">{eyebrow}</div>
          <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[14px] underline underline-offset-[6px] decoration-[1px] hover:decoration-[var(--color-cream-gold)] text-[var(--color-ink)]">
            {followLabel}
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LOCAL_REELS.map((local, i) => (
            <LocalReelCard key={`local-${i}`} src={local.src} href={local.href} />
          ))}
          {Array.from({ length: remainingSlots }).map((_, i) => (
            <a key={`placeholder-${i}`} href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer"
              aria-label="인스타그램 더보기"
              className="aspect-[9/16] bg-[var(--color-canvas-soft)] rounded-[var(--radius-card)] hover:opacity-80 transition-opacity" />
          ))}
        </div>
      </div>
    </section>
  )
}
