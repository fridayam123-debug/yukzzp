import { BRAND, COPY_KO } from '@/lib/constants/brand'

export function InstagramStrip() {
  return (
    <section id="instagram" className="bg-[var(--color-canvas)] py-12 md:py-16 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">{COPY_KO.instagramEyebrow}</div>
          <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[14px] font-medium text-[var(--color-forest-mid)]">
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
