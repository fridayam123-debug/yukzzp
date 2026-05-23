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
    <div className="relative flex flex-col bg-white rounded-[var(--radius-card)] border border-[var(--color-hairline)] px-2.5 md:px-5 pt-9 md:pt-12 pb-3 md:pb-5">
      {/* Hole punch — canvas-soft matches the section bg, giving a real-hole effect */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[14px] h-[14px] md:w-[18px] md:h-[18px] rounded-full bg-[var(--color-canvas-soft)] border border-[var(--color-hairline)]" />

      {/* Ordinal header */}
      <div className="text-center mb-3">
        <p className="text-[12px] md:text-[15px] tracking-[0.15em] text-[var(--color-body)]">
          {ordinal}
        </p>
      </div>

      <div className="border-t border-[var(--color-hairline)] mb-4" />

      {/* Title — LV weight 400, responsive size, centered */}
      <h3 className="text-[13px] md:text-[20px] font-normal text-[var(--color-espresso)] leading-[1.25] tracking-[-0.02em] break-keep mb-3 text-center whitespace-nowrap overflow-hidden text-ellipsis md:whitespace-normal">
        {title}
      </h3>

      {/* Description — centered */}
      <p className="text-[11px] md:text-[14px] text-[var(--color-body)] leading-[1.65] flex-1 text-center line-clamp-5 md:line-clamp-none [word-break:keep-all]">
        {description}
      </p>

      {/* Hanja — decorative illustration area, responsive (-30%) */}
      <div className="flex justify-center py-3 md:py-6">
        <span
          className="text-[24px] md:text-[44px] leading-none select-none text-[var(--color-hairline)] font-serif"
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
    </div>
  )
}
