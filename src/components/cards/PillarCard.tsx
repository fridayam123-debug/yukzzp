export function PillarCard({
  icon,
  title,
  description,
  ordinal,
}: {
  icon: string
  title: string
  description: string
  ordinal: string
}) {
  return (
    <div className="relative flex flex-col bg-white rounded-[var(--radius-card)] border border-[var(--color-hairline)] px-3 md:px-5 pt-10 md:pt-12 pb-4 md:pb-5">
      {/* Hole punch — canvas-soft matches the section bg, giving a real-hole effect */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full bg-[var(--color-canvas-soft)] border border-[var(--color-hairline)]" />

      {/* Ordinal header */}
      <div className="text-center mb-3">
        <p className="text-[12px] md:text-[15px] tracking-[0.15em] text-[var(--color-body)]">
          {ordinal}
        </p>
      </div>

      <div className="border-t border-[var(--color-hairline)] mb-4" />

      {/* Title — LV weight 400, responsive size */}
      <h3 className="text-[16px] md:text-[20px] font-normal text-[var(--color-espresso)] leading-[1.25] tracking-[-0.005em] break-keep mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[13px] md:text-[14px] text-[var(--color-body)] leading-[1.7] flex-1">
        {description}
      </p>

      {/* Hanja — decorative illustration area, responsive */}
      <div className="flex justify-center py-4 md:py-6">
        <span
          className="text-[44px] md:text-[62px] leading-none select-none text-[var(--color-hairline)] font-serif"
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
    </div>
  )
}
