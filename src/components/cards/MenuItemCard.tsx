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
      <div className="relative aspect-[4/5] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-canvas-soft)]">
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        )}
      </div>
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
