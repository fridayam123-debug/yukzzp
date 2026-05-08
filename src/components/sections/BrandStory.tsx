import Image from 'next/image'
import { COPY_KO } from '@/lib/constants/brand'

export function BrandStory() {
  return (
    <section className="bg-[var(--color-forest)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-[400px] md:min-h-[560px]">
        <div className="flex flex-col justify-center px-6 py-16 md:px-16 md:py-24 md:w-1/2">
          <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">
            {COPY_KO.brandStoryEyebrow}
          </div>
          <h2 className="mt-3 text-[32px] md:text-[40px] font-normal text-white max-w-[480px] whitespace-pre-line">
            {COPY_KO.brandStoryH2}
          </h2>
          <p className="mt-6 text-[14px] leading-relaxed text-white/75 whitespace-pre-line">
            {COPY_KO.brandStoryP1}
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-white/75 whitespace-pre-line">
            {COPY_KO.brandStoryP2}
          </p>
        </div>
        <div className="relative order-first md:order-last md:w-1/2 aspect-[4/3] md:aspect-auto">
          <Image
            src="/photos/brand/brand-story.jpg"
            alt="육즙관리소 을지로동대문점 입구 카운터 — 프리미엄 흑돼지 다이닝"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
      </div>
    </section>
  )
}
