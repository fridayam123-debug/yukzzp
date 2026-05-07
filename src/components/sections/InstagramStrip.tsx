import { BRAND, COPY_KO } from '@/lib/constants/brand'

export function InstagramStrip() {
  return (
    <section id="instagram" className="bg-[var(--color-canvas)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-body)]">{COPY_KO.instagramEyebrow}</div>
          <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[14px] underline underline-offset-[6px] decoration-[1px] hover:decoration-[var(--color-cream-gold)] text-[var(--color-ink)]">
            {COPY_KO.instagramFollow}
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <a key={i} href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`인스타그램 사진 ${i}`}
              className="aspect-square bg-[var(--color-canvas-soft)] rounded-[var(--radius-card)] hover:opacity-80 transition-opacity" />
          ))}
        </div>
      </div>
    </section>
  )
}
