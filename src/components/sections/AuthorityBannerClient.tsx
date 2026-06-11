'use client'

import { CHEF_ENDORSEMENT } from '@/lib/constants/brand'

interface Props {
  videoId: string
  eyebrow: string
  h2: string
  sub: string
  body: string[]
  videoBtn: string
  viewCountLabel: string
}

export function AuthorityBannerClient({ videoId, eyebrow, h2, sub, body, viewCountLabel }: Props) {
  return (
    <section className="bg-[var(--color-coral)] py-10 md:py-32 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div className="text-[var(--color-canvas)] order-1">
          <div className="text-[11px] tracking-[0.3em] uppercase opacity-80">{eyebrow}</div>
          <h2 className="text-[26px] md:text-[48px] font-normal mt-5 leading-[1.15] tracking-[-0.01em] whitespace-pre-line [word-break:keep-all]" style={{ fontFamily: "'Cafe24Classictype', serif" }}>{h2}</h2>
          {/* sub — 모바일 숨김 */}
          <p className="hidden md:block text-[26px] mt-3 opacity-95 font-normal leading-[1.3]">{sub}</p>
          {/* 본문 — 모바일 숨김 */}
          <div className="hidden md:block mt-6 space-y-4 text-[15px] opacity-85 leading-[1.75] tracking-[0.01em]">
            {body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <p className="hidden md:block text-[12px] mt-6 opacity-70 tracking-[0.15em] uppercase">{viewCountLabel}</p>
        </div>
        <div className="aspect-video rounded-[var(--radius-card)] overflow-hidden bg-black/20 relative order-2 self-center">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1&controls=1`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={CHEF_ENDORSEMENT.videoTitle}
          />
        </div>
      </div>
    </section>
  )
}
