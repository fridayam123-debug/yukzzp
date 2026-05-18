'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CHEF_ENDORSEMENT, COPY_KO } from '@/lib/constants/brand'

export function AuthorityBannerClient({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <section className="bg-[var(--color-coral)] py-20 md:py-32 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-10 items-start">
        <div className="text-[var(--color-canvas)] order-2 md:order-1">
          <div className="text-[11px] tracking-[0.3em] uppercase opacity-80">{COPY_KO.authorityEyebrow}</div>
          <h2 className="text-[32px] md:text-[48px] font-normal mt-5 leading-[1.05] tracking-[-0.01em]" style={{ fontFamily: "'Cafe24Classictype', serif" }}>{COPY_KO.authorityH2}</h2>
          <p className="text-[20px] md:text-[26px] mt-3 opacity-95 font-normal leading-[1.3]">{COPY_KO.authoritySub}</p>
          <div className="mt-6 space-y-4 text-[14px] md:text-[15px] opacity-85 leading-[1.75] tracking-[0.01em]">
            {COPY_KO.authorityBody.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <p className="text-[12px] mt-6 opacity-70 tracking-[0.15em] uppercase">공식 셰프 채널 {CHEF_ENDORSEMENT.viewCount.toLocaleString()}+ 조회</p>
          <button
            onClick={() => setPlaying(true)}
            className="inline-flex items-center gap-2 bg-[var(--color-canvas)] text-[var(--color-ink)] px-7 py-3.5 rounded-[var(--radius-cta)] text-[14px] font-medium mt-6 hover:bg-[var(--color-cream-gold)] transition-colors"
          >
            ▶ 영상 보기
          </button>
        </div>
        <div className="aspect-video rounded-[var(--radius-card)] overflow-hidden bg-black/20 relative order-1 md:order-2">
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              title={CHEF_ENDORSEMENT.videoTitle}
            />
          ) : (
            <button onClick={() => setPlaying(true)} className="w-full h-full relative cursor-pointer block" aria-label="YouTube 영상 재생">
              <Image
                src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
                alt={`${CHEF_ENDORSEMENT.chefName} 셰프 추천 영상 썸네일`}
                fill
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 flex items-center justify-center rounded-full bg-[var(--color-canvas)]/20 backdrop-blur-sm text-[var(--color-canvas)] text-3xl">▶</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
