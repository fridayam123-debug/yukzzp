export function MenuItemCard({
  name,
  description,
  priceKrw,
  isSignature,
}: {
  name: string
  description?: string | null
  priceKrw?: number | null
  isSignature?: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[4/5] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-stone)]" />
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[17px] font-medium text-[var(--color-ink)]">{name}</h3>
            {isSignature && (
              <span className="text-[9px] tracking-[1.5px] font-mono bg-[var(--color-cream-gold)]/30 text-[var(--color-forest)] px-2 py-0.5 rounded-full">SIGNATURE</span>
            )}
          </div>
          {description && <p className="text-[13px] text-[var(--color-body)] mt-1 leading-[1.5]">{description}</p>}
        </div>
        {priceKrw && (
          <span className="text-[15px] font-mono whitespace-nowrap text-[var(--color-ink)] shrink-0">{priceKrw.toLocaleString()}원</span>
        )}
      </div>
    </div>
  )
}
