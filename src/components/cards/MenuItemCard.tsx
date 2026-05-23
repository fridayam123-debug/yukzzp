import Image from 'next/image'

export function MenuItemCard({
  name,
  description,
  priceKrw,
  priceLabel,
  isSignature,
  image,
}: {
  name: string
  description?: string | null
  priceKrw?: number | null
  priceLabel?: string | null
  isSignature?: boolean
  image?: string | null
}) {
  return (
    <div className="flex flex-col gap-3">
      {image ? (
        <div className="relative aspect-[4/5] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-canvas-soft)]">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      ) : (
        // Service variant — no photo (e.g. 그릴링 서비스)
        <div className="relative aspect-[4/5] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-espresso)] flex flex-col items-center justify-center text-center px-4 py-6">
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[var(--color-cream-gold)]">
            100% Free Service
          </span>
          <div
            className="mt-4 md:mt-6 text-[var(--color-canvas)] leading-[1.05] text-[28px] md:text-[36px] font-normal"
            style={{ fontFamily: "'Cafe24Classictype', serif" }}
          >
            전문 그릴링<br />서비스
          </div>
          <div className="mt-auto pt-4 text-[10px] md:text-[11px] tracking-[0.05em] text-[var(--color-canvas)]/70 leading-[1.5]">
            직접 굽지 않아도<br />되는 편안함
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[17px] font-normal text-[var(--color-ink)] tracking-[-0.005em]">{name}</h3>
            {isSignature && (
              <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--color-cream-gold)] border-b border-[var(--color-cream-gold)] pb-px">SIGNATURE</span>
            )}
          </div>
          {description && <p className="text-[13px] text-[var(--color-body)] mt-1.5 leading-[1.5]">{description}</p>}
        </div>
        {(priceLabel || (typeof priceKrw === 'number')) && (
          <span className="text-[15px] tracking-[0.02em] whitespace-nowrap text-[var(--color-ink)] shrink-0">
            {priceLabel ?? `${priceKrw!.toLocaleString()}원`}
          </span>
        )}
      </div>
    </div>
  )
}
